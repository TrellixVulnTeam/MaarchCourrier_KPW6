<?php
/*
*    Copyright 2008,2009 Maarch
*
*  This file is part of Maarch Framework.
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
*    along with Maarch Framework.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
* @brief  Search result list
*
* @file list_results_mlb.php
* @author Loïc Vinet <dev@maarch.org>
* @date $date$
* @version $Revision$
* @ingroup cases_documents_list.php
*/
session_name('PeopleBox');
session_start();
require_once($_SESSION['pathtocoreclass']."class_functions.php");
require_once($_SESSION['pathtocoreclass']."class_db.php");
require_once($_SESSION['pathtocoreclass']."class_request.php");
require_once($_SESSION['pathtocoreclass']."class_security.php");
require_once($_SESSION['pathtocoreclass']."class_core_tools.php");
require_once($_SESSION['pathtocoreclass']."class_manage_status.php");
require_once($_SESSION['config']['businessapppath']."class".DIRECTORY_SEPARATOR.'class_list_show.php');
require_once($_SESSION['config']['businessapppath']."class".DIRECTORY_SEPARATOR.'class_contacts.php');
require_once($_SESSION['pathtomodules']."cases".DIRECTORY_SEPARATOR."class".DIRECTORY_SEPARATOR.'class_modules_tools.php');
require_once($_SESSION['pathtocoreclass']."class_manage_status.php");

include_once($_SESSION['config']['businessapppath'].'definition_mail_categories.php');

$status_obj = new manage_status();
$core_tools = new core_tools();
$core_tools->test_user();
$core_tools->load_lang();
$core_tools->load_html();
$core_tools->load_header();
$sec = new security();
$status_obj = new manage_status();
$contact = new contacts();
$obj_cases = new cases();

$_SESSION['collection_id_choice'] = 'letterbox_coll';
$view = $sec->retrieve_view_from_coll_id($_SESSION['collection_id_choice'] );
$select = array();

$select[$view]= array();
$where_request = $_SESSION['searching']['cases_request'];
array_push($select[$view], "res_id", "status", "subject", "dest_user", "type_label", "creation_date", "destination", "category_id, exp_user_id", "category_id as category_img" );



$status = $status_obj->get_not_searchable_status();
$status_str = '';
for($i=0; $i<count($status);$i++)
{
	$status_str .=	"'".$status[$i]['ID']."',";
}
$status_str = preg_replace('/,$/', '', $status_str);
$where_request.= "  status not in (".$status_str.") ";
$where_clause = $sec->get_where_clause_from_coll_id($_SESSION['collection_id_choice']);

if($where_clause <> '')
{
		$where_clause .= $obj_cases->get_where_clause_from_case($_SESSION['cases']['actual_case_id']);
}

if(!empty($where_request))
{
	if($_SESSION['searching']['where_clause_bis'] <> "")
	{
		$where_clause = "((".$where_clause.") or (".$_SESSION['searching']['where_clause_bis']."))";
	}
	$where_request = '('.$where_request.') and ('.$where_clause.')';
}
else
{
	if($_SESSION['searching']['where_clause_bis'] <> "")
	{
		$where_clause = "((".$where_clause.") or (".$_SESSION['searching']['where_clause_bis']."))";
	}
	$where_request = $where_clause;
}
$where_request = str_replace("()", "(1=-1)", $where_request);
$where_request = str_replace("and ()", "", $where_request);
$list=new list_show();
$order = '';
if(isset($_REQUEST['order']) && !empty($_REQUEST['order']))
{
	$order = trim($_REQUEST['order']);
}
$field = '';
if(isset($_REQUEST['order_field']) && !empty($_REQUEST['order_field']))
{
	$field = trim($_REQUEST['order_field']);
}

$orderstr = $list->define_order($order, $field);

$request = new request();
$tab=$request->select($select,$where_request,$orderstr,$_SESSION['config']['databasetype']);

$_SESSION['error_page'] = '';



//build the tab with right format for list_doc function
if (count($tab) > 0)
{
	for ($i=0;$i<count($tab);$i++)
	{
		for ($j=0;$j<count($tab[$i]);$j++)
		{
			foreach(array_keys($tab[$i][$j]) as $value)
			{
				if($tab[$i][$j][$value]=='res_id')
				{
					$tab[$i][$j]['res_id']=$tab[$i][$j]['value'];
					$tab[$i][$j]["label"]=_GED_NUM;
					$tab[$i][$j]["size"]="6";
					$tab[$i][$j]["label_align"]="left";
					$tab[$i][$j]["align"]="center";
					$tab[$i][$j]["valign"]="bottom";
					$tab[$i][$j]["show"]=true;
					$tab[$i][$j]["value_export"] = $tab[$i][$j]['value'];
					$tab[$i][$j]["order"]='res_id';
					$_SESSION['mlb_search_current_res_id'] = $tab[$i][$j]['value'];
				}
				if($tab[$i][$j][$value]=="type_label")
				{
					$tab[$i][$j]["label"]=_TYPE;
					$tab[$i][$j]['value'] = $request->show_string($tab[$i][$j]['value']);
					$tab[$i][$j]["size"]="15";
					$tab[$i][$j]["label_align"]="left";
					$tab[$i][$j]["align"]="left";
					$tab[$i][$j]["valign"]="bottom";
					$tab[$i][$j]["show"]=true;
					$tab[$i][$j]["value_export"] = $tab[$i][$j]['value'];
					$tab[$i][$j]["order"]="type_label";
				}
				if($tab[$i][$j][$value]=="status")
				{
					$tab[$i][$j]["label"]=_STATUS;
					$res_status = $status_obj->get_status_data($tab[$i][$j]['value'],$extension_icon);
					$tab[$i][$j]['value'] = "<img src = '".$res_status['IMG_SRC']."' alt = '".$res_status['LABEL']."' title = '".$res_status['LABEL']."'>";
					$tab[$i][$j]["size"]="5";
					$tab[$i][$j]["label_align"]="left";
					$tab[$i][$j]["align"]="left";
					$tab[$i][$j]["valign"]="bottom";
					$tab[$i][$j]["show"]=true;
					$tab[$i][$j]["value_export"] = $tab[$i][$j]['value'];
					$tab[$i][$j]["order"]="status";
				}
				if($tab[$i][$j][$value]=="subject")
				{
					$tab[$i][$j]["label"]=_SUBJECT;
					$tab[$i][$j]['value'] = $request->show_string($tab[$i][$j]['value']);
					$tab[$i][$j]["size"]="25";
					$tab[$i][$j]["label_align"]="left";
					$tab[$i][$j]["align"]="left";
					$tab[$i][$j]["valign"]="bottom";
					$tab[$i][$j]["show"]=true;
					$tab[$i][$j]["value_export"] = $tab[$i][$j]['value'];
					$tab[$i][$j]["order"]="subject";
				}
				if($tab[$i][$j][$value]=="dest_user")
				{
					$tab[$i][$j]["label"]=_DEST_USER;
					$tab[$i][$j]["size"]="10";
					$tab[$i][$j]["label_align"]="left";
					$tab[$i][$j]["align"]="left";
					$tab[$i][$j]["valign"]="bottom";
					$tab[$i][$j]["show"]=true;
					$tab[$i][$j]["value_export"] = $tab[$i][$j]['value'];
					$tab[$i][$j]["order"]="dest_user";
				}
				if($tab[$i][$j][$value]=="creation_date")
				{
					$tab[$i][$j]["label"]=_REG_DATE;
					$tab[$i][$j]["size"]="10";
					$tab[$i][$j]["label_align"]="left";
					$tab[$i][$j]["align"]="left";
					$tab[$i][$j]["valign"]="bottom";
					$tab[$i][$j]["show"]=true;
					$tab[$i][$j]["value_export"] = $tab[$i][$j]['value'];
					$tab[$i][$j]["value"] = $request->format_date_db($tab[$i][$j]['value'], false);
					$tab[$i][$j]["order"]="creation_date";
				}
				if($tab[$i][$j][$value]=="destination")
				{
					$tab[$i][$j]["label"]=_ENTITY;
					$tab[$i][$j]['value'] = $request->show_string($tab[$i][$j]['value']);
					$tab[$i][$j]["size"]="10";
					$tab[$i][$j]["label_align"]="left";
					$tab[$i][$j]["align"]="left";
					$tab[$i][$j]["valign"]="bottom";
					$tab[$i][$j]["show"]=false;
					$tab[$i][$j]["value_export"] = $tab[$i][$j]['value'];
					$tab[$i][$j]["order"]="destination";
				}
				if($tab[$i][$j][$value]=="category_id")
				{
					$_SESSION['mlb_search_current_category_id'] = $tab[$i][$j]['value'];
					$tab[$i][$j]["label"]=_CATEGORY;
					$tab[$i][$j]["size"]="10";
					$tab[$i][$j]["label_align"]="left";
					$tab[$i][$j]["align"]="left";
					$tab[$i][$j]["valign"]="bottom";
					$tab[$i][$j]["show"]=true;
					$tab[$i][$j]["value_export"] = $tab[$i][$j]['value'];
					$tab[$i][$j]["value"] = $_SESSION['mail_categories'][$tab[$i][$j]['value']];
					$tab[$i][$j]["order"]="category_id";

				}
				if($tab[$i][$j][$value]=="category_img")
				{
					$tab[$i][$j]["label"]=_CATEGORY;
					$tab[$i][$j]["size"]="10";
					$tab[$i][$j]["label_align"]="left";
					$tab[$i][$j]["align"]="left";
					$tab[$i][$j]["valign"]="bottom";
					$tab[$i][$j]["show"]=false;
					$tab[$i][$j]["value_export"] = $tab[$i][$j]['value'];
					$my_imgcat = get_img_cat($tab[$i][$j]['value'],$extension_icon);
					$tab[$i][$j]['value'] = "<img src = '".$my_imgcat."' alt = '' title = ''>";
					$tab[$i][$j]["value"] = $tab[$i][$j]['value'];
					$tab[$i][$j]["order"]="category_id";
				}
				if($tab[$i][$j][$value]=="exp_user_id")
				{
					$tab[$i][$j]["label"]=_CONTACT;
					$tab[$i][$j]["size"]="10";
					$tab[$i][$j]["label_align"]="left";
					$tab[$i][$j]["align"]="left";
					$tab[$i][$j]["valign"]="bottom";
					$tab[$i][$j]["show"]=false;
					$tab[$i][$j]["value_export"] = $tab[$i][$j]['value'];
					$tab[$i][$j]["value"] = $contact->get_contact_information($_SESSION['mlb_search_current_res_id'],$_SESSION['mlb_search_current_category_id'],$view);
					$tab[$i][$j]["order"]=false;
				}
			
			}
		}
	}
?>
<body id="tabricator_frame">
<?php


$details = 'details';
	$list->list_doc($tab,$i,'','res_id','cases_documents_list','res_id',$details.'&dir=indexing_searching',false,false,'','','',true,true,true, false,false,false,true,false,'', '',false,'','','listing2 smallfont ', '', false, false, null, '', '{}', false, '', true, '', false);
	?><?php
}

?>
</body>
