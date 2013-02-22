<?php
/*
*
*    Copyright 2008,2012 Maarch
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
* @brief    Contacts list of the current user
*
* @file     my_contacts.php
* @author   Yves Christian Kpakpo <dev@maarch.org>
* @date     $date$
* @version  $Revision$
* @ingroup  apps
*/

require_once "core".DIRECTORY_SEPARATOR."class".DIRECTORY_SEPARATOR."class_request.php";
require_once "apps".DIRECTORY_SEPARATOR.$_SESSION['config']['app_id'].DIRECTORY_SEPARATOR
            ."class".DIRECTORY_SEPARATOR."class_lists.php";

$core_tools = new core_tools();
$request    = new request();
$list       = new lists();   

 $parameters = '';
 if (isset($_REQUEST['order']) && !empty($_REQUEST['order'])) $parameters .= '&order='.$_REQUEST['order'];
 if (isset($_REQUEST['order_field']) && !empty($_REQUEST['order_field'])) $parameters .= '&order_field='.$_REQUEST['order_field'];
 if (isset($_REQUEST['what']) && !empty($_REQUEST['what'])) $parameters .= '&what='.$_REQUEST['what'];
 if (isset($_REQUEST['start']) && !empty($_REQUEST['start'])) $parameters .= '&start='.$_REQUEST['start'];
 

 if (isset($_REQUEST['load'])) {
    $_SESSION['m_admin'] = array();
    $core_tools->test_service('my_contacts', 'apps');

    /****************Management of the location bar  ************/
    $init = false;
    if(isset($_REQUEST['reinit']) && $_REQUEST['reinit'] == "true")
    {
        $init = true;
    }
    $level = "";
    if(isset($_REQUEST['level']) && ($_REQUEST['level'] == 2 || $_REQUEST['level'] == 3 || $_REQUEST['level'] == 4 || $_REQUEST['level'] == 1))
    {
        $level = $_REQUEST['level'];
    }
    $page_path = $_SESSION['config']['businessappurl'].'index.php?page=my_contacts&dir=my_contacts';
    $page_label = _CONTACTS_LIST;
    $page_id = "my_contacts";
    $core_tools->manage_location_bar($page_path, $page_label, $page_id, $init, $level);
    /***********************************************************/
    ?>
    <div id="inner_content">
    <?php    
    //Load list
    $target = $_SESSION['config']['businessappurl'].'index.php?page=my_contacts&dir=my_contacts'.$parameters;
    $listContent = $list->loadList($target, true, 'divList', 'false');
    echo $listContent;
    ?>
    </div>
    <?php
} else {
//Table
    $table = $_SESSION['tablename']['contacts'];
    $select[$table]= array(); 
    
//Fields
    array_push($select[$table],"contact_id", "is_corporate_person", "society", "lastname", "firstname", "enabled");
    
//Where clause
    $where_tab = array();
    //
    $where_tab[] = "(user_id  = '".$_SESSION['user']['UserId']."' and enabled = 'Y')";
    //Filtre alphabetique et champ de recherche
    $what = $list->getWhatSearch();
    if (!empty($what)) {
        $where_tab[] = "(lower(lastname) like lower('"
                        .$request->protect_string_db($what)
                        ."%') or lower(society) like lower('"
                        .$request->protect_string_db($what)."%'))";
    }
    //Build where
    $where = implode(' and ', $where_tab);
    
//Order
    $order = $order_field = '';
    $order = $list->getOrder();
    $order_field = $list->getOrderField();
    if (!empty($order_field) && !empty($order)) 
        $orderstr = "order by ".$order_field." ".$order;
    else  {
        $list->setOrder('asc');
        $list->setOrderField('lastname, society');
        $orderstr = "order by lastname, society asc";
    }

//Request
    $tab=$request->select($select,$where,$orderstr,$_SESSION['config']['databasetype']);
    // $request->show();
    
//Result array    
    for ($i=0;$i<count($tab);$i++)
    {
        for ($j=0;$j<count($tab[$i]);$j++)
        {
            foreach(array_keys($tab[$i][$j]) as $value)
            {
                if($tab[$i][$j][$value]=="contact_id")
                {
                    $tab[$i][$j]["contact_id"]=$tab[$i][$j]['value'];
                    $tab[$i][$j]["label"]= _ID;
                    $tab[$i][$j]["size"]="5";
                    $tab[$i][$j]["label_align"]="left";
                    $tab[$i][$j]["align"]="left";
                    $tab[$i][$j]["valign"]="bottom";
                    $tab[$i][$j]["show"]=true;
                    $tab[$i][$j]["order"]= "contact_id";
                }
                if($tab[$i][$j][$value]=="is_corporate_person")
                {
                    $tab[$i][$j]['value']= ($tab[$i][$j]['value'] == 'Y')? _YES : _NO;
                    $tab[$i][$j]["label"]=_IS_CORPORATE_PERSON;
                    $tab[$i][$j]["size"]="5";
                    $tab[$i][$j]["label_align"]="center";
                    $tab[$i][$j]["align"]="center";
                    $tab[$i][$j]["valign"]="bottom";
                    $tab[$i][$j]["show"]=true;
                    $tab[$i][$j]["order"]= "is_corporate_person";
                }
                if($tab[$i][$j][$value]=="society")
                {
                    $tab[$i][$j]['value']=$request->show_string($tab[$i][$j]['value']);
                    $tab[$i][$j]["society"]=$tab[$i][$j]['value'];
                    $tab[$i][$j]["label"]=_SOCIETY;
                    $tab[$i][$j]["size"]="25";
                    $tab[$i][$j]["label_align"]="left";
                    $tab[$i][$j]["align"]="left";
                    $tab[$i][$j]["valign"]="bottom";
                    $tab[$i][$j]["show"]=true;
                    $tab[$i][$j]["order"]= "society";
                }
                if($tab[$i][$j][$value]=="lastname")
                {
                    $tab[$i][$j]['value']=$request->show_string($tab[$i][$j]['value']);
                    $tab[$i][$j]["lastname"]=$tab[$i][$j]['value'];
                    $tab[$i][$j]["label"]=_LASTNAME;
                    $tab[$i][$j]["size"]="15";
                    $tab[$i][$j]["label_align"]="left";
                    $tab[$i][$j]["align"]="left";
                    $tab[$i][$j]["valign"]="bottom";
                    $tab[$i][$j]["show"]=true;
                    $tab[$i][$j]["order"]= "lastname";
                }
                if($tab[$i][$j][$value]=="firstname")
                {
                    $tab[$i][$j]["firstname"]= $tab[$i][$j]['value'];
                    $tab[$i][$j]["label"]=_FIRSTNAME;
                    $tab[$i][$j]["size"]="20";
                    $tab[$i][$j]["label_align"]="center";
                    $tab[$i][$j]["align"]="center";
                    $tab[$i][$j]["valign"]="bottom";
                    $tab[$i][$j]["show"]=true;
                    $tab[$i][$j]["order"]= "firstname";
                }
                if($tab[$i][$j][$value]=="enabled")
				{
					$tab[$i][$j]["enabled"]= $tab[$i][$j]['value'];
					$tab[$i][$j]["label"]=_STATUS;
					$tab[$i][$j]["size"]="1";
					$tab[$i][$j]["label_align"]="left";
					$tab[$i][$j]["align"]="center";
					$tab[$i][$j]["valign"]="bottom";
					$tab[$i][$j]["show"]=false;
					$tab[$i][$j]["order"]='enabled';
				}
            }
        }
    } 

//List parameters
    $paramsTab = array();
    $paramsTab['bool_modeReturn'] = false;                                              //Desactivation du mode return (vs echo)
    $paramsTab['pageTitle'] =  _CONTACTS_LIST." : ".count($tab).' '._CONTACTS;           //Titre de la page
    $paramsTab['urlParameters'] = '&dir=my_contacts';                                   //parametre d'url supplementaire
    $paramsTab['pagePicto'] = $_SESSION['config']['businessappurl']
            ."static.php?filename=manage_contact_b.gif";                                //Image (pictogramme) de la page
    $paramsTab['bool_sortColumn'] = true;                                               //Affichage Tri
    $paramsTab['bool_showSearchTools'] = true;                                          //Afficle le filtre alphabetique et le champ de recherche
    $paramsTab['searchBoxAutoCompletionUrl'] = $_SESSION['config']['businessappurl']
        ."index.php?display=true&dir=my_contacts&page=contact_list_by_name";            //Script pour l'autocompletion
    $paramsTab['searchBoxAutoCompletionMinChars'] = 2;                                  //Nombre minimum de caractere pour activer l'autocompletion (1 par defaut)
    $paramsTab['bool_showAddButton'] = true;                                            //Affichage du bouton Nouveau
    $paramsTab['addButtonLabel'] = _CONTACT_ADDITION;                                   //Libell� du bouton Nouveau
    // $paramsTab['addButtonLink'] = $_SESSION['config']['businessappurl']
        // ."index.php?dir=my_contacts&page=my_contact_add";                            //Lien sur le bouton nouveau (1)
    $paramsTab['addButtonScript'] = "window.top.location='".$_SESSION['config']['businessappurl']
        ."index.php?dir=my_contacts&page=my_contact_add'";                              //Action sur le bouton nouveau (2)

    //Action icons array
    $paramsTab['actionIcons'] = array();
        //get start
        $start = $list->getStart();
        
        $update = array(
                "script"        => "window.top.location='".$_SESSION['config']['businessappurl']
                                        ."index.php?dir=my_contacts&page=my_contact_up&id=@@contact_id@@&what=".$what."&start=".$start."'",
                "class"         =>  "change",
                "label"         =>  _MODIFY,
                "tooltip"       =>  _MODIFY
                );
        $delete = array(
                "href"          => $_SESSION['config']['businessappurl']
                                    ."index.php?dir=my_contacts&page=my_contact_del&what=".$what."&start=".$start,
                "class"         =>  "delete",
                "label"         =>  _DELETE,
                "tooltip"       =>  _DELETE,
                "alertText"     =>  _REALLY_DELETE.": @@society@@ @@lastname@@ @@firstname@@ ?"
                );
        array_push($paramsTab['actionIcons'], $update);          
        array_push($paramsTab['actionIcons'], $delete);
    
//Afficher la liste
    echo '<br/>';
    $list->showList($tab, $paramsTab, 'contact_id');
}

