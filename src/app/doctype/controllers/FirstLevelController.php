<?php
/**
* Copyright Maarch since 2008 under licence GPLv3.
* See LICENCE.txt file at the root folder for more details.
* This file is part of Maarch software.

* @brief   FirstLevelController
* @author  dev <dev@maarch.org>
* @ingroup core
*/

namespace Doctype\controllers;

use History\controllers\HistoryController;
use Respect\Validation\Validator;
use Doctype\models\FirstLevelModel;
use Doctype\models\SecondLevelModel;
use Doctype\models\DoctypeModel;
use Folder\models\FolderTypeModel;
use Core\Models\ServiceModel;
use Slim\Http\Request;
use Slim\Http\Response;

class FirstLevelController
{
    public function getTree(Request $request, Response $response)
    {
        $firstLevels  = FirstLevelModel::get();
        $secondLevels = SecondLevelModel::get();
        $docTypes     = DoctypeModel::get();

        $structure = [];
        foreach ($firstLevels as $firstLevelValue) {
            $firstLevelValue['id']     = 'firstlevel_'.$firstLevelValue['doctypes_first_level_id'];
            $firstLevelValue['text']   = $firstLevelValue['doctypes_first_level_label'];
            $firstLevelValue['parent'] = '#';
            array_push($structure, $firstLevelValue);
        }
        foreach ($secondLevels as $secondLevelValue) {
            $secondLevelValue['id']     = 'secondlevel_'.$secondLevelValue['doctypes_second_level_id'];
            $secondLevelValue['text']   = $secondLevelValue['doctypes_second_level_label'];
            $secondLevelValue['parent'] = 'firstlevel_'.$secondLevelValue['doctypes_first_level_id'];
            array_push($structure, $secondLevelValue);
        }
        foreach ($docTypes as $doctypeValue) {
            $doctypeValue['id']     = $doctypeValue['type_id'];
            $doctypeValue['text']   = $doctypeValue['description'];
            $doctypeValue['parent'] = 'secondlevel_'.$doctypeValue['doctypes_second_level_id'];
            $doctypeValue['icon'] = 'fa fa-files-o';
            array_push($structure, $doctypeValue);
        }

        return $response->withJson([
            'structure' => $structure,
        ]);
    }

    public function getById(Request $request, Response $response, $aArgs)
    {
        if (!Validator::intVal()->validate($aArgs['id']) || !Validator::notEmpty()->validate($aArgs['id'])) {
            return $response
                ->withStatus(500)
                ->withJson(['errors' => 'wrong format for id']);
        }

        $obj['firstLevel'] = FirstLevelModel::getById(['id' => $aArgs['id']]);

        if (!empty($obj)) {
            if ($obj['firstLevel']['enabled'] == 'Y') {
                $obj['firstLevel']['enabled'] = true;
            } else {
                $obj['firstLevel']['enabled'] = false;
            }

            $folderTypesSelected = FolderTypeModel::getFolderTypeDocTypeFirstLevel(['doctypes_first_level_id' => $aArgs['id']]);
            $arrFolderTypesSelected = [];
            foreach ($folderTypesSelected as $folderType) {
                $arrFolderTypesSelected[] = $folderType['foldertype_id'];
            }
            $obj['firstLevel']['folderTypeSelected'] = $arrFolderTypesSelected;
        }
  
        $obj['folderTypes'] = FolderTypeModel::get(['select' => ['foldertype_id', 'foldertype_label']]);
        return $response->withJson($obj);
    }

    public function initFirstLevel(Request $request, Response $response)
    {
        $obj['folderType'] = FolderTypeModel::get(['select' => ['foldertype_id', 'foldertype_label']]);
        return $response->withJson($obj);
    }

    public function create(Request $request, Response $response)
    {
        if (!ServiceModel::hasService(['id' => 'admin_architecture', 'userId' => $GLOBALS['userId'], 'location' => 'apps', 'type' => 'admin'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        $data = $request->getParams();
        $data = $this->manageValue($data);
        
        $errors = $this->control($data, 'create');
        if (!empty($errors)) {
            return $response->withStatus(500)->withJson(['errors' => $errors]);
        }
    
        $folderTypeId = $data['foldertype_id'];
        unset($data['foldertype_id']);
        $firstLevelId = FirstLevelModel::create($data);

        foreach ($folderTypeId as $value) {
            FolderTypeModel::createFolderTypeDocTypeFirstLevel([
                "doctypes_first_level_id" => $firstLevelId,
                "foldertype_id"           => $value
            ]);
        }

        HistoryController::add([
            'tableName' => 'doctypes_first_level',
            'recordId'  => $firstLevelId,
            'eventType' => 'ADD',
            'eventId'   => 'structureadd',
            'info'      => _DOCTYPE_FIRSTLEVEL_ADDED . ' : ' . $data['doctypes_first_level_label']
        ]);

        return $response->withJson(
            [
            'firstLevel'  => $firstLevelId
            ]
        );
    }

    public function update(Request $request, Response $response, $aArgs)
    {
        if (!ServiceModel::hasService(['id' => 'admin_architecture', 'userId' => $GLOBALS['userId'], 'location' => 'apps', 'type' => 'admin'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        $obj                            = $request->getParams();
        $obj['doctypes_first_level_id'] = $aArgs['id'];

        $obj    = $this->manageValue($obj);
        $errors = $this->control($obj, 'update');
      
        if (!empty($errors)) {
            return $response
                ->withStatus(500)
                ->withJson(['errors' => $errors]);
        }

        $folderTypeId = $obj['foldertype_id'];
        unset($obj['foldertype_id']);
        FirstLevelModel::update($obj);

        FolderTypeModel::deleteFolderTypeDocTypeFirstLevel(['doctypes_first_level_id' => $obj['doctypes_first_level_id']]);
        foreach ($folderTypeId as $value) {
            FolderTypeModel::createFolderTypeDocTypeFirstLevel([
                "doctypes_first_level_id" => $obj['doctypes_first_level_id'],
                "foldertype_id" => $value
            ]);
        }

        HistoryController::add([
            'tableName' => 'doctypes_first_level',
            'recordId'  => $obj['doctypes_first_level_id'],
            'eventType' => 'UP',
            'eventId'   => 'structureup',
            'info'      => _DOCTYPE_FIRSTLEVEL_UPDATED. ' : ' . $obj['doctypes_first_level_label']
        ]);

        return $response->withJson(
            [
            'firstLevel'  => $obj
            ]
        );
    }

    public function delete(Request $request, Response $response, $aArgs)
    {
        if (!ServiceModel::hasService(['id' => 'admin_architecture', 'userId' => $GLOBALS['userId'], 'location' => 'apps', 'type' => 'admin'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Service forbidden']);
        }

        if (!Validator::intVal()->validate($aArgs['id'])) {
            return $response
                ->withStatus(500)
                ->withJson(['errors' => 'Id is not a numeric']);
        }

        FirstLevelModel::update(['doctypes_first_level_id' => $aArgs['id'], 'enabled' => 'N']);
        SecondLevelModel::disabledFirstLevel(['doctypes_first_level_id' => $aArgs['id'], 'enabled' => 'N']);
        DoctypeModel::disabledFirstLevel(['doctypes_first_level_id' => $aArgs['id'], 'enabled' => 'N']);
        FolderTypeModel::deleteFolderTypeDocTypeFirstLevel(['doctypes_first_level_id' => $aArgs['id']]);
        $firstLevel = FirstLevelModel::getById(['id' => $aArgs['id']]);

        HistoryController::add([
            'tableName' => 'doctypes_first_level',
            'recordId'  => $aArgs['id'],
            'eventType' => 'DEL',
            'eventId'   => 'structuredel',
            'info'      => _DOCTYPE_FIRSTLEVEL_DELETED. ' : ' . $firstLevel['doctypes_first_level_label']
        ]);

        return $response->withJson(['firstLevel' => $firstLevel]);
    }

    protected function control($aArgs, $mode)
    {
        $errors = [];

        if ($mode == 'update') {
            if (!Validator::intVal()->validate($aArgs['doctypes_first_level_id'])) {
                $errors[] = 'Id is not a numeric';
            } else {
                $obj = FirstLevelModel::getById(['id' => $aArgs['doctypes_first_level_id']]);
            }
           
            if (empty($obj)) {
                $errors[] = 'Id ' .$aArgs['doctypes_first_level_id']. ' does not exists';
            }
        }
           
        if (!Validator::notEmpty()->validate($aArgs['doctypes_first_level_label']) ||
            !Validator::length(1, 255)->validate($aArgs['doctypes_first_level_label'])) {
            $errors[] = 'Invalid doctypes_first_level_label';
        }

        if (!Validator::notEmpty()->validate($aArgs['foldertype_id'])) {
            $errors[] = 'Invalid foldertype_id';
        }

        if (!Validator::notEmpty()->validate($aArgs['enabled']) || ($aArgs['enabled'] != 'Y' && $aArgs['enabled'] != 'N')) {
            $errors[]= 'Invalid enabled value';
        }

        return $errors;
    }

    protected function manageValue($request)
    {
        foreach ($request  as $key => $value) {
            if (in_array($key, ['enabled'])) {
                if (empty($value)) {
                    $request[$key] = 'N';
                } else {
                    $request[$key] = 'Y';
                }
            }
        }
        return $request;
    }
}
