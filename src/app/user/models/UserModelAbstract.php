<?php

/**
 * Copyright Maarch since 2008 under licence GPLv3.
 * See LICENCE.txt file at the root folder for more details.
 * This file is part of Maarch software.
 *
 */

/**
 * @brief User Model
 * @author dev@maarch.org
 */

namespace User\models;

use SrcCore\models\AuthenticationModel;
use SrcCore\models\DatabaseModel;
use SrcCore\models\ValidatorModel;

abstract class UserModelAbstract
{
    public static function get(array $aArgs)
    {
        ValidatorModel::arrayType($aArgs, ['select', 'where', 'data', 'orderBy']);
        ValidatorModel::intType($aArgs, ['limit']);

        $aUsers = DatabaseModel::select([
            'select'    => empty($aArgs['select']) ? ['*'] : $aArgs['select'],
            'table'     => ['users'],
            'where'     => empty($aArgs['where']) ? [] : $aArgs['where'],
            'data'      => empty($aArgs['data']) ? [] : $aArgs['data'],
            'order_by'  => empty($aArgs['orderBy']) ? [] : $aArgs['orderBy'],
            'limit'     => empty($aArgs['limit']) ? 0 : $aArgs['limit']
        ]);

        return $aUsers;
    }

    public static function getById(array $args)
    {
        ValidatorModel::notEmpty($args, ['id']);
        ValidatorModel::intVal($args, ['id']);

        $where = ['id = ?'];
        if (!empty($args['noDeleted'])) {
            $where[] = "status != 'DEL'";
        }

        $user = DatabaseModel::select([
            'select'    => empty($args['select']) ? ['*'] : $args['select'],
            'table'     => ['users'],
            'where'     => $where,
            'data'      => [$args['id']]
        ]);

        if (empty($user[0])) {
            return [];
        }

        return $user[0];
    }

    public static function getByExternalId(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['externalId', 'externalName']);
        ValidatorModel::intVal($aArgs, ['externalId']);

        $aUser = DatabaseModel::select([
            'select'    => empty($aArgs['select']) ? ['*'] : $aArgs['select'],
            'table'     => ['users'],
            'where'     => ['external_id->>\''.$aArgs['externalName'].'\' = ?'],
            'data'      => [$aArgs['externalId']]
        ]);

        if (empty($aUser)) {
            return [];
        }

        return $aUser[0];
    }

    public static function create(array $args)
    {
        ValidatorModel::notEmpty($args, ['user']);
        ValidatorModel::notEmpty($args['user'], ['userId', 'firstname', 'lastname']);
        ValidatorModel::stringType($args['user'], ['userId', 'firstname', 'lastname', 'mail', 'initials', 'phone', 'loginmode']);

        $password = AuthenticationModel::generatePassword();
        $nextSequenceId = DatabaseModel::getNextSequenceValue(['sequenceId' => 'users_id_seq']);

        DatabaseModel::insert([
            'table'         => 'users',
            'columnsValues' => [
                'id'                            => $nextSequenceId,
                'user_id'                       => strtolower($args['user']['userId']),
                'firstname'                     => $args['user']['firstname'],
                'lastname'                      => $args['user']['lastname'],
                'mail'                          => $args['user']['mail'],
                'phone'                         => $args['user']['phone'],
                'initials'                      => $args['user']['initials'],
                'status'                        => 'OK',
                'loginmode'                     => empty($args['user']['loginmode']) ? 'standard' : $args['user']['loginmode'],
                'password'                      => AuthenticationModel::getPasswordHash($password),
                'password_modification_date'    => 'CURRENT_TIMESTAMP'
            ]
        ]);

        return $nextSequenceId;
    }

    public static function update(array $args)
    {
        ValidatorModel::notEmpty($args, ['set', 'where', 'data']);
        ValidatorModel::arrayType($args, ['set', 'where', 'data']);

        DatabaseModel::update([
            'table' => 'users',
            'set'   => $args['set'],
            'where' => $args['where'],
            'data'  => $args['data']
        ]);

        return true;
    }

    public static function delete(array $args)
    {
        ValidatorModel::notEmpty($args, ['id']);
        ValidatorModel::intVal($args, ['id']);

        DatabaseModel::update([
            'table'     => 'users',
            'set'       => [
                'status'    => 'DEL',
            ],
            'postSet'   => [
                'external_id' => 'external_id - \'maarchParapheur\''
            ],
            'where'     => ['id = ?'],
            'data'      => [$args['id']]
        ]);

        return true;
    }

    public static function getByLogin(array $args)
    {
        ValidatorModel::notEmpty($args, ['login']);
        ValidatorModel::stringType($args, ['login']);
        ValidatorModel::arrayType($args, ['select']);

        static $users;

        if (!empty($users[$args['login']]) && !empty($args['select']) && $args['select'] == ['id']) {
            return $users[$args['login']];
        }

        $user = DatabaseModel::select([
            'select'    => empty($args['select']) ? ['*'] : $args['select'],
            'table'     => ['users'],
            'where'     => ['user_id = ?'],
            'data'      => [$args['login']]
        ]);

        if (empty($user)) {
            return [];
        }
        if (empty($args['select']) || in_array('id', $args['select'])) {
            $users[$args['login']] = $user[0];
        }

        return $user[0];
    }
    
    public static function getByLowerLogin(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['login']);
        ValidatorModel::stringType($aArgs, ['login']);

        $aUser = DatabaseModel::select([
            'select'    => empty($aArgs['select']) ? ['*'] : $aArgs['select'],
            'table'     => ['users'],
            'where'     => ['lower(user_id) = lower(?)'],
            'data'      => [$aArgs['login']]
        ]);

        if (empty($aUser)) {
            return [];
        }

        return $aUser[0];
    }

    public static function getByEmail(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['mail']);
        ValidatorModel::stringType($aArgs, ['mail']);

        $aUser = DatabaseModel::select([
            'select'    => empty($aArgs['select']) ? ['*'] : $aArgs['select'],
            'table'     => ['users'],
            'where'     => ['mail = ? and status = ?'],
            'data'      => [$aArgs['mail'], 'OK'],
            'limit'     => 1
        ]);

        return $aUser;
    }

    public static function updateExternalId(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['id', 'externalId']);
        ValidatorModel::intVal($aArgs, ['id']);
        ValidatorModel::json($aArgs, ['externalId']);

        DatabaseModel::update([
            'table'     => 'users',
            'set'       => [
                'external_id' => $aArgs['externalId']
            ],
            'where'     => ['id = ?'],
            'data'      => [$aArgs['id']]
        ]);

        return true;
    }

    public static function updatePassword(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['id', 'password']);
        ValidatorModel::intVal($aArgs, ['id']);
        ValidatorModel::stringType($aArgs, ['password']);

        DatabaseModel::update([
            'table'     => 'users',
            'set'       => [
                'password'                      => AuthenticationModel::getPasswordHash($aArgs['password']),
                'password_modification_date'    => 'CURRENT_TIMESTAMP'
            ],
            'where'     => ['id = ?'],
            'data'      => [$aArgs['id']]
        ]);

        return true;
    }

    public static function resetPassword(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['id', 'password']);
        ValidatorModel::intVal($aArgs, ['id']);

        DatabaseModel::update([
            'table'     => 'users',
            'set'       => [
                'password'                      => AuthenticationModel::getPasswordHash($aArgs['password']),
                'password_modification_date'    => 'CURRENT_TIMESTAMP',
                'reset_token'                   => null
            ],
            'where'     => ['id = ?'],
            'data'      => [$aArgs['id']]
        ]);

        return true;
    }

    public static function createEmailSignature(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['userId', 'title', 'htmlBody']);
        ValidatorModel::stringType($aArgs, ['userId', 'title', 'htmlBody']);

        DatabaseModel::insert([
            'table'         => 'users_email_signatures',
            'columnsValues' => [
                'user_id'   => $aArgs['userId'],
                'title'     => $aArgs['title'],
                'html_body' => $aArgs['htmlBody']
            ]
        ]);

        return true;
    }

    public static function updateEmailSignature(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['id','userId', 'title', 'htmlBody']);
        ValidatorModel::stringType($aArgs, ['userId', 'title', 'htmlBody']);
        ValidatorModel::intVal($aArgs, ['id']);

        DatabaseModel::update([
            'table'     => 'users_email_signatures',
            'set'       => [
                'title'     => $aArgs['title'],
                'html_body' => $aArgs['htmlBody'],
            ],
            'where'     => ['user_id = ?', 'id = ?'],
            'data'      => [$aArgs['userId'], $aArgs['id']]
        ]);

        return true;
    }

    public static function deleteEmailSignature(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['id', 'userId']);
        ValidatorModel::stringType($aArgs, ['userId']);

        DatabaseModel::delete([
            'table'     => 'users_email_signatures',
            'where'     => ['user_id = ?', 'id = ?'],
            'data'      => [$aArgs['userId'], $aArgs['id']]
        ]);

        return true;
    }

    public static function getEmailSignaturesById(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['userId']);
        ValidatorModel::stringType($aArgs, ['userId']);

        $aReturn = DatabaseModel::select([
            'select'    => empty($aArgs['select']) ? ['*'] : $aArgs['select'],
            'table'     => ['users_email_signatures'],
            'where'     => ['user_id = ?'],
            'data'      => [$aArgs['userId']],
            'order_by'  => ['id']
        ]);

        return $aReturn;
    }

    public static function getEmailSignatureWithSignatureIdById(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['userId', 'signatureId']);
        ValidatorModel::stringType($aArgs, ['userId']);
        ValidatorModel::intVal($aArgs, ['signatureId']);

        $aReturn = DatabaseModel::select([
            'select'    => empty($aArgs['select']) ? ['*'] : $aArgs['select'],
            'table'     => ['users_email_signatures'],
            'where'     => ['user_id = ?', 'id = ?'],
            'data'      => [$aArgs['userId'], $aArgs['signatureId']],
        ]);

        return $aReturn[0];
    }

    public static function getLabelledUserById(array $aArgs)
    {
        ValidatorModel::intVal($aArgs, ['id']);
        ValidatorModel::stringType($aArgs, ['login']);

        if (!empty($aArgs['id'])) {
            $rawUser = UserModel::getById(['id' => $aArgs['id'], 'select' => ['firstname', 'lastname']]);
        } elseif (!empty($aArgs['login'])) {
            $rawUser = UserModel::getByLogin(['login' => $aArgs['login'], 'select' => ['firstname', 'lastname']]);
        }

        $labelledUser = '';
        if (!empty($rawUser)) {
            $labelledUser = $rawUser['firstname']. ' ' .$rawUser['lastname'];
        }

        return $labelledUser;
    }

    public static function getCurrentConsigneById(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['resId']);
        ValidatorModel::intVal($aArgs, ['resId']);

        $aReturn = DatabaseModel::select([
            'select'    => ['process_comment'],
            'table'     => ['listinstance'],
            'where'     => ['res_id = ?', 'process_date is null', 'item_mode in (?)'],
            'data'      => [$aArgs['resId'], ['visa', 'sign']],
            'order_by'  => ['listinstance_id ASC'],
            'limit'     => 1
        ]);

        if (empty($aReturn[0])) {
            return '';
        }

        return $aReturn[0]['process_comment'];
    }

    public static function getPrimaryEntityByUserId(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['userId']);
        ValidatorModel::stringType($aArgs, ['userId']);

        $aEntity = DatabaseModel::select([
            'select'    => ['users_entities.entity_id', 'entities.entity_label', 'users_entities.user_role', 'users_entities.primary_entity'],
            'table'     => ['users_entities, entities'],
            'where'     => ['users_entities.entity_id = entities.entity_id', 'users_entities.user_id = ?', 'users_entities.primary_entity = ?'],
            'data'      => [$aArgs['userId'], 'Y']
        ]);

        if (empty($aEntity[0])) {
            return [];
        }

        return $aEntity[0];
    }

    public static function getPrimaryEntityById(array $args)
    {
        ValidatorModel::notEmpty($args, ['id', 'select']);
        ValidatorModel::intVal($args, ['id']);
        ValidatorModel::arrayType($args, ['select']);

        $entity = DatabaseModel::select([
            'select'    => $args['select'],
            'table'     => ['users, users_entities, entities'],
            'where'     => ['users.user_id = users_entities.user_id', 'users_entities.entity_id = entities.entity_id', 'users.id = ?', 'users_entities.primary_entity = ?'],
            'data'      => [$args['id'], 'Y']
        ]);

        if (empty($entity[0])) {
            return [];
        }

        return $entity[0];
    }

    public static function getNonPrimaryEntitiesById(array $args)
    {
        ValidatorModel::notEmpty($args, ['id']);
        ValidatorModel::intVal($args, ['id']);

        $entities = DatabaseModel::select([
            'select'    => ['users_entities.entity_id', 'entities.entity_label', 'users_entities.user_role', 'users_entities.primary_entity'],
            'table'     => ['users, users_entities, entities'],
            'where'     => ['users.user_id = users_entities.user_id', 'users_entities.entity_id = entities.entity_id', 'users.id = ?', 'users_entities.primary_entity = ?'],
            'data'      => [$args['id'], 'N']
        ]);

        if (empty($entities)) {
            return [];
        }

        return $entities;
    }

    public static function getGroupsByLogin(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['login']);
        ValidatorModel::stringType($aArgs, ['login']);

        $user = UserModel::getByLogin(['login' => $aArgs['login'], 'select' => ['id']]);

        $aGroups = DatabaseModel::select([
            'select'    => ['usergroups.id', 'usergroups.can_index', 'usergroups.group_id', 'usergroups.group_desc', 'usergroups.indexation_parameters', 'usergroup_content.role', 'security.maarch_comment', 'security.where_clause'],
            'table'     => ['usergroup_content, usergroups, security'],
            'where'     => ['usergroup_content.group_id = usergroups.id', 'usergroup_content.user_id = ?','usergroups.group_id = security.group_id'],
            'data'      => [$user['id']]
        ]);

        return $aGroups;
    }

    public static function getGroupsByUser(array $args)
    {
        ValidatorModel::notEmpty($args, ['id']);
        ValidatorModel::intVal($args, ['id']);

        $aGroups = DatabaseModel::select([
            'select'    => ['usergroups.id', 'usergroups.can_index', 'usergroups.group_id', 'usergroups.group_desc', 'usergroups.indexation_parameters', 'usergroup_content.role', 'security.maarch_comment', 'security.where_clause'],
            'table'     => ['usergroup_content, usergroups, security'],
            'where'     => ['usergroup_content.group_id = usergroups.id', 'usergroup_content.user_id = ?','usergroups.group_id = security.group_id'],
            'data'      => [$args['id']]
        ]);

        return $aGroups;
    }

    public static function getEntitiesByLogin(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['login']);
        ValidatorModel::stringType($aArgs, ['login']);

        $aEntities = DatabaseModel::select([
            'select'    => ['entities.id', 'users_entities.entity_id', 'entities.entity_label', 'users_entities.user_role', 'users_entities.primary_entity'],
            'table'     => ['users_entities, entities'],
            'where'     => ['users_entities.entity_id = entities.entity_id', 'users_entities.user_id = ?'],
            'data'      => [$aArgs['login']],
            'order_by'  => ['users_entities.primary_entity DESC']
        ]);

        return $aEntities;
    }

    public static function updateStatus(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['id', 'status']);
        ValidatorModel::intVal($aArgs, ['id']);
        ValidatorModel::stringType($aArgs, ['status']);

        DatabaseModel::update([
            'table'     => 'users',
            'set'       => [
                'status'    => $aArgs['status']
            ],
            'where'     => ['id = ?'],
            'data'      => [$aArgs['id']]
        ]);

        return true;
    }

    public static function hasGroup(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['id', 'groupId']);
        ValidatorModel::intVal($aArgs, ['id']);
        ValidatorModel::stringType($aArgs, ['groupId']);

        $user = UserModel::getById(['id' => $aArgs['id'], 'select' => ['user_id']]);
        $groups = UserModel::getGroupsByLogin(['login' => $user['user_id']]);
        foreach ($groups as $value) {
            if ($value['group_id'] == $aArgs['groupId']) {
                return true;
            }
        }

        return false;
    }

    public static function hasEntity(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['id', 'entityId']);
        ValidatorModel::intVal($aArgs, ['id']);
        ValidatorModel::stringType($aArgs, ['entityId']);

        $user = UserModel::getById(['id' => $aArgs['id'], 'select' => ['user_id']]);
        $entities = UserModel::getEntitiesByLogin(['login' => $user['user_id']]);
        foreach ($entities as $value) {
            if ($value['entity_id'] == $aArgs['entityId']) {
                return true;
            }
        }

        return false;
    }
}
