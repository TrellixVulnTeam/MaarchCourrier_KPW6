<?php

/*
*    Copyright 2008-2016 Maarch
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
*  Users_entities class
*
* Contains all the functions to manage entities and users through session variables
*
* @package  Maarch Framework 3.0
* @version 1
* @since 03/2009
* @license GPL
* @author  <dev@maarch.org>
*/
require("modules/entities/entities_tables.php");

abstract class users_entities_Abstract extends functions
{

    /**
    * Loads in the session variables the entities of the user passed in parameter
    *
    * @param    string  $user_id user identifier
    */
    public function load_entities_session($user_id)
    {
        $db = new Database();
        $stmt = $db->query("select  ue.entity_id, ue.primary_entity, ue.user_role, e.entity_label, e.short_label from ".ENT_USERS_ENTITIES." ue, ".ENT_ENTITIES." e where ue.user_id = ? and ue.entity_id = e.entity_id",array(trim($user_id)));
        if($stmt->rowCount() == 0)
        {
            $_SESSION['m_admin']['entity']['entities'] = array();
        }
        else
        {
            $entitytab = array();
            while($res = $stmt->fetchObject())
            {
                array_push($entitytab, array("USER_ID" => $user_id,"ENTITY_ID" => $res->entity_id, "LABEL" => functions::show_string($res->entity_label),"SHORT_LABEL" => functions::show_string($res->short_label), "PRIMARY" => $res->primary_entity, "ROLE" => functions::show_string($res->user_role) ));
            }
            $_SESSION['m_admin']['entity']['entities'] = $entitytab;

        }
        $_SESSION['m_admin']['load_entities']  = false;
    }


    /**
    * Put in an array ($tmparray) the identifiers of all children of an entity
    *
    * @param    string  $entity_id entity identifier
    * @param    array  $tmparray the array who receive the children
    */
    public function getEntityChildren($parent_id)
    {
        $entities = array();
        $db = new Database();
        $stmt = $db->query('SELECT entity_id, parent_entity_id FROM entities WHERE parent_entity_id = \''.$parent_id.'\' order by entity_id asc', array());
        while($row=$stmt->fetch(PDO::FETCH_ASSOC)){
                $stmt3 = $db->query(
                        "SELECT count(entity_id) as total FROM entities WHERE parent_entity_id IN ('".$row['entity_id']."')"
                );
                $row3 = $stmt3->fetch(PDO::FETCH_ASSOC);

                $entities[] = $row['entity_id'];
                
                $entities = array_merge($entities,self::getEntityChildren($row['entity_id']));
        }
        return $entities ;
    }


    /**
    * Form to add or modify users - entities relations
    *
    * @param string $mode up or add
    * @param integer $id user identifier, empty by default
    */
    public function formuserentities($mode, $id = "")
    {
        // the form to add or modify users
        $func = new functions();

        $state = true;
        if(empty($_SESSION['error']))
        {
            $db = new Database();
            $stmt = $db->query("select count(*) as total from ".ENT_ENTITIES." where enabled ='Y'");
            $nb_total_1 = $stmt->fetchObject();
            $_SESSION['m_admin']['nbentities']  = $nb_total_1->total;
        }
        if($mode == "up")
        {
            $_SESSION['m_admin']['mode'] = "up";
            if(empty($_SESSION['error']))
            {
                $db = new Database();
                $stmt = $db->query("select * from ".$_SESSION['tablename']['users']." where user_id = ?",array(trim($id)));

                if($stmt->rowCount() == 0)
                {
                    $_SESSION['error'] = _USER.' '._UNKNOWN;
                    $state = false;
                }
                else
                {
                    $line = $stmt->fetchObject();

                    $_SESSION['m_admin']['entity']['user_UserId'] = $line->user_id;
                    $_SESSION['m_admin']['entity']['user_FirstName'] = $this->show_string($line->firstname);
                    $_SESSION['m_admin']['entity']['user_LastName'] = $this->show_string($line->lastname);
                    $_SESSION['m_admin']['entity']['user_Phone'] = $line->phone;
                    $_SESSION['m_admin']['entity']['user_Mail'] = $line->mail;
                    $_SESSION['m_admin']['entity']['user_Department'] = $this->show_string($line->department);
                    $_SESSION['m_admin']['entity']['user_Status'] = $line->enabled;

                }

                if (($_SESSION['m_admin']['load_entities'] == true || ! isset($_SESSION['m_admin']['load_entities'] )) && $_SESSION['m_admin']['entity']['user_UserId'] <> "superadmin")
                {
                    $this->load_entities_session($_SESSION['m_admin']['entity']['user_UserId']);
                }
            }
        }

        if($mode == "up")
        {
            echo '<h1><i class="fa fa-sitemap fa-2x"></i> '._USER_ENTITIES_ADDITION.'</h1>';
        }

        ?>
        <div id="inner_content" class="clearfix">
            <div id="add_box" class="block">
                <p>
                <?php
                if($_SESSION['m_admin']['entity']['user_UserId'] <> "superadmin")
                {
                ?>
                    <iframe name="usersEnt" id="usersEnt" class="frameform2" src="<?php echo $_SESSION['config']['businessappurl'].'index.php?display=true&module=entities&page=users_entities_form';?>" frameborder="0"></iframe>
                 <?php
                 }
                 ?>
                </p>
            </div>
            <?php
            if($state == false)
            {
                $_SESSION['error'] = _USER.' '._UNKNOWN;
                echo '<div class="error">'.$_SESSION['error'].'</div>';
            }
            else
            {
                ?>
                <form name="frmuserent" method="post" action="<?php  if($mode == "up") { echo $_SESSION['config']['businessappurl'].'index.php?display=true&module=entities&page=users_entities_up_db'; }  ?>" class="forms addforms" >
                                <p>
                    <label for="UserId"><?php echo _ID;?> :</label>
                    <?php  if($mode == "up") { functions::xecho($_SESSION['m_admin']['entity']['user_UserId']); } ?>
                    <input type="hidden"  name="id" id="id" value="<?php functions::xecho($id);?>" />
                </p>

                <p>
                    <label for="LastName"><?php echo _LASTNAME;?> :</label>
                    <?php functions::xecho($func->show_str($_SESSION['m_admin']['entity']['user_LastName']));?>
                </p>
                <p>
                    <label for="FirstName"><?php echo _FIRSTNAME;?> :</label>
                    <?php functions::xecho($func->show_str($_SESSION['m_admin']['entity']['user_FirstName']));?>
                </p>
                <p>
                    <label for="Phone"><?php echo _PHONE_NUMBER;?> :</label>
                    <?php functions::xecho($_SESSION['m_admin']['entity']['user_Phone']);?>
                </p>
                <p>
                    <label for="Mail"><?php echo _MAIL;?> :</label>
                    <?php functions::xecho($_SESSION['m_admin']['entity']['user_Mail']);?>
                </p>
                    <p class="buttons">
                        <input type="submit" name="Submit" value="<?php echo _VALIDATE;?>" class="button"/>
                        <input type="button" class="button"  name="cancel" value="<?php echo _CANCEL;?>" onclick="javascript:window.location.href='<?php echo $_SESSION['config']['businessappurl'];?>index.php?page=users_list&amp;module=entities';"/>
                    </p>
                </form>
            </div>

            <?php
            }

    }


    /**
    * Updates the database (users_entities table) with the session variables.
    *
    */
    public function load_db($from_module_entities_page = true)
    {
        $db = new Database();

        if(!$from_module_entities_page)
        {
            $stmt = $db->query("DELETE FROM ".ENT_USERS_ENTITIES ." where user_id = ?",array(trim($_SESSION['m_admin']['users']['user_id'])));
        }
        else
        {
            $stmt = $db->query("DELETE FROM ".ENT_USERS_ENTITIES ." where user_id = ?",array(trim($_SESSION['m_admin']['entity']['user_UserId'])));
        }
        for($i=0; $i < count($_SESSION['m_admin']['entity']['entities'] ); $i++)
        {
            $tmp_r = $_SESSION['m_admin']['entity']['entities'][$i]['ROLE'];
            if(!$from_module_entities_page)
            {
                $stmt = $db->query("INSERT INTO ".ENT_USERS_ENTITIES." VALUES (?, ?, ?, ?)",array($_SESSION['m_admin']['users']['user_id'],$_SESSION['m_admin']['entity']['entities'][$i]['ENTITY_ID'],$tmp_r,$_SESSION['m_admin']['entity']['entities'][$i]['PRIMARY']));
            }
            else
            {
                $this->query("INSERT INTO ".ENT_USERS_ENTITIES." VALUES (?, ?, ?, ?)",array($_SESSION['m_admin']['entity']['user_UserId'],$_SESSION['m_admin']['entity']['entities'][$i]['ENTITY_ID'],$tmp_r,$_SESSION['m_admin']['entity']['entities'][$i]['PRIMARY']));
            }
        }

    }


    /**
    * Add ou modify users_entities in the database
    *
    * @param string $mode up or add
    */
    public function addupusersentities($mode)
    {
        $primary_set = false;
        if(!empty($_SESSION['m_admin']['entity']['entities'])   )
        {
            for($i=0; $i < count($_SESSION['m_admin']['entity']['entities']); $i++)
            {
                if($_SESSION['m_admin']['entity']['entities'][$i]['PRIMARY'] == 'Y')
                {
                    $primary_set = true;
                    break;
                }
            }

            if ($primary_set == false)
            {
                $_SESSION['error'] = _NO_PRIMARY_ENTITY;
            }
        }


        if(!empty($_SESSION['error']))
        {
            if($mode == "up")
            {
                if(!empty($_SESSION['m_admin']['entity']['user_UserId']))
                {
                    header("location: ".$_SESSION['config']['businessappurl']."index.php?page=users_entities_up&id=".$_SESSION['m_admin']['entity']['user_UserId']."&module=entities");
                    exit();
                }
                else
                {
                    header("location: ".$_SESSION['config']['businessappurl']."index.php?page=users_list&module=entities");
                    exit();
                }
            }

        }
        else
        {

            if($mode == "up")
            {
                if($_SESSION['m_admin']['entity']['user_UserId'] <> "superadmin")
                {
                    $this->load_db();
                }
                if($_SESSION['history']['usersup'] == "true")
                {
                    $tmp_h = $this->protect_string_db(_USER_UPDATE." : ".$_SESSION['m_admin']['entity']['user_LastName']." ".$_SESSION['m_admin']['entity']['user_FirstName']." (".$_SESSION['m_admin']['entity']['user_UserId'].")");
                    require_once("core".DIRECTORY_SEPARATOR."class".DIRECTORY_SEPARATOR."class_history.php");
                    $hist = new history();
                    $hist->add($_SESSION['tablename']['users'], $_SESSION['m_admin']['entity']['user_UserId'],"UP",'usersup',$tmp_h, $_SESSION['config']['databasetype']);
                }

                $this->clearuserinfos();

                $_SESSION['info'] = _USER_UPDATED;
                header("location: ".$_SESSION['config']['businessappurl'].'index.php?page=users_list&module=entities');
                exit();
            }

        }
    }

    /**
    * Clear the users add or modification vars
    */
    protected function clearuserinfos()
    {
        unset($_SESSION['m_admin']);
    }

}
?>
