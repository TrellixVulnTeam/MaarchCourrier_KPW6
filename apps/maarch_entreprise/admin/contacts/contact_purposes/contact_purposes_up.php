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
* @brief Modify a structure
*
*
* @file
* @author Claire Figueras <dev@maarch.org>
* @date $date$
* @version $Revision$
* @ingroup admin
*/
require "core" . DIRECTORY_SEPARATOR . "class" . DIRECTORY_SEPARATOR
    . "class_history.php";
$core = new core_tools();
if(!$core->test_admin('admin_contacts', 'apps', false)){
	if(!$core->test_admin('my_contacts', 'apps', false)){
		$core->test_admin('my_contacts_menu', 'apps');
	}
}

$mode = "";
if (isset($_GET['id']) && ! empty($_GET['id'])) {
	$mode = 'up';
	$_SESSION['m_admin']['mode'] = $mode;
} else if (isset($_SESSION['m_admin']['mode']) && ! empty($_SESSION['m_admin']['mode'])){
	$mode = $_SESSION['m_admin']['mode'];
} else {
	$_SESSION['CURRENT_ID_CONTACT_PURPOSE'] = '';
	$_SESSION['CURRENT_DESC_CONTACT_PURPOSE'] = '';
	if(isset($_GET['mode']) && ! empty($_GET['mode'])){
		$mode = $_GET['mode'];
		$_SESSION['m_admin']['mode'] = $mode;
	}
}

/****************Management of the location bar  ************/
$init = false;
if (isset($_REQUEST['reinit']) && $_REQUEST['reinit'] == "true") {
    $init = true;
}
$level = "";
if (isset($_REQUEST['level']) && ($_REQUEST['level'] == 2
    || $_REQUEST['level'] == 3 || $_REQUEST['level'] == 4
    || $_REQUEST['level'] == 1)
) {
    $level = $_REQUEST['level'];
}
$pagePath = $_SESSION['config']['businessappurl'] . 'index.php?page=contact_purposes_up';
if ($mode == "up") {
	$pageLabel = _CONTACT_PURPOSE_MODIF;
} else {
	$pageLabel = _NEW_CONTACT_PURPOSE_ADDED;
}
$pageId = "contact_purposes_up";
$core->manage_location_bar($pagePath, $pageLabel, $pageId, $init, $level);
/***********************************************************/

$db = new Database();

$desc = "";
$id = "";

if (isset($_GET['id']) && ! empty($_GET['id'])) {
	$id = $_GET['id'];
	$stmt = $db->query(
		"SELECT label FROM "
	    . $_SESSION['tablename']['contact_purposes']
	    . " WHERE id = ?", array($id)
	);

	$res = $stmt->fetchObject();
	$desc = functions::show_string($res->label);
	$_SESSION['CURRENT_ID_CONTACT_PURPOSE'] = $id;
	$_SESSION['CURRENT_DESC_CONTACT_PURPOSE'] = $desc;
}

$erreur = "";
if (isset($_REQUEST['valid'])) {
	if (isset($_REQUEST['desc_contact_purposes'])
	    && ! empty($_REQUEST['desc_contact_purposes'])
	) {
		$desc = $_REQUEST['desc_contact_purposes'];
        $desc=str_replace(';', ' ', $desc);
        $desc=str_replace('--', '-', $desc);
	    $desc = $core->wash(
	        $desc, 'no', _CONTACT_PURPOSE, 'yes', 0, 255
	    );
	    if($_SESSION['error'] <> ''){
	    	$_SESSION['error'] = '';
	    	$erreur .= _CONTACT_PURPOSE .' '. MUST_BE_LESS_THAN." 255 "._CHARACTERS;
	    }
	} else {
		$erreur .= _CONTACT_PURPOSE_MISSING . ".<br/>";
	}

	if (empty($erreur)) {
		if(utf8_encode(utf8_decode($desc)) != $desc) {
			$desc = utf8_encode($desc);
		}
		$stmt = $db->query(
			"SELECT * FROM ".$_SESSION['tablename']['contact_purposes']
		    . " WHERE lower(label) = lower(?)",
		    array($desc)
		);

		if ($stmt->rowCount() > 0 && $mode <> 'up') {
			$erreur .= _THIS_CONTACT_PURPOSE . ' ' . _ALREADY_EXISTS ;
		} else {
			if ($mode == "up") {
				$stmt = $db->query(
					"SELECT * FROM ".$_SESSION['tablename']['contact_purposes']
				    . " WHERE lower(label) = lower(?) and id <> ?",
				    array($desc, $_REQUEST['ID_contact_purposes'])
				);	
				if($stmt->rowCount() > 0){
					$erreur .= _THIS_CONTACT_PURPOSE . ' ' . _ALREADY_EXISTS ;
				} else {
					if (isset($_REQUEST['ID_contact_purposes'])
					    && ! empty($_REQUEST['ID_contact_purposes'])
					) {
						$id = $_REQUEST['ID_contact_purposes'];
						$db->query(
							"UPDATE " . $_SESSION['tablename']['contact_purposes']
						    . " set label = ?"
						    . "WHERE id = ?",
						    array($desc, $id)
						);

						if ($_SESSION['history']['contact_purposes_up'] == "true") {
							$hist = new history();
							$hist->add(
							    $_SESSION['tablename']['contact_purposes'], $id,
							    "UP", 'contact_purposes_up', _CONTACT_PURPOSE_MODIF . " " . strtolower(_NUM)
							    . $id,
							    $_SESSION['config']['databasetype']
							);
						}
						$_SESSION['info'] .= _CONTACT_PURPOSE_MODIF . " : " . $id;
					} else {
						$erreur .= _ID_CONTACT_PURPOSE_PB . ".";
					}
				}
			} else {
				$desc = $_REQUEST['desc_contact_purposes'];
				if(utf8_encode(utf8_decode($desc)) != $desc) {
					$desc = utf8_encode($desc);
				}
		        $desc=str_replace(';', ' ', $desc);
		        $desc=str_replace('--', '-', $desc);
				$db->query(
					"INSERT INTO "
				    . $_SESSION['tablename']['contact_purposes']
				    . " ( label) VALUES (?)",
				array($desc)
				);
				$stmt = $db->query(
					"SELECT id FROM "
				    . $_SESSION['tablename']['contact_purposes']
				    . " WHERE label = ?",
				    array($desc)
				);
				$res = $stmt->fetchObject();
				$id = $res->id;

				if ($_SESSION['history']['contact_purposes_add'] == "true") {
					$hist = new history();
					$hist->add(
					    $_SESSION['tablename']['contact_purposes'], $id,
					    "ADD", 'contact_purposes_add', _NEW_CONTACT_PURPOSE_ADDED . " (" . $desc . ")",
					    $_SESSION['config']['databasetype']
					);

				}
				if($mode <> 'popup'){
					$_SESSION['info'] .= _NEW_CONTACT_PURPOSE . " : " . $desc;
				}
			}
		}
	}
	if (empty($erreur)) {
		if($mode == 'popup'){
			$stmt = $db->query(
				"SELECT id, label FROM ".$_SESSION['tablename']['contact_purposes']
			    . " WHERE label = ?",
			    array($desc)
			);
			$res = $stmt->fetchObject();
			?>
				<script type="text/javascript">window.opener.$("new_id").value ="<?php functions::xecho(utf8_decode($res->label));?>";window.opener.$("contact_purposes").value ='<?php functions::xecho($res->id);?>';self.close();</script> 
			<?php
		} else {
			unset($_SESSION['m_admin']);
		?>
			<script type="text/javascript">window.location.href="<?php echo $_SESSION['config']['businessappurl'];?>index.php?page=contact_purposes";</script> 
		<?php
		}
		exit();
	} else {
		if($mode <> 'popup'){
			?>
			<div id="header">
		        <div id="nav">
	            <div><p id="ariane"><?php
	            ?></p></div>
	            <p id="gauchemenu"></p>
	            <a href="index.php"><p id="logo"></p></a>
	       </div>
			</div>
			<div id="container">
			    <div id="content">
			<?php
			/****************Management of the location bar  ************/
			$core->manage_location_bar($pagePath, $pageLabel, $pageId, $init, $level);
			/***********************************************************/
		}
	}
}

$core->load_html();

if ($mode == "up") {
	$title = _CONTACT_PURPOSE_MODIF;
} else {
	$title = _NEW_CONTACT_PURPOSE_ADDED;
}
$core->load_header($title, true, false);
$time = $core->get_session_time_expire();
?>
<!-- <body onload="setTimeout(window.close, <?php echo $time;?>*60*1000);window.resizeTo(700,700);"> -->
<br/>

<div class="error">
<?php
functions::xecho($erreur);
$erreur = "";
?>
</div>
<h1 class="tit">
<?php
if ($mode == "up") {
	?><i class="fa fa-edit fa-2x"></i> <?php
    echo _CONTACT_PURPOSE_MODIF;
} else {
	?><i class="fa fa-plus fa-2x"></i> <?php
    echo _NEW_CONTACT_PURPOSE_ADDED;
}
?></h1>
<div class="block">
<br/>

<br/>
<form method="post" name="frmcontact_purposes" id="frmcontact_purposes" class="forms" action="<?php
	echo $_SESSION['config']['businessappurl'];
	?>index.php?display=true&page=contact_purposes_up">
		<input type="hidden" name="display" value="true" />
	    <input type="hidden" name="page" value="contact_purposes_up" />
		<?php
	if ($mode == "up") {
	    ?>
		<p>
	    	<label><?php
	    echo _ID . ' ' . _CONTACT_PURPOSE;
	    ?> :</label>
			<input type="text" class="readonly" name="ID_contact_purposes" value="<?php
		functions::xecho($_SESSION['CURRENT_ID_CONTACT_PURPOSE']);
		?>" readonly="readonly" />
	     </p>
	     <p>&nbsp;</p>
		<?php
	}
	?>

		<p>
	    	<label>
	    		<?php echo _CONTACT_PURPOSE;?> :
	    	</label>
		   <input 
		   		type="text"  name="desc_contact_purposes" value="<?php functions::xecho($_SESSION['CURRENT_DESC_CONTACT_PURPOSE']);?>" 
			/>
	     </p>

	<p class="buttons">
		<input type="submit" name="valid" class="button" value="<?php
	echo _VALIDATE;
	?>" />
		<input type="button" class="button"  name="cancel" value="<?php
	echo _CANCEL;
	?>" 
	<?php 
		if($mode == 'popup'){
		?>
			onclick="self.close();"
		<?php
		} else {
		?>
			onclick="javascript:window.location.href='<?php echo $_SESSION['config']['businessappurl'];?>index.php?page=contact_purposes';" 
		<?php
		}
	?>
		/>
	<br/><br/>
	<input type="hidden" name="mode" value="<?php echo $mode;?>"/>

</form>

</div>

<div class="block_end">&nbsp;</div>

</body>
</html>

<?php 
if (isset($_REQUEST['valid']) && $mode <> 'popup') {
?>
		    <p id="footer">
		        <?php
		        if (isset($_SESSION['config']['showfooter'])
		            && $_SESSION['config']['showfooter'] == 'true'
		        ) {
		            $core->load_footer();
		        }
		        ?>
		    </p>
		    <?php
		    $_SESSION['error'] = '';
		    $_SESSION['info'] = '';
		    $core->view_debug();
		    ?>
		</div>
	</div>
<?php
}
