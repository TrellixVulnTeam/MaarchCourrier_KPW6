<?php

/**
* Copyright Maarch since 2008 under licence GPLv3.
* See LICENCE.txt file at the root folder for more details.
* This file is part of Maarch software.

* @brief   ParametersController
* @author  dev <dev@maarch.org>
* @ingroup core
*/

/**
 * @brief Custom Field Controller
 * @author dev@maarch.org
 */

namespace CustomField\controllers;

use CustomField\models\CustomFieldModel;
use CustomField\models\ResourceCustomFieldModel;
use Group\controllers\PrivilegeController;
use Group\models\ServiceModel;
use History\controllers\HistoryController;
use IndexingModel\models\IndexingModelFieldModel;
use Respect\Validation\Validator;
use Slim\Http\Request;
use Slim\Http\Response;

class CustomFieldController
{
    public function get(Request $request, Response $response)
    {
        $customFields = CustomFieldModel::get(['orderBy' => ['label']]);

        foreach ($customFields as $key => $customField) {
            $customFields[$key]['values'] = json_decode($customField['values'], true);
        }

        return $response->withJson(['customFields' => $customFields]);
    }

    public function create(Request $request, Response $response)
    {
        if (!PrivilegeController::hasPrivilege(['privilegeId' => 'admin_custom_fields', 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        $body = $request->getParsedBody();

        if (!Validator::stringType()->notEmpty()->validate($body['label'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Body label is empty or not a string']);
        } elseif (!Validator::stringType()->notEmpty()->validate($body['type'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Body type is empty or not a string']);
        } elseif (!empty($body['values']) && !Validator::arrayType()->notEmpty()->validate($body['values'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Body values is not an array']);
        }

        $fields = CustomFieldModel::get(['select' => [1], 'where' => ['label = ?'], 'data' => [$body['label']]]);
        if (!empty($fields)) {
            return $response->withStatus(400)->withJson(['errors' => 'Custom field with this label already exists']);
        }

        $id = CustomFieldModel::create([
            'label'         => $body['label'],
            'type'          => $body['type'],
            'values'        => empty($body['values']) ? '[]' : json_encode($body['values'])
        ]);

        HistoryController::add([
            'tableName' => 'custom_fields',
            'recordId'  => $id,
            'eventType' => 'ADD',
            'info'      => _CUSTOMFIELDS_CREATION . " : {$body['label']}",
            'moduleId'  => 'customField',
            'eventId'   => 'customFieldCreation',
        ]);

        return $response->withJson(['customFieldId' => $id]);
    }

    public function update(Request $request, Response $response, array $args)
    {
        if (!PrivilegeController::hasPrivilege(['privilegeId' => 'admin_custom_fields', 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        if (!Validator::intVal()->notEmpty()->validate($args['id'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Param id is empty or not an integer']);
        }

        $body = $request->getParsedBody();

        if (!Validator::stringType()->notEmpty()->validate($body['label'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Body label is empty or not a string']);
        } elseif (!empty($body['values']) && !Validator::arrayType()->notEmpty()->validate($body['values'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Body values is not an array']);
        }

        if (count(array_unique($body['values'])) < count($body['values'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Some values have the same name']);
        }

        $field = CustomFieldModel::getById(['select' => [1], 'id' => $args['id']]);
        if (empty($field)) {
            return $response->withStatus(400)->withJson(['errors' => 'Custom field not found']);
        }

        $fields = CustomFieldModel::get(['select' => [1], 'where' => ['label = ?', 'id != ?'], 'data' => [$body['label'], $args['id']]]);
        if (!empty($fields)) {
            return $response->withStatus(400)->withJson(['errors' => 'Custom field with this label already exists']);
        }

        CustomFieldModel::update([
            'set'   => [
                'label'  => $body['label'],
                'values' => empty($body['values']) ? '[]' : json_encode($body['values'])
            ],
            'where' => ['id = ?'],
            'data'  => [$args['id']]
        ]);

        HistoryController::add([
            'tableName' => 'custom_fields',
            'recordId'  => $args['id'],
            'eventType' => 'UP',
            'info'      => _CUSTOMFIELDS_MODIFICATION . " : {$body['label']}",
            'moduleId'  => 'customField',
            'eventId'   => 'customFieldModification',
        ]);

        return $response->withStatus(204);
    }

    public function delete(Request $request, Response $response, array $args)
    {
        if (!PrivilegeController::hasPrivilege(['privilegeId' => 'admin_custom_fields', 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        if (!Validator::intVal()->notEmpty()->validate($args['id'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Param id is empty or not an integer']);
        }

        $field = CustomFieldModel::getById(['select' => ['label'], 'id' => $args['id']]);

        IndexingModelFieldModel::delete(['where' => ['identifier = ?'], 'data' => ['indexingCustomField_' . $args['id']]]);
        ResourceCustomFieldModel::delete(['where' => ['custom_field_id = ?'], 'data' => [$args['id']]]);

        CustomFieldModel::delete([
            'where' => ['id = ?'],
            'data'  => [$args['id']]
        ]);

        HistoryController::add([
            'tableName' => 'custom_fields',
            'recordId'  => $args['id'],
            'eventType' => 'DEL',
            'info'      => _CUSTOMFIELDS_SUPPRESSION . " : {$field['label']}",
            'moduleId'  => 'customField',
            'eventId'   => 'customFieldSuppression',
        ]);

        return $response->withStatus(204);
    }
}
