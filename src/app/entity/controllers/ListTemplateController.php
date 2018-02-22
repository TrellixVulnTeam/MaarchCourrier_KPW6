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

use Core\Models\ServiceModel;
use SrcCore\models\ValidatorModel;
use Entity\models\EntityModel;
use Entity\models\ListTemplateModel;
use History\controllers\HistoryController;
use Respect\Validation\Validator;
use Slim\Http\Request;
use Slim\Http\Response;
use SrcCore\models\DatabaseModel;

class ListTemplateController
{
    public function get(Request $request, Response $response)
    {
        $rawListTemplates = ListTemplateModel::get(['select' => ['id', 'object_id', 'object_type', 'title', 'description']]);

        $listTemplates = [];
        $tmpTemplates = [];
        foreach ($rawListTemplates as $rawListTemplate) {
            if (empty($tmpTemplates[$rawListTemplate['object_type']][$rawListTemplate['object_id']])) {
                $listTemplates[] = $rawListTemplate;
                $tmpTemplates[$rawListTemplate['object_type']][$rawListTemplate['object_id']] = 1;
            }
        }

        return $response->withJson(['listTemplates' => $listTemplates]);
    }

    public function getById(Request $request, Response $response, array $aArgs)
    {
        $listTemplates = ListTemplateModel::getById(['id' => $aArgs['id']]);
        if (empty($listTemplates)) {
            return $response->withStatus(400)->withJson(['errors' => 'List template not found']);
        }

        return $response->withJson(['listTemplate' => $listTemplates]);
    }

    public function create(Request $request, Response $response)
    {
        if (!ServiceModel::hasService(['id' => 'manage_entities', 'userId' => $GLOBALS['userId'], 'location' => 'entities', 'type' => 'admin'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        $data = $request->getParams();

        $allowedObjectTypes = ['entity_id', 'VISA_CIRCUIT', 'AVIS_CIRCUIT'];
        $check = Validator::stringType()->notEmpty()->validate($data['object_type']) && in_array($data['object_type'], $allowedObjectTypes);
        $check = $check && (Validator::stringType()->notEmpty()->validate($data['object_id']) || $data['object_type'] != 'entity_id');
        $check = $check && Validator::arrayType()->notEmpty()->validate($data['items']);
        $check = $check && (Validator::stringType()->notEmpty()->validate($data['title']) || Validator::stringType()->notEmpty()->validate($data['description']));
        if (!$check) {
            return $response->withStatus(400)->withJson(['errors' => 'Bad Request']);
        }

        if (!empty($data['object_id']) && $data['object_type'] != 'AVIS_CIRCUIT') {
            $listTemplate = ListTemplateModel::get(['select' => [1], 'where' => ['object_id = ?', 'object_type = ?'], 'data' => [$data['object_id'], $data['object_type']]]);
            if (!empty($listTemplate)) {
                return $response->withStatus(400)->withJson(['errors' => 'Entity is already linked to this type of template']);
            }
            $aEntities = EntityModel::getAllowedEntitiesByUserId(['userId' => $GLOBALS['userId']]);
            foreach ($aEntities as $aEntity) {
                if ($aEntity['entity_id'] == $data['object_id'] && $aEntity['allowed'] == false) {
                    return $response->withStatus(403)->withJson(['errors' => 'Entity out of perimeter']);
                }
            }
        } else {
            $data['object_id'] = $data['object_type'] . '_' . DatabaseModel::uniqueId();
        }

        $checkItems = ListTemplateController::checkItems(['items' => $data['items']]);
        if (!empty($checkItems['errors'])) {
            return $response->withStatus(400)->withJson(['errors' => $checkItems['errors']]);
        }

        foreach ($data['items'] as $item) {
            ListTemplateModel::create([
                'object_id'     => $data['object_id'],
                'object_type'   => $data['object_type'],
                'title'         => $data['title'],
                'description'   => $data['description'],
                'sequence'      => $item['sequence'],
                'item_id'       => $item['item_id'],
                'item_type'     => $item['item_type'],
                'item_mode'     => $item['item_mode'],
            ]);
        }

        HistoryController::add([
            'tableName' => 'listmodels',
            'recordId'  => $data['object_id'],
            'eventType' => 'ADD',
            'info'      => _LIST_TEMPLATE_CREATION . " : {$data['title']} {$data['description']}",
            'moduleId'  => 'listTemplate',
            'eventId'   => 'listTemplateCreation',
        ]);

        return $response->withJson(['success' => 'success']);
    }

    public function update(Request $request, Response $response, array $aArgs)
    {
        if (!ServiceModel::hasService(['id' => 'manage_entities', 'userId' => $GLOBALS['userId'], 'location' => 'entities', 'type' => 'admin'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        $data = $request->getParams();
        $check = Validator::arrayType()->notEmpty()->validate($data['items']);
        $check = $check && (Validator::stringType()->notEmpty()->validate($data['title']) || Validator::stringType()->notEmpty()->validate($data['description']));
        if (!$check) {
            return $response->withStatus(400)->withJson(['errors' => 'Bad Request']);
        }

        $listTemplates = ListTemplateModel::getById(['id' => $aArgs['id'], 'select' => ['object_id', 'object_type']]);
        if (empty($listTemplates)) {
            return $response->withStatus(400)->withJson(['errors' => 'List template not found']);
        }

        if (!strstr($listTemplates[0]['object_id'], 'VISA_CIRCUIT_') && !strstr($listTemplates[0]['object_id'], 'AVIS_CIRCUIT_')) {
            $aEntities = EntityModel::getAllowedEntitiesByUserId(['userId' => $GLOBALS['userId']]);
            foreach ($aEntities as $aEntity) {
                if ($aEntity['entity_id'] == $listTemplates[0]['object_id'] && $aEntity['allowed'] == false) {
                    return $response->withStatus(403)->withJson(['errors' => 'Entity out of perimeter']);
                }
            }
        }

        $checkItems = ListTemplateController::checkItems(['items' => $data['items']]);
        if (!empty($checkItems['errors'])) {
            return $response->withStatus(400)->withJson(['errors' => $checkItems['errors']]);
        }

        ListTemplateModel::delete([
            'where' => ['object_id = ?', 'object_type = ?'],
            'data'  => [$listTemplates[0]['object_id'], $listTemplates[0]['object_type']]
        ]);
        foreach ($data['items'] as $item) {
            ListTemplateModel::create([
                'object_id'     => $listTemplates[0]['object_id'],
                'object_type'   => $listTemplates[0]['object_type'],
                'title'         => $data['title'],
                'description'   => $data['description'],
                'sequence'      => $item['sequence'],
                'item_id'       => $item['item_id'],
                'item_type'     => $item['item_type'],
                'item_mode'     => $item['item_mode'],
            ]);
        }

        HistoryController::add([
            'tableName' => 'listmodels',
            'recordId'  => $listTemplates[0]['object_id'],
            'eventType' => 'UP',
            'info'      => _LIST_TEMPLATE_MODIFICATION . " : {$data['title']} {$data['description']}",
            'moduleId'  => 'listTemplate',
            'eventId'   => 'listTemplateModification',
        ]);

        return $response->withJson(['success' => 'success']);
    }

    public function delete(Request $request, Response $response, array $aArgs)
    {
        if (!ServiceModel::hasService(['id' => 'manage_entities', 'userId' => $GLOBALS['userId'], 'location' => 'entities', 'type' => 'admin'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        $listTemplates = ListTemplateModel::getById(['id' => $aArgs['id'], 'select' => ['object_id', 'object_type']]);
        if (empty($listTemplates)) {
            return $response->withStatus(400)->withJson(['errors' => 'List template not found']);
        }

        if (!strstr($listTemplates[0]['object_id'], 'VISA_CIRCUIT_') && !strstr($listTemplates[0]['object_id'], 'AVIS_CIRCUIT_')) {
            $aEntities = EntityModel::getAllowedEntitiesByUserId(['userId' => $GLOBALS['userId']]);
            foreach ($aEntities as $aEntity) {
                if ($aEntity['entity_id'] == $listTemplates[0]['object_id'] && $aEntity['allowed'] == false) {
                    return $response->withStatus(403)->withJson(['errors' => 'Entity out of perimeter']);
                }
            }
        }

        ListTemplateModel::delete([
            'where' => ['object_id = ?', 'object_type = ?'],
            'data'  => [$listTemplates[0]['object_id'], $listTemplates[0]['object_type']]
        ]);
        HistoryController::add([
            'tableName' => 'listmodels',
            'recordId'  => $listTemplates[0]['object_id'],
            'eventType' => 'DEL',
            'info'      => _LIST_TEMPLATE_SUPPRESSION . " : {$listTemplates[0]['object_id']} {$listTemplates[0]['object_type']}",
            'moduleId'  => 'listTemplate',
            'eventId'   => 'listTemplateSuppression',
        ]);

        return $response->withJson(['success' => 'success']);
    }

    private static function checkItems(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['items']);
        ValidatorModel::arrayType($aArgs, ['items']);

        foreach ($aArgs['items'] as $item) {
            if (empty($item['item_id'])) {
                return ['errors' => 'Item_id is empty'];
            }
            if (empty($item['item_type'])) {
                return ['errors' => 'Item_type is empty'];
            }
            if (empty($item['item_mode'])) {
                return ['errors' => 'Item_mode is empty'];
            }
        }

        return ['success' => 'success'];
    }
}
