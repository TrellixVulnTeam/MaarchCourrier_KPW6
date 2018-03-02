<?php

namespace Group\controllers;

use Group\models\ServiceModel;
use Group\models\GroupModel;
use Respect\Validation\Validator;
use Slim\Http\Request;
use Slim\Http\Response;
use SrcCore\controllers\PreparedClauseController;
use SrcCore\models\ValidatorModel;

class GroupController
{
    public function get(Request $request, Response $response)
    {
        if (!ServiceModel::hasService(['id' => 'admin_groups', 'userId' => $GLOBALS['userId'], 'location' => 'apps', 'type' => 'admin'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        $groups = GroupModel::get();
        foreach ($groups as $key => $value) {
            $groups[$key]['users'] = GroupModel::getUsersByGroupId(['groupId' => $value['group_id'], 'select' => ['users.user_id']]);
        }

        return $response->withJson(['groups' => $groups]);
    }

    public function getById(Request $request, Response $response, array $aArgs)
    {
        if (!ServiceModel::hasService(['id' => 'admin_groups', 'userId' => $GLOBALS['userId'], 'location' => 'apps', 'type' => 'admin'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        $group = GroupModel::getById(['id' => $aArgs['id']]);
        if (empty($group)) {
            return $response->withStatus(400)->withJson(['errors' => 'Group not found']);
        }

        return $response->withJson(['group' => $group]);
    }

    public function create(Request $request, Response $response)
    {
        if (!ServiceModel::hasService(['id' => 'admin_groups', 'userId' => $GLOBALS['userId'], 'location' => 'apps', 'type' => 'admin'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        $data = $request->getParams();

        $check = Validator::stringType()->notEmpty()->validate($data['group_id']) && preg_match("/^[\w-]*$/", $data['group_id']) && (strlen($data['group_id']) < 32);
        $check = $check && Validator::stringType()->notEmpty()->validate($data['group_desc']);
        $check = $check && Validator::stringType()->notEmpty()->validate($data['security']['where_clause']);
        if (!$check) {
            return $response->withStatus(400)->withJson(['errors' => 'Bad Request']);
        }

        $existingGroup = GroupModel::getByGroupId(['groupId' => $data['group_id'], 'select' => ['1']]);
        if (!empty($existingGroup)) {
            return $response->withStatus(400)->withJson(['errors' => 'Group already exists']);
        }

        if (!PreparedClauseController::isClauseValid(['clause' => $data['security']['where_clause'], 'userId' => $GLOBALS['userId']])) {
            return $response->withStatus(400)->withJson(['errors' => _INVALID_CLAUSE]);
        }

        GroupModel::create(['groupId' => $data['group_id'], 'description' => $data['group_desc'], 'clause' => $data['security']['where_clause'], 'comment' => $data['security']['maarch_comment']]);

        $group = GroupModel::getByGroupId(['groupId' => $data['group_id'], 'select' => ['id']]);
        if (empty($group)) {
            return $response->withStatus(500)->withJson(['errors' => 'Group Creation Error']);
        }

        return $response->withJson(['group' => $group['id']]);
    }

    public function update(Request $request, Response $response, array $aArgs)
    {
        if (!ServiceModel::hasService(['id' => 'admin_groups', 'userId' => $GLOBALS['userId'], 'location' => 'apps', 'type' => 'admin'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        $group = GroupModel::getById(['id' => $aArgs['id']]);
        if (empty($group)) {
            return $response->withStatus(400)->withJson(['errors' => 'Group not found']);
        }

        $data = $request->getParams();
        $check = Validator::stringType()->notEmpty()->validate($data['description']);
        $check = $check && Validator::stringType()->notEmpty()->validate($data['security']['where_clause']);
        if (!$check) {
            return $response->withStatus(400)->withJson(['errors' => 'Bad Request']);
        }

        if (!PreparedClauseController::isClauseValid(['clause' => $data['security']['where_clause'], 'userId' => $GLOBALS['userId']])) {
            return $response->withStatus(400)->withJson(['errors' => _INVALID_CLAUSE]);
        }

        GroupModel::update(['id' => $aArgs['id'], 'description' => $data['description'], 'clause' => $data['security']['where_clause'], 'comment' => $data['security']['maarch_comment']]);

        return $response->withJson(['success' => 'success']);
    }

    public function delete(Request $request, Response $response, array $aArgs)
    {
        if (!ServiceModel::hasService(['id' => 'admin_groups', 'userId' => $GLOBALS['userId'], 'location' => 'apps', 'type' => 'admin'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        $group = GroupModel::getById(['id' => $aArgs['id']]);
        if (empty($group)) {
            return $response->withStatus(400)->withJson(['errors' => 'Group not found']);
        }

        GroupModel::delete(['id' => $aArgs['id']]);

        $groups = GroupModel::get();
        foreach ($groups as $key => $value) {
            $groups[$key]['users'] = GroupModel::getUsersByGroupId(['groupId' => $value['group_id'], 'select' => ['users.user_id']]);
        }

        return $response->withJson(['groups' => $groups]);
    }

    public function getDetailledById(Request $request, Response $response, array $aArgs)
    {
        if (!ServiceModel::hasService(['id' => 'admin_groups', 'userId' => $GLOBALS['userId'], 'location' => 'apps', 'type' => 'admin'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        $group = GroupModel::getById(['id' => $aArgs['id']]);
        if (empty($group)) {
            return $response->withStatus(400)->withJson(['errors' => 'Group not found']);
        }

        $group['users']     = GroupModel::getUsersByGroupId(['groupId' => $group['group_id'], 'select' => ['users.id', 'users.user_id', 'users.firstname', 'users.lastname']]);
        $group['security']  = GroupModel::getSecurityByGroupId(['groupId' => $group['group_id']]);
        $group['services']  = GroupModel::getAllServicesByGroupId(['groupId' => $group['group_id']]);

        return $response->withJson(['group' => $group]);
    }

    public function updateService(Request $request, Response $response, array $aArgs)
    {
        if (!ServiceModel::hasService(['id' => 'admin_groups', 'userId' => $GLOBALS['userId'], 'location' => 'apps', 'type' => 'admin'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        $data = $request->getParams();

        $group = GroupModel::getById(['id' => $aArgs['id']]);
        if (empty($group)) {
            return $response->withStatus(400)->withJson(['errors' => 'Group not found']);
        }

        if ($data['checked'] === true && !empty(GroupModel::getServiceById(['groupId' => $group['group_id'], 'serviceId' => $aArgs['serviceId']]))) {
            return $response->withStatus(400)->withJson(['errors' => 'Service is already linked to this group']);
        }

        GroupModel::updateServiceById(['groupId' => $group['group_id'], 'serviceId' => $aArgs['serviceId'], 'checked' => $data['checked']]);

        return $response->withJson(['success' => 'success']);
    }

    public function reassignUsers(Request $request, Response $response, array $aArgs)
    {
        if (!ServiceModel::hasService(['id' => 'admin_groups', 'userId' => $GLOBALS['userId'], 'location' => 'apps', 'type' => 'admin'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        $group = GroupModel::getById(['id' => $aArgs['id'], 'select' => ['group_id']]);
        if (empty($group)) {
            return $response->withStatus(400)->withJson(['errors' => 'Group not found']);
        }
        $newGroup = GroupModel::getById(['id' => $aArgs['newGroupId'], 'select' => ['group_id']]);
        if (empty($newGroup)) {
            return $response->withStatus(400)->withJson(['errors' => 'Group not found']);
        }

        GroupModel::reassignUsers(['groupId' => $group['group_id'], 'newGroupId' => $newGroup['group_id']]);

        return $response->withJson(['success' => 'success']);
    }

    public static function arraySort($aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['data', 'on']);
        ValidatorModel::arrayType($aArgs, ['data']);
        ValidatorModel::stringType($aArgs, ['on']);

        $order = SORT_ASC;
        $sortableArray = [];

        foreach ($aArgs['data'] as $k => $v) {
            if (is_array($v)) {
                foreach ($v as $k2 => $v2) {
                    if ($k2 == $aArgs['on']) {
                        $sortableArray[$k] = $v2;
                    }
                }
            } else {
                $sortableArray[$k] = $v;
            }
        }

        switch ($order) {
            case SORT_ASC:
                asort($sortableArray);
                break;
            case SORT_DESC:
                arsort($sortableArray);
                break;
        }

        $newArray = [];
        foreach ($sortableArray as $k => $v) {
            $newArray[] = $aArgs['data'][$k];
        }

        return $newArray;
    }
}
