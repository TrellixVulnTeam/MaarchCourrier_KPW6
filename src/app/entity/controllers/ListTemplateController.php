<?php

/**
 * Copyright Maarch since 2008 under licence GPLv3.
 * See LICENCE.txt file at the root folder for more details.
 * This file is part of Maarch software.
 *
 */

/**
 * @brief List Template Controller
 * @author dev@maarch.org
 */

namespace Entity\controllers;

use Entity\models\EntityModel;
use Entity\models\ListTemplateItemModel;
use Entity\models\ListTemplateModel;
use Group\controllers\PrivilegeController;
use History\controllers\HistoryController;
use Resource\models\ResModel;
use Respect\Validation\Validator;
use Slim\Http\Request;
use Slim\Http\Response;
use SrcCore\models\CoreConfigModel;
use SrcCore\models\CurlModel;
use SrcCore\models\DatabaseModel;
use SrcCore\models\ValidatorModel;
use User\models\UserModel;

class ListTemplateController
{
    public function get(Request $request, Response $response)
    {
        $listTemplates = ListTemplateModel::get(['select' => ['id', 'type', 'entity_id as "entityId"', 'title', 'description']]);

        return $response->withJson(['listTemplates' => $listTemplates]);
    }

    public function getById(Request $request, Response $response, array $args)
    {
        $listTemplate = ListTemplateModel::getById(['id' => $args['id'], 'select' => ['title', 'description', 'type', 'entity_id']]);
        if (empty($listTemplate)) {
            return $response->withStatus(400)->withJson(['errors' => 'List template not found']);
        }

        $listTemplateItems = ListTemplateItemModel::get(['select' => ['*'], 'where' => ['list_template_id = ?'], 'data' => [$args['id']]]);
        foreach ($listTemplateItems as $key => $value) {
            if ($value['item_type'] == 'entity') {
                $listTemplateItems[$key]['idToDisplay'] = EntityModel::getById(['id' => $value['item_id'], 'select' => ['entity_label']])['entity_label'];
                $listTemplateItems[$key]['descriptionToDisplay'] = '';
            } else {
                $listTemplateItems[$key]['idToDisplay'] = UserModel::getLabelledUserById(['id' => $value['item_id']]);
                $listTemplateItems[$key]['descriptionToDisplay'] = UserModel::getPrimaryEntityById(['id' => $value['item_id'], 'select' => ['entity_label']])['entity_label'];
            }
        }

        $roles = EntityModel::getRoles();
        $difflistType = $listTemplate['type'] == 'diffusionList' ? 'entity_id' : $listTemplate['type'] == 'visaCircuit' ? 'VISA_CIRCUIT' : 'AVIS_CIRCUIT';
        $listTemplateTypes = ListTemplateModel::getTypes(['select' => ['difflist_type_roles'], 'where' => ['difflist_type_id = ?'], 'data' => [$difflistType]]);
        $rolesForService = empty($listTemplateTypes[0]['difflist_type_roles']) ? [] : explode(' ', $listTemplateTypes[0]['difflist_type_roles']);
        foreach ($roles as $key => $role) {
            if (!in_array($role['id'], $rolesForService)) {
                unset($roles[$key]);
            } elseif ($role['id'] == 'copy') {
                $roles[$key]['id'] = 'cc';
            }
        }

        $listTemplate = [
            'title'         => $listTemplate['title'],
            'description'   => $listTemplate['description'],
            'type'          => $listTemplate['type'],
            'entityId'      => $listTemplate['entity_id'],
            'items'         => $listTemplateItems,
            'roles'         => array_values($roles)
        ];

        return $response->withJson(['listTemplate' => $listTemplate]);
    }

    public function create(Request $request, Response $response)
    {
        $body = $request->getParsedBody();

        if (!PrivilegeController::hasPrivilege(['privilegeId' => 'manage_entities', 'userId' => $GLOBALS['id']]) && !empty($body['entityId'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        if (!PrivilegeController::hasPrivilege(['privilegeId' => 'admin_listmodels', 'userId' => $GLOBALS['id']]) && empty($body['entityId'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        $allowedTypes = ['diffusionList', 'visaCircuit', 'opinionCircuit'];
        $check = Validator::stringType()->notEmpty()->validate($body['type']) && in_array($body['type'], $allowedTypes);
        $check = $check && Validator::arrayType()->notEmpty()->validate($body['items']);
        $check = $check && (Validator::stringType()->notEmpty()->validate($body['title']) || Validator::stringType()->notEmpty()->validate($body['description']));
        if (!$check) {
            return $response->withStatus(400)->withJson(['errors' => 'Bad Request']);
        }

        if (!empty($body['entityId'])) {
            $listTemplate = ListTemplateModel::get(['select' => [1], 'where' => ['entity_id = ?', 'type = ?'], 'data' => [$body['entityId'], $body['type']]]);
            if (!empty($listTemplate)) {
                return $response->withStatus(400)->withJson(['errors' => 'Entity is already linked to this type of template']);
            }
            $entities = EntityModel::getAllowedEntitiesByUserId(['userId' => $GLOBALS['userId']]);
            foreach ($entities as $entity) {
                if ($entity['serialId'] == $body['entityId'] && $entity['allowed'] == false) {
                    return $response->withStatus(403)->withJson(['errors' => 'Entity out of perimeter']);
                }
            }
        }

        $control = ListTemplateController::controlItems(['items' => $body['items']]);
        if (!empty($control['errors'])) {
            return $response->withStatus(400)->withJson(['errors' => $control['errors']]);
        }

        $listTemplateId = ListTemplateModel::create([
            'title'         => $body['title'] ?? $body['description'],
            'description'   => $body['description'] ?? null,
            'type'          => $body['type'],
            'entity_id'     => $body['entityId'] ?? null
        ]);

        foreach ($body['items'] as $key => $item) {
            ListTemplateItemModel::create([
                'list_template_id'  => $listTemplateId,
                'item_id'           => $item['id'],
                'item_type'         => $item['type'],
                'item_mode'         => $item['mode'],
                'sequence'          => $key,
            ]);
        }

        HistoryController::add([
            'tableName' => 'list_templates',
            'recordId'  => $listTemplateId,
            'eventType' => 'ADD',
            'info'      => _LIST_TEMPLATE_CREATION . " : {$body['title']} {$body['description']}",
            'moduleId'  => 'listTemplate',
            'eventId'   => 'listTemplateCreation',
        ]);

        return $response->withJson(['id' => $listTemplateId]);
    }

    public function update(Request $request, Response $response, array $args)
    {
        $body = $request->getParsedBody();

        $check = Validator::arrayType()->notEmpty()->validate($body['items']);
        $check = $check && Validator::stringType()->notEmpty()->validate($body['title']);
        if (!$check) {
            return $response->withStatus(400)->withJson(['errors' => 'Bad Request']);
        }

        $listTemplate = ListTemplateModel::getById(['id' => $args['id'], 'select' => ['entity_id', 'type']]);
        if (!PrivilegeController::hasPrivilege(['privilegeId' => 'manage_entities', 'userId' => $GLOBALS['id']]) && !empty($listTemplate['entityId'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        if (!PrivilegeController::hasPrivilege(['privilegeId' => 'admin_listmodels', 'userId' => $GLOBALS['id']]) && empty($listTemplate['entityId'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }
        if (empty($listTemplate)) {
            return $response->withStatus(400)->withJson(['errors' => 'List template not found']);
        }

        if (!empty($listTemplate['entityId'])) {
            $entities = EntityModel::getAllowedEntitiesByUserId(['userId' => $GLOBALS['userId']]);
            foreach ($entities as $entity) {
                if ($entity['serialId'] == $listTemplate['entityId'] && $entity['allowed'] == false) {
                    return $response->withStatus(403)->withJson(['errors' => 'Entity out of perimeter']);
                }
            }
        }

        $control = ListTemplateController::controlItems(['items' => $body['items']]);
        if (!empty($control['errors'])) {
            return $response->withStatus(400)->withJson(['errors' => $control['errors']]);
        }

        ListTemplateModel::update([
            'set'   => ['title' => $body['title'], 'description' => $body['description'] ?? null],
            'where' => ['id = ?'],
            'data'  => [$args['id']]
        ]);

        ListTemplateItemModel::delete(['where' => ['list_template_id = ?'], 'data' => [$args['id']]]);
        foreach ($body['items'] as $key => $item) {
            ListTemplateItemModel::create([
                'list_template_id'  => $args['id'],
                'item_id'           => $item['id'],
                'item_type'         => $item['type'],
                'item_mode'         => $item['mode'],
                'sequence'          => $key,
            ]);
        }

        HistoryController::add([
            'tableName' => 'list_templates',
            'recordId'  => $args['id'],
            'eventType' => 'UP',
            'info'      => _LIST_TEMPLATE_MODIFICATION . " : {$body['title']} {$body['description']}",
            'moduleId'  => 'listTemplate',
            'eventId'   => 'listTemplateModification',
        ]);

        return $response->withStatus(204);
    }

    public function delete(Request $request, Response $response, array $args)
    {
        $listTemplate = ListTemplateModel::getById(['id' => $args['id'], 'select' => ['entity_id', 'type', 'title']]);
        if (!PrivilegeController::hasPrivilege(['privilegeId' => 'manage_entities', 'userId' => $GLOBALS['id']]) && !empty($listTemplate['entityId'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        if (!PrivilegeController::hasPrivilege(['privilegeId' => 'admin_listmodels', 'userId' => $GLOBALS['id']]) && empty($listTemplate['entityId'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }
        if (empty($listTemplate)) {
            return $response->withStatus(400)->withJson(['errors' => 'List template not found']);
        }

        if (!empty($listTemplate['entityId'])) {
            $entities = EntityModel::getAllowedEntitiesByUserId(['userId' => $GLOBALS['userId']]);
            foreach ($entities as $entity) {
                if ($entity['serialId'] == $listTemplate['entityId'] && $entity['allowed'] == false) {
                    return $response->withStatus(403)->withJson(['errors' => 'Entity out of perimeter']);
                }
            }
        }

        ListTemplateModel::delete([
            'where' => ['id = ?'],
            'data'  => [$args['id']]
        ]);
        ListTemplateItemModel::delete(['where' => ['list_template_id = ?'], 'data' => [$args['id']]]);

        HistoryController::add([
            'tableName' => 'list_templates',
            'recordId'  => $args['id'],
            'eventType' => 'DEL',
            'info'      => _LIST_TEMPLATE_SUPPRESSION . " : {$listTemplate['title']}",
            'moduleId'  => 'listTemplate',
            'eventId'   => 'listTemplateSuppression',
        ]);

        return $response->withStatus(204);
    }

    public function getByEntityId(Request $request, Response $response, array $args)
    {
        $entity = EntityModel::getById(['select' => ['entity_id'], 'id' => $args['entityId']]);
        if (empty($entity)) {
            return $response->withStatus(400)->withJson(['errors' => 'Entity does not exist']);
        }

        $queryParams = $request->getQueryParams();

        $where = ['entity_id = ?'];
        $data = [$args['entityId']];
        if (!empty($queryParams['type'])) {
            if (in_array($queryParams['type'], ['visaCircuit', 'opinionCircuit'])) {
                $where[] = 'type = ?';
                $data[] = $queryParams['type'];
            } else {
                $where[] = 'type = ?';
                $data[] = 'diffusionList';
            }
        }

        $listTemplates = ListTemplateModel::get(['select' => ['*'], 'where' => $where, 'data' => $data]);
        foreach ($listTemplates as $key => $listTemplate) {
            $listTemplateItems = ListTemplateItemModel::get(['select' => ['*'], 'where' => ['list_template_id = ?'], 'data' => [$listTemplate['id']]]);
            foreach ($listTemplateItems as $itemKey => $value) {
                if ($value['item_type'] == 'entity') {
                    $listTemplateItems[$itemKey]['labelToDisplay'] = Entitymodel::getById(['id' => $value['item_id'], 'select' => ['entity_label']])['entity_label'];
                    $listTemplateItems[$itemKey]['descriptionToDisplay'] = '';
                } else {
                    $user = UserModel::getById(['id' => $value['item_id'], 'select' => ['firstname', 'lastname', 'external_id']]);
                    $listTemplateItems[$itemKey]['labelToDisplay'] = "{$user['firstname']} {$user['lastname']}";
                    $listTemplateItems[$itemKey]['descriptionToDisplay'] = UserModel::getPrimaryEntityById(['id' => $value['item_id'], 'select' => ['entity_label']])['entity_label'];

                    $externalId = json_decode($user['external_id'], true);
                    if (!empty($queryParams['maarchParapheur']) && !empty($externalId['maarchParapheur'])) {
                        $loadedXml = CoreConfigModel::getXmlLoaded(['path' => 'modules/visa/xml/remoteSignatoryBooks.xml']);
                        if ($loadedXml->signatoryBookEnabled == 'maarchParapheur') {
                            foreach ($loadedXml->signatoryBook as $signatoryBook) {
                                if ($signatoryBook->id == "maarchParapheur") {
                                    $url      = $signatoryBook->url;
                                    $userId   = $signatoryBook->userId;
                                    $password = $signatoryBook->password;
                                    break;
                                }
                            }
                            $curlResponse = CurlModel::execSimple([
                                'url'           => rtrim($url, '/') . '/rest/users/' . $externalId['maarchParapheur'],
                                'basicAuth'     => ['user' => $userId, 'password' => $password],
                                'headers'       => ['content-type:application/json'],
                                'method'        => 'GET'
                            ]);
                            if (!empty($curlResponse['response']['user'])) {
                                $listTemplateItems[$itemKey]['externalId']['maarchParapheur'] = $externalId['maarchParapheur'];
                            }
                        }
                    }

                }
            }

            $listTemplates[$key]['items'] = $listTemplateItems;
        }

        return $response->withJson(['listTemplates' => $listTemplates]);
    }

    public function getByEntityIdWithMaarchParapheur(Request $request, Response $response, array $args)
    {
        $entity = EntityModel::getById(['select' => ['entity_id'], 'id' => $args['entityId']]);
        if (empty($entity)) {
            return $response->withStatus(400)->withJson(['errors' => 'Entity does not exist']);
        }

        $queryParams = $request->getQueryParams();

        $listTemplates = ListTemplateModel::get(['select' => ['*'], 'where' => ['object_id = ?'], 'data' => [$entity['entity_id']]]);

        foreach ($listTemplates as $key => $value) {
            if ($value['item_type'] == 'entity_id') {
                $listTemplates[$key]['labelToDisplay'] = Entitymodel::getByEntityId(['entityId' => $value['item_id'], 'select' => ['entity_label']])['entity_label'];
                $listTemplates[$key]['descriptionToDisplay'] = '';
            } else {
                $listTemplates[$key]['labelToDisplay'] = UserModel::getLabelledUserById(['login' => $value['item_id']]);
                $listTemplates[$key]['descriptionToDisplay'] = UserModel::getPrimaryEntityByUserId(['userId' => $value['item_id']])['entity_label'];

                $userInfos = UserModel::getByLowerLogin(['login' => $value['item_id'], 'select' => ['external_id']]);
                $listTemplates[$key]['externalId'] = json_decode($userInfos['external_id'], true);
                if (!empty($listTemplates[$key]['externalId']['maarchParapheur'])) {
                    $loadedXml = CoreConfigModel::getXmlLoaded(['path' => 'modules/visa/xml/remoteSignatoryBooks.xml']);
                    if ($loadedXml->signatoryBookEnabled == 'maarchParapheur') {
                        foreach ($loadedXml->signatoryBook as $signatoryBook) {
                            if ($signatoryBook->id == "maarchParapheur") {
                                $url      = $signatoryBook->url;
                                $userId   = $signatoryBook->userId;
                                $password = $signatoryBook->password;
                                break;
                            }
                        }
                        $curlResponse = CurlModel::execSimple([
                            'url'           => rtrim($url, '/') . '/rest/users/'.$listTemplates[$key]['externalId']['maarchParapheur'],
                            'basicAuth'     => ['user' => $userId, 'password' => $password],
                            'headers'       => ['content-type:application/json'],
                            'method'        => 'GET'
                        ]);
                        if (empty($curlResponse['response']['user'])) {
                            unset($listTemplates[$key]['externalId']['maarchParapheur']);
                        }
                    }
                }
            }
        }

        return $response->withJson(['listTemplate' => $listTemplates]);
    }

    public function updateByUserWithEntityDest(Request $request, Response $response, array $args)
    {
        if (!PrivilegeController::hasPrivilege(['privilegeId' => 'admin_users', 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }
        
        $data = $request->getParams();

        DatabaseModel::beginTransaction();

        $allEntityIds = array_column($data['redirectListModels'], 'entity_id');
        $templates = ListTemplateModel::get(['select' => ['id'], 'where' => ['type = ?', 'entity_id in (?)'], 'data' => ['diffusionList', $allEntityIds]]);
        $templates = array_column($templates, 'id');
        foreach ($data['redirectListModels'] as $listModel) {
            $redirectUser = UserModel::getByLogin(['login' => $listModel['redirectUserId'], 'select' => ['status', 'id']]);
            if (empty($redirectUser) || $redirectUser['status'] != "OK") {
                DatabaseModel::rollbackTransaction();
                return $response->withStatus(400)->withJson(['errors' => 'User not found or not active']);
            }

            ListTemplateItemModel::update([
                'set'   => ['item_id' => $redirectUser['id']],
                'where' => ['item_id = ?', 'item_type = ?', 'item_mode = ?', 'list_template_id in (?)'],
                'data'  => [$args['itemId'], 'user', 'dest', $templates]
            ]);
        }

        ListTemplateModel::deleteNoItemsOnes();
        DatabaseModel::commitTransaction();

        return $response->withStatus(204);
    }

    public function getTypeRoles(Request $request, Response $response, array $aArgs)
    {
        $unneededRoles = [];
        if ($aArgs['typeId'] == 'entity_id') {
            $unneededRoles = ['visa', 'sign'];
        }
        $roles = EntityModel::getRoles();
        $listTemplateTypes = ListTemplateModel::getTypes(['select' => ['difflist_type_roles'], 'where' => ['difflist_type_id = ?'], 'data' => [$aArgs['typeId']]]);
        $rolesForType = empty($listTemplateTypes[0]['difflist_type_roles']) ? [] : explode(' ', $listTemplateTypes[0]['difflist_type_roles']);
        foreach ($roles as $key => $role) {
            if ($role['id'] == 'dest') {
                $roles[$key]['label'] = _ASSIGNEE;
            }
            if (in_array($role['id'], $unneededRoles)) {
                unset($roles[$key]);
                continue;
            }
            if (in_array($role['id'], $rolesForType)) {
                $roles[$key]['available'] = true;
            } else {
                $roles[$key]['available'] = false;
            }
            if ($role['id'] == 'copy') {
                $roles[$key]['id'] = 'cc';
            }

            $roles[$key]['usedIn'] = [];
            $type = $aArgs['typeId'] == 'entity_id' ? 'diffusionList' : ($aArgs['typeId'] == 'VISA_CIRCUIT' ? 'visaCircuit' : 'opinionCircuit');
            $listTemplates = ListTemplateModel::getWithItems(['select' => ['DISTINCT entity_id'], 'where' => ['type = ?', 'item_mode = ?', 'entity_id is not null'], 'data' => [$type, $roles[$key]['id']]]);
            foreach ($listTemplates as $listTemplate) {
                $entity = Entitymodel::getById(['select' => ['short_label'], 'id' => $listTemplate['entity_id']]);
                $roles[$key]['usedIn'][] = $entity['short_label'];
            }
        }

        return $response->withJson(['roles' => array_values($roles)]);
    }

    public function updateTypeRoles(Request $request, Response $response, array $aArgs)
    {
        if (!PrivilegeController::hasPrivilege(['privilegeId' => 'manage_entities', 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        $data = $request->getParams();

        $check = Validator::arrayType()->notEmpty()->validate($data['roles']);
        if (!$check) {
            return $response->withStatus(400)->withJson(['errors' => 'Bad Request']);
        }

        $roles = '';
        foreach ($data['roles'] as $role) {
            if ($role['available'] === true) {
                if ($role['id'] == 'cc') {
                    $role['id'] = 'copy';
                }

                if (!empty($roles)) {
                    $roles .= ' ';
                }
                $roles .= $role['id'];
            }
        }

        ListTemplateModel::updateTypes([
            'set'   => ['difflist_type_roles' => $roles],
            'where' => ['difflist_type_id = ?'],
            'data'  => [$aArgs['typeId']]
        ]);

        $listTemplates = ListTemplateModel::get([
            'select'    => ['id'],
            'where'     => ['type = ?'],
            'data'      => ['diffusionList']
        ]);
        $listTemplates = array_column($listTemplates, 'id');

        if (empty($roles)) {
            if (!empty($listTemplates)) {
                ListTemplateModel::delete([
                    'where' => ['type = ?'],
                    'data'  => ['diffusionList']
                ]);
                ListTemplateItemModel::delete([
                    'where' => ['list_template_id in (?)'],
                    'data'  => [$listTemplates]
                ]);
            }
        } else {
            ListTemplateItemModel::delete([
                'where' => ['list_template_id in (?)', 'item_mode not in (?)'],
                'data'  => [$listTemplates, explode(' ', str_replace('copy', 'cc', $roles))]
            ]);
            ListTemplateModel::deleteNoItemsOnes();
        }

        return $response->withJson(['success' => 'success']);
    }

    public function getRoles(Request $request, Response $response)
    {
        $data = $request->getQueryParams();

        $canUpdateDiffusionRecipient = false;
        $canUpdateDiffusionRoles = false;
        $triggerContext = false;

        if ($data['context'] == 'indexation') {
            $serviceRecipient = 'update_diffusion_indexing';
            $serviceRoles = 'update_diffusion_except_recipient_indexing';
            $triggerContext = true;
        } elseif ($data['context'] == 'details') {
            $serviceRecipient = 'update_diffusion_indexing';
            $serviceRoles = 'update_diffusion_except_recipient_indexing';
            $triggerContext = true;
        }

        if ($data['context'] == 'redirect') {
            $triggerContext = true;
            $canUpdateDiffusionRecipient = true;
        } elseif ($triggerContext) {
            if (PrivilegeController::hasPrivilege(['privilegeId' => $serviceRecipient, 'userId' => $GLOBALS['id']])) {
                $canUpdateDiffusionRecipient = true;
            }
            if (!$canUpdateDiffusionRecipient && PrivilegeController::hasPrivilege(['privilegeId' => $serviceRoles, 'userId' => $GLOBALS['id']])) {
                $canUpdateDiffusionRoles = true;
            }
        }

        $listTemplateTypes = ListTemplateModel::getTypes(['select' => ['difflist_type_roles'], 'where' => ['difflist_type_id = ?'], 'data' => ['entity_id']]);
        $availableRoles = empty($listTemplateTypes[0]['difflist_type_roles']) ? [] : explode(' ', $listTemplateTypes[0]['difflist_type_roles']);
        $roles = EntityModel::getRoles();
        foreach ($roles as $key => $role) {
            if (!in_array($role['id'], $availableRoles)) {
                unset($roles[$key]);
                continue;
            }
            if ($role['id'] == 'dest') {
                $roles[$key]['label'] = _ASSIGNEE;
                if ($triggerContext) {
                    $roles[$key]['canUpdate'] = $canUpdateDiffusionRecipient;
                }
            } else {
                if ($triggerContext) {
                    $roles[$key]['canUpdate'] = $canUpdateDiffusionRecipient || $canUpdateDiffusionRoles;
                }
            }
            if ($role['id'] == 'copy') {
                $roles[$key]['id'] = 'cc';
            }
        }

        return $response->withJson(['roles' => array_values($roles)]);
    }

    public function getAvailableCircuitsByResId(Request $request, Response $response, array $args)
    {
        $queryParams = $request->getQueryParams();

        if (!Validator::stringType()->notEmpty()->validate($queryParams['circuit'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Query params circuit is empty']);
        }

        $circuit = $queryParams['circuit'] == 'opinion' ? 'opinionCircuit' : 'visaCircuit';
        $resource = ResModel::getById(['resId' => $args['resId'], 'select' => ['destination']]);

        $where = ['type = ?'];
        $data = [$circuit];
        if (!empty($resource['destination'])) {
            $entity = EntityModel::getByEntityId(['entityId' => $resource['destination'], 'select' => ['id']]);
            $where[] = '(entity_id is null OR entity_id = ?)';
            $data[] = $entity['id'];
            $orderBy = ["entity_id='{$entity['id']}' DESC", 'title'];
        } else {
            $where[] = 'entity_id is null';
            $orderBy = ['title'];
        }

        $circuits = ListTemplateModel::get(['select' => ['*'], 'where' => $where, 'data' => $data, 'orderBy' => $orderBy]);

        return $response->withJson(['circuits' => $circuits]);
    }

    private static function controlItems(array $args)
    {
        ValidatorModel::notEmpty($args, ['items']);
        ValidatorModel::arrayType($args, ['items']);

        $destFound = false;
        foreach ($args['items'] as $item) {
            if ($destFound && $item['item_mode'] == 'dest') {
                return ['errors' => 'More than one dest not allowed'];
            }
            if (empty($item['id'])) {
                return ['errors' => 'id is empty'];
            }
            if (empty($item['type'])) {
                return ['errors' => 'type is empty'];
            }
            if (empty($item['mode'])) {
                return ['errors' => 'mode is empty'];
            }
            if ($item['item_mode'] == 'dest') {
                $destFound = true;
            }
        }

        return ['success' => 'success'];
    }
}
