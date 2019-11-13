<?php

/**
* Copyright Maarch since 2008 under licence GPLv3.
* See LICENCE.txt file at the root folder for more details.
* This file is part of Maarch software.
*
*/

/**
* @brief Attachment Controller
* @author dev@maarch.org
*/

namespace Attachment\controllers;

use Attachment\models\AttachmentModel;
use Contact\models\ContactModel;
use Convert\controllers\ConvertPdfController;
use Convert\controllers\ConvertThumbnailController;
use Convert\models\AdrModel;
use Docserver\controllers\DocserverController;
use Docserver\models\DocserverModel;
use Docserver\models\DocserverTypeModel;
use Group\controllers\PrivilegeController;
use History\controllers\HistoryController;
use Resource\controllers\ResController;
use Resource\controllers\StoreController;
use Resource\models\ResModel;
use Respect\Validation\Validator;
use setasign\Fpdi\Tcpdf\Fpdi;
use Slim\Http\Request;
use Slim\Http\Response;
use SrcCore\models\CoreConfigModel;
use SrcCore\models\DatabaseModel;
use SrcCore\models\ValidatorModel;
use Template\controllers\TemplateController;
use User\models\UserModel;

class AttachmentController
{
    public function create(Request $request, Response $response)
    {
        $body = $request->getParsedBody();

        $control = AttachmentController::controlAttachment(['body' => $body]);
        if (!empty($control['errors'])) {
            return $response->withStatus(400)->withJson(['errors' => $control['errors']]);
        }

        $id = StoreController::storeAttachment($body);
        if (empty($id) || !empty($id['errors'])) {
            return $response->withStatus(500)->withJson(['errors' => '[AttachmentController create] ' . $id['errors']]);
        }

        ConvertPdfController::convert([
            'resId'     => $id,
            'collId'    => 'attachments_coll'
        ]);

        $customId = CoreConfigModel::getCustomId();
        $customId = empty($customId) ? 'null' : $customId;
        exec("php src/app/convert/scripts/FullTextScript.php --customId {$customId} --resId {$id} --collId attachments_coll --userId {$GLOBALS['id']} > /dev/null &");

        HistoryController::add([
            'tableName' => 'res_attachments',
            'recordId'  => $id,
            'eventType' => 'ADD',
            'info'      => _ATTACHMENT_ADDED,
            'moduleId'  => 'attachment',
            'eventId'   => 'attachmentAdd'
        ]);

        HistoryController::add([
            'tableName' => 'res_letterbox',
            'recordId'  => $body['resIdMaster'],
            'eventType' => 'ADD',
            'info'      => _ATTACHMENT_ADDED,
            'moduleId'  => 'attachment',
            'eventId'   => 'attachmentAdd'
        ]);

        return $response->withJson(['id' => $id]);
    }

    public function update(Request $request, Response $response, array $args)
    {
        $attachment = AttachmentModel::getById(['id' => $args['id'], 'select' => ['res_id_master', 'status']]);
        if (empty($attachment) || $attachment['status'] == 'DEL') {
            return $response->withStatus(400)->withJson(['errors' => 'Attachment does not exist']);
        }
        if (!ResController::hasRightByResId(['resId' => [$attachment['res_id_master']], 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(400)->withJson(['errors' => 'Attachment out of perimeter']);
        }

        $body = $request->getParsedBody();

        if (empty($body)) {
            return $response->withStatus(400)->withJson(['errors' => 'Body is not set or empty']);
        } elseif (!Validator::stringType()->notEmpty()->validate($body['type'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Body type is empty or not a string']);
        }

        $attachmentsTypes = AttachmentModel::getAttachmentsTypesByXML();
        if (empty($attachmentsTypes[$body['type']])) {
            return $response->withStatus(400)->withJson(['errors' => 'Body type does not exist']);
        }

        $control = AttachmentController::controlFileData(['body' => $body]);
        if (!empty($control['errors'])) {
            return $response->withStatus(400)->withJson(['errors' => $control['errors']]);
        }

        $control = AttachmentController::controlDates(['body' => $body]);
        if (!empty($control['errors'])) {
            return $response->withStatus(400)->withJson(['errors' => $control['errors']]);
        }

        $isStored = StoreController::storeAttachment($body);
        if (empty($isStored) || !empty($isStored['errors'])) {
            return $response->withStatus(500)->withJson(['errors' => '[AttachmentController update] ' . $isStored['errors']]);
        }

        if (!empty($body['encodedFile'])) {
            AdrModel::deleteAttachmentAdr(['where' => ['res_id = ?'], 'data' => [$args['id']]]);
            ConvertPdfController::convert([
                'resId'     => $args['id'],
                'collId'    => 'attachments_coll'
            ]);

            $customId = CoreConfigModel::getCustomId();
            $customId = empty($customId) ? 'null' : $customId;
            exec("php src/app/convert/scripts/FullTextScript.php --customId {$customId} --resId {$args['id']} --collId attachments_coll --userId {$GLOBALS['id']} > /dev/null &");
        }

        HistoryController::add([
            'tableName' => 'res_attachments',
            'recordId'  => $args['id'],
            'eventType' => 'UP',
            'info'      => _ATTACHMENT_UPDATED,
            'moduleId'  => 'attachment',
            'eventId'   => 'attachmentModification'
        ]);

        HistoryController::add([
            'tableName' => 'res_letterbox',
            'recordId'  => $attachment['res_id_master'],
            'eventType' => 'UP',
            'info'      => _ATTACHMENT_UPDATED,
            'moduleId'  => 'attachment',
            'eventId'   => 'attachmentModification'
        ]);

        return $response->withJson(['id' => $id]);
    }

    public function delete(Request $request, Response $response, array $args)
    {
        if (!Validator::intVal()->notEmpty()->validate($args['id'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Route id must be an integer val']);
        }

        $attachment = AttachmentModel::getById(['id' => $args['id'], 'select' => ['origin_id', 'res_id_master', 'attachment_type', 'res_id', 'title', 'typist', 'status']]);
        if (empty($attachment) || $attachment['status'] == 'DEL') {
            return $response->withStatus(400)->withJson(['errors' => 'Attachment does not exist']);
        }

        if ($GLOBALS['userId'] != $attachment['typist'] && !PrivilegeController::hasPrivilege(['privilegeId' => 'manage_attachments', 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(403)->withJson(['errors' => 'Document out of perimeter']);
        }

        if (!ResController::hasRightByResId(['resId' => [$attachment['res_id_master']], 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(403)->withJson(['errors' => 'Document out of perimeter']);
        }

        if (empty($attachment['origin_id'])) {
            $idToDelete = $attachment['res_id'];
        } else {
            $idToDelete = $attachment['origin_id'];
        }
        AttachmentModel::delete([
            'where' => ['res_id = ? or origin_id = ?'],
            'data'  => [$idToDelete, $idToDelete]
        ]);

        HistoryController::add([
            'tableName' => 'res_attachments',
            'recordId'  => $args['id'],
            'eventType' => 'DEL',
            'info'      =>  _DOC_DELETED . " : {$attachment['title']}",
            'eventId'   => 'attachmentSuppression',
        ]);

        return $response->withStatus(204);
    }

    public function getByResId(Request $request, Response $response, array $args)
    {
        if (!Validator::intVal()->validate($args['resId']) || !ResController::hasRightByResId(['resId' => [$args['resId']], 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(403)->withJson(['errors' => 'Document out of perimeter']);
        }

        $queryParams = $request->getQueryParams();
        if (!empty($queryParams['limit']) && !Validator::intVal()->validate($queryParams['limit'])) {
            return $response->withStatus(403)->withJson(['errors' => 'Query limit is not an integer']);
        }

        $excludeAttachmentTypes = ['converted_pdf', 'print_folder'];
        if (!PrivilegeController::hasPrivilege(['privilegeId' => 'view_documents_with_notes', 'userId' => $GLOBALS['id']])) {
            $excludeAttachmentTypes[] = 'document_with_notes';
        }

        $attachments = AttachmentModel::get([
            'select'    => [
                'res_id as "resId"', 'res_id_master as "resIdMaster"', 'identifier as chrono', 'title', 'creation_date as "creationDate"', 'modification_date as "modificationDate"',
                'relation', 'status', 'attachment_type as type', 'origin_id as "originId"', 'in_signature_book as "inSignatureBook"', 'in_send_attach as "inSendAttach"'
            ],
            'where'     => ['res_id_master = ?', 'status not in (?)', 'attachment_type not in (?)'],
            'data'      => [$args['resId'], ['DEL', 'OBS'], $excludeAttachmentTypes],
            'orderBy'   => ['modification_date DESC'],
            'limit'     => (int)$queryParams['limit'] ?? 0
        ]);

        $attachmentsTypes = AttachmentModel::getAttachmentsTypesByXML();
        foreach ($attachments as $key => $attachment) {
            if (!empty($attachmentsTypes[$attachment['type']]['label'])) {
                $attachments[$key]['typeLabel'] = $attachmentsTypes[$attachment['type']]['label'];
            }

            $oldVersions = [];
            if (!empty($attachment['originId'])) {
                $oldVersions = AttachmentModel::get([
                    'select'    => [
                        'res_id as "resId"', 'identifier as chrono', 'title', 'creation_date as "creationDate"', 'modification_date as "modificationDate"',
                        'relation', 'status', 'attachment_type as type'
                    ],
                    'where'     => ['(origin_id = ? OR res_id =  ?)', 'res_id != ?', 'status not in (?)', 'attachment_type not in (?)'],
                    'data'      => [$attachment['originId'], $attachment['originId'], $attachment['resId'], ['DEL'], $excludeAttachmentTypes],
                    'orderBy'   => ['relation DESC']
                ]);
            }
            $attachments[$key]['versions'] = $oldVersions;
        }

        $mailevaConfig = CoreConfigModel::getMailevaConfiguration();
        $mailevaEnabled = false;
        if (!empty($mailevaConfig) && $mailevaConfig['enabled']) {
            $mailevaEnabled = true;
        }

        return $response->withJson(['attachments' => $attachments, 'mailevaEnabled' => $mailevaEnabled]);
    }

    public function setInSignatureBook(Request $request, Response $response, array $aArgs)
    {
        $attachment = AttachmentModel::getById(['id' => $aArgs['id'], 'select' => ['in_signature_book', 'res_id_master']]);
        if (empty($attachment)) {
            return $response->withStatus(400)->withJson(['errors' => 'Attachment not found']);
        }

        if (!ResController::hasRightByResId(['resId' => [$attachment['res_id_master']], 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(403)->withJson(['errors' => 'Document out of perimeter']);
        }

        AttachmentModel::setInSignatureBook(['id' => $aArgs['id'], 'inSignatureBook' => !$attachment['in_signature_book']]);

        return $response->withJson(['success' => 'success']);
    }

    public function setInSendAttachment(Request $request, Response $response, array $aArgs)
    {
        $attachment = AttachmentModel::getById(['id' => $aArgs['id'], 'select' => ['in_send_attach', 'res_id_master']]);
        if (empty($attachment)) {
            return $response->withStatus(400)->withJson(['errors' => 'Attachment not found']);
        }

        if (!ResController::hasRightByResId(['resId' => [$attachment['res_id_master']], 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(403)->withJson(['errors' => 'Document out of perimeter']);
        }

        AttachmentModel::setInSendAttachment(['id' => $aArgs['id'], 'inSendAttachment' => !$attachment['in_send_attach']]);

        return $response->withJson(['success' => 'success']);
    }

    public function getThumbnailContent(Request $request, Response $response, array $args)
    {
        if (!Validator::intVal()->validate($args['id'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Route id is not an integer']);
        }

        $attachment = AttachmentModel::get([
            'select'    => ['res_id', 'docserver_id', 'path', 'filename', 'res_id_master'],
            'where'     => ['res_id = ?', 'status not in (?)'],
            'data'      => [$args['id'], ['DEL', 'OBS']],
            'limit'     => 1
        ]);
        if (empty($attachment[0])) {
            return $response->withStatus(403)->withJson(['errors' => 'Attachment not found']);
        }

        if (!ResController::hasRightByResId(['resId' => [$attachment[0]['res_id_master']], 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(403)->withJson(['errors' => 'Document out of perimeter']);
        }

        $pathToThumbnail = 'apps/maarch_entreprise/img/noThumbnail.png';
        $attachmentTodisplay = $attachment[0];
        $collId = "attachments_coll";

        $tnlAdr = AdrModel::getTypedAttachAdrByResId([
            'select'    => ['docserver_id', 'path', 'filename'],
            'resId'     => $args['id'],
            'type'      => 'TNL'
        ]);

        if (empty($tnlAdr)) {
            ConvertThumbnailController::convert(['collId' => $collId, 'resId' => $args['id']]);
            
            $tnlAdr = AdrModel::getTypedAttachAdrByResId([
                'select'    => ['docserver_id', 'path', 'filename'],
                'resId'     => $args['id'],
                'type'      => 'TNL'
            ]);
        }

        if (!empty($tnlAdr)) {
            $docserver = DocserverModel::getByDocserverId(['docserverId' => $tnlAdr['docserver_id'], 'select' => ['path_template']]);
            if (empty($docserver['path_template']) || !file_exists($docserver['path_template'])) {
                return $response->withStatus(400)->withJson(['errors' => 'Docserver does not exist']);
            }

            $pathToThumbnail = $docserver['path_template'] . str_replace('#', DIRECTORY_SEPARATOR, $tnlAdr['path']) . $tnlAdr['filename'];
        }

        $fileContent = file_get_contents($pathToThumbnail);
        if ($fileContent === false) {
            return $response->withStatus(404)->withJson(['errors' => 'Thumbnail not found on docserver']);
        }

        $finfo    = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->buffer($fileContent);
        $pathInfo = pathinfo($pathToThumbnail);

        $response->write($fileContent);
        $response = $response->withAddedHeader('Content-Disposition', "inline; filename=maarch.{$pathInfo['extension']}");

        return $response->withHeader('Content-Type', $mimeType);
    }
    
    public function getFileContent(Request $request, Response $response, array $args)
    {
        if (!Validator::intVal()->validate($args['id'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Route id is not an integer']);
        }

        $attachment = AttachmentModel::get([
            'select'    => ['res_id', 'docserver_id', 'path', 'filename', 'res_id_master'],
            'where'     => ['res_id = ?', 'status not in (?)'],
            'data'      => [$args['id'], ['DEL']],
            'limit'     => 1
        ]);
        if (empty($attachment[0])) {
            return $response->withStatus(403)->withJson(['errors' => 'Attachment not found']);
        }

        if (!ResController::hasRightByResId(['resId' => [$attachment[0]['res_id_master']], 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(403)->withJson(['errors' => 'Document out of perimeter']);
        }

        $attachmentTodisplay = $attachment[0];
        $id = $attachmentTodisplay['res_id'];

        $convertedAttachment = ConvertPdfController::getConvertedPdfById(['resId' => $id, 'collId' => 'attachments_coll']);
        if (empty($convertedAttachment['errors'])) {
            $attachmentTodisplay = $convertedAttachment;
        }
        $document['docserver_id'] = $attachmentTodisplay['docserver_id'];
        $document['path'] = $attachmentTodisplay['path'];
        $document['filename'] = $attachmentTodisplay['filename'];
        $document['fingerprint'] = $attachmentTodisplay['fingerprint'];

        $docserver = DocserverModel::getByDocserverId(['docserverId' => $document['docserver_id'], 'select' => ['path_template', 'docserver_type_id']]);
        if (empty($docserver['path_template']) || !file_exists($docserver['path_template'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Docserver does not exist']);
        }

        $pathToDocument = $docserver['path_template'] . str_replace('#', DIRECTORY_SEPARATOR, $document['path']) . $document['filename'];

        if (!file_exists($pathToDocument)) {
            return $response->withStatus(404)->withJson(['errors' => 'Attachment not found on docserver']);
        }

        $docserverType = DocserverTypeModel::getById(['id' => $docserver['docserver_type_id'], 'select' => ['fingerprint_mode']]);
        $fingerprint = StoreController::getFingerPrint(['filePath' => $pathToDocument, 'mode' => $docserverType['fingerprint_mode']]);
        if (!empty($document['fingerprint']) && $document['fingerprint'] != $fingerprint) {
            return $response->withStatus(400)->withJson(['errors' => 'Fingerprints do not match']);
        }

        $loadedXml = CoreConfigModel::getXmlLoaded(['path' => 'modules/attachments/xml/config.xml']);
        if ($loadedXml) {
            $watermark = (array)$loadedXml->CONFIG->watermark;
            if ($watermark['enabled'] == 'true') {
                $text = "watermark by {$GLOBALS['userId']}";
                if (!empty($watermark['text'])) {
                    $text = $watermark['text'];
                    preg_match_all('/\[(.*?)\]/i', $watermark['text'], $matches);

                    foreach ($matches[1] as $value) {
                        $tmp = '';
                        if ($value == 'date_now') {
                            $tmp = date('d-m-Y');
                        } elseif ($value == 'hour_now') {
                            $tmp = date('H:i');
                        } else {
                            $backFromView = AttachmentModel::get(['select' => [$value], 'where' => ['res_id = ?'], 'data' => [$args['id']]]);
                            if (!empty($backFromView[0][$value])) {
                                $tmp = $backFromView[0][$value];
                            }
                        }
                        $text = str_replace("[{$value}]", $tmp, $text);
                    }
                }

                $color = ['192', '192', '192']; //RGB
                if (!empty($watermark['text_color'])) {
                    $rawColor = explode(',', $watermark['text_color']);
                    $color = count($rawColor) == 3 ? $rawColor : $color;
                }

                $font = ['helvetica', '10']; //Familly Size
                if (!empty($watermark['font'])) {
                    $rawFont = explode(',', $watermark['font']);
                    $font = count($rawFont) == 2 ? $rawFont : $font;
                }

                $position = [30, 35, 0, 0.5]; //X Y Angle Opacity
                if (!empty($watermark['position'])) {
                    $rawPosition = explode(',', $watermark['position']);
                    $position = count($rawPosition) == 4 ? $rawPosition : $position;
                }

                try {
                    $pdf = new Fpdi('P', 'pt');
                    $nbPages = $pdf->setSourceFile($pathToDocument);
                    $pdf->setPrintHeader(false);
                    for ($i = 1; $i <= $nbPages; $i++) {
                        $page = $pdf->importPage($i, 'CropBox');
                        $size = $pdf->getTemplateSize($page);
                        $pdf->AddPage($size['orientation'], $size);
                        $pdf->useImportedPage($page);
                        $pdf->SetFont($font[0], '', $font[1]);
                        $pdf->SetTextColor($color[0], $color[1], $color[2]);
                        $pdf->SetAlpha($position[3]);
                        $pdf->Rotate($position[2]);
                        $pdf->Text($position[0], $position[1], $text);
                    }
                    $fileContent = $pdf->Output('', 'S');
                } catch (\Exception $e) {
                    $fileContent = null;
                }
            }
        }

        if (empty($fileContent)) {
            $fileContent = file_get_contents($pathToDocument);
        }
        if ($fileContent === false) {
            return $response->withStatus(404)->withJson(['errors' => 'Document not found on docserver']);
        }

        HistoryController::add([
            'tableName' => 'res_attachments',
            'recordId'  => $args['id'],
            'eventType' => 'VIEW',
            'info'      => _ATTACH_DISPLAYING . " : {$id}",
            'moduleId'  => 'attachments',
            'eventId'   => 'resview',
        ]);

        $data = $request->getQueryParams();
        if ($data['mode'] == 'base64') {
            return $response->withJson(['encodedDocument' => base64_encode($fileContent)]);
        } else {
            $finfo    = new \finfo(FILEINFO_MIME_TYPE);
            $mimeType = $finfo->buffer($fileContent);
            $pathInfo = pathinfo($pathToDocument);

            $response->write($fileContent);
            $response = $response->withAddedHeader('Content-Disposition', "inline; filename=maarch.{$pathInfo['extension']}");
            return $response->withHeader('Content-Type', $mimeType);
        }
    }

    public function getOriginalFileContent(Request $request, Response $response, array $args)
    {
        if (!Validator::intVal()->validate($args['id'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Route id is not an integer']);
        }

        $attachment = AttachmentModel::get([
            'select'    => ['res_id', 'docserver_id', 'path', 'filename', 'res_id_master'],
            'where'     => ['res_id = ?', 'status not in (?)'],
            'data'      => [$args['id'], ['DEL']],
            'limit'     => 1
        ]);
        if (empty($attachment[0])) {
            return $response->withStatus(403)->withJson(['errors' => 'Attachment not found']);
        }

        if (!ResController::hasRightByResId(['resId' => [$attachment[0]['res_id_master']], 'userId' => $GLOBALS['id']])) {
            return $response->withStatus(403)->withJson(['errors' => 'Document out of perimeter']);
        }

        $attachmentTodisplay = $attachment[0];
        $id = $attachmentTodisplay['res_id'];

        $document['docserver_id'] = $attachmentTodisplay['docserver_id'];
        $document['path'] = $attachmentTodisplay['path'];
        $document['filename'] = $attachmentTodisplay['filename'];
        $document['fingerprint'] = $attachmentTodisplay['fingerprint'];

        $docserver = DocserverModel::getByDocserverId(['docserverId' => $document['docserver_id'], 'select' => ['path_template', 'docserver_type_id']]);
        if (empty($docserver['path_template']) || !file_exists($docserver['path_template'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Docserver does not exist']);
        }

        $pathToDocument = $docserver['path_template'] . str_replace('#', DIRECTORY_SEPARATOR, $document['path']) . $document['filename'];

        if (!file_exists($pathToDocument)) {
            return $response->withStatus(404)->withJson(['errors' => 'Attachment not found on docserver']);
        }

        $docserverType = DocserverTypeModel::getById(['id' => $docserver['docserver_type_id'], 'select' => ['fingerprint_mode']]);
        $fingerprint = StoreController::getFingerPrint(['filePath' => $pathToDocument, 'mode' => $docserverType['fingerprint_mode']]);
        if (!empty($document['fingerprint']) && $document['fingerprint'] != $fingerprint) {
            return $response->withStatus(400)->withJson(['errors' => 'Fingerprints do not match']);
        }

        if (empty($fileContent)) {
            $fileContent = file_get_contents($pathToDocument);
        }
        if ($fileContent === false) {
            return $response->withStatus(400)->withJson(['errors' => 'Document not found on docserver']);
        }

        $finfo    = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->buffer($fileContent);
        $pathInfo = pathinfo($pathToDocument);

        $response->write($fileContent);
        $response = $response->withAddedHeader('Content-Disposition', "attachment; filename=maarch.{$pathInfo['extension']}");

        HistoryController::add([
            'tableName' => 'res_attachments',
            'recordId'  => $args['id'],
            'eventType' => 'VIEW',
            'info'      => _ATTACH_DISPLAYING . " : {$id}",
            'moduleId'  => 'attachments',
            'eventId'   => 'resview',
        ]);

        return $response->withHeader('Content-Type', $mimeType);
    }

    public function getAttachmentsTypes(Request $request, Response $response)
    {
        $attachmentsTypes = AttachmentModel::getAttachmentsTypesByXML();

        return $response->withJson(['attachmentsTypes' => $attachmentsTypes]);
    }

    public static function getEncodedDocument(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['id']);
        ValidatorModel::intVal($aArgs, ['id']);
        ValidatorModel::boolType($aArgs, ['original']);

        $document = AttachmentModel::getById(['select' => ['docserver_id', 'path', 'filename', 'title'], 'id' => $aArgs['id']]);

        if (empty($aArgs['original'])) {
            $convertedDocument = ConvertPdfController::getConvertedPdfById(['resId' => $aArgs['id'], 'collId' => 'attachments_coll']);

            if (empty($convertedDocument['errors'])) {
                $document['docserver_id'] = $convertedDocument['docserver_id'];
                $document['path'] = $convertedDocument['path'];
                $document['filename'] = $convertedDocument['filename'];
                $document['fingerprint'] = $convertedDocument['fingerprint'];
            }
        }

        $docserver = DocserverModel::getByDocserverId(['docserverId' => $document['docserver_id'], 'select' => ['path_template', 'docserver_type_id']]);
        if (empty($docserver['path_template']) || !file_exists($docserver['path_template'])) {
            return ['errors' => 'Docserver does not exist'];
        }

        $pathToDocument = $docserver['path_template'] . str_replace('#', DIRECTORY_SEPARATOR, $document['path']) . $document['filename'];
        if (!file_exists($pathToDocument)) {
            return ['errors' => 'Document not found on docserver'];
        }

        $docserverType = DocserverTypeModel::getById(['id' => $docserver['docserver_type_id'], 'select' => ['fingerprint_mode']]);
        $fingerprint = StoreController::getFingerPrint(['filePath' => $pathToDocument, 'mode' => $docserverType['fingerprint_mode']]);
        if (!empty($document['fingerprint']) && $document['fingerprint'] != $fingerprint) {
            ['errors' => 'Fingerprints do not match'];
        }

        $fileContent = file_get_contents($pathToDocument);
        if ($fileContent === false) {
            return ['errors' => 'Document not found on docserver'];
        }


        $encodedDocument = base64_encode($fileContent);

        if (!empty($document['title'])) {
            $document['title'] = preg_replace(utf8_decode('@[\\/:*?"<>|]@i'), '_', substr($document['title'], 0, 30));
        }

        $pathInfo = pathinfo($pathToDocument);
        $fileName = (empty($document['title']) ? 'document' : $document['title']) . ".{$pathInfo['extension']}";

        return ['encodedDocument' => $encodedDocument, 'fileName' => $fileName];
    }

    public static function generateAttachForMailing(array $aArgs)
    {
        $attachments = AttachmentModel::get([
            'select'    => ['*'],
            'where'     => ['res_id_master = ?', 'status = ?', 'in_signature_book = ?'],
            'data'      => [$aArgs['resIdMaster'], 'SEND_MASS', true]
        ]);

        $contactsForMailing = DatabaseModel::select([
            'select'    => ['*'],
            'table'     => ['contacts_res'],
            'where'     => ['res_id = ?', 'address_id <> 0'],
            'data'      => [$aArgs['resIdMaster']]
        ]);

        if (!empty($attachments[0])) {
            foreach ($attachments as $attachment) {
                $docserver = DocserverModel::getCurrentDocserver(['typeId' => 'DOC', 'collId' => 'letterbox_coll', 'select' => ['path_template']]);
                $pathToAttachmentToCopy = $docserver['path_template'] . str_replace('#', '/', $attachment['path']) . $attachment['filename'];

                foreach ($contactsForMailing as $keyContact => $contactForMailing) {
                    $chronoPubli = $attachment['identifier'].'-'.($keyContact+1);

                    $params = [
                        'userId'           => $aArgs['userId'],
                        'res_id'           => $aArgs['resIdMaster'],
                        'coll_id'          => 'letterbox_coll',
                        'res_view'         => 'res_attachments',
                        'res_table'        => 'res_attachments',
                        'res_contact_id'   => $contactForMailing['contact_id'],
                        'res_address_id'   => $contactForMailing['address_id'],
                        'pathToAttachment' => $pathToAttachmentToCopy,
                        'chronoAttachment' => $chronoPubli,
                    ];

                    $filePathOnTmp = TemplateController::mergeDatasource($params);

                    $allDatas = [
                        "encodedFile"       => base64_encode(file_get_contents($filePathOnTmp)),
                        "format"            => $attachment['format'],
                        'resIdMaster'       => $aArgs['resIdMaster'],
                        'type'              => $attachment['attachment_type'],
                        'chrono'            => $chronoPubli,
                        'title'             => $attachment['title'],
                        'inSignatureBook'   => true,
                    ];

                    StoreController::storeAttachment($allDatas);
                }
                
                AttachmentModel::update([
                    'set'       => [
                        'status'  => 'DEL',
                    ],
                    'where'     => ['res_id = ?'],
                    'data'      => [$attachment['res_id']]
                ]);
            }
        }

        return ['success' => 'success'];
    }

    public static function isMailingAttach(array $aArgs)
    {
        $user = UserModel::getByLogin(['login' => $aArgs['login'], 'select' => ['id']]);

        if (!Validator::intVal()->validate($aArgs['resIdMaster']) || !ResController::hasRightByResId(['resId' => [$aArgs['resIdMaster']], 'userId' => $user['id']])) {
            return ['errors' => 'Document out of perimeter'];
        }

        $attachments = AttachmentModel::get([
            'select' => ['res_id'],
            'where' => ['res_id_master = ?', 'status = ?'],
            'data' => [$aArgs['resIdMaster'],'SEND_MASS']
        ]);

        $return['nbAttach'] = count($attachments);

        if ($return['nbAttach'] == 0) {
            return false;
        }

        $return['nbContacts'] = ResModel::getNbContactsByResId(["resId" => $aArgs['resIdMaster']]);

        return $return;
    }

    private static function controlAttachment(array $args)
    {
        $body = $args['body'];

        if (empty($body)) {
            return ['errors' => 'Body is not set or empty'];
        } elseif (!Validator::notEmpty()->validate($body['encodedFile'])) {
            return ['errors' => 'Body encodedFile is empty'];
        } elseif (!Validator::stringType()->notEmpty()->validate($body['format'])) {
            return ['errors' => 'Body format is empty or not a string'];
        } elseif (!Validator::intVal()->notEmpty()->validate($body['resIdMaster'])) {
            return ['errors' => 'Body resIdMaster is empty or not an integer'];
        } elseif (!Validator::stringType()->notEmpty()->validate($body['type'])) {
            return ['errors' => 'Body type is empty or not a string'];
        }

        if (!ResController::hasRightByResId(['resId' => [$body['resIdMaster']], 'userId' => $GLOBALS['id']])) {
            return ['errors' => 'Body resIdMaster is out of perimeter'];
        }

        $attachmentsTypes = AttachmentModel::getAttachmentsTypesByXML();
        if (empty($attachmentsTypes[$body['type']])) {
            return ['errors' => 'Body type does not exist'];
        }

        $control = AttachmentController::controlFileData(['body' => $body]);
        if (!empty($control['errors'])) {
            return ['errors' => $control['errors']];
        }

        $control = AttachmentController::controlOrigin(['body' => $body]);
        if (!empty($control['errors'])) {
            return ['errors' => $control['errors']];
        }

        $control = AttachmentController::controlDates(['body' => $body]);
        if (!empty($control['errors'])) {
            return ['errors' => $control['errors']];
        }

        return true;
    }

    private static function controlFileData(array $args)
    {
        $body = $args['body'];

        if (!empty($body['encodedFile'])) {
            if (!Validator::stringType()->notEmpty()->validate($body['format'])) {
                return ['errors' => 'Body format is empty or not a string'];
            }

            $file     = base64_decode($body['encodedFile']);
            $finfo    = new \finfo(FILEINFO_MIME_TYPE);
            $mimeType = $finfo->buffer($file);
            if (!StoreController::isFileAllowed(['extension' => $body['format'], 'type' => $mimeType])) {
                return ['errors' => "Format with this mimeType is not allowed : {$body['format']} {$mimeType}"];
            }
        }

        return true;
    }

    private static function controlOrigin(array $args)
    {
        $body = $args['body'];

        if (!empty($body['originId'])) {
            if (!Validator::intVal()->notEmpty()->validate($body['originId'])) {
                return ['errors' => 'Body originId is not an integer'];
            }
            $origin = AttachmentModel::getById(['id' => $body['originId'], 'select' => ['res_id_master']]);
            if (empty($origin)) {
                return ['errors' => 'Body originId does not exist'];
            } elseif ($origin['res_id_master'] != $body['resIdMaster']) {
                return ['errors' => 'Body resIdMaster is different from origin'];
            }
        }

        return true;
    }

    private static function controlDates(array $args)
    {
        $body = $args['body'];

        if (!empty($body['validationDate'])) {
            if (!Validator::date()->notEmpty()->validate($body['validationDate'])) {
                return ['errors' => "Body validationDate is not a date"];
            }
        }

        if (!empty($body['effectiveDate'])) {
            if (!Validator::date()->notEmpty()->validate($body['effectiveDate'])) {
                return ['errors' => "Body effectiveDate is not a date"];
            }
        }

        return true;
    }
}
