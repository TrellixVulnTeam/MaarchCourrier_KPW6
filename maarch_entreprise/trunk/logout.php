<?php
/**
* File : deco.php
*
* use this to terminate your session
*
* @package  Maarch PeopleBox 1.0
* @version 2.1
* @since 10/2005
* @license GPL
* @author  Claire Figueras  <dev@maarch.org>
*/

require_once("core".DIRECTORY_SEPARATOR."class".DIRECTORY_SEPARATOR."class_history.php");
core_tools::load_lang();
setcookie("maarch", "",time()-3600000);
$_SESSION['error'] = _NOW_LOGOUT;
if(isset($_GET['abs_mode']))
{
    $_SESSION['error'] .= ', '._ABS_LOG_OUT;
}


if($_SESSION['history']['userlogout'] == "true")
{
    $hist = new history();
    $ip = $_SERVER['REMOTE_ADDR'];
    $navigateur = addslashes($_SERVER['HTTP_USER_AGENT']);
    //$host = gethostbyaddr($_SERVER['REMOTE_ADDR']);
    $host = $_SERVER['REMOTE_ADDR'];
    $hist->add($_SESSION['tablename']['users'],$_SESSION['user']['UserId'],"LOGOUT","IP : ".$ip.", BROWSER : ".$navigateur.", HOST : ".$host, $_SESSION['config']['databasetype']);
}
$custom = $_SESSION['custom_override_id'];
$core_path = $_SESSION['config']['corepath'];
$app_url = $_SESSION['config']['businessappurl'];
$app_id = $_SESSION['config']['app_id'];
$_SESSION = array();
$_SESSION['custom_override_id'] = $custom;
$_SESSION['config']['corepath'] = $core_path ;
$_SESSION['config']['app_id'] = $app_id ;

if ($_GET['logout'])
    $logout_extension = "&logout=true";
else
    $logout_extension = "";

header("location: ".$app_url."index.php?display=true&page=login".$logout_extension."&coreurl=".$_GET['coreurl']);
exit();
?>
