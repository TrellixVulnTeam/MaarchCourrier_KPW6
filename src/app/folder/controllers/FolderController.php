<?php

/**
 * Copyright Maarch since 2008 under licence GPLv3.
 * See LICENCE.txt file at the root folder for more details.
 * This file is part of Maarch software.
 */

/**
 * @brief Folder Controller
 *
 * @author dev@maarch.org
 */

namespace Folder\controllers;

use Attachment\models\AttachmentModel;
use Basket\models\BasketModel;
use Basket\models\GroupBasketModel;
use Entity\models\EntityModel;
use Folder\models\EntityFolderModel;
use Folder\models\FolderModel;
use Folder\models\ResourceFolderModel;
use Group\models\GroupModel;
use Group\models\ServiceModel;
use History\controllers\HistoryController;
use Resource\controllers\ResController;
use Resource\controllers\ResourceListController;
use Resource\models\ResModel;
use Resource\models\ResourceListModel;
use Respect\Validation\Validator;
use Slim\Http\Request;
use Slim\Http\Response;
use SrcCore\controllers\PreparedClauseController;
use SrcCore\models\DatabaseModel;
use SrcCore\models\ValidatorModel;
use User\models\UserModel;

class FolderController
{
    public function get(Request $request, Response $response)
    {
        $folders = FolderController::getScopeFolders(['login' => $GLOBALS['userId']]);

        $userEntities = EntityModel::getWithUserEntities(['select'  => ['entities.id'], 'where' => ['user_id = ?'], 'data' => [$GLOBALS['userId']]]);

        $userEntities = array_column($userEntities, 'id');
        if (empty($userEntities)) {
            $userEntities = 0;
        }

        $foldersWithResources = FolderModel::getWithEntitiesAndResources([
            'select'   => ['COUNT(DISTINCT resources_folders.res_id)', 'resources_folders.folder_id'],
            'where'    => ['(entities_folders.entity_id in (?) OR folders.user_id = ?)'],
            'data'     => [$userEntities, $GLOBALS['id']],
            'groupBy'  => ['resources_folders.folder_id']
        ]);

        $tree = [];
        foreach ($folders as $folder) {
            $key = array_keys(array_column($foldersWithResources, 'folder_id'), $folder['id']);
            $count = 0;
            if (isset($key[0])) {
                $count = $foldersWithResources[$key[0]]['count'];
            }
            $insert = [
                'name'       => $folder['label'],
                'id'         => $folder['id'],
                'label'      => $folder['label'],
                'public'     => $folder['public'],
                'user_id'    => $folder['user_id'],
                'parent_id'  => $folder['parent_id'],
                'level'      => $folder['level'],
                'countResources' => $count
            ];
            if ($folder['level'] == 0) {
                array_splice($tree, 0, 0, [$insert]);
            } else {
                $found = false;
                foreach ($tree as $key => $branch) {
                    if ($branch['id'] == $folder['parent_id']) {
                        array_splice($tree, $key + 1, 0, [$insert]);
                        $found = true;
                        break;
                    }
                }
                if (!$found) {
                    $insert['level'] = 0;
                    $insert['parent_id'] = null;
                    $tree[] = $insert;
                }
            }
        }

        return $response->withJson(['folders' => $tree]);
    }

    public function getById(Request $request, Response $response, array $args)
    {
        if (!Validator::numeric()->notEmpty()->validate($args['id'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Route id is not an integer']);
        }

        $folder = FolderController::getScopeFolders(['login' => $GLOBALS['userId'], 'folderId' => $args['id']]);
        if (empty($folder[0])) {
            return $response->withStatus(400)->withJson(['errors' => 'Folder not found or out of your perimeter']);
        }

        $folder = $folder[0];
        $ownerInfo = UserModel::getById(['select' => ['firstname', 'lastname'], 'id' => $folder['user_id']]);
        $folder['ownerDisplayName'] = $ownerInfo['firstname'] . ' ' . $ownerInfo['lastname'];

        $folder['sharing']['entities'] = [];
        if ($folder['public']) {
            $entitiesFolder = EntityFolderModel::getByFolderId(['folder_id' => $args['id'], 'select' => ['entities_folders.entity_id', 'entities_folders.edition', 'entities.entity_label']]);
            foreach ($entitiesFolder as $value) {
                $folder['sharing']['entities'][] = ['entity_id' => $value['entity_id'], 'edition' => $value['edition'], 'label' => $value['entity_label']];
            }
        }

        return $response->withJson(['folder' => $folder]);
    }

    public function create(Request $request, Response $response)
    {
        $data = $request->getParsedBody();

        if (!Validator::stringType()->notEmpty()->validate($data['label'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Body label is empty or not a string']);
        }
        if (!empty($data['parent_id']) && !Validator::intval()->validate($data['parent_id'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Body parent_id is not a numeric']);
        }

        if (empty($data['parent_id'])) {
            $data['parent_id'] = null;
            $owner  = $GLOBALS['id'];
            $public = false;
            $level  = 0;
        } else {
            $folder = FolderController::getScopeFolders(['login' => $GLOBALS['userId'], 'folderId' => $data['parent_id'], 'edition' => true]);
            if (empty($folder[0])) {
                return $response->withStatus(400)->withJson(['errors' => 'Parent Folder not found or out of your perimeter']);
            }
            $owner  = $folder[0]['user_id'];
            $public = $folder[0]['public'];
            $level  = $folder[0]['level'] + 1;
        }

        $id = FolderModel::create([
            'label'     => $data['label'],
            'public'    => $public,
            'user_id'   => $owner,
            'parent_id' => $data['parent_id'],
            'level'     => $level
        ]);

        if ($public && !empty($data['parent_id'])) {
            $entitiesSharing = EntityFolderModel::getByFolderId(['folder_id' => $data['parent_id'], 'select' => ['entities.id', 'entities_folders.edition']]);
            foreach ($entitiesSharing as $entity) {
                EntityFolderModel::create([
                    'folder_id' => $id,
                    'entity_id' => $entity['id'],
                    'edition'   => $entity['edition'],
                ]);
            }
        }

        HistoryController::add([
            'tableName' => 'folders',
            'recordId'  => $id,
            'eventType' => 'ADD',
            'info'      => _FOLDER_CREATION . " : {$data['label']}",
            'moduleId'  => 'folder',
            'eventId'   => 'folderCreation',
        ]);

        return $response->withJson(['folder' => $id]);
    }

    public function update(Request $request, Response $response, array $aArgs)
    {
        $data = $request->getParams();

        if (!Validator::numeric()->notEmpty()->validate($aArgs['id'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Query id is empty or not an integer']);
        }
        if (!Validator::stringType()->notEmpty()->validate($data['label'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Body label is empty or not a string']);
        }
        if (!empty($data['parent_id']) && !Validator::intval()->validate($data['parent_id'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Body parent_id is not a numeric']);
        }
        if ($data['parent_id'] == $aArgs['id']) {
            return $response->withStatus(400)->withJson(['errors' => 'Parent_id and id can not be the same']);
        }
        if (!empty($data['parent_id']) && FolderController::isParentFolder(['parent_id' => $data['parent_id'], 'id' => $aArgs['id']])) {
            return $response->withStatus(400)->withJson(['errors' => 'parent_id does not exist or Id is a parent of parent_id']);
        }

        $folder = FolderController::getScopeFolders(['login' => $GLOBALS['userId'], 'folderId' => $aArgs['id'], 'edition' => true]);
        if (empty($folder[0])) {
            return $response->withStatus(400)->withJson(['errors' => 'Folder not found or out of your perimeter']);
        }

        if (empty($data['parent_id'])) {
            $data['parent_id'] = null;
            $level = 0;
        } else {
            $folderParent = FolderModel::getById(['id' => $data['parent_id'], 'select' => ['folders.id', 'parent_id', 'level']]);
            $level = $folderParent[0]['level'] + 1;
        }

        FolderController::updateChildren($aArgs['id'], $level);

        FolderModel::update([
            'set' => [
                'label'      => $data['label']
            ],
            'where' => ['id = ?'],
            'data' => [$aArgs['id']]
        ]);


        if ($folder[0]['parent_id'] != $data['parent_id']) {
            $childrenInPerimeter = FolderController::areChildrenInPerimeter(['folderId' => $aArgs['id']]);
            if ($childrenInPerimeter) {
                FolderModel::update([
                    'set' => [
                        'parent_id' => $data['parent_id'],
                        'level' => $level
                    ],
                    'where' => ['id = ?'],
                    'data' => [$aArgs['id']]
                ]);
            } else {
                return $response->withStatus(400)->withJson(['errors' => 'Cannot move folder because at least one folder is out of your perimeter']);
            }
        }

        HistoryController::add([
            'tableName' => 'folders',
            'recordId'  => $aArgs['id'],
            'eventType' => 'UP',
            'info'      => _FOLDER_MODIFICATION . " : {$data['label']}",
            'moduleId'  => 'folder',
            'eventId'   => 'folderModification',
        ]);

        return $response->withStatus(200);
    }

    public function sharing(Request $request, Response $response, array $aArgs)
    {
        $data = $request->getParams();

        if (!Validator::numeric()->notEmpty()->validate($aArgs['id'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Query id is empty or not an integer']);
        }
        if (!Validator::boolType()->validate($data['public'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Body public is empty or not a boolean']);
        }
        if ($data['public'] && !isset($data['sharing']['entities'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Body sharing/entities does not exists']);
        }

        DatabaseModel::beginTransaction();
        $sharing = FolderController::folderSharing(['folderId' => $aArgs['id'], 'public' => $data['public'], 'sharing' => $data['sharing']]);
        if (!$sharing) {
            DatabaseModel::rollbackTransaction();
            return $response->withStatus(400)->withJson(['errors' => 'Cannot share/unshare folder because at least one folder is out of your perimeter']);
        }
        DatabaseModel::commitTransaction();

        HistoryController::add([
            'tableName' => 'folders',
            'recordId'  => $aArgs['id'],
            'eventType' => 'UP',
            'info'      => _FOLDER_SHARING_MODIFICATION . " : {$data['label']}",
            'moduleId'  => 'folder',
            'eventId'   => 'folderModification',
        ]);

        return $response->withStatus(204);
    }

    public function folderSharing($aArgs = [])
    {
        $folder = FolderController::getScopeFolders(['login' => $GLOBALS['userId'], 'folderId' => $aArgs['folderId'], 'edition' => true]);
        if (empty($folder[0])) {
            return false;
        }

        FolderModel::update([
            'set' => [
                'public' => empty($aArgs['public']) ? 'false' : 'true',
            ],
            'where' => ['id = ?'],
            'data' => [$aArgs['folderId']]
        ]);

        EntityFolderModel::deleteByFolderId(['folder_id' => $aArgs['folderId']]);

        if ($aArgs['public'] && !empty($aArgs['sharing']['entities'])) {
            foreach ($aArgs['sharing']['entities'] as $entity) {
                EntityFolderModel::create([
                    'folder_id' => $aArgs['folderId'],
                    'entity_id' => $entity['entity_id'],
                    'edition'   => $entity['edition'],
                ]);
            }
        }

        $folderChild = FolderModel::getChild(['id' => $aArgs['folderId'], 'select' => ['id']]);
        if (!empty($folderChild)) {
            foreach ($folderChild as $child) {
                FolderController::folderSharing(['folderId' => $child['id'], 'public' => $aArgs['public'], 'sharing' => $aArgs['sharing']]);
            }
        }

        return true;
    }

    public function delete(Request $request, Response $response, array $aArgs)
    {
        if (!Validator::numeric()->notEmpty()->validate($aArgs['id'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Query id is empty or not an integer']);
        }

        $folder = FolderController::getScopeFolders(['login' => $GLOBALS['userId'], 'folderId' => $aArgs['id'], 'edition' => true]);
        
        DatabaseModel::beginTransaction();
        $deletion = FolderController::folderDeletion(['folderId' => $aArgs['id']]);
        if (!$deletion) {
            DatabaseModel::rollbackTransaction();
            return $response->withStatus(400)->withJson(['errors' => 'Cannot delete because at least one folder is out of your perimeter']);
        }
        DatabaseModel::commitTransaction();

        HistoryController::add([
            'tableName' => 'folder',
            'recordId'  => $aArgs['id'],
            'eventType' => 'DEL',
            'info'      => _FOLDER_SUPPRESSION . " : {$folder[0]['label']}",
            'moduleId'  => 'folder',
            'eventId'   => 'folderSuppression',
        ]);

        return $response->withStatus(204);
    }

    public static function folderDeletion(array $aArgs = [])
    {
        $folder = FolderController::getScopeFolders(['login' => $GLOBALS['userId'], 'folderId' => $aArgs['folderId'], 'edition' => true]);
        if (empty($folder[0])) {
            return false;
        }

        FolderModel::delete(['where' => ['id = ?'], 'data' => [$aArgs['folderId']]]);
        EntityFolderModel::deleteByFolderId(['folder_id' => $aArgs['folderId']]);
        ResourceFolderModel::delete(['where' => ['folder_id = ?'], 'data' => [$aArgs['folderId']]]);

        $folderChild = FolderModel::getChild(['id' => $aArgs['folderId'], 'select' => ['id']]);
        if (!empty($folderChild)) {
            foreach ($folderChild as $child) {
                $deletion = FolderController::folderDeletion(['folderId' => $child['id']]);
                if (!$deletion) {
                    return false;
                }
            }
        }
        return true;
    }

    public static function areChildrenInPerimeter(array $aArgs = []) {
        $folder = FolderController::getScopeFolders(['login' => $GLOBALS['userId'], 'folderId' => $aArgs['folderId'], 'edition' => true]);
        if (empty($folder[0])) {
            return false;
        }

        $children = FolderModel::getWithEntities([
            'select' =>  ['distinct (folders.id), edition'],
            'where'  =>  ['parent_id = ?'],
            'data'   =>  [$aArgs['folderId']]
        ]);

        if (!empty($children)) {
            foreach ($children as $child) {
                if ($child['edition'] == false or $child['edition'] == null) {
                    return false;
                }
            }
        }
        return true;
    }

    public function getResourcesById(Request $request, Response $response, array $args)
    {
        if (!Validator::numeric()->notEmpty()->validate($args['id'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Route id is not an integer']);
        }

        if (!FolderController::hasFolder(['id' => $args['id'], 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(400)->withJson(['errors' => 'Folder out of perimeter']);
        }

        $foldersResources = ResourceFolderModel::get(['select' => ['res_id'], 'where' => ['folder_id = ?'], 'data' => [$args['id']]]);
        $foldersResources = array_column($foldersResources, 'res_id');

        $formattedResources = [];
        $allResources = [];
        $count = 0;
        if (!empty($foldersResources)) {
            $queryParams = $request->getQueryParams();
            $queryParams['offset'] = (empty($queryParams['offset']) || !is_numeric($queryParams['offset']) ? 0 : (int)$queryParams['offset']);
            $queryParams['limit'] = (empty($queryParams['limit']) || !is_numeric($queryParams['limit']) ? 10 : (int)$queryParams['limit']);

            $allQueryData = ResourceListController::getResourcesListQueryData(['data' => $queryParams]);
            if (!empty($allQueryData['order'])) {
                $data['order'] = $allQueryData['order'];
            }

            $rawResources = ResourceListModel::getOnView([
                'select'    => ['res_id'],
                'table'     => $allQueryData['table'],
                'leftJoin'  => $allQueryData['leftJoin'],
                'where'     => array_merge(['res_id in (?)'], $allQueryData['where']),
                'data'      => array_merge([$foldersResources], $allQueryData['queryData']),
                'orderBy'   => empty($data['order']) ? ['creation_date'] : [$data['order']]
            ]);

            $resIds = ResourceListController::getIdsWithOffsetAndLimit(['resources' => $rawResources, 'offset' => $queryParams['offset'], 'limit' => $queryParams['limit']]);

            foreach ($rawResources as $resource) {
                $allResources[] = $resource['res_id'];
            }

            $formattedResources = [];
            if (!empty($resIds)) {
                $excludeAttachmentTypes = ['converted_pdf', 'print_folder'];
                if (!ServiceModel::hasService(['id' => 'view_documents_with_notes', 'userId' => $GLOBALS['userId'], 'location' => 'attachments', 'type' => 'use'])) {
                    $excludeAttachmentTypes[] = 'document_with_notes';
                }

                $attachments = AttachmentModel::getOnView([
                    'select'    => ['COUNT(res_id)', 'res_id_master'],
                    'where'     => ['res_id_master in (?)', 'status not in (?)', 'attachment_type not in (?)', '((status = ? AND typist = ?) OR status != ?)'],
                    'data'      => [$resIds, ['DEL', 'OBS'], $excludeAttachmentTypes, 'TMP', $GLOBALS['userId'], 'TMP'],
                    'groupBy'   => ['res_id_master']
                ]);

                $select = [
                    'res_letterbox.res_id', 'res_letterbox.subject', 'res_letterbox.barcode', 'res_letterbox.alt_identifier',
                    'status.label_status AS "status.label_status"', 'status.img_filename AS "status.img_filename"', 'priorities.color AS "priorities.color"'
                ];
                $tableFunction = ['status', 'priorities'];
                $leftJoinFunction = ['res_letterbox.status = status.id', 'res_letterbox.priority = priorities.id'];

                $order = 'CASE res_letterbox.res_id ';
                foreach ($resIds as $key => $resId) {
                    $order .= "WHEN {$resId} THEN {$key} ";
                }
                $order .= 'END';

                $resources = ResourceListModel::getOnResource([
                    'select'    => $select,
                    'table'     => $tableFunction,
                    'leftJoin'  => $leftJoinFunction,
                    'where'     => ['res_letterbox.res_id in (?)'],
                    'data'      => [$resIds],
                    'orderBy'   => [$order]
                ]);

                $formattedResources = ResourceListController::getFormattedResources([
                    'resources'     => $resources,
                    'userId'        => $GLOBALS['id'],
                    'attachments'   => $attachments,
                    'checkLocked'   => false
                ]);
            }

            $count = count($rawResources);
        }

        return $response->withJson(['resources' => $formattedResources, 'countResources' => $count, 'allResources' => $allResources]);
    }

    public function addResourcesById(Request $request, Response $response, array $args)
    {
        if (!Validator::numeric()->notEmpty()->validate($args['id'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Route id is not an integer']);
        }

        $body = $request->getParsedBody();
        if (!Validator::arrayType()->notEmpty()->validate($body['resources'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Body resources is empty or not an array']);
        }

        if (!FolderController::hasFolder(['id' => $args['id'], 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(400)->withJson(['errors' => 'Folder out of perimeter']);
        }

        $foldersResources = ResourceFolderModel::get(['select' => ['res_id'], 'where' => ['folder_id = ?'], 'data' => [$args['id']]]);
        $foldersResources = array_column($foldersResources, 'res_id');

        $resourcesToClassify = array_diff($body['resources'], $foldersResources);
        if (empty($resourcesToClassify)) {
            return $response->withJson(['countResources' => count($foldersResources)]);
        }

        if (!ResController::hasRightByResId(['resId' => $resourcesToClassify, 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(400)->withJson(['errors' => 'Resources out of perimeter']);
        }

        foreach ($resourcesToClassify as $value) {
            ResourceFolderModel::create(['folder_id' => $args['id'], 'res_id' => $value]);
        }

        HistoryController::add([
            'tableName' => 'resources_folders',
            'recordId'  => $args['id'],
            'eventType' => 'ADD',
            'info'      => _FOLDER_RESOURCES_ADDED . " : " . implode(", ", $resourcesToClassify) . " " . _FOLDER_TO_FOLDER . " " . $args['id'],
            'moduleId'  => 'folder',
            'eventId'   => 'folderResourceAdded',
        ]);

        return $response->withJson(['countResources' => count($foldersResources) + count($resourcesToClassify)]);
    }

    public function removeResourcesById(Request $request, Response $response, array $args)
    {
        if (!Validator::numeric()->notEmpty()->validate($args['id'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Route id is not an integer']);
        }

        if (!FolderController::hasFolder(['id' => $args['id'], 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(400)->withJson(['errors' => 'Folder out of perimeter']);
        }

        $foldersResources = ResourceFolderModel::get(['select' => ['res_id'], 'where' => ['folder_id = ?'], 'data' => [$args['id']]]);
        $foldersResources = array_column($foldersResources, 'res_id');

        $body = $request->getParsedBody();
        if (!Validator::arrayType()->notEmpty()->validate($body['resources'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Body resources is empty or not an array']);
        }

        $resourcesToUnclassify = array_intersect($foldersResources, $body['resources']);
        if (empty($resourcesToUnclassify)) {
            return $response->withJson(['countResources' => count($foldersResources)]);
        }

        if (!ResController::hasRightByResId(['resId' => $resourcesToUnclassify, 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(400)->withJson(['errors' => 'Resources out of perimeter']);
        }

        foreach ($resourcesToUnclassify as $value) {
            ResourceFolderModel::delete(['where' => ['folder_id = ?', 'res_id = ?'], 'data' => [$args['id'], $value]]);
        }

        HistoryController::add([
            'tableName' => 'resources_folders',
            'recordId'  => $args['id'],
            'eventType' => 'DEL',
            'info'      => _FOLDER_RESOURCES_REMOVED . " : " . implode(", ", $resourcesToUnclassify) . " " . _FOLDER_TO_FOLDER . " " . $args['id'],
            'moduleId'  => 'folder',
            'eventId'   => 'folderResourceRemoved',
        ]);

        return $response->withJson(['countResources' => count($foldersResources) - count($resourcesToUnclassify)]);
    }

    public function getBasketsFromFolder(Request $request, Response $response, array $args)
    {
        if (!Validator::numeric()->notEmpty()->validate($args['id'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Route id is not an integer']);
        }

        if (!FolderController::hasFolder(['id' => $args['id'], 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(403)->withJson(['errors' => 'Folder out of perimeter']);
        }

        $foldersResource = ResourceFolderModel::get(['select' => [1], 'where' => ['folder_id = ?', 'res_id = ?'], 'data' => [$args['id'], $args['resId']]]);
        if (empty($foldersResource)) {
            return $response->withStatus(403)->withJson(['errors' => 'Resource out of perimeter']);
        }

        $baskets = BasketModel::getWithPreferences([
            'select'    => ['baskets.id', 'baskets.basket_name', 'baskets.basket_clause', 'users_baskets_preferences.group_serial_id', 'usergroups.group_desc'],
            'where'     => ['users_baskets_preferences.user_serial_id = ?'],
            'data'      => [$GLOBALS['id']]
        ]);
        $groupsBaskets = [];
        $inCheckedBaskets = [];
        $outCheckedBaskets = [];
        foreach ($baskets as $basket) {
            if (in_array($basket['id'], $outCheckedBaskets)) {
                continue;
            } else {
                if (!in_array($basket['id'], $inCheckedBaskets)) {
                    $preparedClause = PreparedClauseController::getPreparedClause(['clause' => $basket['basket_clause'], 'login' => $GLOBALS['userId']]);
                    $resource = ResModel::getOnView(['select' => [1], 'where' => ['res_id = ?', "({$preparedClause})"], 'data' => [$args['resId']]]);
                    if (empty($resource)) {
                        $outCheckedBaskets[] = $basket['id'];
                        continue;
                    }
                }
                $inCheckedBaskets[] = $basket['id'];
                $groupsBaskets[] = ['groupId' => $basket['group_serial_id'], 'groupName' => $basket['group_desc'], 'basketId' => $basket['id'], 'basketName' => $basket['basket_name']];
            }
        }

        return $response->withJson(['groupsBaskets' => $groupsBaskets]);
    }

    public function getFilters(Request $request, Response $response, array $args)
    {
        if (!Validator::numeric()->notEmpty()->validate($args['id'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Route id is not an integer']);
        }

        if (!FolderController::hasFolder(['id' => $args['id'], 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(400)->withJson(['errors' => 'Folder out of perimeter']);
        }

        $foldersResources = ResourceFolderModel::get(['select' => ['res_id'], 'where' => ['folder_id = ?'], 'data' => [$args['id']]]);
        $foldersResources = array_column($foldersResources, 'res_id');

        if (empty($foldersResources)) {
            return $response->withJson(['entities' => [], 'priorities' => [], 'categories' => [], 'statuses' => [], 'entitiesChildren' => []]);
        }

        $where = ['(res_id in (?))'];
        $queryData = [$foldersResources];
        $queryParams = $request->getQueryParams();

        $filters = ResourceListController::getFormattedFilters(['where' => $where, 'queryData' => $queryData, 'queryParams' => $queryParams]);

        return $response->withJson($filters);
    }

    // login (string) : Login of user connected
    // folderId (integer) : Check specific folder
    // edition (boolean) : whether user can edit or not
    public static function getScopeFolders(array $aArgs)
    {
        $login = $aArgs['login'];
        $userEntities = EntityModel::getWithUserEntities(['select'  => ['entities.id'], 'where' => ['user_id = ?'], 'data' => [$login]]);

        $userEntities = array_column($userEntities, 'id');
        if (empty($userEntities)) {
            $userEntities = 0;
        }

        $user = UserModel::getByLogin(['login' => $login, 'select' => ['id']]);

        if ($aArgs['edition']) {
            $edition = [1];
        } else {
            $edition = [0, 1, null];
        }

        $where = ['(user_id = ? OR (entity_id in (?) AND entities_folders.edition in (?)))'];
        $data = [$user['id'], $userEntities, $edition];

        if (!empty($aArgs['folderId'])) {
            $where[] = 'folders.id = ?';
            $data[]  = $aArgs['folderId'];
        }

        $folders = FolderModel::getWithEntities([
            'select'    => ['distinct (folders.id)', 'folders.*'],
            'where'     => $where,
            'data'      => $data,
            'orderBy'   => ['level', 'label desc']
        ]);

        return $folders;
    }

    private static function hasFolder(array $args)
    {
        ValidatorModel::notEmpty($args, ['id', 'userId']);
        ValidatorModel::intVal($args, ['id', 'userId']);


        $user = UserModel::getById(['id' => $args['userId'], 'select' => ['user_id']]);

        $entities = UserModel::getEntitiesById(['userId' => $user['user_id']]);
        $entities = array_column($entities, 'id');

        if (empty($entities)) {
            $entities = [0];
        }

        $folders = FolderModel::getWithEntities([
            'select'   => [1],
            'where'    => ['folders.id = ?', '(user_id = ? OR entity_id in (?))'],
            'data'     => [$args['id'], $args['userId'], $entities]
        ]);

        if (empty($folders)) {
            return false;
        }

        return true;
    }

    private static function isParentFolder(array $args)
    {
        $parentInfo = FolderModel::getById(['id' => $args['parent_id'], 'select' => ['folders.id', 'parent_id']]);
        if (empty($parentInfo) || $parentInfo['id'] == $args['id']) {
            return true;
        } elseif (!empty($parentInfo['parent_id'])) {
            return FolderController::isParentFolder(['parent_id' => $parentInfo['parent_id'], 'id' => $args['id']]);
        }
        return false;
    }

    private static function updateChildren($parentId, $levelParent)
    {
        $folderChild = FolderModel::getChild(['id' => $parentId]);
        if (!empty($folderChild)) {
            foreach ($folderChild as $child) {
                $level = $levelParent + 1;
                FolderController::updateChildren($child['id'], $level);
            }

            $idsChildren = array_column($folderChild, 'id');

            FolderModel::update([
                'set' => [
                    'level' => $level
                ],
                'where' => ['id in (?)'],
                'data' => [$idsChildren]
            ]);
        }
    }
}
