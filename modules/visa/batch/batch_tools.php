<?php

/*
 *   Copyright 2008-2015 Maarch
 *
 *   This file is part of Maarch Framework.
 *
 *   Maarch Framework is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   Maarch Framework is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with Maarch Framework.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @brief API to manage batchs
 *
 * @file
 * @author Laurent Giovannoni <dev@maarch.org>
 * @date $date$
 * @version $Revision$
 * @ingroup sendmail
 */

/**
 * Execute a sql query
 *
 * @param object $dbConn connection object to the database
 * @param string $queryTxt path of the file to include
 * @param boolean $transaction for rollback if error
 * @return true if ok, exit if ko and rollback if necessary
 */
function Bt_doQuery($dbConn, $queryTxt, $param=array(), $transaction=false)
{
    if (count($param) > 0) {
        $stmt = $dbConn->query($queryTxt, $param);
    } else {
        $stmt = $dbConn->query($queryTxt);
    }

    if (!$stmt) {
        if ($transaction) {
            $GLOBALS['logger']->write('ROLLBACK', 'INFO');
            $dbConn->query('ROLLBACK');
        }
        Bt_exitBatch(
            104, 'SQL Query error:' . $queryTxt
        );
    }
    $GLOBALS['logger']->write('SQL query:' . $queryTxt, 'DEBUG');
    return $stmt;
}

/**
 * Exit the batch with a return code, message in the log and
 * in the database if necessary
 *
 * @param int $returnCode code to exit (if > O error)
 * @param string $message message to the log and the DB
 * @return nothing exit the program
 */
function Bt_exitBatch($returnCode, $message='')
{
    if (file_exists($GLOBALS['lckFile'])) {
        unlink($GLOBALS['lckFile']);
    }
    if ($returnCode > 0) {
        $GLOBALS['totalProcessedResources']--;
        if ($GLOBALS['totalProcessedResources'] == -1) {
            $GLOBALS['totalProcessedResources'] = 0;
        }
        if ($returnCode < 100) {
            if (file_exists($GLOBALS['errorLckFile'])) {
                unlink($GLOBALS['errorLckFile']);
            }
            $semaphore = fopen($GLOBALS['errorLckFile'], "a");
            fwrite($semaphore, '1');
            fclose($semaphore);
        }
        $GLOBALS['logger']->write($message, 'ERROR', $returnCode);
        Bt_logInDataBase($GLOBALS['totalProcessedResources'], 1, $message.' (return code: '. $returnCode.')');
    } elseif ($message <> '') {
        $GLOBALS['logger']->write($message, 'INFO', $returnCode);
        Bt_logInDataBase($GLOBALS['totalProcessedResources'], 0, $message.' (return code: '. $returnCode.')');
    }
    Bt_updateWorkBatch();
    exit($returnCode);
}

/**
* Insert in the database the report of the batch
* @param long $totalProcessed total of resources processed in the batch
* @param long $totalErrors total of errors in the batch
* @param string $info message in db
*/
function Bt_logInDataBase($totalProcessed=0, $totalErrors=0, $info='')
{
    $query = "INSERT INTO history_batch (module_name, batch_id, event_date, "
           . "total_processed, total_errors, info) values(?, ?, CURRENT_TIMESTAMP, ?, ?, ?)";
    $arrayPDO = array($GLOBALS['batchName'], $GLOBALS['wb'], $totalProcessed, $totalErrors, substr(str_replace('\\', '\\\\', str_replace("'", "`", $info)), 0, 999));
    $GLOBALS['db']->query($query, $arrayPDO);
}

/**
 * Get the batch if of the batch
 *
 * @return nothing
 */
function Bt_getWorkBatch()
{
    $req = "SELECT param_value_int FROM parameters WHERE id = ? ";
    $stmt = $GLOBALS['db']->query($req, array($GLOBALS['batchName']."_id"));
    
    while ($reqResult = $stmt->fetchObject()) {
        $GLOBALS['wb'] = $reqResult->param_value_int + 1;
    }
    if ($GLOBALS['wb'] == '') {
        $req = "INSERT INTO parameters(id, param_value_int) VALUES (?, 1)";
        $GLOBALS['db']->query($req, array($GLOBALS['batchName']."_id"));
        $GLOBALS['wb'] = 1;
    }
}

/**
 * Update the database with the new batch id of the batch
 *
 * @return nothing
 */
function Bt_updateWorkBatch()
{
    $req = "UPDATE parameters SET param_value_int = ? WHERE id = ?";
    $GLOBALS['db']->query($req, array($GLOBALS['wb'], $GLOBALS['batchName']."_id"));
}

/**
 * Include the file requested if exists
 *
 * @param string $file path of the file to include
 * @return nothing
 */
function Bt_myInclude($file)
{
    if (file_exists($file)) {
        include_once($file);
    } else {
        throw new IncludeFileError($file);
    }
}

function Bt_createAttachment($aArgs = [])
{
    $dataValue = [];
    array_push($dataValue, ['column' => 'res_id_master',    'value' => $aArgs['res_id_master'],   'type' => 'integer']);
    array_push($dataValue, ['column' => 'title',            'value' => $aArgs['title'],           'type' => 'string']);
    array_push($dataValue, ['column' => 'identifier',       'value' => $aArgs['identifier'],      'type' => 'string']);
    array_push($dataValue, ['column' => 'type_id',          'value' => $aArgs['type_id'],         'type' => 'integer']);
    array_push($dataValue, ['column' => 'dest_contact_id',  'value' => $aArgs['dest_contact_id'], 'type' => 'integer']);
    array_push($dataValue, ['column' => 'dest_address_id',  'value' => $aArgs['dest_address_id'], 'type' => 'integer']);
    array_push($dataValue, ['column' => 'dest_user',        'value' => $aArgs['dest_user'],       'type' => 'string']);
    array_push($dataValue, ['column' => 'typist',           'value' => $aArgs['typist'],          'type' => 'string']);
    array_push($dataValue, ['column' => 'attachment_type',  'value' => 'signed_response',         'type' => 'string']);

    $allDatas = [
        "encodedFile" => $aArgs['encodedFile'],
        "data"        => $dataValue,
        "collId"      => "letterbox_coll",
        "table"       => "res_attachments",
        "fileFormat"  => $aArgs['format'],
        "status"      => 'TRA'
    ];

    $opts = [
        CURLOPT_URL => $GLOBALS['applicationUrl'] . 'rest/res',
        CURLOPT_HTTPHEADER => [
            'accept:application/json',
            'content-type:application/json'
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => 'Authorization: Basic ' . base64_encode($GLOBALS['userWS']. ':' .$GLOBALS['passwordWS']),
        CURLOPT_POSTFIELDS => json_encode($allDatas),
        CURLOPT_POST => true
    ];

    $curl = curl_init();
    curl_setopt_array($curl, $opts);
    $rawResponse = curl_exec($curl);

    return json_decode($rawResponse, true);
}

function Bt_refusedSignedMail($aArgs = [])
{
    $GLOBALS['db']->query("UPDATE ".$aArgs['tableAttachment']." SET status = 'A_TRA' WHERE res_id = ?", [$aArgs['resIdAttachment']]);
    $GLOBALS['db']->query("UPDATE res_letterbox SET status = '" . $aArgs['refusedStatus'] . "' WHERE res_id = ?", [$aArgs['resIdMaster']]);
    if (!empty($aArgs['noteContent'])) {
        $GLOBALS['db']->query("INSERT INTO notes (identifier, tablename, user_id, date_note, note_text, coll_id) VALUES (?, 'res_letterbox', 'superadmin', CURRENT_TIMESTAMP, ?, 'letterbox_coll')",
        [$aArgs['resIdMaster'], $aArgs['noteContent']]);
    }
}
