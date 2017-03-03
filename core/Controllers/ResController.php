<?php

/**
* Copyright Maarch since 2008 under licence GPLv3.
* See LICENCE.txt file at the root folder for more details.
* This file is part of Maarch software.
*
*/

/**
* @brief Resource Controller
* @author dev@maarch.org
* @ingroup core
*/

namespace Core\Controllers;

use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;
use Respect\Validation\Validator;
use Core\Models\UserModel;
use Entities\Models\EntitiesModel;
use Core\Controllers\DocserverController;

class ResController
{

    /**
     * Store resource on database.
     * @param  $encodedFile  string 
     * @param  $data array
     * @param  $collId  string 
     * @param  $table  string 
     * @param  $fileFormat  string  
     * @param  $status  string  
     * @return res_id
     */
    public function storeResource($aArgs)
    {
        if (empty($aArgs['encodedFile'])) {

            return ['errors' => 'encodedFile ' . _EMPTY];
        }

        if (empty($aArgs['data'])) {

            return ['errors' => 'data ' . _EMPTY];
        }

        if (empty($aArgs['collId'])) {

            return ['errors' => 'collId ' . _EMPTY];
        }

        if (empty($aArgs['table'])) {

            return ['errors' => 'table ' . _EMPTY];
        }

        if (empty($aArgs['fileFormat'])) {

            return ['errors' => 'fileFormat ' . _EMPTY];
        }

        if (empty($aArgs['status'])) {

            return ['errors' => 'status ' . _EMPTY];
        }
        $encodedFile = $aArgs['encodedFile'];
        $data = $aArgs['data'];
        $collId = $aArgs['collId'];
        $table = $aArgs['table'];
        $fileFormat = $aArgs['fileFormat'];
        $status = $aArgs['status'];

        try {
            $count = count($data);
            for ($i=0;$i<$count;$i++) {
                $data[$i]['column'] = strtolower($data[$i]['column']);
            }
            
            $returnCode = 0;
            //copy sended file on tmp 
            $fileContent = base64_decode($encodedFile);
            $random = rand();
            $fileName = 'tmp_file_' . $random . '.' . $fileFormat;
            $Fnm = $_SESSION['config']['tmppath'] . $fileName;
            $inF = fopen($Fnm,"w");
            fwrite($inF, $fileContent);
            fclose($inF);

            //store resource on docserver
            $ds = new DocserverController();
            $aArgs = [
                'collId' => $collId,
                'fileInfos' => 
                    [
                        'tmpDir'        => $_SESSION['config']['tmppath'],
                        'size'          => filesize($Fnm),
                        'format'        => $fileFormat,
                        'tmpFileName'   => $fileName,
                    ]
            ];
            
            $storeResult = array();
            $storeResult = $ds->storeResourceOnDocserver($aArgs);
            
            if (!empty($storeResult['errors'])) {
                
                return ['errors' => $storeResult['errors']];
            }

            //store resource metadata in database
            $aArgs = [
                'data'        => $data,
                'docserverId' => $storeResult['docserver_id'],
                'status'      => $status,
                'fileFormat'  => $fileFormat,
            ];
            
            $data = $this->prepareStorage($aArgs);
            
            unlink($Fnm);
            
            require_once 'core/class/class_resource.php';
            $resource = new \resource();
            $resId = $resource->load_into_db(
                $table, 
                $storeResult['destination_dir'],
                $storeResult['file_destination_name'],
                $storeResult['path_template'],
                $storeResult['docserver_id'], 
                $data,
                $_SESSION['config']['databasetype'],
                true
            );

            if (!is_numeric($resId)) {

                return ['errors' => 'Pb with SQL insertion : ' .$resId];
            }

            if ($resId == 0) {
                $resId = '';
            }

            return [$resId];
            
        } catch (Exception $e) {

            return ['errors' => 'unknown error' . $e->getMessage()];
        }
    }

    /**
     * Prepares storage on database.
     * @param  $data array
     * @param  $docserverId string
     * @param  $status string
     * @param  $fileFormat string
     * @return $data
     */
    public function prepareStorage($aArgs)
    {
        if (empty($aArgs['data'])) {

            return ['errors' => 'data ' . _EMPTY];
        }

        if (empty($aArgs['docserverId'])) {

            return ['errors' => 'docserverId ' . _EMPTY];
        }

        if (empty($aArgs['status'])) {

            return ['errors' => 'status ' . _EMPTY];
        }

        if (empty($aArgs['fileFormat'])) {

            return ['errors' => 'fileFormat ' . _EMPTY];
        }

        $statusFound = false;
        $typistFound = false;
        $typeIdFound = false;
        $toAddressFound = false;
        $userPrimaryEntity = false;
        $destinationFound = false;
        $initiatorFound = false;
        
        $data = $aArgs['data'];
        $docserverId = $aArgs['docserverId'];
        $status = $aArgs['status'];
        $fileFormat = $aArgs['fileFormat'];

        $userModel = new UserModel();
        $entityModel = new \Entities\Models\EntitiesModel();

        $countD = count($data);
        for ($i=0;$i<$countD;$i++) {

            if (
                strtoupper($data[$i]['type']) == 'INTEGER' || 
                strtoupper($data[$i]['type']) == 'FLOAT'
            ) {
                if ($data[$i]['value'] == '') {
                    $data[$i]['value'] = '0';
                }
            }

            if (strtoupper($data[$i]['type']) == 'STRING') {
               $data[$i]['value'] = $data[$i]['value'];
               $data[$i]['value'] = str_replace(";", "", $data[$i]['value']);
               $data[$i]['value'] = str_replace("--", "", $data[$i]['value']);
            }

            if (strtoupper($data[$i]['column']) == strtoupper('status')) {
                $statusFound = true;
            }

            if (strtoupper($data[$i]['column']) == strtoupper('typist')) {
                $typistFound = true;
            }

            if (strtoupper($data[$i]['column']) == strtoupper('type_id')) {
                $typeIdFound = true;
            }

            if (strtoupper($data[$i]['column']) == strtoupper('custom_t10')) {
                $mail = array();
                $theString = str_replace(">", "", $data[$i]['value']);
                $mail = explode("<", $theString);
                $user = $userModel->getByEmail(['mail' => $mail[count($mail) -1]]);
                $userIdFound = $user[0]['user_id'];
                if (!empty($userIdFound)) {
                    $toAddressFound = true;
                    $destUser = $userIdFound;
                    $entity = $entityModel->getByUserId(['user_id' => $destUser]);
                    if (!empty($entity[0]['entity_id'])) {
                        $userEntity = $entity[0]['entity_id'];
                        $userPrimaryEntity = true;
                    }
                } else {
                    $entity = $entityModel->getByEmail(['email' => $mail[count($mail) -1]]);
                    if (!empty($entity[0]['entity_id'])) {
                        $userPrimaryEntity = true;
                    }
                }
            }
        }

        if (!$typistFound && !$toAddressFound) {
            array_push(
                $data,
                array(
                    'column' => 'typist',
                    'value' => 'auto',
                    'type' => 'string',
                )
            );
        }

        if (!$typeIdFound) {
            array_push(
                $data,
                array(
                    'column' => 'type_id',
                    'value' => '10',
                    'type' => 'string',
                )
            );
        }
        
        if (!$statusFound) {
            array_push(
                $data,
                array(
                    'column' => 'status',
                    'value' => $status,
                    'type' => 'string',
                )
            );
        }
        
        if ($toAddressFound) {
            array_push(
                $data,
                array(
                    'column' => 'dest_user',
                    'value' => $destUser,
                    'type' => 'string',
                )
            );
            array_push(
                $data,
                array(
                    'column' => 'typist',
                    'value' => $destUser,
                    'type' => 'string',
                )
            );
        }
        
        if ($userPrimaryEntity) {
            for ($i=0;$i<count($data);$i++) {
                if (strtoupper($data[$i]['column']) == strtoupper('destination')) {
                    if ($data[$i]['value'] == "") {
                        $data[$i]['value'] = $userEntity;
                    }
                    $destinationFound = true;
                    break;
                }
            }
            if (!$destinationFound) {
                array_push(
                    $data,
                    array(
                        'column' => 'destination',
                        'value' => $userEntity,
                        'type' => 'string',
                    )
                );
            }
        }
        
        if ($userPrimaryEntity) {
            for ($i=0;$i<count($data);$i++) {
                if (strtoupper($data[$i]['column']) == strtoupper('initiator')) {
                    if ($data[$i]['value'] == "") {
                        $data[$i]['value'] = $userEntity;
                    }
                    $initiatorFound = true;
                    break;
                }
            }
            if (!$initiatorFound) {
                array_push(
                    $data,
                    array(
                        'column' => 'initiator',
                        'value' => $userEntity,
                        'type' => 'string',
                    )
                );
            }
        }    
        array_push(
            $data,
            array(
                'column' => 'format',
                'value' => $fileFormat,
                'type' => 'string',
            )
        );
        array_push(
            $data,
            array(
                'column' => 'offset_doc',
                'value' => '',
                'type' => 'string',
            )
        );
        array_push(
            $data,
            array(
                'column' => 'logical_adr',
                'value' => '',
                'type' => 'string',
            )
        );
        array_push(
            $data,
            array(
                'column' => 'docserver_id',
                'value' => $docserverId,
                'type' => 'string',
            )
        );

        return $data;
    }
}