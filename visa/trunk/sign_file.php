<?php
require_once 'core/class/class_core_tools.php';
require_once 'core/class/class_db.php';
require_once 'core/core_tables.php';
require_once 'modules/attachments/attachments_tables.php';
require_once 'core/class/docservers_controler.php';
require_once 'core/docservers_tools.php';
require_once 'core/class/class_resource.php';

function writeLogIndex($EventInfo)
{
    $logFileOpened = fopen($_SESSION['config']['corepath'] . '/modules/visa/log/signFile_' . date('Y') . '_' . date('m'). '_' . date('d') . '.log', 'a');
    fwrite($logFileOpened, '[' . date('d') . '/' . date('m') . '/' . date('Y')
        . ' ' . date('H') . ':' . date('i') . ':' . date('s') . '] ' . $EventInfo
        . "\r\n"
    );
    fclose($logFileOpened);
}

$core_tools = new core_tools();
$core_tools->test_user();
$core_tools->load_lang();

if (!isset($_SESSION['user']['pathToSignature']) ||$_SESSION['user']['pathToSignature'] == '') {
    $_SESSION['error'] = _IMG_SIGN_MISSING;
}

if (!empty($_REQUEST['id']) && !empty($_REQUEST['collId'])){
	$objectId = $_REQUEST['id'];
	$tableName = 'res_view_attachments';
	$db = new Database();
    if (isset($_REQUEST['isVersion'])) $stmt = $db->query("select res_id_version, format, res_id_master, title, identifier, type_id from ".$tableName." where attachment_type = ? and res_id_version = ?", array('response_project', $objectId));
    else if (isset($_REQUEST['isOutgoing'])) $stmt = $db->query("select res_id, format, res_id_master, title, identifier, type_id from ".$tableName." where attachment_type = ? and res_id = ?", array('outgoing_mail', $objectId));
    else $stmt = $db->query("select res_id, format, res_id_master, title, identifier, type_id from ".$tableName." where attachment_type = ? and res_id = ?", array('response_project', $objectId));
	
    if ($stmt->rowCount() < 1) {
		$_SESSION['error'] = __FILE . ' ' . _UNKNOWN;
    } 
	else {
		$line = $stmt->fetchObject();
		$_SESSION['visa']['last_resId_signed']['res_id'] = $line->res_id_master;
		$_SESSION['visa']['last_resId_signed']['title'] = $line->title;
		$_SESSION['visa']['last_resId_signed']['identifier'] = $line->identifier;
		$_SESSION['visa']['last_resId_signed']['type_id'] = $line->type_id;
		
		include 'modules/visa/retrieve_attachment_from_cm.php';
		
		
		//java -jar C:\Temp\SigniText.jar C:\Temp\blowagie\Modele.pdf C:\Temp\blowagie\extracted\images\Modele-1.jpg 140 114 C:\Temp\blowagie\images
		if (!file_exists($fileOnDs)){
			echo "{status:1, error : 'Fichier $fileOnDs non present'}";
			exit;
		}
		$cmd = "java -jar '".$_SESSION['config']['corepath']."modules/visa/dist/SignPdf.jar' '".$fileOnDs."' '".$_SESSION['user']['pathToSignature']."' ".$_SESSION['modules_loaded']['visa']['width_blocsign']." ".$_SESSION['modules_loaded']['visa']['height_blocsign']." '".$_SESSION['config']['tmppath']."'";
		exec($cmd);
		
		$tmpFileName = pathinfo($fileOnDs, PATHINFO_BASENAME);
		$fileExtension = "pdf";
		
		include 'modules/visa/save_attach_res_from_cm.php';
		
		echo "{status:0, new_id : $id}";
		exit;
	}
} else {
	$_SESSION['error'] = _ATTACHMENT_ID_AND_COLL_ID_REQUIRED;
}
exit;

?>