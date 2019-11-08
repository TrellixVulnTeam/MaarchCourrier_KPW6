<?php

/**
* Copyright Maarch since 2008 under licence GPLv3.
* See LICENCE.txt file at the root folder for more details.
* This file is part of Maarch software.
*
*/

/**
* @brief Group Model
* @author dev@maarch.org
*/

namespace Group\models;

use Group\controllers\GroupController;
use SrcCore\models\DatabaseModel;
use SrcCore\models\ValidatorModel;
use User\models\UserModel;

abstract class GroupModelAbstract
{
    public static function get(array $aArgs = [])
    {
        $aGroups = DatabaseModel::select([
            'select'    => empty($aArgs['select']) ? ['*'] : $aArgs['select'],
            'table'     => ['usergroups'],
            'order_by'  => ['group_desc']
        ]);

        return $aGroups;
    }

    public static function getById(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['id']);
        ValidatorModel::intVal($aArgs, ['id']);

        $aGroups = DatabaseModel::select([
            'select'    => empty($aArgs['select']) ? ['*'] : $aArgs['select'],
            'table'     => ['usergroups'],
            'where'     => ['id = ?'],
            'data'      => [$aArgs['id']]
        ]);

        return $aGroups[0];
    }

    public static function getByGroupId(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['groupId']);
        ValidatorModel::stringType($aArgs, ['groupId']);

        $aGroups = DatabaseModel::select([
            'select'    => empty($aArgs['select']) ? ['*'] : $aArgs['select'],
            'table'     => ['usergroups'],
            'where'     => ['group_id = ?'],
            'data'      => [$aArgs['groupId']]
        ]);

        return $aGroups[0];
    }

    public static function create(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['groupId', 'description', 'clause']);
        ValidatorModel::stringType($aArgs, ['groupId', 'description', 'clause', 'comment']);

        DatabaseModel::insert([
            'table'     => 'usergroups',
            'columnsValues'     => [
                'group_id'      => $aArgs['groupId'],
                'group_desc'    => $aArgs['description']
            ]
        ]);

        DatabaseModel::insert([
            'table'     => 'security',
            'columnsValues'         => [
                'group_id'          => $aArgs['groupId'],
                'coll_id'           => 'letterbox_coll',
                'where_clause'      => $aArgs['clause'],
                'maarch_comment'    => $aArgs['comment'],
            ]
        ]);

        return true;
    }

    public static function update(array $args)
    {
        ValidatorModel::notEmpty($args, ['where']);
        ValidatorModel::arrayType($args, ['set', 'postSet', 'where', 'data']);

        DatabaseModel::update([
            'table'     => 'usergroups',
            'set'       => empty($args['set']) ? [] : $args['set'],
            'postSet'   => empty($args['postSet']) ? [] : $args['postSet'],
            'where'     => $args['where'],
            'data'      => empty($args['data']) ? [] : $args['data']
        ]);

        return true;
    }

    public static function updateSecurity(array $args)
    {
        ValidatorModel::notEmpty($args, ['set', 'where', 'data']);
        ValidatorModel::arrayType($args, ['set', 'where', 'data']);

        DatabaseModel::update([
            'table' => 'security',
            'set'   => $args['set'],
            'where' => $args['where'],
            'data'  => $args['data']
        ]);

        return true;
    }

    public static function delete(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['id']);
        ValidatorModel::intVal($aArgs, ['id']);

        $group = GroupModel::getById(['id' => $aArgs['id'], 'select' => ['group_id']]);

        DatabaseModel::delete([
            'table'     => 'usergroups',
            'where'     => ['id = ?'],
            'data'      => [$aArgs['id']]
        ]);
        DatabaseModel::delete([
            'table'     => 'usergroup_content',
            'where'     => ['group_id = ?'],
            'data'      => [$aArgs['id']]
        ]);
        DatabaseModel::delete([
            'table'     => 'usergroups_reports',
            'where'     => ['group_id = ?'],
            'data'      => [$group['group_id']]
        ]);
        DatabaseModel::delete([
            'table'     => 'usergroups_services',
            'where'     => ['group_id = ?'],
            'data'      => [$group['group_id']]
        ]);
        DatabaseModel::delete([
            'table'     => 'security',
            'where'     => ['group_id = ?'],
            'data'      => [$group['group_id']]
        ]);
        DatabaseModel::delete([
            'table'     => 'groupbasket',
            'where'     => ['group_id = ?'],
            'data'      => [$group['group_id']]
        ]);
        DatabaseModel::delete([
            'table'     => 'groupbasket_redirect',
            'where'     => ['group_id = ?'],
            'data'      => [$group['group_id']]
        ]);
        DatabaseModel::delete([
            'table' => 'users_baskets_preferences',
            'where' => ['group_serial_id = ?'],
            'data'  => [$aArgs['id']]
        ]);

        return true;
    }

    public static function getUsersById(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['id']);
        ValidatorModel::intVal($aArgs, ['id']);
        ValidatorModel::arrayType($aArgs, ['select']);

        $users = DatabaseModel::select([
            'select'    => empty($aArgs['select']) ? ['*'] : $aArgs['select'],
            'table'     => ['usergroup_content, users'],
            'where'     => ['group_id = ?', 'usergroup_content.user_id = users.id', 'users.status != ?'],
            'data'      => [$aArgs['id'], 'DEL']
        ]);

        return $users;
    }

    public static function getAvailableGroupsByUserId(array $aArgs = [])
    {
        ValidatorModel::notEmpty($aArgs, ['userId']);
        ValidatorModel::stringType($aArgs, ['userId']);

        $rawUserGroups = UserModel::getGroupsByLogin(['login' => $aArgs['userId']]);

        $userGroups = [];
        foreach ($rawUserGroups as $value) {
            $userGroups[] = $value['group_id'];
        }

        $allGroups = GroupModel::get(['select' => ['group_id', 'group_desc']]);

        foreach ($allGroups as $key => $value) {
            if (in_array($value['group_id'], $userGroups)) {
                $allGroups[$key]['disabled'] = true;
            } else {
                $allGroups[$key]['disabled'] = false;
            }
        }

        return $allGroups;
    }

    public static function getGroupWithUsersGroups(array $aArgs = [])
    {
        ValidatorModel::notEmpty($aArgs, ['userId', 'groupId']);
        ValidatorModel::intVal($aArgs, ['userId', 'groupId']);

        $aGroups = DatabaseModel::select([
            'select'    => empty($aArgs['select']) ? ['*'] : $aArgs['select'],
            'table'     => ['usergroup_content, usergroups'],
            'where'     => ['usergroup_content.group_id = usergroups.id', 'usergroup_content.user_id = ?', 'usergroup_content.group_id = ?'],
            'data'      => [$aArgs['userId'], $aArgs['groupId']]
        ]);

        return $aGroups;
    }

    public static function getSecurityByGroupId(array $aArgs = [])
    {
        ValidatorModel::notEmpty($aArgs, ['groupId']);
        ValidatorModel::stringType($aArgs, ['groupId']);

        $aData = DatabaseModel::select([
            'select'    => ['where_clause', 'maarch_comment'],
            'table'     => ['security'],
            'where'     => ['group_id = ?'],
            'data'      => [$aArgs['groupId']]
        ]);

        return $aData[0];
    }
}
