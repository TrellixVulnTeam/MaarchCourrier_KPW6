<?php

/**
* Copyright Maarch since 2008 under licence GPLv3.
* See LICENCE.txt file at the root folder for more details.
* This file is part of Maarch software.
*
*/

/**
* @brief User Controller
* @author dev@maarch.org
*/

namespace User\controllers;

use Basket\models\BasketModel;
use Group\models\ServiceModel;
use Entity\models\EntityModel;
use Entity\models\ListTemplateModel;
use Group\models\GroupModel;
use History\controllers\HistoryController;
use History\models\HistoryModel;
use Respect\Validation\Validator;
use Slim\Http\Request;
use Slim\Http\Response;
use SrcCore\models\CoreConfigModel;
use SrcCore\controllers\StoreController;
use SrcCore\models\SecurityModel;
use User\models\UserBasketPreferenceModel;
use User\models\UserModel;

class UserController
{
    public function get(Request $request, Response $response)
    {
        if (!ServiceModel::hasService(['id' => 'admin_users', 'userId' => $GLOBALS['userId'], 'location' => 'apps', 'type' => 'admin'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        if ($GLOBALS['userId'] == 'superadmin') {
            $users = UserModel::get([
                'select'    => ['id', 'user_id', 'firstname', 'lastname', 'status', 'enabled', 'mail'],
                'where'     => ['user_id != ?', 'status != ?'],
                'data'      => ['superadmin', 'DEL']
            ]);
        } else {
            $entities = EntityModel::getAllEntitiesByUserId(['userId' => $GLOBALS['userId']]);
            $users = UserModel::getByEntities([
                'select'    => ['DISTINCT users.id', 'users.user_id', 'firstname', 'lastname', 'status', 'enabled', 'mail'],
                'entities'  => $entities
            ]);
        }

        $usersIds = [];
        foreach ($users as $value) {
            $usersIds[] = $value['user_id'];
        }

        $listModels = ListTemplateModel::get(['select' => ['item_id'], 'where' => ['item_id in (?)', 'object_type = ?', 'item_mode = ?'], 'data' => [$usersIds, 'entity_id', 'dest']]);

        $usersListModels = [];
        foreach ($listModels as $value) {
            $usersListModels[] = $value['item_id'];
        }

        foreach ($users as $key => $value) {
            if (in_array($value['user_id'], $usersListModels)) {
                $users[$key]['inDiffListDest'] = 'Y';
            } else {
                $users[$key]['inDiffListDest'] = 'N';
            }
        }

        return $response->withJson(['users' => $users]);
    }

    public function getDetailledById(Request $request, Response $response, array $aArgs)
    {
        $error = $this->hasUsersRights(['id' => $aArgs['id']]);
        if (!empty($error['error'])) {
            return $response->withStatus($error['status'])->withJson(['errors' => $error['error']]);
        }

        $user = UserModel::getById(['id' => $aArgs['id'], 'select' => ['id', 'user_id', 'firstname', 'lastname', 'status', 'enabled', 'phone', 'mail', 'initials', 'thumbprint']]);
        $user['signatures'] = UserModel::getSignaturesById(['id' => $aArgs['id']]);
        $user['emailSignatures'] = UserModel::getEmailSignaturesById(['userId' => $user['user_id']]);
        $user['groups'] = UserModel::getGroupsByUserId(['userId' => $user['user_id']]);
        $user['allGroups'] = GroupModel::getAvailableGroupsByUserId(['userId' => $user['user_id']]);
        $user['entities'] = UserModel::getEntitiesById(['userId' => $user['user_id']]);
        $user['allEntities'] = EntityModel::getAvailableEntitiesForAdministratorByUserId(['userId' => $user['user_id'], 'administratorUserId' => $GLOBALS['userId']]);
        $user['baskets'] = BasketModel::getBasketsByUserId(['userId' => $user['user_id']]);
        $user['history'] = HistoryModel::getByUserId(['userId' => $user['user_id']]);

        return $response->withJson($user);
    }

    public function create(Request $request, Response $response)
    {
        if (!ServiceModel::hasService(['id' => 'admin_users', 'userId' => $GLOBALS['userId'], 'location' => 'apps', 'type' => 'admin'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        $data = $request->getParams();

        $check = Validator::stringType()->notEmpty()->validate($data['userId']) && preg_match("/^[\w.@-]*$/", $data['userId']);
        $check = $check && Validator::stringType()->notEmpty()->validate($data['firstname']);
        $check = $check && Validator::stringType()->notEmpty()->validate($data['lastname']);
        $check = $check && (empty($data['mail']) || filter_var($data['mail'], FILTER_VALIDATE_EMAIL));
        $check = $check && (empty($data['phone']) || preg_match("/^(?:0|\+\d\d\s?)[1-9]([\.\-\s]?\d\d){4}$/", $data['phone']));
        if (!$check) {
            return $response->withStatus(400)->withJson(['errors' => 'Bad Request']);
        }

        $existingUser = UserModel::getByUserId(['userId' => $data['userId'], 'select' => ['1']]);
        if (!empty($existingUser)) {
            return $response->withStatus(400)->withJson(['errors' => 'User already exists']);
        }

        UserModel::create(['user' => $data]);

        $newUser = UserModel::getByUserId(['userId' => $data['userId']]);
        if (!Validator::intType()->notEmpty()->validate($newUser['id'])) {
            return $response->withStatus(500)->withJson(['errors' => 'User Creation Error']);
        }

        return $response->withJson(['user' => $newUser]);
    }

    public function update(Request $request, Response $response, array $aArgs)
    {
        $error = $this->hasUsersRights(['id' => $aArgs['id']]);
        if (!empty($error['error'])) {
            return $response->withStatus($error['status'])->withJson(['errors' => $error['error']]);
        }

        $data = $request->getParams();

        $check = Validator::stringType()->notEmpty()->validate($data['user_id']);
        $check = $check && Validator::stringType()->notEmpty()->validate($data['firstname']);
        $check = $check && Validator::stringType()->notEmpty()->validate($data['lastname']);
        $check = $check && (empty($data['mail']) || filter_var($data['mail'], FILTER_VALIDATE_EMAIL));
        $check = $check && (empty($data['phone']) || preg_match("/^(?:0|\+\d\d\s?)[1-9]([\.\-\s]?\d\d){4}$/", $data['phone']));
        if (!$check) {
            return $response->withStatus(400)->withJson(['errors' => 'Bad Request']);
        }

        UserModel::update(['id' => $aArgs['id'], 'user' => $data]);

        return $response->withJson(['success' => 'success']);
    }

    public function delete(Request $request, Response $response, array $aArgs)
    {
        $error = $this->hasUsersRights(['id' => $aArgs['id']]);
        if (!empty($error['error'])) {
            return $response->withStatus($error['status'])->withJson(['errors' => $error['error']]);
        }

        UserModel::delete(['id' => $aArgs['id']]);

        return $response->withJson(['success' => 'success']);
    }

    public function getProfile(Request $request, Response $response)
    {
        $user = UserModel::getByUserId(['userId' => $GLOBALS['userId'], 'select' => ['id', 'user_id', 'firstname', 'lastname', 'phone', 'mail', 'initials', 'thumbprint']]);
        $user['signatures'] = UserModel::getSignaturesById(['id' => $user['id']]);
        $user['emailSignatures'] = UserModel::getEmailSignaturesById(['userId' => $user['user_id']]);
        $user['groups'] = UserModel::getGroupsByUserId(['userId' => $user['user_id']]);
        $user['entities'] = UserModel::getEntitiesById(['userId' => $user['user_id']]);
        $user['baskets'] = BasketModel::getBasketsByUserId(['userId' => $user['user_id'], 'unneededBasketId' => ['IndexingBasket']]);
        $user['redirectedBaskets'] = BasketModel::getRedirectedBasketsByUserId(['userId' => $user['user_id']]);
        $user['regroupedBaskets'] = BasketModel::getRegroupedBasketsByUserId(['userId' => $user['user_id']]);
        $user['canModifyPassword'] = true;

        $baskets = [];
        foreach ($user['baskets'] as $key => $basket) {
            if (in_array($basket['basket_id'], $baskets) && $basket['basket_owner'] == $user['user_id']) {
                unset($user['baskets'][$key]);
            } else {
                $baskets[] = $basket['basket_id'];
            }
        }
        $user['baskets'] = array_values($user['baskets']);

        $loggingMethod = CoreConfigModel::getLoggingMethod();
        if ($loggingMethod['id'] == 'ozwillo') {
            $user['canModifyPassword'] = false;
        }

        return $response->withJson($user);
    }

    public function updateProfile(Request $request, Response $response)
    {
        $user = UserModel::getByUserId(['userId' => $GLOBALS['userId'], 'select' => ['id', 'enabled']]);

        $data = $request->getParams();

        $check = Validator::stringType()->notEmpty()->validate($data['firstname']);
        $check = $check && Validator::stringType()->notEmpty()->validate($data['lastname']);
        $check = $check && (empty($data['mail']) || filter_var($data['mail'], FILTER_VALIDATE_EMAIL));
        $check = $check && (empty($data['phone']) || preg_match("/^(?:0|\+\d\d\s?)[1-9]([\.\-\s]?\d\d){4}$/", $data['phone']));
        if (!$check) {
            return $response->withStatus(400)->withJson(['errors' => 'Bad Request']);
        }
        $data['enabled'] = $user['enabled'];

        UserModel::update(['id' => $user['id'], 'user' => $data]);

        return $response->withJson(['success' => 'success']);
    }

    public function resetPassword(Request $request, Response $response, array $aArgs)
    {
        $error = $this->hasUsersRights(['id' => $aArgs['id']]);
        if (!empty($error['error'])) {
            return $response->withStatus($error['status'])->withJson(['errors' => $error['error']]);
        }

        UserModel::resetPassword(['id' => $aArgs['id']]);

        return $response->withJson(['success' => 'success']);
    }

    public function updateCurrentUserPassword(Request $request, Response $response)
    {
        $data = $request->getParams();

        if (!$this->checkNeededParameters(['data' => $data, 'needed' => ['currentPassword', 'newPassword', 'reNewPassword']])) {
            return $response->withStatus(400)->withJson(['errors' => 'Bas request']);
        }

        if ($data['newPassword'] != $data['reNewPassword']) {
            return $response->withStatus(400)->withJson(['errors' => 'Bad Request']);
        } elseif (!SecurityModel::authentication(['userId' => $GLOBALS['userId'], 'password' => $data['currentPassword']])) {
            return $response->withStatus(401)->withJson(['errors' => _WRONG_PSW]);
        }

        $user = UserModel::getByUserId(['userId' => $GLOBALS['userId'], 'select' => ['id']]);
        UserModel::updatePassword(['id' => $user['id'], 'password' => $data['newPassword']]);

        return $response->withJson(['success' => 'success']);
    }

    public function setRedirectedBaskets(Request $request, Response $response, array $aArgs)
    {
        $error = $this->hasUsersRights(['id' => $aArgs['id'], 'himself' => true]);
        if (!empty($error['error'])) {
            return $response->withStatus($error['status'])->withJson(['errors' => $error['error']]);
        }

        $user = UserModel::getById(['id' => $aArgs['id'], 'select' => ['user_id']]);

        $data = $request->getParams();

        foreach ($data as $key => $value) {
            if (empty($value['newUser']) || empty($value['basketId']) || empty($value['basketOwner']) || empty($value['virtual'])) {
                return $response->withStatus(400)->withJson(['errors' => 'Bad Request']);
            }
            $check = UserModel::getByUserId(['userId' => $value['newUser'], 'select' => ['1']]);
            if (empty($check)) {
                return $response->withStatus(400)->withJson(['errors' => 'User not found']);
            }

            if($value['basketOwner'] != $user['user_id']){
                BasketModel::updateRedirectedBaskets([
                    'userId'      => $user['user_id'],
                    'basketOwner' => $value['basketOwner'],
                    'basketId'    => $value['basketId'],
                    'userAbs'     => $value['basketOwner'],
                    'newUser'     => $value['newUser']
                ]);
                unset($data[$key]);
            }
        }

        if (!empty($data)) {
            foreach ($data as $value) {
                BasketModel::setRedirectedBaskets([
                    'userAbs'       => $user['user_id'],
                    'newUser'       => $value['newUser'],
                    'basketId'      => $value['basketId'],
                    'basketOwner'   => $value['basketOwner'],
                    'isVirtual'     => $value['virtual']
                ]);
            }
        }

        return $response->withJson(['redirectedBaskets' => BasketModel::getRedirectedBasketsByUserId(['userId' => $user['user_id']])]);
    }

    public function deleteRedirectedBaskets(Request $request, Response $response, array $aArgs)
    {
        $error = $this->hasUsersRights(['id' => $aArgs['id'], 'himself' => true]);
        if (!empty($error['error'])) {
            return $response->withStatus($error['status'])->withJson(['errors' => $error['error']]);
        }

        $user = UserModel::getById(['id' => $aArgs['id'], 'select' => ['user_id']]);

        BasketModel::deleteBasketRedirection(['userId' => $user['user_id'], 'basketId' => $aArgs['basketId']]);

        return $response->withJson(['redirectedBaskets' => BasketModel::getRedirectedBasketsByUserId(['userId' => $user['user_id']])]);
    }

    public function updateStatus(Request $request, Response $response, array $aArgs)
    {
        $error = $this->hasUsersRights(['id' => $aArgs['id'], 'himself' => true]);
        if (!empty($error['error'])) {
            return $response->withStatus($error['status'])->withJson(['errors' => $error['error']]);
        }

        $data = $request->getParams();

        $check = Validator::stringType()->notEmpty()->validate($data['status']);
        $check = $check && ($data['status'] == 'OK' || $data['status'] == 'ABS');
        if (!$check) {
            return $response->withStatus(400)->withJson(['errors' => 'Bad Request']);
        }

        UserModel::updateStatus(['id' => $aArgs['id'], 'status' => $data['status']]);

        $user = UserModel::getById(['id' => $aArgs['id'], 'select' => ['user_id', 'firstname', 'lastname']]);
        HistoryController::add([
            'tableName'    => 'users',
            'recordId'     => $user['user_id'],
            'eventType'    => 'RET',
            'eventId'      => 'userabs',
            'info'         => "{$user['firstname']} {$user['lastname']} " ._BACK_FROM_VACATION
        ]);

        return $response->withJson(['user' => UserModel::getById(['id' => $aArgs['id'], 'select' => ['status']])]);
    }

    public function addSignature(Request $request, Response $response, array $aArgs)
    {
        $error = $this->hasUsersRights(['id' => $aArgs['id'], 'himself' => true]);
        if (!empty($error['error'])) {
            return $response->withStatus($error['status'])->withJson(['errors' => $error['error']]);
        }

        $data = $request->getParams();

        if (!$this->checkNeededParameters(['data' => $data, 'needed' => ['base64', 'name', 'label']])) {
            return $response->withStatus(400)->withJson(['errors' => 'Bad Request']);
        }

        $file     = base64_decode($data['base64']);
        $tmpName  = "tmp_file_{$aArgs['id']}_" .rand(). "_{$data['name']}";

        $finfo    = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->buffer($file);
        $size     = strlen($file);
        $type     = explode('/', $mimeType);
        $ext      = strtoupper(substr($data['name'], strrpos($data['name'], '.') + 1));

        $customId = CoreConfigModel::getCustomId();

        if (file_exists("custom/{$customId}/apps/maarch_entreprise/xml/extensions.xml")) {
            $path = "custom/{$customId}/apps/maarch_entreprise/xml/extensions.xml";
        } else {
            $path = 'apps/maarch_entreprise/xml/extensions.xml';
        }

        $xmlfile  = simplexml_load_file($path);

        $fileAccepted = false;
        if (count($xmlfile->FORMAT) > 0) {
            foreach ($xmlfile->FORMAT as $value) {
                if(strtoupper($value->name) == $ext && strtoupper($value->mime) == strtoupper($mimeType)){
                    $fileAccepted = true;
                    break;
                }
            }
        }

        if (!$fileAccepted || $type[0] != 'image') {
            return $response->withStatus(400)->withJson(['errors' => _WRONG_FILE_TYPE]);
        } elseif ($size > 2000000){
            return $response->withStatus(400)->withJson(['errors' => _MAX_SIZE_UPLOAD_REACHED . ' (2 MB)']);
        }

        file_put_contents(CoreConfigModel::getTmpPath() . $tmpName, $file);

        $storeInfos = StoreController::storeResourceOnDocServer([
            'collId'            => 'templates',
            'docserverTypeId'   => 'TEMPLATES',
            'fileInfos'         => [
                'tmpDir'        => CoreConfigModel::getTmpPath(),
                'size'          => $data['size'],
                'format'        => $ext,
                'tmpFileName'   => $tmpName,
            ]
        ]);

        if (!file_exists($storeInfos['path_template']. str_replace('#', '/', $storeInfos['destination_dir']) .$storeInfos['file_destination_name'])) {
            return $response->withStatus(500)->withJson(['errors' => $storeInfos['error'] .' templates']);
        }

        UserModel::createSignature([
            'userSerialId'      => $aArgs['id'],
            'signatureLabel'    => $data['label'],
            'signaturePath'     => $storeInfos['destination_dir'],
            'signatureFileName' => $storeInfos['file_destination_name'],
        ]);

        return $response->withJson([
            'signatures' => UserModel::getSignaturesById(['id' => $aArgs['id']])
        ]);
    }

    public function updateSignature(Request $request, Response $response, array $aArgs)
    {
        $error = $this->hasUsersRights(['id' => $aArgs['id'], 'himself' => true]);
        if (!empty($error['error'])) {
            return $response->withStatus($error['status'])->withJson(['errors' => $error['error']]);
        }

        $data = $request->getParams();

        if (!$this->checkNeededParameters(['data' => $data, 'needed' => ['label']])) {
            return $response->withStatus(400)->withJson(['errors' => 'Bad Request']);
        }

        UserModel::updateSignature([
            'signatureId'   => $aArgs['signatureId'],
            'userSerialId'  => $aArgs['id'],
            'label'         => $data['label']
        ]);

        return $response->withJson([
            'signature' => UserModel::getSignatureWithSignatureIdById(['id' => $aArgs['id'], 'signatureId' => $aArgs['signatureId']])
        ]);
    }

    public function deleteSignature(Request $request, Response $response, array $aArgs)
    {
        $error = $this->hasUsersRights(['id' => $aArgs['id'], 'himself' => true]);
        if (!empty($error['error'])) {
            return $response->withStatus($error['status'])->withJson(['errors' => $error['error']]);
        }

        UserModel::deleteSignature(['signatureId' => $aArgs['signatureId'], 'userSerialId' => $aArgs['id']]);

        return $response->withJson([
            'signatures' => UserModel::getSignaturesById(['id' => $aArgs['id']])
        ]);
    }

    public function createCurrentUserEmailSignature(Request $request, Response $response)
    {
        $data = $request->getParams();

        if (!$this->checkNeededParameters(['data' => $data, 'needed' => ['title', 'htmlBody']])) {
            return $response->withJson(['errors' => _EMPTY_EMAIL_SIGNATURE_FORM]);
        }

        $r = UserModel::createEmailSignature([
            'userId'    => $GLOBALS['userId'],
            'title'     => $data['title'],
            'htmlBody'  => $data['htmlBody']
        ]);

        if (!$r) {
            return $response->withStatus(500)->withJson(['errors' => 'Email Signature Creation Error']);
        }

        return $response->withJson([
            'emailSignatures' => UserModel::getEmailSignaturesById(['userId' => $GLOBALS['userId']])
        ]);
    }

    public function updateCurrentUserEmailSignature(Request $request, Response $response, array $aArgs)
    {
        $data = $request->getParams();

        if (!$this->checkNeededParameters(['data' => $data, 'needed' => ['title', 'htmlBody']])) {
            return $response->withJson(['errors' => _EMPTY_EMAIL_SIGNATURE_FORM]);
        }

        $r = UserModel::updateEmailSignature([
            'id'        => $aArgs['id'],
            'userId'    => $GLOBALS['userId'],
            'title'     => $data['title'],
            'htmlBody'  => $data['htmlBody']
        ]);

        if (!$r) {
            return $response->withStatus(500)->withJson(['errors' => 'Email Signature Update Error']);
        }

        return $response->withJson([
            'emailSignature' => UserModel::getEmailSignatureWithSignatureIdById(['userId' => $GLOBALS['userId'], 'signatureId' => $aArgs['id']])
        ]);
    }

    public function deleteCurrentUserEmailSignature(Request $request, Response $response, array $aArgs)
    {
        $r = UserModel::deleteEmailSignature([
            'id'        => $aArgs['id'],
            'userId'    => $GLOBALS['userId']
        ]);

        if (!$r) {
            return $response->withStatus(500)->withJson(['errors' => 'Email Signature Delete Error']);
        }

        return $response->withJson([
            'emailSignatures' => UserModel::getEmailSignaturesById(['userId' => $GLOBALS['userId']])
        ]);
    }

    public function addGroup(Request $request, Response $response, array $aArgs)
    {
        $error = $this->hasUsersRights(['id' => $aArgs['id']]);
        if (!empty($error['error'])) {
            return $response->withStatus($error['status'])->withJson(['errors' => $error['error']]);
        }

        $data = $request->getParams();
        if (!$this->checkNeededParameters(['data' => $data, 'needed' => ['groupId']])) {
            return $response->withStatus(400)->withJson(['errors' => 'Bad Request']);
        }
        if (empty(GroupModel::getByGroupId(['groupId' => $data['groupId']]))) {
            return $response->withStatus(400)->withJson(['errors' => 'Group not found']);
        } elseif (UserModel::hasGroup(['id' => $aArgs['id'], 'groupId' => $data['groupId']])) {
            return $response->withStatus(400)->withJson(['errors' => 'User is already linked to this group']);
        }
        if (empty($data['role'])) {
            $data['role'] = '';
        }

        UserModel::addGroup(['id' => $aArgs['id'], 'groupId' => $data['groupId'], 'role' => $data['role']]);

        $user = UserModel::getById(['id' => $aArgs['id'], 'select' => ['user_id']]);
        HistoryController::add([
            'tableName' => 'users',
            'recordId'  => $user['user_id'],
            'eventType' => 'UP',
            'info'      => _USER_GROUP_CREATION . " : {$user['user_id']} {$data['groupId']}",
            'moduleId'  => 'user',
            'eventId'   => 'userModification',
        ]);

        return $response->withJson([
            'groups'    => UserModel::getGroupsByUserId(['userId' => $user['user_id']]),
            'allGroups' => GroupModel::getAvailableGroupsByUserId(['userId' => $user['user_id']]),
            'baskets'   => BasketModel::getBasketsByUserId(['userId' => $user['user_id']])
        ]);
    }

    public function updateGroup(Request $request, Response $response, array $aArgs)
    {
        $error = $this->hasUsersRights(['id' => $aArgs['id']]);
        if (!empty($error['error'])) {
            return $response->withStatus($error['status'])->withJson(['errors' => $error['error']]);
        }
        if (empty(GroupModel::getByGroupId(['groupId' => $aArgs['groupId']]))) {
            return $response->withStatus(400)->withJson(['errors' => 'Group not found']);
        }

        $data = $request->getParams();
        if (empty($data['role'])) {
            $data['role'] = '';
        }

        UserModel::updateGroup(['id' => $aArgs['id'], 'groupId' => $aArgs['groupId'], 'role' => $data['role']]);

        $user = UserModel::getById(['id' => $aArgs['id'], 'select' => ['user_id']]);
        HistoryController::add([
            'tableName' => 'users',
            'recordId'  => $user['user_id'],
            'eventType' => 'UP',
            'info'      => _USER_GROUP_MODIFICATION . " : {$user['user_id']} {$aArgs['groupId']}",
            'moduleId'  => 'user',
            'eventId'   => 'userModification',
        ]);

        return $response->withJson(['success' => 'success']);
    }

    public function deleteGroup(Request $request, Response $response, array $aArgs)
    {
        $error = $this->hasUsersRights(['id' => $aArgs['id']]);
        if (!empty($error['error'])) {
            return $response->withStatus($error['status'])->withJson(['errors' => $error['error']]);
        }
        if (empty(GroupModel::getByGroupId(['groupId' => $aArgs['groupId']]))) {
            return $response->withStatus(400)->withJson(['errors' => 'Group not found']);
        }

        UserModel::deleteGroup(['id' => $aArgs['id'], 'groupId' => $aArgs['groupId']]);

        $user = UserModel::getById(['id' => $aArgs['id'], 'select' => ['user_id']]);
        HistoryController::add([
            'tableName' => 'users',
            'recordId'  => $user['user_id'],
            'eventType' => 'UP',
            'info'      => _USER_GROUP_SUPPRESSION . " : {$user['user_id']} {$aArgs['groupId']}",
            'moduleId'  => 'user',
            'eventId'   => 'userModification',
        ]);

        return $response->withJson([
            'groups'    => UserModel::getGroupsByUserId(['userId' => $user['user_id']]),
            'allGroups' => GroupModel::getAvailableGroupsByUserId(['userId' => $user['user_id']])
        ]);
    }

    public function addEntity(Request $request, Response $response, array $aArgs)
    {
        $error = $this->hasUsersRights(['id' => $aArgs['id']]);
        if (!empty($error['error'])) {
            return $response->withStatus($error['status'])->withJson(['errors' => $error['error']]);
        }

        $data = $request->getParams();
        if (!$this->checkNeededParameters(['data' => $data, 'needed' => ['entityId']])) {
            return $response->withStatus(400)->withJson(['errors' => 'Bad Request']);
        }
        if (empty(EntityModel::getById(['entityId' => $data['entityId']]))) {
            return $response->withStatus(400)->withJson(['errors' => 'Entity not found']);
        } elseif (UserModel::hasEntity(['id' => $aArgs['id'], 'entityId' => $data['entityId']])) {
            return $response->withStatus(400)->withJson(['errors' => 'User is already linked to this entity']);
        }
        if (empty($data['role'])) {
            $data['role'] = '';
        }
        $user = UserModel::getById(['id' => $aArgs['id'], 'select' => ['user_id']]);
        $primaryEntity = UserModel::getPrimaryEntityByUserId(['userId' => $user['user_id']]);
        $pEntity = 'N';
        if (empty($primaryEntity)) {
            $pEntity = 'Y';
        }

        UserModel::addEntity(['id' => $aArgs['id'], 'entityId' => $data['entityId'], 'role' => $data['role'], 'primaryEntity' => $pEntity]);
        HistoryController::add([
            'tableName' => 'users',
            'recordId'  => $user['user_id'],
            'eventType' => 'UP',
            'info'      => _USER_ENTITY_CREATION . " : {$user['user_id']} {$data['entityId']}",
            'moduleId'  => 'user',
            'eventId'   => 'userModification',
        ]);

        return $response->withJson([
            'entities'      => UserModel::getEntitiesById(['userId' => $user['user_id']]),
            'allEntities'   => EntityModel::getAvailableEntitiesForAdministratorByUserId(['userId' => $user['user_id'], 'administratorUserId' => $GLOBALS['userId']])
        ]);
    }

    public function updateEntity(Request $request, Response $response, array $aArgs)
    {
        $error = $this->hasUsersRights(['id' => $aArgs['id']]);
        if (!empty($error['error'])) {
            return $response->withStatus($error['status'])->withJson(['errors' => $error['error']]);
        }
        if (empty(EntityModel::getById(['entityId' => $aArgs['entityId']]))) {
            return $response->withStatus(400)->withJson(['errors' => 'Entity not found']);
        }

        $data = $request->getParams();
        if (empty($data['user_role'])) {
            $data['user_role'] = '';
        }

        UserModel::updateEntity(['id' => $aArgs['id'], 'entityId' => $aArgs['entityId'], 'role' => $data['user_role']]);
        HistoryController::add([
            'tableName' => 'users',
            'recordId'  => $aArgs['id'],
            'eventType' => 'UP',
            'info'      => _USER_ENTITY_MODIFICATION . " : {$aArgs['id']} {$aArgs['entityId']}",
            'moduleId'  => 'user',
            'eventId'   => 'userModification',
        ]);

        return $response->withJson(['success' => 'success']);
    }

    public function updatePrimaryEntity(Request $request, Response $response, array $aArgs)
    {
        $error = $this->hasUsersRights(['id' => $aArgs['id']]);
        if (!empty($error['error'])) {
            return $response->withStatus($error['status'])->withJson(['errors' => $error['error']]);
        }
        if (empty(EntityModel::getById(['entityId' => $aArgs['entityId']]))) {
            return $response->withStatus(400)->withJson(['errors' => 'Entity not found']);
        }

        $user = UserModel::getById(['id' => $aArgs['id'], 'select' => ['user_id']]);
        UserModel::updatePrimaryEntity(['id' => $aArgs['id'], 'entityId' => $aArgs['entityId']]);

        return $response->withJson(['entities' => UserModel::getEntitiesById(['userId' => $user['user_id']])]);
    }

    public function deleteEntity(Request $request, Response $response, array $aArgs)
    {
        $error = $this->hasUsersRights(['id' => $aArgs['id']]);
        if (!empty($error['error'])) {
            return $response->withStatus($error['status'])->withJson(['errors' => $error['error']]);
        }
        if (empty(EntityModel::getById(['entityId' => $aArgs['entityId']]))) {
            return $response->withStatus(400)->withJson(['errors' => 'Entity not found']);
        }

        $user = UserModel::getById(['id' => $aArgs['id'], 'select' => ['user_id']]);
        $primaryEntity = UserModel::getPrimaryEntityByUserId(['userId' => $user['user_id']]);
        UserModel::deleteEntity(['id' => $aArgs['id'], 'entityId' => $aArgs['entityId']]);

        if (!empty($primaryEntity['entity_id']) && $primaryEntity['entity_id'] == $aArgs['entityId']) {
            UserModel::reassignPrimaryEntity(['userId' => $user['user_id']]);
        }

        HistoryController::add([
            'tableName' => 'users',
            'recordId'  => $user['user_id'],
            'eventType' => 'UP',
            'info'      => _USER_ENTITY_SUPPRESSION . " : {$user['user_id']} {$aArgs['entityId']}",
            'moduleId'  => 'user',
            'eventId'   => 'userModification',
        ]);

        return $response->withJson([
            'entities'      => UserModel::getEntitiesById(['userId' => $user['user_id']]),
            'allEntities'   => EntityModel::getAvailableEntitiesForAdministratorByUserId(['userId' => $user['user_id'], 'administratorUserId' => $GLOBALS['userId']])
        ]);
    }

    public function updateBasketsDisplay(Request $request, Response $response, array $aArgs)
    {
        $error = $this->hasUsersRights(['id' => $aArgs['id']]);
        if (!empty($error['error'])) {
            return $response->withStatus($error['status'])->withJson(['errors' => $error['error']]);
        }

        $data = $request->getParams();
        $check = Validator::stringType()->notEmpty()->validate($data['basketId']);
        $check = $check && Validator::intVal()->notEmpty()->validate($data['groupSerialId']);
        $check = $check && Validator::boolType()->validate($data['allowed']);
        if (!$check) {
            return $response->withStatus(400)->withJson(['errors' => 'Bad Request']);
        }

        $group = GroupModel::getById(['id' => $data['groupSerialId'], 'select' => ['group_id']]);
        $basket = BasketModel::getById(['id' => $data['basketId'], 'select' => [1]]);
        if (empty($group) || empty($basket)) {
            return $response->withStatus(400)->withJson(['errors' => 'Group or basket does not exist']);
        }

        $user = UserModel::getById(['id' => $aArgs['id'], 'select' => ['user_id']]);
        $groups = UserModel::getGroupsByUserId(['userId' => $user['user_id']]);
        $groupFound = false;
        foreach ($groups as $value) {
            if ($value['id'] == $data['groupSerialId']) {
                $groupFound = true;
            }
        }
        if (!$groupFound) {
            return $response->withStatus(400)->withJson(['errors' => 'Group is not linked to this user']);
        }
        $groups = BasketModel::getGroups(['id' => $data['basketId']]);
        $groupFound = false;
        foreach ($groups as $value) {
            if ($value['group_id'] == $group['group_id']) {
                $groupFound = true;
            }
        }
        if (!$groupFound) {
            return $response->withStatus(400)->withJson(['errors' => 'Group is not linked to this basket']);
        }

        $preference = UserBasketPreferenceModel::get([
            'select'    => [1],
            'where'     => ['user_serial_id = ?', 'group_serial_id = ?', 'basket_id = ?'],
            'data'      => [$aArgs['id'], $data['groupSerialId'], $data['basketId']]
        ]);
        if (!empty($preference)) {
            return $response->withStatus(400)->withJson(['errors' => 'Preference already exists']);
        }

        if ($data['allowed']) {
            $data['userSerialId'] = $aArgs['id'];
            $data['display'] = 'true';
            UserBasketPreferenceModel::create($data);
        } else {
            UserBasketPreferenceModel::delete([
                'where' => ['user_serial_id = ?', 'group_serial_id = ?', 'basket_id = ?'],
                'data'  => [$aArgs['id'], $data['groupSerialId'], $data['basketId']]
            ]);
        }

        return $response->withJson(['success' => 'success']);
    }

    public function updateBasketPreference(Request $request, Response $response, array $aArgs)
    {
        $data = $request->getParams();

        $user = UserModel::getByUserId(['userId' => $GLOBALS['userId'], 'select' => ['id']]);

        if(isset($data['color']) && $data['color'] == ''){
            UserModel::eraseBasketColor(['id' => $user['id'], 'groupId' => $aArgs['groupId'], 'basketId' => $aArgs['basketId']]);
        } else if (!empty($data['color'])) {
            UserModel::updateBasketColor(['id' => $user['id'], 'groupId' => $aArgs['groupId'], 'basketId' => $aArgs['basketId'], 'color' => $data['color']]);
        }

        return $response->withJson([
            'userBaskets' => BasketModel::getRegroupedBasketsByUserId(['userId' => $GLOBALS['userId']])
        ]);
    }

    private function hasUsersRights(array $aArgs)
    {
        $error = [
            'status'    => 200,
            'error'     => ''
        ];

        $user = UserModel::getById(['id' => $aArgs['id'], 'select' => ['user_id']]);
        if (empty($user['user_id'])) {
            $error['status'] = 400;
            $error['error'] = 'User not found';
        } else {
            if (empty($aArgs['himself']) || $GLOBALS['userId'] != $user['user_id']) {
                if (!ServiceModel::hasService(['id' => 'admin_users', 'userId' => $GLOBALS['userId'], 'location' => 'apps', 'type' => 'admin'])) {
                    $error['status'] = 403;
                    $error['error'] = 'Service forbidden';
                }
                if ($GLOBALS['userId'] != 'superadmin') {
                    $entities = EntityModel::getAllEntitiesByUserId(['userId' => $GLOBALS['userId']]);
                    $users = UserModel::getByEntities([
                        'select'    => ['users.id'],
                        'entities'  => $entities
                    ]);
                    $allowed = false;
                    foreach ($users as $value) {
                        if ($value['id'] == $aArgs['id']) {
                            $allowed = true;
                        }
                    }
                    if (!$allowed) {
                        $error['status'] = 403;
                        $error['error'] = 'UserId out of perimeter';
                    }
                }
            }
        }

        return $error;
    }

    private function checkNeededParameters(array $aArgs)
    {
        foreach ($aArgs['needed'] as $value) {
            if (empty($aArgs['data'][$value])) {
                return false;
            }
        }

        return true;
    }
}
