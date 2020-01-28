<?php

/**
* Copyright Maarch since 2008 under licence GPLv3.
* See LICENCE.txt file at the root folder for more details.
* This file is part of Maarch software.

* @brief   ActionController
* @author  dev <dev@maarch.org>
* @ingroup core
*/

namespace Action\controllers;

use AcknowledgementReceipt\models\AcknowledgementReceiptModel;
use Action\models\ActionModel;
use Action\models\BasketPersistenceModel;
use Action\models\ResMarkAsReadModel;
use Attachment\models\AttachmentModel;
use Entity\controllers\ListInstanceController;
use Entity\models\EntityModel;
use Entity\models\ListInstanceModel;
use Entity\models\ListTemplateModel;
use ExternalSignatoryBook\controllers\MaarchParapheurController;
use History\controllers\HistoryController;
use MessageExchange\controllers\MessageExchangeReviewController;
use Note\models\NoteModel;
use Resource\controllers\ResController;
use Resource\models\ResModel;
use Respect\Validation\Validator;
use SrcCore\models\CoreConfigModel;
use SrcCore\models\CurlModel;
use SrcCore\models\DatabaseModel;
use SrcCore\models\ValidatorModel;
use User\models\UserModel;

class ActionMethodController
{
    use AcknowledgementReceiptTrait;
    use ShippingTrait;
    use ExternalSignatoryBookTrait;

    const COMPONENTS_ACTIONS = [
        'confirmAction'                         => null,
        'closeMailAction'                       => 'closeMailAction',
        'closeMailWithAttachmentsOrNotesAction' => 'closeMailWithAttachmentsOrNotesAction',
        'redirectAction'                        => 'redirect',
        'closeAndIndexAction'                   => 'closeAndIndexAction',
        'updateDepartureDateAction'             => 'updateDepartureDateAction',
        'enabledBasketPersistenceAction'        => 'enabledBasketPersistenceAction',
        'disabledBasketPersistenceAction'       => 'disabledBasketPersistenceAction',
        'resMarkAsReadAction'                   => 'resMarkAsReadAction',
        'sendExternalSignatoryBookAction'       => 'sendExternalSignatoryBookAction',
        'sendExternalNoteBookAction'            => 'sendExternalNoteBookAction',
        'createAcknowledgementReceiptsAction'   => 'createAcknowledgementReceipts',
        'updateAcknowledgementSendDateAction'   => 'updateAcknowledgementSendDateAction',
        'sendShippingAction'                    => 'createMailevaShippings',
        'sendSignatureBookAction'               => 'sendSignatureBook',
        'continueVisaCircuitAction'             => 'continueVisaCircuit',
        'rejectVisaBackToPrevious'              => 'rejectVisaBackToPrevious',
        'redirectInitiatorEntityAction'         => 'redirectInitiatorEntityAction',
        'rejectVisaBackToPreviousAction'        => 'rejectVisaBackToPrevious',
        'resetVisaAction'                       => 'resetVisa',
        'interruptVisaAction'                   => 'interruptVisa',
        'sendToParallelOpinion'                 => 'sendToParallelOpinion',
        'sendToOpinionCircuitAction'            => 'sendToOpinionCircuit',
        'continueOpinionCircuitAction'          => 'continueOpinionCircuit',
        'giveOpinionParallelAction'             => 'giveOpinionParallel',
        'validateParallelOpinionDiffusionAction' => 'validateParallelOpinionDiffusion',
        'noConfirmAction'                       => null
    ];

    public static function terminateAction(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['id', 'resources']);
        ValidatorModel::intVal($aArgs, ['id']);
        ValidatorModel::arrayType($aArgs, ['resources']);
        ValidatorModel::stringType($aArgs, ['basketName', 'note', 'history']);

        $set = ['locker_user_id' => null, 'locker_time' => null, 'modification_date' => 'CURRENT_TIMESTAMP'];

        $action = ActionModel::getById(['id' => $aArgs['id'], 'select' => ['label_action', 'id_status', 'history']]);
        if (!empty($action['id_status']) && $action['id_status'] != '_NOSTATUS_') {
            $set['status'] = $action['id_status'];
        }

        ResModel::update([
            'set'   => $set,
            'where' => ['res_id in (?)'],
            'data'  => [$aArgs['resources']]
        ]);

        foreach ($aArgs['resources'] as $resource) {
            if (!empty(trim($aArgs['note']))) {
                NoteModel::create([
                    'resId'     => $resource,
                    'user_id'   => $GLOBALS['id'],
                    'note_text' => $aArgs['note']
                ]);
            }

            if ($action['history'] == 'Y') {
                $info = "{$action['label_action']}{$aArgs['history']}";
                $info = empty($aArgs['basketName']) ? $info : "{$aArgs['basketName']} : {$info}";
                HistoryController::add([
                    'tableName' => 'res_letterbox',
                    'recordId'  => $resource,
                    'eventType' => 'ACTION#' . $aArgs['id'],
                    'moduleId'  => 'resource',
                    'eventId'   => $aArgs['id'],
                    'info'      => $info
                ]);

                MessageExchangeReviewController::sendMessageExchangeReview(['res_id' => $resource, 'action_id' => $aArgs['id'], 'userId' => $GLOBALS['userId']]);
            }
        }

        return true;
    }

    public static function closeMailAction(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['resId']);
        ValidatorModel::intVal($aArgs, ['resId']);
        ValidatorModel::stringType($aArgs, ['note']);

        ResModel::update(['set' => ['closing_date' => 'CURRENT_TIMESTAMP'], 'where' => ['res_id = ?', 'closing_date is null'], 'data' => [$aArgs['resId']]]);

        return true;
    }

    public static function closeMailWithAttachmentsOrNotesAction(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['resId']);
        ValidatorModel::intVal($aArgs, ['resId']);
        ValidatorModel::stringType($aArgs, ['note']);

        $attachments = AttachmentModel::get([
            'select' => [1],
            'where'  => ['res_id_master = ?', 'status != ?'],
            'data'   => [$aArgs['resId'], 'DEL'],
        ]);

        $notes = NoteModel::getByUserIdForResource(['select' => ['user_id', 'id'], 'resId' => $aArgs['resId'], 'userId' => $GLOBALS['id']]);

        if (empty($attachments) && empty($notes) && empty($aArgs['note'])) {
            return ['errors' => ['No attachments or notes']];
        }

        ResModel::update(['set' => ['closing_date' => 'CURRENT_TIMESTAMP'], 'where' => ['res_id = ?', 'closing_date is null'], 'data' => [$aArgs['resId']]]);

        return true;
    }

    public static function closeAndIndexAction(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['resId']);
        ValidatorModel::intVal($aArgs, ['resId']);

        ResModel::update(['set' => ['closing_date' => 'CURRENT_TIMESTAMP'], 'where' => ['res_id = ?', 'closing_date is null'], 'data' => [$aArgs['resId']]]);

        return true;
    }

    public static function updateAcknowledgementSendDateAction(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['resId', 'data']);
        ValidatorModel::intVal($aArgs, ['resId']);

        AcknowledgementReceiptModel::updateSendDate(['send_date' => date('Y-m-d H:i:s', $aArgs['data']['send_date']), 'res_id' => $aArgs['resId']]);

        return true;
    }

    public static function updateDepartureDateAction(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['resId']);
        ValidatorModel::intVal($aArgs, ['resId']);

        ResModel::update(['set' => ['departure_date' => 'CURRENT_TIMESTAMP'], 'where' => ['res_id = ?', 'departure_date is null'], 'data' => [$aArgs['resId']]]);

        return true;
    }

    public static function disabledBasketPersistenceAction(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['resId']);
        ValidatorModel::intVal($aArgs, ['resId']);

        BasketPersistenceModel::delete([
            'where' => ['res_id = ?',  'user_id = ?'],
            'data'  => [$aArgs['resId'], $GLOBALS['userId']]
        ]);

        BasketPersistenceModel::create([
            'res_id'        => $aArgs['resId'],
            'user_id'       => $GLOBALS['userId'],
            'is_persistent' => 'N'
        ]);

        return true;
    }

    public static function enabledBasketPersistenceAction(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['resId']);
        ValidatorModel::intVal($aArgs, ['resId']);

        BasketPersistenceModel::delete([
            'where' => ['res_id = ?', 'user_id = ?'],
            'data'  => [$aArgs['resId'], $GLOBALS['userId']]
        ]);

        BasketPersistenceModel::create([
            'res_id'        => $aArgs['resId'],
            'user_id'       => $GLOBALS['userId'],
            'is_persistent' => 'Y'
        ]);

        return true;
    }

    public static function resMarkAsReadAction(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['resId', 'data']);
        ValidatorModel::intVal($aArgs, ['resId']);

        ResMarkAsReadModel::delete([
            'where' => ['res_id = ?', 'user_id = ?', 'basket_id = ?'],
            'data'  => [$aArgs['resId'], $GLOBALS['userId'], $aArgs['data']['basketId']]
        ]);

        ResMarkAsReadModel::create([
            'res_id'    => $aArgs['resId'],
            'user_id'   => $GLOBALS['userId'],
            'basket_id' => $aArgs['data']['basketId']
        ]);

        return true;
    }

    public static function redirect(array $args)
    {
        ValidatorModel::notEmpty($args, ['resId', 'data']);
        ValidatorModel::intVal($args, ['resId']);
        ValidatorModel::arrayType($args, ['data']);

        $listInstances = [];
        if (!empty($args['data']['onlyRedirectDest'])) {
            if (count($args['data']['listInstances']) == 1) {
                $listInstances = ListInstanceModel::get(['select' => ['*'], 'where' => ['res_id = ?', 'difflist_type = ?', 'item_mode != ?'], 'data' => [$args['resId'], 'entity_id', 'dest']]);
            }
        }

        $listInstances = array_merge($listInstances, $args['data']['listInstances']);
        $controller = ListInstanceController::updateListInstance(['data' => [['resId' => $args['resId'], 'listInstances' => $listInstances]], 'userId' => $GLOBALS['id']]);
        if (!empty($controller['errors'])) {
            return ['errors' => [$controller['errors']]];
        }

        return true;
    }

    public static function redirectInitiatorEntityAction(array $args)
    {
        ValidatorModel::notEmpty($args, ['resId']);
        ValidatorModel::intVal($args, ['resId']);
        ValidatorModel::arrayType($args, ['data']);

        $resource = ResModel::getById(['select' => ['initiator'], 'resId' => $args['resId']]);
        if (!empty($resource)) {
            $entityInfo = EntityModel::getByEntityId(['entityId' => $resource['initiator'], 'select' => ['id']]);
            if (!empty($entityInfo)) {
                $destUser = ListTemplateModel::getWithItems(['where' => ['entity_id = ?', 'item_mode = ?', 'type = ?'], 'data' => [$entityInfo['id'], 'dest', 'diffusionList']]);
                if (!empty($destUser)) {
                    ListInstanceModel::update([
                        'set' => [
                            'item_mode' => 'cc'
                        ],
                        'where' => ['item_mode = ?', 'res_id = ?'],
                        'data' => ['dest', $args['resId']]
                    ]);
                    $userInfo = UserModel::getById(['select' => ['user_id'], 'id' => $destUser[0]['item_id']]);
                    ListInstanceModel::create([
                        'res_id'              => $args['resId'],
                        'sequence'            => 0,
                        'item_id'             => $userInfo['user_id'],
                        'item_type'           => 'user_id',
                        'item_mode'           => 'dest',
                        'added_by_user'       => $GLOBALS['userId'],
                        'viewed'              => 0,
                        'difflist_type'       => 'entity_id'
                    ]);
                    $destUser = $userInfo['user_id'];
                } else {
                    $destUser = '';
                }
                ResModel::update([
                    'set'   => ['destination' => $resource['initiator'], 'dest_user' => $destUser],
                    'where' => ['res_id = ?'],
                    'data'  => [$args['resId']]
                ]);
            }
        }

        return true;
    }

    public function sendSignatureBook(array $args)
    {
        ValidatorModel::notEmpty($args, ['resId']);
        ValidatorModel::intVal($args, ['resId']);

        $circuit = ListInstanceModel::get(['select' => [1], 'where' => ['res_id = ?', 'difflist_type = ?', 'process_date is null'], 'data' => [$args['resId'], 'VISA_CIRCUIT']]);
        if (empty($circuit)) {
            return ['errors' => ['No available circuit']];
        }

        $signableAttachmentsTypes = [];
        $attachmentsTypes = AttachmentModel::getAttachmentsTypesByXML();
        foreach ($attachmentsTypes as $key => $type) {
            if ($type['sign']) {
                $signableAttachmentsTypes[] = $key;
            }
        }

        $attachments = AttachmentModel::get([
            'select'    => [1],
            'where'     => ['res_id_master = ?', 'attachment_type in (?)', 'in_signature_book = ?', 'status not in (?)'],
            'data'      => [$args['resId'], $signableAttachmentsTypes, true, ['OBS', 'DEL', 'FRZ']]
        ]);
        if (empty($attachments)) {
            return ['errors' => ['No available attachments']];
        }

        return true;
    }

    public function continueVisaCircuit(array $args)
    {
        ValidatorModel::notEmpty($args, ['resId']);
        ValidatorModel::intVal($args, ['resId']);

        $listInstance = ListInstanceModel::get([
            'select'    => ['listinstance_id'],
            'where'     => ['res_id = ?', 'difflist_type = ?', 'process_date is null'],
            'data'      => [$args['resId'], 'VISA_CIRCUIT'],
            'orderBy'   => ['listinstance_id'],
            'limit'     => 1
        ]);

        if (empty($listInstance[0])) {
            return ['errors' => ['No available circuit']];
        }

        ListInstanceModel::update([
            'set'   => [
                'process_date' => 'CURRENT_TIMESTAMP'
            ],
            'where' => ['listinstance_id = ?'],
            'data'  => [$listInstance[0]['listinstance_id']]
        ]);

        return true;
    }

    public static function sendExternalNoteBookAction(array $args)
    {
        ValidatorModel::notEmpty($args, ['resId']);
        ValidatorModel::intVal($args, ['resId']);

        $loadedXml = CoreConfigModel::getXmlLoaded(['path' => 'modules/visa/xml/remoteSignatoryBooks.xml']);
        $config = [];

        if (!empty($loadedXml)) {
            $config['id'] = 'maarchParapheur';
            foreach ($loadedXml->signatoryBook as $value) {
                if ($value->id == $config['id']) {
                    $config['data'] = (array)$value;
                    break;
                }
            }

            $processingUserInfo = MaarchParapheurController::getUserById(['config' => $config, 'id' => $args['data']['processingUser']]);
            $sendedInfo = MaarchParapheurController::sendDatas([
                'config'            => $config,
                'resIdMaster'       => $args['resId'],
                'processingUser'    => $args['data']['processingUser'],
                'objectSent'        => 'mail',
                'userId'            => $GLOBALS['userId'],
                'note'              => $args['note'] ?? null
            ]);
            if (!empty($sendedInfo['error'])) {
                return ['errors' => [$sendedInfo['error']]];
            } else {
                $attachmentToFreeze = $sendedInfo['sended'];
            }

            $historyInfo = ' (à ' . $processingUserInfo['firstname'] . ' ' . $processingUserInfo['lastname'] . ')';
        }

        if (!empty($attachmentToFreeze)) {
            ResModel::update([
                'set' => ['external_signatory_book_id' => $attachmentToFreeze['letterbox_coll'][$args['resId']]],
                'where' => ['res_id = ?'],
                'data' => [$args['resId']]
            ]);
        }

        return ['history' => $historyInfo];
    }

    public static function rejectVisaBackToPrevious(array $args)
    {
        ValidatorModel::notEmpty($args, ['resId']);
        ValidatorModel::intVal($args, ['resId']);

        $listInstances = ListInstanceModel::get([
            'select'    => ['listinstance_id'],
            'where'     => ['res_id = ?', 'difflist_type = ?', 'process_date is not null'],
            'data'      => [$args['resId'], 'VISA_CIRCUIT'],
            'orderBy'   => ['listinstance_id desc'],
            'limit'     => 1
        ]);

        if (empty($listInstances[0])) {
            $hasCircuit = ListInstanceModel::get(['select' => [1], 'where' => ['res_id = ?', 'difflist_type = ?'], 'data' => [$args['resId'], 'VISA_CIRCUIT']]);
            if (!empty($hasCircuit)) {
                return ['errors' => ['Workflow has ended']];
            } else {
                return ['errors' => ['No workflow defined']];
            }
        } else {
            $hasPrevious = ListInstanceModel::get([
                'select'  => [1],
                'where'   => ['res_id = ?', 'difflist_type = ?', 'process_date is not null'],
                'data'    => [$args['resId'], 'VISA_CIRCUIT'],
                'orderBy' => ['listinstance_id'],
                'limit'   => 1
            ]);
            if (!empty($hasPrevious)) {
                return ['errors' => ['Workflow not yet started']];
            }
        }

        $listInstances = $listInstances[0];

        ListInstanceModel::update([
            'set'   => ['process_date' => null],
            'where' => ['listinstance_id = ?'],
            'data'  => [$listInstances['listinstance_id']]
        ]);

        return true;
    }

    public static function resetVisa(array $args)
    {
        ValidatorModel::notEmpty($args, ['resId']);
        ValidatorModel::intVal($args, ['resId']);

        $inCircuit = ListInstanceModel::get([
            'select'  => [1],
            'where'   => ['res_id = ?', 'difflist_type = ?', 'process_date is null'],
            'data'    => [$args['resId'], 'VISA_CIRCUIT'],
            'orderBy' => ['listinstance_id'],
            'limit'   => 1
        ]);
        if (empty($inCircuit[0])) {
            $hasCircuit = ListInstanceModel::get(['select' => [1], 'where' => ['res_id = ?', 'difflist_type = ?'], 'data' => [$args['resId'], 'VISA_CIRCUIT']]);
            if (!empty($hasCircuit)) {
                return ['errors' => ['Workflow has ended']];
            } else {
                return ['errors' => ['No workflow defined']];
            }
        }

        ListInstanceModel::update([
            'set'   => ['process_date' => null],
            'where' => ['res_id = ?', 'difflist_type = ?'],
            'data'  => [$args['resId'], 'VISA_CIRCUIT']
        ]);

        return true;
    }

    public static function interruptVisa(array $args)
    {
        ValidatorModel::notEmpty($args, ['resId']);
        ValidatorModel::intVal($args, ['resId']);


        $listInstances = ListInstanceModel::get([
            'select'   => ['listinstance_id'],
            'where'    => ['res_id = ?', 'difflist_type = ?', 'process_date is null'],
            'data'     => [$args['resId'], 'VISA_CIRCUIT'],
            'orderBy' => ['listinstance_id'],
            'limit'    => 1
        ]);

        if (!empty($listInstances[0])) {
            $listInstances = $listInstances[0];

            ListInstanceModel::update([
                'set'   => [
                    'process_date' => 'CURRENT_TIMESTAMP',
                    'process_comment' => _HAS_INTERRUPTED_WORKFLOW
                ],
                'where' => ['listinstance_id = ?'],
                'data'  => [$listInstances['listinstance_id']]
            ]);
        } else {
            $hasCircuit = ListInstanceModel::get(['select' => [1], 'where' => ['res_id = ?', 'difflist_type = ?'], 'data' => [$args['resId'], 'VISA_CIRCUIT']]);
            if (!empty($hasCircuit)) {
                return ['errors' => ['Workflow has ended']];
            } else {
                return ['errors' => ['No workflow defined']];
            }
        }

        ListInstanceModel::update([
            'set'   => [
                'process_date' => 'CURRENT_TIMESTAMP',
                'process_comment' => _INTERRUPTED_WORKFLOW
            ],
            'where' => ['res_id = ?', 'difflist_type = ?', 'process_date is null'],
            'data'  => [$args['resId'], 'VISA_CIRCUIT']
        ]);

        return true;
    }

    public static function sendToOpinionCircuit(array $args)
    {
        ValidatorModel::notEmpty($args, ['resId']);
        ValidatorModel::intVal($args, ['resId']);

        $listinstances = ListInstanceModel::get([
            'select' => [1],
            'where'  => ['res_id = ?', 'difflist_type = ?'],
            'data'   => [$args['resId'], 'AVIS_CIRCUIT']
        ]);

        if (empty($listinstances)) {
            return ['errors' => ['No available opinion workflow']];
        }

        if (empty($args['data']['opinionLimitDate'])) {
            return ["errors" => ["Opinion limit date is missing"]];
        }

        $opinionLimitDate = new \DateTime($args['data']['opinionLimitDate']);
        $today = new \DateTime('today');
        if ($opinionLimitDate < $today) {
            return ['errors' => ["Opinion limit date is not a valid date"]];
        }

        ResModel::update([
            'set'   => ['opinion_limit_date' => $args['data']['opinionLimitDate']],
            'where' => ['res_id = ?'],
            'data'  => [$args['resId']]
        ]);

        return true;
    }

    public static function sendToParallelOpinion(array $args)
    {
        if (empty($args['resId'])) {
            return ['errors' => ['resId is empty']];
        }

        if (!Validator::intVal()->validate($args['resId']) || !ResController::hasRightByResId(['resId' => [$args['resId']], 'userId' => $GLOBALS['id']])) {
            return ['errors' => ['Document out of perimeter']];
        }

        if (empty($args['data']['opinionLimitDate'])) {
            return ["errors" => ["Opinion limit date is missing"]];
        }

        $opinionLimitDate = new \DateTime($args['data']['opinionLimitDate']);
        $today = new \DateTime('today');
        if ($opinionLimitDate < $today) {
            return ['errors' => ["Opinion limit date is not a valid date"]];
        }

        if (empty($args['data']['opinionCircuit'])) {
            return ['errors' => "opinionCircuit is empty"];
        }

        foreach ($args['data']['opinionCircuit'] as $instance) {
            if (!in_array($instance['item_mode'], ['avis', 'avis_copy', 'avis_info'])) {
                return ['errors' => ['item_mode is different from avis, avis_copy or avis_info']];
            }

            $listControl = ['item_id', 'item_type'];
            foreach ($listControl as $itemControl) {
                if (empty($instance[$itemControl])) {
                    return ['errors' => ["ListInstance {$itemControl} is not set or empty"]];
                }
            }
        }

        DatabaseModel::beginTransaction();

        ListInstanceModel::delete([
            'where' => ['res_id = ?', 'difflist_type = ?', 'item_mode in (?)'],
            'data'  => [$args['resId'], 'entity_id', ['avis', 'avis_copy', 'avis_info']]
        ]);

        foreach ($args['data']['opinionCircuit'] as $key => $instance) {
            if (in_array($instance['item_type'], ['user_id', 'user'])) {
                $user = UserModel::getById(['id' => $instance['item_id'], 'select' => ['id', 'user_id']]);
                $instance['item_id'] = $user['user_id'] ?? null;
                $instance['item_type'] = 'user_id';
                
                if (empty($user)) {
                    DatabaseModel::rollbackTransaction();
                    return ['errors' => ['User not found']];
                }
            } else {
                DatabaseModel::rollbackTransaction();
                return ['errors' => ['item_type does not exist']];
            }

            ListInstanceModel::create([
                'res_id'                => $args['resId'],
                'sequence'              => $key,
                'item_id'               => $instance['item_id'],
                'item_type'             => $instance['item_type'],
                'item_mode'             => $instance['item_mode'],
                'added_by_user'         => $GLOBALS['userId'],
                'difflist_type'         => 'entity_id',
                'process_date'          => null,
                'process_comment'       => null,
                'requested_signature'   => false,
                'viewed'                => empty($instance['viewed']) ? 0 : $instance['viewed']
            ]);
        }

        DatabaseModel::commitTransaction();

        ResModel::update([
            'set'   => ['opinion_limit_date' => $args['data']['opinionLimitDate']],
            'where' => ['res_id = ?'],
            'data'  => [$args['resId']]
        ]);

        return true;
    }

    public static function continueOpinionCircuit(array $args)
    {
        ValidatorModel::notEmpty($args, ['resId']);
        ValidatorModel::intVal($args, ['resId']);

        $currentStep = ListInstanceModel::get([
            'select'  => ['listinstance_id', 'item_id'],
            'where'   => ['res_id = ?', 'difflist_type = ?', 'process_date is null'],
            'data'    => [$args['resId'], 'AVIS_CIRCUIT'],
            'orderBy' => ['listinstance_id'],
            'limit'   => 1
        ]);

        if (empty($currentStep)) {
            return ['errors' => ['No workflow or workflow finished']];
        }
        $currentStep = $currentStep[0];

        $message = null;
        if ($currentStep['item_id'] != $GLOBALS['userId']) {
            $currentUser = UserModel::getById(['select' => ['firstname', 'lastname'], 'id' => $GLOBALS['id']]);
            $stepUser = UserModel::get([
                'select' => ['firstname', 'lastname'],
                'where' => ['user_id = ?'],
                'data' => [$currentStep['item_id']]
            ]);
            $stepUser = $stepUser[0];

            $message = ' ' . _AVIS_SENT . " " . _BY ." "
                . $currentUser['firstname'] . ' ' . $currentUser['lastname']
                . " " . _INSTEAD_OF . " "
                . $stepUser['firstname'] . ' ' . $stepUser['lastname'];
        }

        ListInstanceModel::update([
            'set'   => [
                'process_date' => 'CURRENT_TIMESTAMP'
            ],
            'where' => ['listinstance_id = ?'],
            'data'  => [$currentStep['listinstance_id']]
        ]);

        if ($message == null) {
            return true;
        }
        return ['history' => $message];
    }

    public static function giveOpinionParallel(array $args)
    {
        ValidatorModel::notEmpty($args, ['resId']);
        ValidatorModel::intVal($args, ['resId']);

        $currentStep = ListInstanceModel::get([
            'select'  => ['listinstance_id', 'item_id'],
            'where'   => ['res_id = ?', 'difflist_type = ?', 'item_id = ?', 'item_mode in (?)'],
            'data'    => [$args['resId'], 'entity_id', $GLOBALS['userId'], ['avis', 'avis_copy', 'avis_info']],
            'limit'   => 1
        ]);

        if (empty($currentStep)) {
            return ['errors' => ['No workflow available']];
        }
        $currentStep = $currentStep[0];

        ListInstanceModel::update([
            'set'   => [
                'process_date' => 'CURRENT_TIMESTAMP'
            ],
            'where' => ['listinstance_id = ?'],
            'data'  => [$currentStep['listinstance_id']]
        ]);

        return true;
    }

    public static function validateParallelOpinionDiffusion(array $args)
    {
        ValidatorModel::notEmpty($args, ['resId']);
        ValidatorModel::intVal($args, ['resId']);

        if (empty($args['data']['opinionLimitDate'])) {
            return ["errors" => ["Opinion limit date is missing"]];
        }

        $opinionLimitDate = new \DateTime($args['data']['opinionLimitDate']);
        $today = new \DateTime('today');
        if ($opinionLimitDate < $today) {
            return ['errors' => ["Opinion limit date is not a valid date"]];
        }

        $latestNote = NoteModel::get([
            'where'  => ['identifier = ?', "note_text like '[" . _TO_AVIS . "]%'"],
            'data'   => [$args['resId']],
            'oderBy' => ['creation_date desc'],
            'limit'  => 1
        ]);

        if (empty($latestNote)) {
            return ["errors" => ["No note for opinion available"]];
        }
        $latestNote = $latestNote[0];

        if (!empty($args['data']['note'])) {
            $newNote = $args['data']['note'];

            NoteModel::delete([
                'where' => ['id = ?'],
                'data'  => [$latestNote['id']]
            ]);

            NoteModel::create([
                'resId'     => $args['resId'],
                'user_id'   => $GLOBALS['id'],
                'note_text' => $newNote
            ]);
        } else {
            $user = UserModel::getById(['select' => ['firstname', 'lastname'], 'id' => $GLOBALS['id']]);
            $newNote = $latestNote['note_text'] . '← ' . _VALIDATE_BY . ' ' . $user['firstname'] . ' ' . $user['lastname'];

            NoteModel::update([
                'set'   => [
                    'note_text'     => $newNote,
                    'creation_date' => 'CURRENT_TIMESTAMP'
                ],
                'where' => ['id = ?'],
                'data'  => [$latestNote['id']]
            ]);
        }

        if (!empty($args['data']['opinionWorkflow'])) {
            foreach ($args['data']['opinionWorkflow'] as $instance) {
                if (!in_array($instance['item_mode'], ['avis', 'avis_copy', 'avis_info'])) {
                    return ['errors' => ['item_mode is different from avis, avis_copy or avis_info']];
                }

                $listControl = ['item_id', 'item_type'];
                foreach ($listControl as $itemControl) {
                    if (empty($instance[$itemControl])) {
                        return ['errors' => ["ListInstance {$itemControl} is not set or empty"]];
                    }
                }
            }

            DatabaseModel::beginTransaction();

            ListInstanceModel::delete([
                'where' => ['res_id = ?', 'difflist_type = ?', 'item_mode in (?)'],
                'data'  => [$args['resId'], 'entity_id', ['avis', 'avis_copy', 'avis_info']]
            ]);

            foreach ($args['data']['opinionWorkflow'] as $key => $instance) {
                if (in_array($instance['item_type'], ['user_id', 'user'])) {
                    $user = UserModel::getById(['id' => $instance['item_id'], 'select' => ['id', 'user_id']]);
                    $instance['item_id'] = $user['user_id'] ?? null;
                    $instance['item_type'] = 'user_id';

                    if (empty($user)) {
                        DatabaseModel::rollbackTransaction();
                        return ['errors' => ['User not found']];
                    }
                } else {
                    DatabaseModel::rollbackTransaction();
                    return ['errors' => ['item_type does not exist']];
                }

                ListInstanceModel::create([
                    'res_id'              => $args['resId'],
                    'sequence'            => $key,
                    'item_id'             => $instance['item_id'],
                    'item_type'           => $instance['item_type'],
                    'item_mode'           => $instance['item_mode'],
                    'added_by_user'       => $GLOBALS['userId'],
                    'difflist_type'       => 'entity_id',
                    'process_date'        => null,
                    'process_comment'     => null,
                    'requested_signature' => false,
                    'viewed'              => empty($instance['viewed']) ? 0 : $instance['viewed']
                ]);
            }

            DatabaseModel::commitTransaction();
        }

        ResModel::update([
            'set'   => ['opinion_limit_date' => $args['data']['opinionLimitDate']],
            'where' => ['res_id = ?'],
            'data'  => [$args['resId']]
        ]);

        return true;
    }
}
