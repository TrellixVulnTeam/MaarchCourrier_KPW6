<?php

/**
* Copyright Maarch since 2008 under licence GPLv3.
* See LICENCE.txt file at the root folder for more details.
* This file is part of Maarch software.
*
*/

/**
* File : details.php
*
* Detailed informations on an indexed document
*
* @package  indexing_searching
* @version 1.3
* @since 10/2005
* @license GPL
* @author  Claire Figueras  <dev@maarch.org>
*/

//DECLARATIONS
require_once 'core/manage_bitmask.php';
require_once 'core/class/class_request.php';
require_once 'core/class/class_security.php';
require_once 'apps/' . $_SESSION['config']['app_id'] . '/security_bitmask.php';
require_once 'apps/' . $_SESSION['config']['app_id'] . '/class/class_list_show.php';
require_once 'core/class/class_history.php';
require_once 'core/class/LinkController.php';
require_once 'apps/' . $_SESSION['config']['app_id'] . '/class/class_indexing_searching_app.php';
require_once 'apps/' . $_SESSION['config']['app_id'] . '/class/class_types.php';
if (file_exists(
    $_SESSION['config']['corepath'] . 'custom/apps/' . $_SESSION['config']['app_id']
    . '/definition_mail_categories.php'
)
) {
    $path = $_SESSION['config']['corepath'] . 'custom/apps/' . $_SESSION['config']['app_id']
          . '/definition_mail_categories.php';
} else {
    $path = 'apps/' . $_SESSION['config']['app_id'] . '/definition_mail_categories.php';
}
include_once $path;

//INSTANTIATE
$core     = new core_tools();
$hist     = new history();
$security = new security();
$func     = new functions();
$request  = new request;
$type     = new types();
$is       = new indexing_searching_app();
$db       = new Database();

//INITIALIZE
$core->test_user();
$core->load_lang();
$_SESSION['basket_used'] = $_SESSION['current_basket']['id'];
if (!isset($_REQUEST['coll_id'])) {
    $_REQUEST['coll_id'] = '';
}
$_SESSION['doc_convert'] = array();
$_SESSION['stockCheckbox'] = '';
$_SESSION['save_list']['fromDetail'] = "true";
$s_id = '';
$_SESSION['req'] ='details';
$_SESSION['indexing'] = array();
$coll_id = '';
$table = '';
if (!isset($_REQUEST['coll_id']) || empty($_REQUEST['coll_id'])) {
    //$_SESSION['error'] = _COLL_ID.' '._IS_MISSING;
    $coll_id = $_SESSION['collections'][0]['id'];
    $table = $_SESSION['collections'][0]['view'];
    $is_view = true;
} else {
    $coll_id = $_REQUEST['coll_id'];
    $table = $security->retrieve_view_from_coll_id($coll_id);
    $is_view = true;
    if (empty($table)) {
        $table = $security->retrieve_table_from_coll($coll_id);
        $is_view = false;
    }
}
$_SESSION['collection_id_choice'] = $coll_id;
$_SESSION['current_basket']['coll_id'] = $coll_id;
$idCourrier = $_GET['id'];



//test service print_details
$printDetails = false;
if ($core->test_service('print_details', 'apps', false)) {
    $printDetails = true;
}
//test service put_in_validation
$putInValid = false;
if ($core->test_service('put_in_validation', 'apps', false)) {
    $putInValid = true;
}
//test service view technical infos
$viewTechnicalInfos = false;
if ($core->test_service('view_technical_infos', 'apps', false)) {
    $viewTechnicalInfos = true;
}

//test service view doc history
$viewDocHistory = false;
if ($core->test_service('view_doc_history', 'apps', false) || $core->test_service('view_full_history', 'apps', false)) {
    $viewDocHistory = true;
}

//test service add new version
$addNewVersion = false;
if ($core->test_service('add_new_version', 'apps', false)) {
    $addNewVersion = true;
}

//test service view_emails_notifs
// $viewEmailsNotifs = false;
// if ($core->test_service('view_emails_notifs', 'notifications', false)) {
    // $viewEmailsNotifs = true;
// }

/****************Management of the location bar  ************/
$init = false;
if (isset($_REQUEST['reinit']) && $_REQUEST['reinit'] == 'true') {
    $init = true;
}
if (isset($_SESSION['indexation'] ) && $_SESSION['indexation'] == true) {
    $init = true;
}
$level = '';
if (
    isset($_REQUEST['level'])
    && (
        $_REQUEST['level'] == 2
        || $_REQUEST['level'] == 3
        || $_REQUEST['level'] == 4
        || $_REQUEST['level'] == 1
    )
) {
    $level = $_REQUEST['level'];
}
$page_path = $_SESSION['config']['businessappurl']
    . 'index.php?page=details&dir=indexing_searching&coll_id='
    . $_REQUEST['coll_id']
    . '&id=' . $_REQUEST['id'];
$page_label = _DETAILS;
$page_id = 'details';
$core->manage_location_bar($page_path, $page_label, $page_id, $init, $level);
/***********************************************************/


if (isset($_GET['id']) && !empty($_GET['id'])) {
    $s_id = addslashes($func->wash($_GET['id'], 'num', _THE_DOC));
}

$stmt = $db->query("SELECT res_id FROM mlb_coll_ext WHERE res_id = ?", array($s_id));
if ($stmt->rowCount() <= 0) {
    $_SESSION['error'] = _QUALIFY_FIRST;
    ?>
        <script type="text/javascript">window.top.location.href='<?php
            echo $_SESSION['config']['businessappurl'];?>index.php';</script>
    <?php
    exit();
}
$_SESSION['doc_id'] = $s_id;
$right = $security->test_right_doc($coll_id, $s_id);
//$_SESSION['error'] = 'coll '.$coll_id.', res_id : '.$s_id;

$stmt = $db->query("SELECT typist, creation_date, filename FROM ".$table." WHERE res_id = ?", array($s_id));
$info_mail = $stmt->fetchObject();

$date1 = new DateTime($info_mail->creation_date);
$date2 = new DateTime();
$date2->sub(new DateInterval('PT1M'));

if (!$right && $_SESSION['user']['UserId'] == $info_mail->typist && $date1 > $date2) {
    $right = true;
    $_SESSION['info'] = _MAIL_WILL_DISAPPEAR;
}

if (!$right) {
    $_SESSION['error'] = _NO_RIGHT_TXT;
    ?>
    <script type="text/javascript">
    window.top.location.href = '<?php
        echo $_SESSION['config']['businessappurl'];
        ?>index.php';
    </script>
    <?php
    exit();
}
if (isset($s_id) && !empty($s_id) && $_SESSION['history']['resview'] == 'true') {
    $hist->add(
        $table,
        $s_id ,
        'VIEW',
        'resview',
        _VIEW_DETAILS_NUM . $s_id,
        $_SESSION['config']['databasetype'],
        'apps'
    );
}

$modify_doc = check_right(
    $_SESSION['user']['security'][$coll_id]['DOC']['securityBitmask'],
    DATA_MODIFICATION
);
$delete_doc = check_right(
    $_SESSION['user']['security'][$coll_id]['DOC']['securityBitmask'],
    DELETE_RECORD
);

//update index with the doctype
if (isset($_POST['submit_index_doc'])) {
    $is->update_mail($_POST, 'POST', $s_id, $coll_id);

    if ($core->is_module_loaded('tags')) {
        $tags = $_POST['tag_userform'];
        $tags_list = $tags;
        include_once("modules".DIRECTORY_SEPARATOR."tags".DIRECTORY_SEPARATOR."tags_update.php");
    }

    //thesaurus
    if ($core->is_module_loaded('thesaurus')) {
        require_once 'modules' . DIRECTORY_SEPARATOR . 'thesaurus'
                    . DIRECTORY_SEPARATOR . 'class' . DIRECTORY_SEPARATOR
                    . 'class_modules_tools.php';
        $thesaurus = new thesaurus();

        if (! empty($_POST['thesaurus'])) {
            $thesaurusList = implode('__',$_POST['thesaurus']);
        }else{
               $thesaurusList = '';
        }
        $thesaurus->updateResThesaurusList($thesaurusList,$s_id);
    }
}

//delete the doctype
if (isset($_POST['delete_doc'])) {
    $is ->delete_doc($s_id, $coll_id);
    ?>
        <script type="text/javascript">window.top.location.href='<?php
            echo $_SESSION['config']['businessappurl']
                . 'index.php?page=search_adv&dir=indexing_searching';
            ?>';</script>
    <?php
    exit();
}
if (isset($_POST['put_doc_on_validation'])) {
    $is ->update_doc_status($s_id, $coll_id, 'VAL');
    ?>
        <script language="javascript" type="text/javascript">window.top.location.href='<?php
            echo $_SESSION['config']['businessappurl']
            . 'index.php?page=search_adv&dir=indexing_searching';
            ?>';</script>
    <?php
    exit();
}

//Load multicontacts
$query = "SELECT c.contact_firstname, c.contact_lastname, c.firstname, c.lastname, c.society 
        FROM view_contacts c, contacts_res cres 
        WHERE cres.coll_id = 'letterbox_coll' AND cres.res_id = ? AND cast (c.contact_id as varchar(128)) = cres.contact_id AND c.ca_id = cres.address_id 
        GROUP BY c.firstname, c.lastname, c.society, c.contact_firstname, c.contact_lastname";

$stmt = $db->query($query, array($_REQUEST['id']));
$nbContacts = 0;
$frameContacts = "";
$frameContacts = "{";
while ($res = $stmt->fetchObject()) {
    $nbContacts        = $nbContacts + 1;
    $contact_firstname = str_replace("'", "\'", $res->contact_firstname);
    $contact_firstname = str_replace('"', " ", $contact_firstname);
    $contact_lastname  = str_replace("'", "\'", $res->contact_lastname);
    $contact_lastname  = str_replace('"', " ", $contact_lastname);
    $firstname         = str_replace("'", "\'", $res->firstname);
    $firstname         = str_replace('"', " ", $firstname);
    $lastname          = str_replace("'", "\'", $res->lastname);
    $lastname          = str_replace('"', " ", $lastname);
    $society           = str_replace("'", "\'", $res->society);
    $society           = str_replace('"', " ", $society);
    $frameContacts    .= "'contact " . $nbContacts . "' : '" . $contact_firstname . " " . $contact_lastname . " " . $firstname . " " . $lastname . " " . $society . " (contact)', ";
}
$query = "SELECT u.firstname, u.lastname, u.user_id ";
$query .= "FROM users u, contacts_res cres  ";
$query .= "WHERE cres.coll_id = 'letterbox_coll' AND cres.res_id = ? AND cast (u.user_id as varchar(128)) = cres.contact_id ";
$query .= "GROUP BY u.firstname, u.lastname, u.user_id";

$stmt = $db->query($query, array($_REQUEST['id']));

while($res = $stmt->fetchObject()){
    $nbContacts = $nbContacts + 1;
    $firstname  = str_replace("'","\'", $res->firstname);
    $firstname  = str_replace('"'," ", $firstname);
    $lastname   = str_replace("'","\'", $res->lastname);
    $lastname   = str_replace('"'," ", $lastname);
    $frameContacts .= "'contact ".$nbContacts."' : '" . $firstname . " " . $lastname . " (utilisateur)', ";
}
$frameContacts = substr($frameContacts, 0, -2);
$frameContacts .= "}";

if (empty($_SESSION['error']) || $_SESSION['indexation']) {
    $comp_fields = '';
    $stmt = $db->query("SELECT type_id FROM ".$table." WHERE res_id = ?", array($s_id));
    if ($stmt->rowCount() > 0) {
        $res = $stmt->fetchObject();
        $type_id = $res->type_id;
        $indexes = $type->get_indexes($type_id, $coll_id, 'minimal');
        for($i=0;$i<count($indexes);$i++) {
            // In the view all custom from res table begin with doc_
            if (preg_match('/^custom_/', $indexes[$i])) {
                $comp_fields .= ', doc_'.$indexes[$i];
            } else {
                $comp_fields .= ', '.$indexes[$i];
            }
        }
    }
    $case_sql_complementary = '';
    if ($core->is_module_loaded('cases') == true) {
        $case_sql_complementary = " , case_id";
    }
    $stmt = $db->query(
        "SELECT status, format, typist, creation_date, fingerprint, filesize, "
        . "res_id, destination, work_batch, page_count, is_paper, scan_date, scan_user, "
        . "scan_location, scan_wkstation, scan_batch, source, doc_language, "
        . "description, closing_date, alt_identifier, initiator, entity_label " . $comp_fields
        . $case_sql_complementary . " FROM " . $table . " WHERE res_id = ?",
        array($s_id)
    );
    $res = $stmt->fetchObject();

}
?>
<div id="details_div">
<h1 class="titdetail">
    <i class="fa fa-info-circle fa-2x"></i>&nbsp;
    <?php
    if(_ID_TO_DISPLAY == 'res_id'){
        echo '<i style="font-style:normal;">'._DETAILS . " : " . _DOC . ' ' . strtolower(_NUM).$s_id.'</i>';
    }else{
        echo '<i style="font-style:normal;" title="'. _LETTER_NUM . $s_id . '">'._DETAILS . " : " . _DOC . ' ' . $res->alt_identifier.'</i>';
    }
    ?>
     <span>(<?php
        echo  $security->retrieve_coll_label_from_coll_id($coll_id);
        ?>)</span>
</h1>
<div id="inner_content" class="clearfix">
<?php 
if ((!empty($_SESSION['error']) && ! ($_SESSION['indexation'] ))  )
{
    ?>
    <div class="error">
    <br />
    <br />
    <br />
    <?php echo $_SESSION['error'];  $_SESSION['error'] = "";?>
    <br />
    <br />
    <br />
    </div>
    <?php
} else {
    if ($stmt->rowCount() == 0) {
        ?>
        <div align="center">
            <br />
            <br />
            <?php echo _NO_DOCUMENT_CORRESPOND_TO_IDENTIFIER;?>.
            <br />
            <br />
            <br />
        </div>
        <?php
        } else {
            ?>
            <div id="info_detail" class="info" onclick="this.hide();">
                <?php echo $_SESSION['info'] ;?>
                <br />
                <br />
            </div>
            <?php
            if(isset($_SESSION['info']) && $_SESSION['info'] <> '') {
                ?>

                <script>
                    var info_detail = $('info_detail');
                    if (info_detail != null) {
                        info_detail.style.display = 'table-cell';
                        Element.hide.delay(10, 'info_detail');
                    }
                </script>
                <?php
                $_SESSION['info'] = "";
            }
    
            $param_data = array(
                'img_category_id'        => true,
                'img_priority'           => true,
                'img_type_id'            => true,
                'img_doc_date'           => true,
                'img_admission_date'     => true,
                'img_nature_id'          => true,
                'img_reference_number'   => true,
                'img_subject'            => true,
                'img_process_limit_date' => true,
                'img_author'             => true,
                'img_destination'        => true,
                'img_folder'             => true,
                'img_contact'            => true,
                'img_confidentiality'    => true,
                );

            $typist         = $res->typist;
            $format         = $res->format;
            $filesize       = $res->filesize;
            $creation_date  = functions::format_date_db($res->creation_date, false);
            $chrono_number  = $res->alt_identifier;
            $initiator      = $res->initiator;
            $fingerprint    = $res->fingerprint;
            $work_batch     = $res->work_batch;
            $destination    = $res->destination;
            $page_count     = $res->page_count;
            $is_paper       = $res->is_paper;
            $scan_date      = functions::format_date_db($res->scan_date);
            $scan_user      = $res->scan_user;
            $scan_location  = $res->scan_location;
            $scan_wkstation = $res->scan_wkstation;
            $scan_batch     = $res->scan_batch;
            $doc_language   = $res->doc_language;
            $closing_date   = functions::format_date_db($res->closing_date, false);
            $indexes        = $type->get_indexes($type_id, $coll_id);
            $entityLabel    = $res->entity_label;

            $queryUser  = "SELECT firstname, lastname FROM users WHERE user_id = ?";
            $stmt       = $db->query($queryUser, array($typist));
            $resultUser = $stmt->fetchObject();

            $queryEntities  = "SELECT entity_label FROM entities WHERE entity_id = ?";
            $stmt           = $db->query($queryEntities, array($initiator));
            $resultEntities = $stmt->fetchObject();
            $entities       = $resultEntities->entity_label;

            if ($resultUser->lastname <> '') {
                $typistLabel = $resultUser->firstname . ' ' . $resultUser->lastname;
            } else {
                $typistLabel = $typist;
            }

            if ($core->is_module_loaded('cases') == true) {
                require_once('modules/cases/class/class_modules_tools.php');
                $case = new cases();
                if ($res->case_id <> '')
                    $case_properties = $case->get_case_info($res->case_id);
            }

            foreach (array_keys($indexes) as $key) {
                if (preg_match('/^custom/', $key)) {
                    $tmp = 'doc_' . $key;
                } else{
                    $tmp = $key;
                }
                if ($indexes[$key]['type'] == "date") {
                    $res->{$tmp} = functions::format_date_db($res->{$tmp}, false);
                }
                $indexes[$key]['value'] = $res->{$tmp};
                $indexes[$key]['show_value'] = $res->{$tmp};
                if ($indexes[$key]['type'] == "string") {
                    $indexes[$key]['show_value'] = functions::show_string($res->{$tmp});
                } elseif ($indexes[$key]['type'] == "date") {
                    $indexes[$key]['show_value'] = functions::format_date_db($res->{$tmp}, true);
                }
            }

            $process_data = $is->get_process_data($coll_id, $s_id);
            $status = $res->status;
            if (!empty($status))
            {
                require_once('core/class/class_manage_status.php');
                $status_obj = new manage_status();
                $res_status = $status_obj->get_status_data($status);
                if ($modify_doc) {
                    $can_be_modified = $status_obj->can_be_modified($status);
                    if (!$can_be_modified) {
                        $modify_doc = false;
                    }
                }
            }
            $mode_data = 'full';
            if ($modify_doc) {
                $mode_data = 'form';
            }
            foreach (array_keys($indexes) as $key) {
                $indexes[$key]['opt_index'] = true;
                if ($indexes[$key]['type_field'] == 'select') {
                    for($i=0;$i<count($indexes[$key]['values']);$i++) {
                        if ($indexes[$key]['values'][$i]['id'] == $indexes[$key]['value']) {
                            $indexes[$key]['show_value'] = $indexes[$key]['values'][$i]['label'] ;
                            break;
                        }
                    }
                }
                if (!$modify_doc) {
                    $indexes[$key]['readonly'] = true;
                    $indexes[$key]['type_field'] = 'input';
                } else {
                    $indexes[$key]['readonly'] = false;
                }
            }
            $data = get_general_data($coll_id, $s_id, $mode_data, $param_data );

            $detailsExport = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" >';
            $detailsExport .= '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">';
            $detailsExport .= "<head><title>Maarch Details</title><meta http-equiv='Content-Type' content='text/html; charset=UTF-8' /><meta content='fr' http-equiv='Content-Language'/><meta http-equiv='cache-control' content='no-cache'/><meta http-equiv='pragma' content='no-cache'><meta http-equiv='Expires' content='0'></head>";
            $detailsExport .= "<body onload='javascript:window.print();' style='font-size:8pt'>";
            ?>
            <div class="block">
                <b>
                <p id="back_list">
                    <?php
                    if (! isset($_POST['up_res_id']) || ! $_POST['up_res_id']) {
                        if ($_SESSION['indexation'] == false) {                        
                             echo '<a href="#" onclick="document.getElementById(\'ariane\').childNodes[document.getElementById(\'ariane\').childNodes.length-2].click();"><i class="fa fa-arrow-circle-left fa-2x" title="' .  _BACK . '"></i></a>';
                        }
                    }
                    
                    ?>
                </p>
                <p id="viewdoc">
                    <?php if($info_mail->filename){?>
                        <a href="index.php?display=true&dir=indexing_searching&page=view_resource_controler&id=<?php functions::xecho($s_id);?>" 
                            target="_blank"><i class="fa fa-download fa-2x" title="<?php echo _VIEW_DOC; ?>"></i></a>
                    <?php } ?>
                    &nbsp;&nbsp;&nbsp;
                </p>
                </b>&nbsp;
            </div>
            <br/>
            <div class="whole-panel">

            <?php 
                if($nbAttach == 0 && strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome')){
                                $style = 'visibility:hidden;"';
                            }else{
                                $style = 'display:none;"';
                            }
            ?>
                <?php $detailsExport .= "<h1><center>"._DETAILS_PRINT." : ".$s_id."</center></h1><hr>";?>

                <div class="fa fa-info-circle detailsTab DetailsTabFunc TabSelected  " id="DetailstachometerTab" style="font-size:2em;padding-left: 15px;<?php if(strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome')){echo 'padding-right: 0px;';}else{echo 'padding-right: 15px;';}?>" title="<?php echo _PROPERTIES;?>" onclick="tabClicked('DetailstachometerTab',false);">
                <sup><span style="font-size: 10px;<?php echo $style; ?>" class="nbResZero">0</span></sup></div>

               
             <?php
                                //SERVICE TO VIEW TECHNICAL INDEX
                                if ($viewTechnicalInfos) {
                                $uniqueString = '';                                    
                                $pathScriptTab = 'index.php?display=true&page=show_technicalInfo_tab';
                                $uniqueString .= '<div class="fa fa-cogs DetailsTabFunc" id="DetailsCogdTab" style="font-size:2em;padding-left: 15px;padding-right: 15px;" title="'._TECHNICAL_INFORMATIONS.'" onclick="loadSpecificTab(\'uniqueDetailsIframe\',\''.$pathScriptTab.'\');tabClicked(\'DetailsCogdTab\',true);"><sup><span style="font-size: 10px;display: none;" class="nbResZero"></span></sup></div>';
                                }
                                $uniqueString .= '<div class="fa fa-share-alt DetailsTabFunc" id="DetailsGearTab" " style="font-size:2em;padding-left: 15px;';
                                if(strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome')) {
                                        $uniqueString .=  'padding-right: 0px;';
                                }else {
                                        $uniqueString .=  'padding-right: 15px;';
                                }
                                require_once('modules/entities/class/class_manage_listdiff.php');
                                    $diff_list = new diffusion_list();
                                    $_SESSION['details']['diff_list'] = $diff_list->get_listinstance($s_id, false, $coll_id);
                                    $_SESSION['details']['difflist_type'] = $diff_list->get_difflist_type($_SESSION['details']['diff_list']['difflist_type']);
                                    $roles = $diff_list->list_difflist_roles();
                                    json_encode($roles);
                                    $roles_str = json_encode($roles);
                                    $category = $data['category_id']['value'];
                                    $pathScriptTab = 'index.php?display=true&page=show_diffList_tab&module=entities&resId='.$s_id.'&collId='.$coll_id.'&fromDetail=true&category='.$category.'&roles='.urlencode($roles_str).$onlyCC;    
                                    $uniqueString .= '" title="'._DIFF_LIST.'" onclick="loadSpecificTab(\'uniqueDetailsIframe\',\''.$pathScriptTab.'\');tabClicked(\'DetailsGearTab\',true);"> <sup><span style="font-size: 10px;';
                                        if(strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome')) {
                                            $style = 'visibility:hidden;"';
                                        }else {
                                            $style = 'display:none;"';
                                        }
                                    $uniqueString .=$style.' class="nbResZero">0</span></sup></div>';

                                if ($core->test_service('print_folder_doc', 'visa', false)) {
                                        require_once "modules" . DIRECTORY_SEPARATOR . "visa" . DIRECTORY_SEPARATOR
                                        . "class" . DIRECTORY_SEPARATOR
                                        . "class_modules_tools.php";
                
                                        $pathScriptTab = $_SESSION['config']['businessappurl']
                                        . 'index.php?display=true&page=show_printFolder_tab&module=visa&resId='
                                        . $s_id . '&collId=' . $coll_id . '&table=' . $table;
                                        $uniqueString .= '<div class="fa fa-print DetailsTabFunc" id="DetailsPrintTab" style="font-size:2em;padding-left: 15px;';
                                        if(strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome')) {
                                            $uniqueString .=  'padding-right: 0px;';
                                        }else {
                                            $uniqueString .=  'padding-right: 15px;';
                                        }
                                        $uniqueString .= '" title="'._PRINTFOLDER.'" onclick="loadSpecificTab(\'uniqueDetailsIframe\',\''.$pathScriptTab.'\');tabClicked(\'DetailsPrintTab\',true);"> <sup><span style="font-size: 10px;';
                                        if(strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome')) {
                                            $style = 'visibility:hidden;"';
                                        }else {
                                            $style = 'display:none;"';
                                        }
                                        $uniqueString .= $style.'class="nbResZero">0</span></sup></div>';
                                }
                                
                                if ($core->is_module_loaded('visa')) {
                                    $pathScriptTab = 'index.php?display=true&page=show_visa_tab&module=visa&resId='.$s_id.'&collId='.$coll_id.'&destination='.$destination.'&fromDetail=true';
                                    $uniqueString .= '<div id="visa_tab" class="fa fa-retweet DetailsTabFunc " style="font-size:2em;padding-left: 15px;';
                                    $uniqueString .='padding-right: 15px;" title="'._VISA_WORKFLOW.'" onclick="loadSpecificTab(\'uniqueDetailsIframe\',\''.$pathScriptTab.'\');tabClicked(\'visa_tab\',true);"> <sup id="visa_tab_badge"></sup></div>';
                                    //LOAD TOOLBAR BADGE
                                    $toolbarBagde_script = 'index.php?display=true&module=visa&page=load_toolbar_visa&resId='.$s_id.'&collId='.$coll_id;
                                    $uniqueString .='<script>loadToolbarBadge(\'visa_tab\',\''.$toolbarBagde_script.'\');</script>';
                                    }
                                
                                    if ($core->is_module_loaded('avis')) {
                                    $pathScriptTab = 'index.php?display=true&page=show_avis_tab&module=avis&resId='.$s_id.'&collId='.$coll_id.'&fromDetail=true';
                                    $uniqueString .= '<div id="avis_tab" class="fa fa-commenting-o DetailsTabFunc " style="font-size:2em;padding-left: 15px;';
                                    $uniqueString .= 'padding-right: 15px;" title="'._AVIS_WORKFLOW.'" onclick="loadSpecificTab(\'uniqueDetailsIframe\',\''.$pathScriptTab.'\');tabClicked(\'avis_tab\',true);"> <sup id="avis_tab_badge"></sup></div><div id="page_circuit_avis" style="overflow-x: hidden;">';
                                    $uniqueString .= '</div>';
                                    
                                    //LOAD TOOLBAR BADGE
                                    $toolbarBagde_script = 'index.php?display=true&module=avis&page=load_toolbar_avis&resId='.$s_id.'&collId='.$coll_id;
                                    $uniqueString .='<script>loadToolbarBadge(\'avis_tab\',\''.$toolbarBagde_script.'\');</script>';
                                    }       

                                    if ($core->is_module_loaded('attachments')) {
                                    $extraParam = '&attach_type_exclude=response_project,signed_response,outgoing_mail_signed,converted_pdf,outgoing_mail,print_folder';
                                    $pathScriptTab = 'index.php?display=true&page=show_attachments_details_tab&module=attachments&resId='
                                    . $s_id . '&collId=' . $coll_id.'&fromDetail=attachments'.$extraParam;
                                    $uniqueString .= '<div class="fa fa-paperclip DetailsTabFunc " id="attachments_tab" style="font-size:2em;padding-left: 15px;padding-right: 15px;" title="'._ATTACHMENTS .'" onclick="loadSpecificTab(\'uniqueDetailsIframe\',\''.$pathScriptTab.'\');tabClicked(\'attachments_tab\',true);"> <sup id="attachments_tab_badge"></sup></div>';
                                    //LOAD TOOLBAR BADGE
                                    $toolbarBagde_script = 'index.php?display=true&module=attachments&page=load_toolbar_attachments&resId='.$s_id.'&collId='.$coll_id;
                                    $uniqueString .='<script>loadToolbarBadge(\'attachments_tab\',\''.$toolbarBagde_script.'\');</script>';
                                    }

                                    if ($core->is_module_loaded('attachments')) {
                                            $extraParam = '&attach_type=response_project,outgoing_mail_signed,signed_response,outgoing_mail';
                                            $pathScriptTab =  'index.php?display=true&page=show_attachments_details_tab&module=attachments&fromDetail=response&resId='
                                            . $s_id . '&collId=' . $coll_id.$extraParam;
                                            $uniqueString .= '<div id="responses_tab" class="fa fa-mail-reply  DetailsTabFunc" style="font-size:2em;padding-left: 15px;padding-right: 15px;" title="'._DONE_ANSWERS.'" onclick="loadSpecificTab(\'uniqueDetailsIframe\',\''.$pathScriptTab.'\');tabClicked(\'responses_tab\',true);"> <sup id="responses_tab_badge"></sup></div>';
                                            //LOAD TOOLBAR BADGE
                                            $toolbarBagde_script = 'index.php?display=true&module=attachments&page=load_toolbar_attachments&responses&resId='.$s_id.'&collId='.$coll_id;
                                            $uniqueString .='<script>loadToolbarBadge(\'responses_tab\',\''.$toolbarBagde_script.'\');</script>';
                                    }                    

                                    if ($viewDocHistory) {
                                    
                                        $pathScriptTab = 'index.php?display=true&page=show_history_tab&resId='
                                        . $s_id . '&collId=' . $coll_id;
                                        $uniqueString .= '<div class="fa fa-history  DetailsTabFunc" id="DetailsLineChartTab" style="font-size:2em;padding-left: 15px;';
                                        if(strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome')) {
                                            $uniqueString .=  'padding-right: 0px;';
                                        } else {
                                            $uniqueString .=  'padding-right: 15px;';
                                        }
                                        $uniqueString .= '" title="'. _DOC_HISTORY . '" onclick="loadSpecificTab(\'uniqueDetailsIframe\',\''.$pathScriptTab.'\');tabClicked(\'DetailsLineChartTab\',true);"> <sup><span style="font-size: 10px;';
                                        if(strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome')) {
                                                $style .= 'visibility:hidden;"';
                                            } else {
                                                $style .= 'display:none;"';
                                            }
                                        $uniqueString .= $style.' class="nbResZero">0</span></sup></div>';
                                    }
                                
                                    if ($core->is_module_loaded('notes')) {
                                    // $note = '';
                                        $pathScriptTab = 'index.php?display=true&module=notes&page=notes&identifier='
                                    . $s_id . '&origin=document&coll_id=' . $coll_id . '&load&size=full';
                                        $uniqueString .= '<div id="notes_tab" class="fa fa-sticky-note  DetailsTabFunc" style="font-size:2em;padding-left: 15px;padding-right: 15px;" title="'. _NOTES.'" onclick="loadSpecificTab(\'uniqueDetailsIframe\',\''.$pathScriptTab.'\');;tabClicked(\'notes_tab\',true);"> <sup id="notes_tab_badge"></sup></div>';
                                        //LOAD TOOLBAR BADGE
                                        $toolbarBagde_script = 'index.php?display=true&module=notes&page=load_toolbar_notes&resId='.$s_id.'&collId='.$coll_id;
                                        $uniqueString .='<script>loadToolbarBadge(\'notes_tab\',\''.$toolbarBagde_script.'\');</script>';
                                        }
                                    
                                    //CASES TAB
                                    if ($core->is_module_loaded('cases') == true){   
                                        $pathScriptTab = 'index.php?display=true&page=show_case_tab&module=cases&collId=' . $coll_id . '&resId='.$s_id;
                                        $uniqueString .= '<div id="cases_tab" class="fa fa-suitcase  DetailsTabFunc" style="font-size:2em;padding-left: 15px;padding-right: 15px;" title="' . _CASE . '" onclick="loadSpecificTab(\'uniqueDetailsIframe\',\''.$pathScriptTab.'\');tabClicked(\'cases_tab\',true);"> <sup id="cases_tab_badge"></sup></div>';
                                        //LOAD TOOLBAR BADGE
                                        $toolbarBagde_script = 'index.php?display=true&module=cases&page=load_toolbar_cases&resId='.$s_id.'&collId='.$coll_id;
                                        $uniqueString .='<script>loadToolbarBadge(\'cases_tab\',\''.$toolbarBagde_script.'\');</script>';
                                        }
                                    
                                    //SENDMAILS TAB         
                                    if ($core->test_service('sendmail', 'sendmail', false) === true) {
                                        $pathScriptTab = 'index.php?display=true&module=sendmail&page=sendmail&identifier='. $s_id . '&origin=document&coll_id=' . $coll_id . '&load&size=medium';    
                                        $uniqueString .= '<div id="sendmail_tab" class="fa fa-envelope  DetailsTabFunc" style="font-size:2em;padding-left: 15px;padding-right: 15px;" title="'._SENDED_EMAILS.'" onclick="loadSpecificTab(\'uniqueDetailsIframe\',\''.$pathScriptTab.'\');tabClicked(\'sendmail_tab\',true);"> <sup id="sendmail_tab_badge"></sup></div>';
                                        //LOAD TOOLBAR BADGE
                                        $toolbarBagde_script =  'index.php?display=true&module=sendmail&page=load_toolbar_sendmail&resId='.$s_id.'&collId='.$coll_id;
                                        $uniqueString .='<script>loadToolbarBadge(\'sendmail_tab\',\''.$toolbarBagde_script.'\');</script>';
                                    }
                                    /// LINKS
                                    if ($core->test_service('view_version_letterbox', 'apps', false)) {
                                        //VERSIONS TAB
                                        $versionTable = $security->retrieve_version_table_from_coll_id(
                                            $coll_id
                                        );
                                        $selectVersions = "SELECT res_id FROM ". $versionTable . " WHERE res_id_master = ? and status <> 'DEL' order by res_id desc";

                                        $stmt = $db->query($selectVersions, array($s_id));
                                        $nb_versions_for_title = $stmt->rowCount();
                                        $lineLastVersion = $stmt->fetchObject();
                                        $lastVersion = $lineLastVersion->res_id;
                                        if ($lastVersion <> '') {
                                            $objectId = $lastVersion;
                                            $objectTable = $versionTable;
                                        } else {
                                            $objectTable = $security->retrieve_table_from_coll(
                                                $coll_id
                                            );
                                            $objectId = $s_id;
                                            $_SESSION['cm']['objectId4List'] = $s_id;
                                        }
                                        if ($nb_versions_for_title == 0) {
                                            $extend_title_for_versions = '0';
                                            $class="nbResZero";
                                            if($nbAttach == 0 && strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome')){
                                                $style = 'visibility:hidden;font-size: 10px;';
                                            }else{
                                                $style = 'display:none;font-size: 10px;';
                                            }
                                            $style2 = 'color:#9AA7AB;font-size:2em;padding-left: 15px;padding-right: 15px;';
                                        } else {
                                            $extend_title_for_versions = $nb_versions_for_title;
                                            $class="nbRes";
                                            $style = 'font-size: 10px;';
                                        }
                                        $_SESSION['cm']['resMaster'] = '';
                                        
                                        $pathScriptTab = 'index.php?display=true&page=show_versions_tab&collId=' . $coll_id . '&resId='.$s_id.'&objectTable='.$objectTable;
                                        $uniqueString .= '<div  class="fa fa-code-fork  DetailsTabFunc" id="DetailsCodeForkTab" style="font-size:2em;padding-left: 15px;';
                                        if(strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome')){
                                            $uniqueString .=  'padding-right: 0px;';
                                        }else{
                                            $uniqueString .=  'padding-right: 15px;';
                                        }
                                        $uniqueString .= '"title="'. _VERSIONS .'" onclick="loadSpecificTab(\'uniqueDetailsIframe\',\''.$pathScriptTab.'\');tabClicked(\'DetailsCodeForkTab\',true);">';
                                        $uniqueString .= ' <sup><span id="nbVersions" ';
                                        if(strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome')){
                                                $style .= 'visibility:hidden;"';
                                            }else{
                                                $style .= 'display:none;"';
                                            }
                                        $uniqueString .= 'class="'.$class.'" style="'.$style.'">' . $extend_title_for_versions . '</span></sup>';
                                        $uniqueString.='</div>';
                                    }   
                                    //LINKS TAB
                                    $pathScriptTab = 'index.php?display=true&page=show_links_tab';  
                                    $uniqueString .= '<div id="links_tab" class="fa fa-link  DetailsTabFunc" style="font-size:2em;padding-left: 15px;padding-right: 15px;" title="'._LINK_TAB.'" onclick="loadSpecificTab(\'uniqueDetailsIframe\',\''.$pathScriptTab.'\');tabClicked(\'links_tab\',true);"> <sup id="links_tab_badge"></sup>';
                                    $uniqueString .= '</div>';

                                    //LOAD TOOLBAR BADGE
                                    $toolbarBagde_script = 'index.php?display=true&page=load_toolbar_links&resId='.$s_id.'&collId='.$coll_id;
                                    $uniqueString .='<script>loadToolbarBadge(\'links_tab\',\''.$toolbarBagde_script.'\');</script>';
                                    echo $uniqueString;

                 ?>
               
                <div class="detailsDisplayDiv" id = "home-panel">
                    
                    <br/>
                <form method="post" name="index_doc" id="index_doc" action="index.php?page=details&dir=indexing_searching&id=<?php functions::xecho($s_id);?>">
                    <div align="center">
                        <?php 
                        //TOOLBAR
                        $toolBar = '';
                        if ($printDetails) { 
                            $toolBar .= '<input type="button" class="button" name="print_details" id="print_details" value="'._PRINT_DETAILS.'" onclick="window.open(\''.$_SESSION['config']['businessappurl'].'index.php?display=true&page=print&id='.$s_id.'\', \'_blank\');" /> ';
                        }
                        
                        if ($putInValid) {
                            $toolBar .= '<input type="submit" class="button"  value="'._PUT_DOC_ON_VALIDATION.'" name="put_doc_on_validation" onclick="return(confirm(\''._REALLY_PUT_DOC_ON_VALIDATION.'\n\r\n\r\'));" /> ';
                        }
                        
                        if ($delete_doc) {
                            $toolBar .= '<input type="submit" class="button"  value="'._DELETE_DOC.'" name="delete_doc" onclick="return(confirm(\''. _REALLY_DELETE.' '._THIS_DOC.' ?\n\r\n\r\'));" /> ';
                        }
                        
                        if ($modify_doc) {
                           $toolBar .= '<input type="submit" class="button"  value="'._SAVE_MODIFICATION.'" name="submit_index_doc" /> ';   
                        }
                        $toolBar .= '<input type="button" class="button" name="back_welcome" id="back_welcome" value="'._BACK_TO_WELCOME.'" onclick="window.top.location.href=\''.$_SESSION['config']['businessappurl'].'index.php\';" />';
                        
                        echo $toolBar;
                        ?>
                    </div>
                    <h2>
                        <span class="date">
                            <?php $detailsExport .= "<h2>"._FILE_DATA."</h2>";?>
                            <b><?php echo _FILE_DATA;?></b>
                        </span>
                    </h2>
                    <?php $detailsExport .= "<table cellpadding='2' cellspacing='0' border='1' class='block forms details' width='100%'>";?>
                    <table cellpadding="2" cellspacing="2" border="0" class="block forms details" width="100%" id="informations-panel">
                        <?php
                        $i=0;
                        if (!$modify_doc) {
                            $data['process_limit_date']['readonly'] = true;
                        }
                        foreach(array_keys($data) as $key)
                        {
                            if($key != 'is_multicontacts' || ($key == 'is_multicontacts' && $data[$key]['show_value'] == 'Y')){
                                if ($i%2 != 1 || $i==0) // pair
                                {
                                    $detailsExport .= "<tr class='col'>"; ?>
                                    <tr class="col">
                                <?php
                                }
                                $folder_id = "";
                                if ($key == "folder" && $data[$key]['show_value'] <> "")
                                {
                                        $folderTmp = $data[$key]['show_value'];
                                        $find1 = strpos($folderTmp, '(');
                                        $folder_id = substr($folderTmp, $find1, strlen($folderTmp));
                                        $folder_id = str_replace("(", "", $folder_id);
                                        $folder_id = str_replace(")", "", $folder_id);
                                }
                                //$detailsExport .= "<th align='left' width='50px'>";
                                ?>
                                <th align="left" class="picto" >
                                <?php
                                if (isset($data[$key]['addon'])) {
                                    if(in_array($key, ['dest_user_id', 'exp_user_id', 'dest_contact_id', 'exp_contact_id'])){ 
                                        echo $data[$key]['addon_detail'];
                                    } else {
                                        echo $data[$key]['addon'];
                                    }
                                } elseif (isset($data[$key]['img'])) {
                                    //$detailsExport .= "<img alt='".$data[$key]['label']."' title='".$data[$key]['label']."' src='".$data[$key]['img']."'  />";
                                    if ($folder_id <> "") {
                                        echo "<a href='" . $_SESSION['config']['businessappurl'] . "index.php?page=show_folder&module=folder&id=" . $folder_id . "'>";
                                        ?>
                                        <i class="fa fa-<?php functions::xecho($data[$key]['img']); ?> fa-2x" title="<?php functions::xecho($data[$key]['label']); ?>"></i>
                                        </a>
                                        <?php
                                    } else if ($key == 'is_multicontacts') {
                                        ?>

                                        <i class="fa fa-<?php functions::xecho($data[$key]['img']); ?> fa-2x" title="<?php functions::xecho($data[$key]['label']); ?>"
                                           onclick = "previsualiseAdminRead(event, <?php functions::xecho($frameContacts); ?>);" style="cursor: pointer;"></i>
                                        </a>
                                    <?php
                                    } else {
                                    ?>
                                        <i class="fa fa-<?php functions::xecho($data[$key]['img']); ?> fa-2x" title="<?php functions::xecho($data[$key]['label']); ?>"></i>
                                        <?php
                                    }
                                }
                                ?>
                                </th>
                            <?php                        
                            $detailsExport .= "<td align='left' width='200px'>"; ?>
                            <td align="left" width="200px">
                            <?php                                                                        
                                $detailsExport .= $data[$key]['label'];
                                echo $data[$key]['label'];
                            ?>                                                
                            </td>
                            <?php                        
                            $detailsExport .=  "</td>";
                            $detailsExport .=  "<td>";                        
                            ?>
                            <td>                        
                                <?php
                                $detailsExport .=  $data[$key]['show_value'];
                            if (!isset($data[$key]['readonly']) || $data[$key]['readonly'] == true)
                            {                        
                                if($key == 'is_multicontacts') {
                                    if($data[$key]['show_value'] == 'Y'){
                                    ?>
                                        <input type="hidden" name="<?php functions::xecho($key);?>" id="<?php functions::xecho($key);?>" value="<?php functions::xecho($data[$key]['show_value']);?>" readonly="readonly" class="readonly" size="40"  title="<?php functions::xecho($data[$key]['show_value']);?>" alt="<?php functions::xecho($data[$key]['show_value']);?>" />

                                        <div onClick="$('return_previsualise').style.display='none';" id="return_previsualise" style="cursor: pointer; display: none; border-radius: 10px; box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.4); padding: 10px; width: auto; height: auto; position: absolute; top: 0; left: 0; z-index: 999; background-color: rgba(255, 255, 255, 0.9); border: 3px solid #459ed1;">';
                                            <input type="hidden" id="identifierDetailFrame" value="" />
                                        </div>

                                        <input type="text" value="<?php functions::xecho($nbContacts . ' ' ._CONTACTS);?>" readonly="readonly" class="readonly" size="40"  title="<?php echo _SHOW_MULTI_CONTACT;?>" alt="<?php functions::xecho($data[$key]['show_value']);?>" 
                                                                            onclick = "previsualiseAdminRead(event, <?php functions::xecho($frameContacts);?>);" style="cursor: pointer;"/>
                                    <?php
                                    }

                                }elseif ($data[$key]['display'] == 'textinput')
                                {
                                    if($key == 'type_id'){
                                        ?>
                                        <input type="text" name="<?php echo $key;?>"  value="<?php echo $data[$key]['show_value'];?>" readonly="readonly" class="readonly" size="40"  title="<?php  echo $data[$key]['show_value']; ?>" alt="<?php  echo $data[$key]['show_value']; ?>" />
                                        <input type="hidden" name="<?php echo $key;?>" id="<?php echo $data[$key]['value'];?>" value="<?php echo $data[$key]['value'];?>" readonly="readonly" class="readonly" size="40"  title="<?php  echo $data[$key]['show_value']; ?>" alt="<?php  echo $data[$key]['show_value']; ?>" />
                                        <?php
                                    }else{
                                    ?>
                                        <input type="text" name="<?php echo $key;?>" id="<?php echo $key;?>" value="<?php echo $data[$key]['show_value'];?>" readonly="readonly" class="readonly" size="40"  title="<?php  echo $data[$key]['show_value']; ?>" alt="<?php  echo $data[$key]['show_value']; ?>" />
                                    <?php
                                    }
                                }
                                elseif ($data[$key]['display'] == 'textarea')
                                                                
                                {
                                    echo '<textarea name="'.$key.'" id="'.$key.'" rows="3" readonly="readonly" class="readonly" style="width: 200px; max-width: 200px;">'
                                        .$data[$key]['show_value']
                                        .'</textarea>';                                                                
                                } else if ($data[$key]['field_type'] == 'radio') {
                                    for($k=0; $k<count($data[$key]['radio']);$k++) {
                                        ?><input name ="<?php functions::xecho($key);?>" <?php if ($data[$key]['value'] ==$data[$key]['radio'][$k]['ID']){ echo 'checked';}?> type="radio" id="<?php functions::xecho($key) .'_' . $data[$key]['radio'][$k]['ID'];?>" value="<?php functions::xecho($data[$key]['radio'][$k]['ID']);?>" disabled ><?php functions::xecho($data[$key]['radio'][$k]['LABEL']);
                                    }
                                }
                                else                                
                                {
                                    ?>
                                    <input type="text" name="<?php functions::xecho($key);?>" id="<?php functions::xecho($key);?>" value="<?php functions::xecho($data[$key]['show_value']);?>" readonly="readonly" class="readonly" size="40" title="<?php functions::xecho($data[$key]['show_value']);?>" alt="<?php functions::xecho($data[$key]['show_value']);?>" />
                                    <?php
                                    if (isset($data[$key]['addon']))                                
                                    {
                                        $frm_str .= $data[$key]['addon'];
                                    }
                                }
                            }
                            else
                            {
                                if ($data[$key]['field_type'] == 'textfield')
                                {
                                    ?>
                                     <input type="text" name="<?php functions::xecho($key);?>" id="<?php functions::xecho($key);?>" value="<?php echo $data[$key]['show_value'];?>" size="40"  title="<?php echo $data[$key]['show_value'];?>" alt="<?php echo $data[$key]['show_value'];?>" />
                                    <?php
                                }
                                elseif ($data[$key]['display'] == 'textarea') 
                                {
                                    echo '<textarea name="'.$key.'" id="'.$key.'" rows="3" style="width: 200px; max-width: 200px;">'
                                        .$data[$key]['show_value']
                                    .'</textarea>';
                                }
                                else if ($data[$key]['field_type'] == 'date')
                                {
                                                                
                                                                
                                    ?>
                                    <input type="text" name="<?php functions::xecho($key);?>" id="<?php functions::xecho($key);?>" value="<?php functions::xecho($data[$key]['show_value']);?>" size="40"  title="<?php functions::xecho($data[$key]['show_value']);?>" alt="<?php functions::xecho($data[$key]['show_value']);?>" onclick="showCalender(this);" />
                                     <?php

                                }
                                else if ($data[$key]['field_type'] == 'select')
                                {
                                    ?>
                                    <select id="<?php functions::xecho($key);?>" name="<?php functions::xecho($key);?>"
                                    <?php if ($key == 'type_id'){
                                        echo 'onchange="change_doctype_details(this.options[this.options.selectedIndex].value, \''.$_SESSION['config']['businessappurl'].'index.php?display=true&dir=indexing_searching&page=change_doctype_details\' , \''._DOCTYPE.' '._MISSING.'\');"';
                                    } else if ($key == 'priority') {
                                        echo 'onchange="updateProcessDate(\'' . $_SESSION['config']['businessappurl'] . 'index.php?display=true&dir=indexing_searching&page=update_process_date\', ' . $s_id . ')"';
                                    } else if ($key == 'nature_id') {
                                        echo 'disabled';
                                    }
                                    ?>
                                    >
                                    <?php
                                        if ($key == 'type_id')
                                        {
                                            if ($_SESSION['features']['show_types_tree'] == 'true')
                                            {

                                                for($k=0; $k<count($data[$key]['select']);$k++)
                                                {
                                                ?><option value="" class="doctype_level1"><?php functions::xecho($data[$key]['select'][$k]['label']);?></option><?php
                                                    for($j=0; $j<count($data[$key]['select'][$k]['level2']);$j++)
                                                    {
                                                        ?><option value="" class="doctype_level2">&nbsp;&nbsp;<?php functions::xecho($data[$key]['select'][$k]['level2'][$j]['label']);?></option><?php
                                                        for($l=0; $l<count($data[$key]['select'][$k]['level2'][$j]['types']);$l++)
                                                        {
                                                            ?><option
                                                            <?php if ($data[$key]['value'] ==$data[$key]['select'][$k]['level2'][$j]['types'][$l]['id']){ echo 'selected="selected"';}?>
                                                             value="<?php functions::xecho($data[$key]['select'][$k]['level2'][$j]['types'][$l]['id']);?>" >&nbsp;&nbsp;&nbsp;&nbsp;<?php functions::xecho($data[$key]['select'][$k]['level2'][$j]['types'][$l]['label']);?></option><?php
                                                        }
                                                    }
                                                }
                                            }
                                            else
                                            {
                                                for($k=0; $k<count($data[$key]['select']);$k++)
                                                {
                                                    ?><option <?php if ($data[$key]['value'] ==$data[$key]['select'][$k]['ID']){ echo 'selected="selected"';}?> value="<?php functions::xecho($data[$key]['select'][$k]['ID']);?>" ><?php functions::xecho($data[$key]['select'][$k]['LABEL']);?></option><?php
                                                }
                                            }
                                        }
                                        else
                                        {
                                            for($k=0; $k<count($data[$key]['select']);$k++)
                                            {
                                                ?><option value="<?php functions::xecho($data[$key]['select'][$k]['ID']);?>" <?php if ($data[$key]['value'] == $data[$key]['select'][$k]['ID']){echo 'selected="selected"';}?>><?php functions::xecho($data[$key]['select'][$k]['LABEL']);?></option><?php
                                            }
                                        }
                                    ?>
                                    </select>
                                    <?php
                                } else if ($data[$key]['field_type'] == 'radio') {
                                    for($k=0; $k<count($data[$key]['radio']);$k++) {
                                        ?><input name ="<?php functions::xecho($key);?>" <?php if ($data[$key]['value'] ==$data[$key]['radio'][$k]['ID']){ echo 'checked';}?> type="radio" id="<?php functions::xecho($key) .'_' . $data[$key]['radio'][$k]['ID'];?>" value="<?php functions::xecho($data[$key]['radio'][$k]['ID']);?>" ><?php functions::xecho($data[$key]['radio'][$k]['LABEL']);
                                    }
                                } 
                                else if ($data[$key]['field_type'] == 'autocomplete')
                                {
                                    if ($key == 'folder' && $core->is_module_loaded('folder') && ($core->test_service('associate_folder', 'folder',false) == 1))
                                    {
                                    ?>  
                                        <input type="text" name="folder" id="folder" onblur="" value="<?php echo $data['folder']['show_value']; ?>" />
                                        <div id="show_folder" class="autocomplete"></div>
                                        <script type="text/javascript">initList('folder', 'show_folder','<?php echo $_SESSION['config']['businessappurl'];
                                        ?>index.php?display=true&module=folder&page=autocomplete_folders&mode=folder',  'Input', '2');</script>
                                        <?php
                                    } else { ?>
                                         <input class="readonly" type="text" name="folder" id="folder" onblur="" value="<?php echo $data['folder']['show_value']; ?>" readonly="readonly"/>
                                    <?php }
                                }
                            }
                                $detailsExport .=  "</td>";
                                ?>
                            </td>
                            <?php
                            if ($i%2 == 1 && $i!=0) // impair
                            {
                                $detailsExport .=  "</td>";
                                ?>
                                </tr>
                                <?php
                            }
                            else
                            {
                                if ($i+1 == count($data))
                                {
                                    $detailsExport .= "<td  colspan='2'>&nbsp;</td></tr>";
                                    echo '<td  colspan="2">&nbsp;</td></tr>';
                                }
                            }
                            $i++;
                            }
                        }
                        $detailsExport .=  "<tr class='col'>";
                        $detailsExport .=  "<td align='left' width='200px'>";
                        $detailsExport .=  _STATUS;
                        $detailsExport .=  "</td>";
                        $detailsExport .=  "<td>";
                        $detailsExport .=  $res_status['LABEL'];
                        $detailsExport .=  "</td>";
                        $detailsExport .=  "<td align='left' width='200px'>";
                        $detailsExport .=  _CHRONO_NUMBER;
                        $detailsExport .=  "</td>";
                        $detailsExport .=  "<td>";
                        $detailsExport .=  $chrono_number;
                        $detailsExport .=  "</td>";
                        $detailsExport .=  "</tr>";

                        ?>
                        <tr class="col">
                            <th align="left" class="picto">
                                <!--img alt="<?php echo _STATUS.' : '.$res_status['LABEL'];?>" src="<?php functions::xecho($res_status['IMG_SRC']);?>" title="<?php functions::xecho($res_status['LABEL']);?>" alt="<?php functions::xecho($res_status['LABEL']);?>"/-->
                                <?php 
                                $img_class = substr($res_status['IMG_SRC'], 0, 2);
                                ?>
                                <i class = "<?php echo $img_class; ?> <?php functions::xecho($res_status['IMG_SRC']);?> <?php echo $img_class; ?>-2x" alt = "<?php functions::xecho($res_status['LABEL']);?>" title = "<?php functions::xecho($res_status['LABEL']);?>"></i>
                            </th>
                            <td align="left" width="200px">
                                <?php echo _STATUS;?>
                            </td>
                            <td>
                                <input type="text" class="readonly" readonly="readonly" value="<?php functions::xecho($res_status['LABEL']);?>" size="40"  />
                            </td>
                        <!--</tr>
                        <tr class="col">-->
                            <th align="left" class="picto">
                                <i class="fa fa-compass fa-2x" title="<?php echo _CHRONO_NUMBER;?>" ></i>
                            </th>
                            <td align="left" width="200px">
                                <?php echo _CHRONO_NUMBER;?>
                            </td>
                            <td>
                                <input type="text" class="readonly" readonly="readonly" value="<?php functions::xecho($chrono_number);?>" size="40" title="<?php functions::xecho($chrono_number);?>" alt="<?php functions::xecho($chrono_number);?>" />
                            </td>
                        </tr>
                        <tr class="col">
                            <th align="left" class="picto">
                                <i class="fa fa-sitemap fa-2x" title="<?php echo _INITIATOR;?>" ></i>
                            </th>
                            <td align="left" width="200px">
                                <?php echo _INITIATOR;?>
                            </td>
                            <td>
                                <textarea rows="2" style="width: 200px; max-width: 200px;" class="readonly" readonly="readonly"><?php functions::xecho($entities);?></textarea>
                            </td>
                            <!-- typist -->
                            <th align="left" class="picto">
                                <i class="fa fa-user fa-2x"></i>
                            </th>
                            <td align="left" width="200px">
                                <?php echo _TYPIST;?>
                            </td>
                            <td>
                                <input type="text" class="readonly" readonly="readonly" value="<?php functions::xecho($typistLabel); 
                                ?>" size="40" title="<?php functions::xecho($typistLabel);?>" alt="<?php functions::xecho($typistLabel);?>" />
                            </td>
                        </tr>

                    </table>
                    <?php
                    $detailsExport .=  "</table>";
                    ?>

                    <div id="opt_indexes">
                    <?php if (count($indexes) > 0 || ($core->is_module_loaded('tags') && ($core->test_service('tag_view', 'tags', false) == 1)) || ($core->is_module_loaded('thesaurus') && ($core->test_service('thesaurus_view', 'thesaurus', false) == 1)))
                    {
                        ?><br/>
                        <h2>
                        <span class="date">
                            <b><?php echo _OPT_INDEXES;?></b>
                        </span>
                        </h2>
                        <br/>
                        <div class="block forms details">
                        <table cellpadding="2" cellspacing="2" border="0" id="opt_indexes_custom" width="100%">
                            <?php
                            $i=0;
                            foreach(array_keys($indexes) as $key)
                            {

                                if ($i%2 != 1 || $i==0) // pair
                                {
                                    $detailsExport .= "<tr class='col'>";
                                    ?>
                                    <tr class="col">
                                    <?php
                                }
                                $detailsExport .= "<th align='left' width='50px'>";
                                ?>
                                <th align="left" class="picto" >
                                    <?php
                                    if (isset($indexes[$key]['img']))
                                    {
                                        //$detailsExport .= "<img alt='".$indexes[$key]['label']."' title='".$indexes[$key]['label']."' src='".$indexes[$key]['img']."'  />";
                                        ?>
                                        <i class="fa fa-<?php functions::xecho($indexes[$key]['img']);?> fa-2x" title="<?php functions::xecho($indexes[$key]['label']);?>" ></i>
                                        <?php
                                    }
                                    $detailsExport .= "</th>";
                                    ?>
                                </th>
                                <?php
                                $detailsExport .= "<td align='left' width='200px'>";
                                ?>
                                <td align="left" width="200px">
                                    <?php
                                    $detailsExport .= $indexes[$key]['label'];
                                    functions::xecho($indexes[$key]['label']);?> :
                                </td>
                                <?php
                                $detailsExport .=  "</td>";
                                $detailsExport .=  "<td>";
                                ?>
                                <td>
                                    <?php
                                    $detailsExport .=  $indexes[$key]['show_value'];
                                    if ($indexes[$key]['type_field'] == 'input')
                                    {
                                        ?>
                                        <textarea name="<?php functions::xecho($key);?>" id="<?php functions::xecho($key);?>" value="<?php functions::xecho($indexes[$key]['show_value']);?>" <?php if (!isset($indexes[$key]['readonly']) || $indexes[$key]['readonly'] == true){ echo 'readonly="readonly" class="readonly"';}else if ($indexes[$key]['type'] == 'date'){echo 'onclick="showCalender(this);"';}?> style="width: 200px; "  title="<?php functions::xecho($indexes[$key]['show_value']);?>" alt="<?php functions::xecho($indexes[$key]['show_value']);?>" ></textarea>
                                        <?php
                                    }
                                    else
                                    {?>
                                        <select name="<?php functions::xecho($key);?>" id="<?php functions::xecho($key);?>" >
                                            <option value=""><?php echo _CHOOSE;?>...</option>
                                            <?php
                                            for ($j = 0; $j < count($indexes[$key]['values']); $j ++)
                                            {?>
                                                <option value="<?php functions::xecho($indexes[$key]['values'][$j]['id']);?>" <?php
                                                if ($indexes[$key]['values'][$j]['id'] == $indexes[$key]['value']) {
                                                    echo 'selected="selected"';
                                                }?>><?php functions::xecho($indexes[$key]['values'][$j]['label']);?></option><?php
                                            }?>
                                        </select><?php
                                    }

                                    $detailsExport .=  "</td>";
                                    ?>
                                </td>
                                <?php
                                if ($i%2 == 1 && $i!=0) // impair
                                {
                                    $detailsExport .=  "</td>";
                                    ?>
                                    </tr>
                                    <?php
                                }
                                else
                                {
                                    if ($i+1 == count($indexes))
                                    {
                                        $detailsExport .= "<td  colspan='2'>&nbsp;</td></tr>";
                                        echo '<td  colspan="2">&nbsp;</td></tr>';
                                    }
                                }
                                $i++;
                            }
                            ?>
                            </table>
                            <table cellpadding="2" cellspacing="2" border="0" width="100%">
                            <?php
                            if ($core->is_module_loaded('tags') && ($core->test_service('tag_view', 'tags', false) == 1)) {
                                    include_once('modules/tags/templates/details/index.php');
                            }
                    }
                            if ($core->is_module_loaded('thesaurus') && ($core->test_service('thesaurus_view', 'thesaurus', false) == 1))   
                            {  
                                require_once 'modules' . DIRECTORY_SEPARATOR . 'thesaurus'
                                . DIRECTORY_SEPARATOR . 'class' . DIRECTORY_SEPARATOR
                                . 'class_modules_tools.php';
                                $thesaurus = new thesaurus();

                                $thesaurusListRes = array();

                                $thesaurusListRes = $thesaurus->getThesaursusListRes($s_id);
                                    
                                echo '<tr id="thesaurus_tr_label" >';
                                echo '<th align="left" class="picto" ><i class="fa fa-bookmark fa-2x" title="' . _THESAURUS . '"></i></th>';
                                echo '<td style="font-weight:bold;width:200px;">'._THESAURUS.'</td>';
                                echo '<td id="thesaurus_field" colspan="6"><select multiple="multiple" id="thesaurus" name="thesaurus[]" data-placeholder=" "';

                                if (!$core->test_service('add_thesaurus_to_res', 'thesaurus', false)) {
                                    echo 'disabled="disabled"';
                                }

                                echo '>';
                                if(!empty($thesaurusListRes)){
                                    foreach ($thesaurusListRes as $key => $value) {

                                        echo '<option title="'.functions::show_string($value['LABEL']).'" data-object_type="thesaurus_id" id="thesaurus_'.$value['ID'].'"  value="' . $value['ID'] . '"';
                                            echo ' selected="selected"'; 
                                        echo '>' 
                                            .  functions::show_string($value['LABEL']) 
                                            . '</option>';

                                    }
                                }

                                echo '</select> <i onclick="lauch_thesaurus_list(this);" class="fa fa-search" title="parcourir le thésaurus" aria-hidden="true" style="cursor:pointer;"></i></td>';
                                echo '</tr>';
                                echo '<div onClick="$(\'return_previsualise_thes\').style.display=\'none\';" id="return_previsualise_thes" style="cursor: pointer; display: none; border-radius: 10px; box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.4); padding: 10px; width: auto; height: auto; position: absolute; top: 0; left: 0; z-index: 999; color: #4f4b47; text-shadow: -1px -1px 0px rgba(255,255,255,0.2);background:#FFF18F;border-radius:5px;overflow:auto;">\';
                                                <input type="hidden" id="identifierDetailFrame" value="" />
                                            </div>';
                                echo '<script>$j("#thesaurus").chosen({width: "95%", disable_search_threshold:10}); </script>';                               
                                echo '<style>#thesaurus_chosen .chosen-drop{display:none;}</style>';

                            }

                       
                    if ($core->is_module_loaded('fileplan') && ($core->test_service('put_doc_in_fileplan', 'fileplan', false) == 1) && $fileplanLabel <> "") { 
                        
                         //Requete pour récupérer position_label
                        $stmt = $db->query("SELECT position_label FROM fp_fileplan_positions INNER JOIN fp_res_fileplan_positions 
                                    ON fp_fileplan_positions.position_id = fp_res_fileplan_positions.position_id
                                    WHERE fp_res_fileplan_positions.res_id=?",array($idCourrier));

                        while($res_fileplan= $stmt->fetchObject()){
                            if(!isset($positionLabel)){
                                $positionLabel=$res_fileplan->position_label;
                            }else{
                                $positionLabel=$positionLabel." / ".$res_fileplan->position_label;
                            }  
                        }

                        //Requete pour récuperer fileplan_label
                        $stmt = $db->query("SELECT fileplan_label FROM fp_fileplan INNER JOIN fp_res_fileplan_positions
                                    ON fp_fileplan.fileplan_id = fp_res_fileplan_positions.fileplan_id
                                    WHERE fp_res_fileplan_positions.res_id=? AND fp_fileplan.user_id = ?", array($idCourrier,$_SESSION['user']['UserId']));
                        $res2 = $stmt->fetchObject();
                        $fileplanLabel=$res2->fileplan_label;
                        $planClassement= $fileplanLabel." / ".$positionLabel;
                        ?>
                            <tr class="col">
                                <th align="left" class="picto">
                                    <i class="fa fa-bookmark fa-2x" title="<?php echo _FILEPLAN;?>"></i>
                                </th>
                                <td align="left" width="200px">
                                    <?php echo _FILEPLAN;?> :
                                </td>
                                <td colspan="6">
                                    <input type="text" class="readonly" readonly="readonly" style="width:95%;" value="<?php functions::xecho($planClassement);?>" size="110"  />
                                </td>
                            </tr>
                    <?php } ?>
                        </table>
                        </div>
                        <?php  } ?>
                    </div>
                                                        </form><br><br>

<!--                                    IFRAME                                             !-->      
                    
                </div>
                <?php 
                    $technicalInfo_frame = '<div class="detailsDisplayDiv" id="uniqueDetailsDiv">';
                    $technicalInfo_frame .= '<iframe src="" name="uniqueDetailsIframe" width="100%" align="left" scrolling="yes" frameborder="0" id="uniqueDetailsIframe" style="height:100%;"></iframe>';        
                    $technicalInfo_frame .= '</div>';
                    echo $technicalInfo_frame;

                    ?>
                <?php 
                ?> 
            </dl>
       </div>

    <?php
}
?> 

</div>
</div>
<?php
//INITIALIZE INDEX TABS

//OUTGOING CREATION MODE
if($_SESSION['indexation'] == true && $category == 'outgoing'){
    $is_outgoing_indexing_mode = false;
    $selectAttachments = "SELECT attachment_type FROM res_view_attachments"
        ." WHERE res_id_master = ? and coll_id = ? and status <> 'DEL' and attachment_type = 'outgoing_mail'";
    $stmt = $db->query($selectAttachments, array($_SESSION['doc_id'], $_SESSION['collection_id_choice']));
    if($stmt->rowCount()==0){
        //launch outgoing_mail creation
        echo '<script type="text/javascript">document.getElementById(\'responses_tab\').click();showAttachmentsForm(\''.$_SESSION['config']['businessappurl'].'index.php?display=true&module=attachments&page=attachments_content&fromDetail=create&cat=outgoing\',\'98%\',\'auto\');</script>';
    }
}
$detailsExport .= "</body></html>";
$_SESSION['doc_convert'] = array();
$_SESSION['doc_convert']['details_result'] = $detailsExport;
$_SESSION['info'] = '';