<?php

/**
* Copyright Maarch since 2008 under licence GPLv3.
* See LICENCE.txt file at the root folder for more details.
* This file is part of Maarch software.
*
*/

/**
* @brief Entity Model Abstract
* @author dev@maarch.org
*/

namespace Entity\models;

use Core\Models\UserModel;
use Core\Models\ValidatorModel;
use SrcCore\models\DatabaseModel;

class EntityModelAbstract
{
    public static function get(array $aArgs = [])
    {
        ValidatorModel::arrayType($aArgs, ['select', 'where', 'data', 'orderBy']);

        $aEntities = DatabaseModel::select([
            'select'    => empty($aArgs['select']) ? ['*'] : $aArgs['select'],
            'table'     => ['entities'],
            'where'     => $aArgs['where'],
            'data'      => $aArgs['data'],
            'order_by'  => $aArgs['orderBy']
        ]);

        return $aEntities;
    }

    public static function getById(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['entityId']);
        ValidatorModel::stringType($aArgs, ['entityId']);

        $aEntity = DatabaseModel::select([
            'select'    => empty($aArgs['select']) ? ['*'] : $aArgs['select'],
            'table'     => ['entities'],
            'where'     => ['entity_id = ?'],
            'data'      => [$aArgs['entityId']]
        ]);

        return $aEntity[0];
    }

    public static function create(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['id', 'entity_label', 'short_label', 'entity_type']);
        ValidatorModel::stringType($aArgs, [
            'id', 'entity_label', 'short_label', 'entity_type', 'adrs_1', 'adrs_2', 'adrs_3',
            'zipcode', 'city', 'country', 'email', 'business_id', 'parent_entity_id',
            'entity_path', 'ldap_id', 'transferring_agency', 'archival_agreement', 'archival_agency', 'entity_full_name'
        ]);

        DatabaseModel::insert([
            'table'         => 'entities',
            'columnsValues' => [
                'entity_id'             => $aArgs['id'],
                'entity_label'          => $aArgs['entity_label'],
                'short_label'           => $aArgs['short_label'],
                'adrs_1'                => $aArgs['adrs_1'],
                'adrs_2'                => $aArgs['adrs_2'],
                'adrs_3'                => $aArgs['adrs_3'],
                'zipcode'               => $aArgs['zipcode'],
                'city'                  => $aArgs['city'],
                'country'               => $aArgs['country'],
                'email'                 => $aArgs['email'],
                'business_id'           => $aArgs['business_id'],
                'parent_entity_id'      => $aArgs['parent_entity_id'],
                'entity_type'           => $aArgs['entity_type'],
                'entity_path'           => $aArgs['entity_path'],
                'ldap_id'               => $aArgs['ldap_id'],
                'transferring_agency'   => $aArgs['transferring_agency'],
                'archival_agreement'    => $aArgs['archival_agreement'],
                'archival_agency'       => $aArgs['archival_agency'],
                'entity_full_name'      => $aArgs['entity_full_name'],
            ]
        ]);

        return true;
    }

    public static function update(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['set', 'where', 'data']);
        ValidatorModel::arrayType($aArgs, ['set', 'where', 'data']);

        DatabaseModel::delete([
            'table' => 'entities',
            'set'   => $aArgs['set'],
            'where' => $aArgs['where'],
            'data'  => $aArgs['data']
        ]);

        return true;
    }

    public static function delete(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['where', 'data']);
        ValidatorModel::arrayType($aArgs, ['where', 'data']);

        DatabaseModel::delete([
            'table' => 'entities',
            'where' => $aArgs['where'],
            'data'  => $aArgs['data']
        ]);

        return true;
    }

    public static function getByEmail(array $aArgs = [])
    {
        ValidatorModel::notEmpty($aArgs, ['email']);
        ValidatorModel::stringType($aArgs, ['email']);

        $aReturn = DatabaseModel::select([
            'select'    => empty($aArgs['select']) ? ['*'] : $aArgs['select'],
            'table'     => ['entities'],
            'where'     => ['email = ?', 'enabled = ?'],
            'data'      => [$aArgs['email'], 'Y'],
            'limit'     => 1,
        ]);

        return $aReturn;
    }

    public static function getByUserId(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['userId']);
        ValidatorModel::stringType($aArgs, ['userId']);
        ValidatorModel::arrayType($aArgs, ['select']);

        $aEntities = DatabaseModel::select([
            'select'    => empty($aArgs['select']) ? ['*'] : $aArgs['select'],
            'table'     => ['users_entities'],
            'where'     => ['user_id = ?'],
            'data'      => [$aArgs['userId']]
        ]);

        return $aEntities;
    }

    public static function getEntityChildren(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['entityId']);
        ValidatorModel::stringType($aArgs, ['entityId']);

        $aReturn = DatabaseModel::select([
            'select'    => ['entity_id'],
            'table'     => ['entities'],
            'where'     => ['parent_entity_id = ?'],
            'data'      => [$aArgs['entityId']]
        ]);

        $entities = [$aArgs['entityId']];
        foreach ($aReturn as $value) {
            $entities = array_merge($entities, EntityModel::getEntityChildren(['entityId' => $value['entity_id']]));
        }

        return $entities;
    }

    public static function getAllEntitiesByUserId(array $aArgs = [])
    {
        ValidatorModel::notEmpty($aArgs, ['userId']);
        ValidatorModel::stringType($aArgs, ['userId']);

        $aReturn = UserModel::getEntitiesById(['userId' => $aArgs['userId']]);

        $entities = [];
        foreach ($aReturn as $value) {
            $entities = array_merge($entities, EntityModel::getEntityChildren(['entityId' => $value['entity_id']]));
        }
        
        return array_unique($entities);
    }

    public static function getAvailableEntitiesForAdministratorByUserId(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['userId', 'administratorUserId']);
        ValidatorModel::stringType($aArgs, ['userId', 'administratorUserId']);

        if ($aArgs['administratorUserId'] == 'superadmin') {
            $rawEntitiesAllowedForAdministrator = EntityModel::get(['select' => ['entity_id'], 'where' => ['enabled = ?'], 'data' => ['Y'], 'orderBy' => ['entity_label']]);
            $entitiesAllowedForAdministrator = [];
            foreach ($rawEntitiesAllowedForAdministrator as $value) {
                $entitiesAllowedForAdministrator[] = $value['entity_id'];
            }
        } else {
            $entitiesAllowedForAdministrator = EntityModel::getAllEntitiesByUserId(['userId' => $aArgs['administratorUserId']]);
        }

        $rawUserEntities = EntityModel::getByUserId(['userId' => $aArgs['userId'], 'select' => ['entity_id']]);

        $userEntities = [];
        foreach ($rawUserEntities as $value) {
            $userEntities[] = $value['entity_id'];
        }

        $allEntities = EntityModel::get(['select' => ['entity_id', 'entity_label', 'parent_entity_id'], 'where' => ['enabled = ?'], 'data' => ['Y'], 'orderBy' => ['entity_label']]);

        foreach ($allEntities as $key => $value) {
            $allEntities[$key]['id'] = $value['entity_id'];
            if (empty($value['parent_entity_id'])) {
                $allEntities[$key]['parent'] = '#';
                $allEntities[$key]['icon'] = "fa fa-building";
            } else {
                $allEntities[$key]['parent'] = $value['parent_entity_id'];
                $allEntities[$key]['icon'] = "fa fa-sitemap";
            }
            $allEntities[$key]['text'] = $value['entity_label'];
            if (in_array($value['entity_id'], $userEntities) || !in_array($value['entity_id'], $entitiesAllowedForAdministrator)) {
                $allEntities[$key]['state']['opened'] = true;
                $allEntities[$key]['state']['selected'] = true;
            }
        }

        return $allEntities;
    }

    public static function getAllowedEntitiesByUserId(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['userId']);
        ValidatorModel::stringType($aArgs, ['userId']);

        if ($aArgs['userId'] == 'superadmin') {
            $rawEntitiesAllowed = EntityModel::get(['select' => ['entity_id'], 'where' => ['enabled = ?'], 'data' => ['Y'], 'orderBy' => ['entity_label']]);
            $entitiesAllowed = [];
            foreach ($rawEntitiesAllowed as $value) {
                $entitiesAllowed[] = $value['entity_id'];
            }
        } else {
            $entitiesAllowed = EntityModel::getAllEntitiesByUserId(['userId' => $aArgs['userId']]);
        }

        $allEntities = EntityModel::get(['select' => ['entity_id', 'entity_label', 'parent_entity_id'], 'where' => ['enabled = ?'], 'data' => ['Y'], 'orderBy' => ['entity_label']]);

        foreach ($allEntities as $key => $value) {
            $allEntities[$key]['id'] = $value['entity_id'];
            if (empty($value['parent_entity_id'])) {
                $allEntities[$key]['parent'] = '#';
                $allEntities[$key]['icon'] = "fa fa-building";
            } else {
                $allEntities[$key]['parent'] = $value['parent_entity_id'];
                $allEntities[$key]['icon'] = "fa fa-sitemap";
            }
            if (in_array($value['entity_id'], $entitiesAllowed)) {
                $allEntities[$key]['allowed'] = true;
            } else {
                $allEntities[$key]['allowed'] = false;
            }
            $allEntities[$key]['text'] = $value['entity_label'];
        }

        return $allEntities;
    }

    public static function getUsersById(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['id']);
        ValidatorModel::stringType($aArgs, ['id']);
        ValidatorModel::arrayType($aArgs, ['select']);

        $aUsers = DatabaseModel::select([
            'select'    => empty($aArgs['select']) ? ['*'] : $aArgs['select'],
            'table'     => ['users_entities, users'],
            'where'     => ['users_entities.entity_id = ?', 'users_entities.user_id = users.user_id'],
            'data'      => [$aArgs['id']]
        ]);

        return $aUsers;
    }
}
