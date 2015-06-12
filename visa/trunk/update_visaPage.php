<?php
/* FONCTIONS */

function get_rep_path($res_id, $coll_id)
{
    require_once("core".DIRECTORY_SEPARATOR."class".DIRECTORY_SEPARATOR."class_security.php");
    require_once("core".DIRECTORY_SEPARATOR."class".DIRECTORY_SEPARATOR."docservers_controler.php");
	$docserverControler = new docservers_controler();
    $sec =new security();
    $view = $sec->retrieve_view_from_coll_id($coll_id);
    if(empty($view))
    {
        $view = $sec->retrieve_table_from_coll($coll_id);
    }
    $db = new dbquery();
    $db->connect();

    //$db->query("select docserver_id, path, filename from ".$view." where res_id = ".$res_id);
    $db->query("select docserver_id from res_view_attachments where res_id_master = " . $res_id . " order by res_id desc");
    while ($res = $db->fetch_object()) {
        $docserver_id = $res->docserver_id;
        break;
    }

    $db->query("select path_template from ".$_SESSION['tablename']['docservers']." where docserver_id = '".$docserver_id."'");
    $res = $db->fetch_object();
    $docserver_path = $res->path_template;
	$db->query("select filename, path,title,res_id,res_id_version,attachment_type  from res_view_attachments where res_id_master = " . $res_id . " AND status <> 'OBS' AND status <> 'SIGN' AND status <> 'DEL' and attachment_type IN ('response_project','signed_response') order by creation_date asc");
	$array_reponses = array();
	$cpt_rep = 0;
	while ($res2 = $db->fetch_object()){
		$filename=$res2->filename;
		$path = preg_replace('/#/', DIRECTORY_SEPARATOR, $res2->path);
		$filename_pdf = str_replace(pathinfo($filename, PATHINFO_EXTENSION), "pdf",$filename);
		if (file_exists($docserver_path.$path.$filename_pdf)){
			$array_reponses[$cpt_rep]['path'] = $docserver_path.$path.$filename_pdf;
			$array_reponses[$cpt_rep]['title'] = $res2->title;
			$array_reponses[$cpt_rep]['attachment_type'] = $res2->attachment_type;
			if ($res2->res_id_version == 0){
				$array_reponses[$cpt_rep]['res_id'] = $res2->res_id;
				$array_reponses[$cpt_rep]['is_version'] = 0;
			}
			else{
				$array_reponses[$cpt_rep]['res_id'] = $res2->res_id_version;
				$array_reponses[$cpt_rep]['is_version'] = 1;
			}
			$cpt_rep++;
		}
	}
    return $array_reponses;
}

/*************/

$res_id = $_REQUEST['res_id'];
$coll_id = $_REQUEST['coll_id'];

require_once "modules" . DIRECTORY_SEPARATOR . "visa" . DIRECTORY_SEPARATOR
			. "class" . DIRECTORY_SEPARATOR
			. "class_modules_tools.php";
include('apps'.DIRECTORY_SEPARATOR.$_SESSION['config']['app_id'].DIRECTORY_SEPARATOR.'definition_mail_categories.php');

$core =new core_tools();

$data = get_general_data($coll_id, $res_id, 'minimal');
			
/* Partie centrale */

// AVANCEMENT
$avancement_html = '';

$avancement_html .= '<h2>'. _WF .'</h2>';
$avancement_html .= '<iframe src="' . $_SESSION['config']['businessappurl'].'index.php?display=true&dir=indexing_searching&page=document_workflow_history&id='. $res_id .'&coll_id='. $coll_id.'&load&size=full&small=true" name="workflow_history_document" width="100%" height="620px" align="left" scrolling="yes" frameborder="0" id="workflow_history_document"></iframe>';
$avancement_html .= '<br/>';
$avancement_html .= '<br/>';

$avancement_html .= '<span style="cursor: pointer;" onmouseover="this.style.cursor=\\\'pointer\\\';" onclick="new Effect.toggle(\\\'history_document\\\', \\\'blind\\\', {delay:0.2});whatIsTheDivStatus(\\\'history_document\\\', \\\'divStatus_all_history_div\\\');return false;">';
$avancement_html .= '<span id="divStatus_all_history_div" style="color:#1C99C5;"><<</span>';
$avancement_html .= '<b>&nbsp;'. _ALL_HISTORY .'</b>';
$avancement_html .= '</span>';

$avancement_html .= '<iframe src="' . $_SESSION['config']['businessappurl'].'index.php?display=true&dir=indexing_searching&page=document_history&id='. $res_id .'&coll_id='. $coll_id.'&load&size=full&small=true" name="history_document" width="100%" height="620px;" align="left" scrolling="yes" frameborder="0" id="history_document" style="display:none;"></iframe>';

//CIRCUIT 
$circuit_html = '';
$circuit_html .= '<h2>Circuit de visa</h2>';
	
$modifVisaWorkflow = false;
if ($core->test_service('config_visa_workflow', 'visa', false)) {
	$modifVisaWorkflow = true;
}
$visa = new visa();

$circuit_html .= '<div class="error" id="divError" name="divError"></div>';
$circuit_html .= '<div style="text-align:center;">';
$circuit_html .= $visa->getList($res_id, $coll_id, $modifVisaWorkflow, 'VISA_CIRCUIT', true);
			
$circuit_html .= '</div><br>';
/* Historique diffusion visa */
$circuit_html .= '<br/>'; 
	$circuit_html .= '<br/>';                
	$circuit_html .= '<span class="diff_list_visa_history" style="width: 90%; cursor: pointer;" onmouseover="this.style.cursor=\\\'pointer\\\';" onclick="new Effect.toggle(\\\'diff_list_visa_history_div\\\', \\\'blind\\\', {delay:0.2});whatIsTheDivStatus(\\\'diff_list_visa_history_div\\\', \\\'divStatus_diff_list_visa_history_div\\\');return false;">';
		$circuit_html .= '<span id="divStatus_diff_list_visa_history_div" style="color:#1C99C5;"><<</span>';
		$circuit_html .= '<b>&nbsp;<small>Historique du circuit de visa</small></b>';
	$circuit_html .= '</span>';

	$circuit_html .= '<div id="diff_list_visa_history_div" style="display:none">';

		$s_id = $res_id;
		$return_mode = true;
		$diffListType = 'VISA_CIRCUIT';
		require_once('modules/entities/difflist_visa_history_display.php');
					
$circuit_html .= '</div>';
	
//NOTES	
if ($core->is_module_loaded('notes')){
	require_once "modules" . DIRECTORY_SEPARATOR . "notes" . DIRECTORY_SEPARATOR
						. "class" . DIRECTORY_SEPARATOR
						. "class_modules_tools.php";
	$notes_tools    = new notes();
					
	//Count notes
	$nbr_notes = $notes_tools->countUserNotes($res_id, $coll_id);
	if ($nbr_notes > 0 ) $nbr_notes = ' ('.$nbr_notes.')';  else $nbr_notes = '';
	//Notes iframe
	$notes_html_dt =  _NOTES.$nbr_notes;
	$notes_html_dd = '<h2>'. _NOTES .'</h2><iframe name="list_notes_doc" id="list_notes_doc" src="'. $_SESSION['config']['businessappurl'].'index.php?display=true&module=notes&page=notes&identifier='. $res_id .'&origin=document&coll_id='.$coll_id.'&load&size=full" frameborder="0" scrolling="no" width="99%" height="570px"></iframe> ';	
}

/* Partie droite */
$right_html = '';
$tab_path_rep_file = get_rep_path($res_id, $coll_id);
	for ($i=0; $i<count($tab_path_rep_file);$i++){
		$num_rep = $i+1;
		if (strlen($tab_path_rep_file[$i]['title']) > 20) $titleRep = substr($tab_path_rep_file[$i]['title'],0,20).'...';
		else $titleRep = $tab_path_rep_file[$i]['title'];
		$titleRep = str_replace("'", "\\'",$titleRep);
		$right_html .= '<dt id="ans_'.$num_rep.'" onclick="updateFunctionModifRep(\\\''.$tab_path_rep_file[$i]['res_id'].'\\\', '.$num_rep.', '.$tab_path_rep_file[$i]['is_version'].');">'.$titleRep.'</dt><dd>';
		$right_html .= '<iframe src="'.$_SESSION['config']['businessappurl'].'index.php?display=true&module=visa&page=view_pdf_attachement&res_id_master='.$res_id.'&id='.$tab_path_rep_file[$i]['res_id'].'" name="viewframevalidRep'.$num_rep.'" id="viewframevalidRep'.$num_rep.'"  scrolling="auto" frameborder="0" style="width:100%;height:100%;" ></iframe>';
		 $right_html .= '</dd>';
	}
	
		$countAttachments = "select res_id from res_view_attachments where status NOT IN ('DEL','OBS') and res_id_master = " . $res_id . " and coll_id = '" . $coll_id . "'";
		$dbAttach = new dbquery();
		$dbAttach->query($countAttachments);
		if ($dbAttach->nb_result() > 0) {
			$nb_attach = ' (' . ($dbAttach->nb_result()). ')';
		}
	
		$right_html .= '<dt id="onglet_pj">'. _ATTACHED_DOC .$nb_attach.'</dt><dd id="page_pj">';
		
		if ($core_tools->is_module_loaded('attachments')) {
        require 'modules/templates/class/templates_controler.php';
        $templatesControler = new templates_controler();
        $templates = array();
        $templates = $templatesControler->getAllTemplatesForProcess($curdest);
        $_SESSION['destination_entity'] = $curdest;
        //var_dump($templates);
        $right_html .= '<div id="list_answers_div" onmouseover="this.style.cursor=\\\'pointer\\\';" style="width:920px;">';
            $right_html .= '<div class="block" style="margin-top:-2px;">';
                $right_html .= '<div id="processframe" name="processframe">';
                    $right_html .= '<center><h2>' . _PJ . ', ' . _ATTACHEMENTS . '</h2></center>';
                    $req = new request;
                    $req->connect();
                    $req->query("select res_id from ".$_SESSION['tablename']['attach_res_attachments']
                        . " where (status = 'A_TRA' or status = 'TRA' or status = 'SIGN') and res_id_master = " . $res_id . " and coll_id = '" . $coll_id . "'");
                    //$req->show();
                    $nb_attach = 0;
                    if ($req->nb_result() > 0) {
                        $nb_attach = $req->nb_result();
                    }
                    $right_html .= '<div class="ref-unit">';
                    $right_html .= '<center>';
                    if ($core_tools->is_module_loaded('templates')) {
                        $right_html .= '<input type="button" name="attach" id="attach" class="button" value="'
                            . _CREATE_PJ
                            .'" onclick="showAttachmentsForm(\\\'' . $_SESSION['config']['businessappurl']
                            . 'index.php?display=true&module=attachments&page=attachments_content\\\')" />';
                    }
                    $right_html .= '</center><iframe name="list_attach" id="list_attach" src="'
                    . $_SESSION['config']['businessappurl']
                    . 'index.php?display=true&module=attachments&page=frame_list_attachments&load&resId='.$res_id.'" '
                    . 'frameborder="0" width="900px" scrolling="yes" height="600px"></iframe>';
                    $right_html .= '</div>';
                $right_html .= '</div>';
            $right_html .= '</div>';
            $right_html .= '<hr />';
        $right_html .= '</div>';
    }
	
	
		$right_html .= '</dd>';
					
		if ( $core->is_module_loaded('content_management') && $data['category_id']['value'] == 'outgoing') {
        $versionTable = $sec->retrieve_version_table_from_coll_id(
            $coll_id
        );
        $selectVersions = "select res_id from "
            . $versionTable . " where res_id_master = "
            . $res_id . " and status <> 'DEL' order by res_id desc";
        $dbVersions = new dbquery();
        $dbVersions->connect();
        $dbVersions->query($selectVersions);
        $nb_versions_for_title = $dbVersions->nb_result();
        $lineLastVersion = $dbVersions->fetch_object();
        $lastVersion = $lineLastVersion->res_id;
        if ($lastVersion <> '') {
            $objectId = $lastVersion;
            $objectTable = $versionTable;
        } else {
            $objectTable = $sec->retrieve_table_from_coll(
                $coll_id
            );
            $objectId = $res_id;
            $_SESSION['cm']['objectId4List'] = $res_id;
        }
        if ($nb_versions_for_title == 0) {
            $extend_title_for_versions = '0';
        } else {
            $extend_title_for_versions = $nb_versions_for_title;
        }
        $_SESSION['cm']['resMaster'] = '';
		$right_html .= '<dt>' . _VERSIONS . ' (<span id="nbVersions">' . $extend_title_for_versions . '</span>)</dt><dd>';
		$right_html .= '<h2>';
			$right_html .= '<center>' . _VERSIONS . '</center>';
		$right_html .= '</h2>';
		$right_html .= '<div class="error" id="divError" name="divError"></div>';
		$right_html .= '<div style="text-align:center;">';
			$right_html .= '<a href="';
				$right_html .=  $_SESSION['config']['businessappurl'];
				$right_html .= 'index.php?display=true&dir=indexing_searching&page=view_resource_controler&original&id=';
				$right_html .= $res_id;
				$right_html .= '" target="_blank">';
				$right_html .= '<img alt="' . _VIEW_ORIGINAL . '" src="';
				$right_html .= $_SESSION['config']['businessappurl'];
				$right_html .= 'static.php?filename=picto_dld.gif" border="0" alt="" />';
				$right_html .= _VIEW_ORIGINAL . ' | ';
			$right_html .= '</a>';
			if ($core->test_service('add_new_version_init', 'apps', false)) {
				$_SESSION['cm']['objectTable'] = $objectTable;
				$right_html .= '<div id="createVersion" style="display: inline;"></div>';
			}
			$right_html .= '<div id="loadVersions"></div>';
            $right_html .= '<script language="javascript">';
                $right_html .= 'showDiv("loadVersions", "nbVersions", "createVersion", "';
                    $right_html .= $_SESSION['config']['businessappurl'];
                    $right_html .= 'index.php?display=false&module=content_management&page=list_versions")';
            $right_html .= '</script>';
		$right_html .= '</div><br>';
		$right_html .= '</dd>';
    }

	$valid_but = 'valid_action_form( \\\'index_file\\\', \\\'index.php?display=true&page=manage_action&module=core\\\', \\\''.$_REQUEST['action'].'\\\', \\\''.$res_id.'\\\', \\\'res_letterbox\\\', \\\'null\\\', \\\''.$coll_id.'\\\', \\\'page\\\');';
//echo "{status : 1,avancement:'".$avancement_html."',circuit:'".$circuit_html."',notes_dt:'".$notes_html_dt."',notes_dd:'".$notes_html_dd."'}";
echo "{status : 1,notes_dt:'".$notes_html_dt."',notes_dd:'".$notes_html_dd."',circuit:'".addslashes($circuit_html)."',avancement:'".$avancement_html."',right_html:'".$right_html."',valid_button:'".$valid_but."',id_rep:'".$tab_path_rep_file[0]['res_id']."',is_vers_rep:'".$tab_path_rep_file[0]['is_version']."'}";
exit();
?>