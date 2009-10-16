<?php
/**
* File : users_entities_up_db.php
*
* Modify the users_entities in the database after the form
*
* @package  Maarch Framework 3.0
* @version 1
* @since 03/2009
* @license GPL
* @author  C�dric Ndoumba  <dev@maarch.org>
*/

session_name('PeopleBox');
session_start();

require_once($_SESSION['pathtocoreclass']."class_functions.php");

require($_SESSION['pathtocoreclass']."class_core_tools.php");

$core_tools = new core_tools();
$core_tools->test_admin('manage_entities', 'entities');
//here we loading the lang vars
$core_tools->load_lang();
require_once($_SESSION['pathtocoreclass']."class_db.php");
require_once($_SESSION['pathtomodules'].'entities'.DIRECTORY_SEPARATOR.'class'.DIRECTORY_SEPARATOR.'class_users_entities.php');

$usersEnt = new users_entities();

$usersEnt->addupusersentities("up");
?>
