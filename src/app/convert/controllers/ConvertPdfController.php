<?php

/**
 * Copyright Maarch since 2008 under licence GPLv3.
 * See LICENCE.txt file at the root folder for more details.
 * This file is part of Maarch software.
 *
 */

/**
 * @brief Convert PDF Controller
 * @author dev@maarch.org
 */

namespace Convert\controllers;

use Attachment\models\AttachmentModel;
use Convert\models\AdrModel;
use Docserver\controllers\DocserverController;
use Docserver\models\DocserverModel;
use Resource\controllers\StoreController;
use Resource\models\ResModel;
use Respect\Validation\Validator;
use Slim\Http\Request;
use Slim\Http\Response;
use SrcCore\models\CoreConfigModel;
use SrcCore\models\ValidatorModel;

class ConvertPdfController
{
    public static function tmpConvert(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['fullFilename']);

        if (!file_exists($aArgs['fullFilename'])) {
            return ['errors' => '[ConvertPdf] Document '.$aArgs['fullFilename'].' does not exist'];
        }

        $docInfo = pathinfo($aArgs['fullFilename']);

        $tmpPath = CoreConfigModel::getTmpPath();

        ConvertPdfController::addBom($aArgs['fullFilename']);
        $command = "timeout 30 unoconv -f pdf " . escapeshellarg($aArgs['fullFilename']);

        exec('export HOME=' . $tmpPath . ' && '.$command.' 2>&1', $output, $return);

        if (!file_exists($tmpPath.$docInfo["filename"].'.pdf')) {
            return ['errors' => '[ConvertPdf]  Conversion failed ! '. implode(" ", $output)];
        } else {
            return ['fullFilename' => $tmpPath.$docInfo["filename"].'.pdf'];
        }
    }

    public static function convert(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['collId', 'resId']);
        ValidatorModel::stringType($aArgs, ['collId']);
        ValidatorModel::intVal($aArgs, ['resId']);

        if ($aArgs['collId'] == 'letterbox_coll') {
            $resource = ResModel::getById(['resId' => $aArgs['resId'], 'select' => ['docserver_id', 'path', 'filename', 'format']]);
        } else {
            $resource = AttachmentModel::getById(['id' => $aArgs['resId'], 'select' => ['docserver_id', 'path', 'filename', 'format']]);
        }

        if (empty($resource)) {
            return ['errors' => '[ConvertPdf] Resource does not exist'];
        }

        $docserver = DocserverModel::getByDocserverId(['docserverId' => $resource['docserver_id'], 'select' => ['path_template']]);
        if (empty($docserver['path_template']) || !file_exists($docserver['path_template'])) {
            return ['errors' => '[ConvertPdf] Docserver does not exist'];
        }

        $pathToDocument = $docserver['path_template'] . str_replace('#', DIRECTORY_SEPARATOR, $resource['path']) . $resource['filename'];

        if (!file_exists($pathToDocument)) {
            return ['errors' => '[ConvertPdf] Document does not exist on docserver'];
        }

        $docInfo = pathinfo($pathToDocument);
        if (empty($docInfo['extension'])) {
            $docInfo['extension'] = $resource['format'];
        }

        $canConvert = ConvertPdfController::canConvert(['extension' => $docInfo['extension']]);
        if (!$canConvert) {
            return ['docserver_id' => $resource['docserver_id'], 'path' => $resource['path'], 'filename' => $resource['filename']];
        }

        $tmpPath = CoreConfigModel::getTmpPath();
        $fileNameOnTmp = rand() . $docInfo["filename"];

        copy($pathToDocument, $tmpPath.$fileNameOnTmp.'.'.$docInfo["extension"]);

        if (strtolower($docInfo["extension"]) != 'pdf') {
            ConvertPdfController::addBom($tmpPath.$fileNameOnTmp.'.'.$docInfo["extension"]);
            $command = "timeout 30 unoconv -f pdf " . escapeshellarg($tmpPath.$fileNameOnTmp.'.'.$docInfo["extension"]);
            exec('export HOME=' . $tmpPath . ' && '.$command, $output, $return);

            if (!file_exists($tmpPath.$fileNameOnTmp.'.pdf')) {
                return ['errors' => '[ConvertPdf]  Conversion failed ! '. implode(" ", $output)];
            }
        }

        $resource = file_get_contents("{$tmpPath}{$fileNameOnTmp}.pdf");
        $storeResult = DocserverController::storeResourceOnDocServer([
            'collId'            => $aArgs['collId'],
            'docserverTypeId'   => 'CONVERT',
            'encodedResource'   => base64_encode($resource),
            'format'            => 'pdf'
        ]);

        if (!empty($storeResult['errors'])) {
            return ['errors' => "[ConvertPdf] {$storeResult['errors']}"];
        }

        if ($aArgs['collId'] == 'letterbox_coll') {
            AdrModel::createDocumentAdr([
                'resId'         => $aArgs['resId'],
                'type'          => 'PDF',
                'docserverId'   => $storeResult['docserver_id'],
                'path'          => $storeResult['destination_dir'],
                'filename'      => $storeResult['file_destination_name'],
                'fingerprint'   => $storeResult['fingerPrint']
            ]);
        } else {
            AdrModel::createAttachAdr([
                'resId'         => $aArgs['resId'],
                'isVersion'     => $aArgs['isVersion'],
                'type'          => 'PDF',
                'docserverId'   => $storeResult['docserver_id'],
                'path'          => $storeResult['destination_dir'],
                'filename'      => $storeResult['file_destination_name'],
                'fingerprint'   => $storeResult['fingerPrint']
            ]);
        }

        return ['docserver_id' => $storeResult['docserver_id'], 'path' => $storeResult['destination_dir'], 'filename' => $storeResult['file_destination_name']];
    }

    public static function convertFromEncodedResource(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['encodedResource']);
        ValidatorModel::stringType($aArgs, ['encodedResource', 'context']);

        $tmpPath = CoreConfigModel::getTmpPath();
        $tmpFilename = 'converting' . rand() . '_' . rand();

        file_put_contents($tmpPath . $tmpFilename, base64_decode($aArgs['encodedResource']));

        ConvertPdfController::addBom($tmpPath.$tmpFilename);
        $command = "timeout 30 unoconv -f pdf {$tmpPath}{$tmpFilename}";
        exec('export HOME=' . $tmpPath . ' && '.$command, $output, $return);

        if (!file_exists($tmpPath.$tmpFilename.'.pdf')) {
            return ['errors' => '[ConvertPdf]  Conversion failed ! '. implode(" ", $output)];
        }

        unlink("{$tmpPath}{$tmpFilename}");

        $resource = file_get_contents("{$tmpPath}{$tmpFilename}.pdf");

        $aReturn = [];

        if (!empty($aArgs['context']) && $aArgs['context'] == 'scan') {
            $aReturn["tmpFilename"] = $tmpFilename.'.pdf';
        } else {
            $aReturn["encodedResource"] = base64_encode($resource);
            unlink("{$tmpPath}{$tmpFilename}.pdf");
        }
        return $aReturn;
    }

    public static function getConvertedPdfById(array $aArgs)
    {
        ValidatorModel::notEmpty($aArgs, ['resId', 'collId']);
        ValidatorModel::intVal($aArgs, ['resId']);

        $convertedDocument = AdrModel::getConvertedDocumentById([
            'select'    => ['docserver_id','path', 'filename', 'fingerprint'],
            'resId'     => $aArgs['resId'],
            'collId'    => $aArgs['collId'],
            'type'      => 'PDF'
        ]);
        
        if (empty($convertedDocument)) {
            $convertedDocument = ConvertPdfController::convert([
                'resId'     => $aArgs['resId'],
                'collId'    => $aArgs['collId']
            ]);
        }

        return $convertedDocument;
    }

    private static function canConvert(array $args)
    {
        ValidatorModel::notEmpty($args, ['extension']);
        ValidatorModel::stringType($args, ['extension']);

        $canConvert = false;
        $loadedXml = CoreConfigModel::getXmlLoaded(['path' => 'apps/maarch_entreprise/xml/extensions.xml']);
        if ($loadedXml) {
            foreach ($loadedXml->FORMAT as $value) {
                if (strtoupper((string)$value->name) == strtoupper($args['extension']) && (string)$value->canConvert == 'true') {
                    $canConvert = true;
                }
            }
        }

        return $canConvert;
    }

    public static function addBom($filePath)
    {
        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        if (strtolower($extension) == strtolower('txt')) {
            $content = file_get_contents($filePath);
            $bom = chr(239) . chr(187) . chr(191); # use BOM to be on safe side
            file_put_contents($filePath, $bom.$content);
        }
    }

    public function convertedFile(Request $request, Response $response)
    {
        $body = $request->getParsedBody();

        if (!Validator::notEmpty()->validate($body['name'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Body name is empty']);
        }
        if (!Validator::notEmpty()->validate($body['base64'])) {
            return $response->withStatus(400)->withJson(['errors' => 'Body base64 is empty']);
        }
        
        $file     = base64_decode($body['base64']);
        $finfo    = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->buffer($file);
        $ext      = substr($body['name'], strrpos($body['name'], '.') + 1);
        $size     = strlen($file);

        if (strtolower($ext) == 'pdf' && strtolower($mimeType) == 'application/pdf') {
            if ($body['context'] == 'scan') {
                $tmpPath = CoreConfigModel::getTmpPath();
                $tmpFilename = 'scan_converting' . rand() . '.pdf';
        
                file_put_contents($tmpPath . $tmpFilename, $file);
                $return['tmpFilename'] = $tmpFilename;
            } else {
                $return['encodedResource'] = $body['base64'];
            }
            return $response->withJson($return);
        } else {
            $fileAccepted  = StoreController::isFileAllowed(['extension' => $ext, 'type' => $mimeType]);
            $maxFilesizeMo = ini_get('upload_max_filesize');
            $uploadMaxFilesize = StoreController::getBytesSizeFromPhpIni(['size' => $maxFilesizeMo]);
            $canConvert    = ConvertPdfController::canConvert(['extension' => $ext]);
    
            if (!$fileAccepted) {
                return $response->withStatus(400)->withJson(['errors' => 'File type not allowed. Extension : ' . $ext . '. Mime Type : ' . $mimeType . '.']);
            } elseif ($size > $uploadMaxFilesize) {
                $maximumSizeLabel = round($maxFilesizeMo / 1048576, 3) . ' Mo';
                return $response->withStatus(400)->withJson(['errors' => 'File maximum size is exceeded ('.$maximumSizeLabel.')']);
            } elseif (!$canConvert) {
                return $response->withStatus(400)->withJson(['errors' => 'File accepted but can not be converted in pdf']);
            }
    
            $convertion = ConvertPdfController::convertFromEncodedResource(['encodedResource' => $body['base64'], 'context' => $body['context']]);
            if (empty($convertion['errors'])) {
                return $response->withJson($convertion);
            } else {
                return $response->withStatus(400)->withJson($convertion);
            }
        }
    }

    public function getConvertedFileByFilename(Request $request, Response $response, array $args)
    {
        $tmpPath = CoreConfigModel::getTmpPath();

        if (!file_exists("{$tmpPath}{$args['filename']}")) {
            return $response->withStatus(400)->withJson(['errors' => 'File does not exist']);
        }

        $resource = file_get_contents("{$tmpPath}{$args['filename']}");
        $extension = pathinfo("{$tmpPath}{$args['filename']}", PATHINFO_EXTENSION);
        $mimeType = mime_content_type("{$tmpPath}{$args['filename']}");
        
        unlink("{$tmpPath}{$args['filename']}");
        $encodedResource = base64_encode($resource);

        $encodedFiles = ['encodedResource' => $encodedResource];

        $encodedFiles['type'] = $mimeType;
        $encodedFiles['extension'] = $extension;
        

        $queryParams = $request->getQueryParams();
        if (!empty($queryParams['convert'])) {
            if (ConvertPdfController::canConvert(['extension' => $extension])) {
                $convertion = ConvertPdfController::convertFromEncodedResource(['encodedResource' => $encodedResource]);
                if (!empty($convertion['errors'])) {
                    $encodedFiles['convertedResourceErrors'] = $convertion['errors'];
                } else {
                    $encodedFiles['encodedConvertedResource'] = $convertion['encodedResource'];
                }
            }
        }

        return $response->withJson($encodedFiles);
    }
}
