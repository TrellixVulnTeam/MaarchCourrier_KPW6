<?php
/**
* File : note_add.php
*
* Popup add a note
*
* @package Maarch LetterBox 2.3
* @version 1.0
* @since 06/2007
* @license GPL
* @author  Claire Figueras  <dev@maarch.org>
*/
require_once "core" . DIRECTORY_SEPARATOR . "class" . DIRECTORY_SEPARATOR
. "class_security.php";
require_once "core/class/class_history.php";
require_once 'modules/notes/notes_tables.php';
require_once "modules/entities/class/EntityControler.php";
require_once "modules" . DIRECTORY_SEPARATOR . "notes" . DIRECTORY_SEPARATOR
. "class" . DIRECTORY_SEPARATOR
. "class_modules_tools.php";
$core = new core_tools();
$sec = new security();
$ent = new EntityControler();
$notes_mod_tools = new notes();
//here we loading the lang vars
$core->load_lang();
$func = new functions();
$db = new Database();

$core->load_html();
//here we building the header
$core->load_header(_ADD_NOTE, true, false);
$time = $core->get_session_time_expire();
$identifier = '';
$table = '';
$collId = '';
$extendUrl = '';
$extendUrlValue = '';
if(isset($_GET['redirect'])){
    $redirect="redirect";
}else{
    $redirect="";
}
if (isset($_REQUEST['size']) && $_REQUEST['size'] == "full") {
    $extendUrl = "&size=full";
    $extendUrlValue = $_REQUEST['size'];
}

if (isset($_REQUEST['identifier']) && ! empty($_REQUEST['identifier'])) {
    $identifier = trim($_REQUEST['identifier']);
}
if (isset($_REQUEST['coll_id']) && ! empty($_REQUEST['coll_id'])) {
    $collId = trim($_REQUEST['coll_id']);
    $view = $sec->retrieve_view_from_coll_id($collId);
    $table = $sec->retrieve_table_from_coll($collId);
}

if (isset($_REQUEST['table']) && ! empty($_REQUEST['table'])) {
    $table = trim($_REQUEST['table']);
}

?>
<body id="pop_up" onload="resizeTo(500, 500);setTimeout(window.close, <?php
    echo $time;
    ?>*60*1000);">
<?php

if (isset($_REQUEST['notes']) && ! empty($_REQUEST['notes'])) {

    $db->query(
        "INSERT INTO " . NOTES_TABLE . "(identifier, note_text, date_note, "
            . "user_id, coll_id, tablename) VALUES"
    . " (?, ?, CURRENT_TIMESTAMP, ?, ?, ?)",
    array($identifier, $_REQUEST['notes'], $_SESSION['user']['UserId'], $collId, $table)
    );
    $sequence_name = 'notes_seq';

    $id = $db->lastInsertId($sequence_name);
    if (isset($_REQUEST['entities_chosen']) && !empty($_REQUEST['entities_chosen']))
    {
        $notes['copy_entities'] = array();
        for ($i=0; $i<count($_REQUEST['entities_chosen']); $i++) 
        {
            $notes['copy']['entities'] = array_push($notes['copy_entities'], $_REQUEST['entities_chosen'][$i]);
        }
        for ($i=0; $i<count($notes['copy_entities']); $i++) 
        {   
            $db->query(
                "INSERT INTO " . NOTE_ENTITIES_TABLE . "(note_id, item_id) VALUES"
                . " (?, ?)",
                array($id, $notes['copy_entities'][$i])
            );
        }
    }
    
    if ($_SESSION['history']['noteadd']) {
        $hist = new history();
        if (isset($_SESSION['origin']) && $_SESSION['origin'] == "show_folder") {
            $hist->add(
                $table, $identifier, "UP", 'resup', _ADDITION_NOTE . _ON_FOLDER_NUM
                . $identifier . ' (' . $id . ') : "' . substr(functions::protect_string_db($_REQUEST['notes']), 0, 254) .'"',
                $_SESSION['config']['databasetype'], 'notes'
                );
        } else {
            $hist->add(
                $view, $identifier, "UP", 'resup',  _ADDITION_NOTE . _ON_DOC_NUM
                . $identifier . ' (' . $id . ') ',
                $_SESSION['config']['databasetype'], 'notes'
                );
        }

        $hist->add(
            NOTES_TABLE, $id, "ADD", 'noteadd', _NOTES_ADDED . ' (' . $id . ')',
            $_SESSION['config']['databasetype'], 'notes'
            );
    }

    if (isset($_REQUEST['origin']) && $_SESSION['origin'] <> 'valid'
        && $_SESSION['origin'] <> 'qualify'
        ) {
        //$_SESSION['error'] = _ADDITION_NOTE;
    }
if(isset($_GET['redirect'])){
    header('Location: '.$_SESSION['config']['businessappurl'].'index.php?display=true&module=notes&page=note_add&identifier='.$_GET['identifier'].'&table='.$table.'&coll_id='.$collId.'&redirect&success');
}else{
    ?>
    <script type="text/javascript">
        <?php

        if (isset($_SESSION['origin']) && $_SESSION['origin'] == "process") {
            ?>
            var eleframe1 = window.opener.top.frames['process_frame'].document.getElementById('list_notes_doc');
            <?php
        } else if (isset($_SESSION['origin']) && ($_SESSION['origin'] == "valid"
            || $_SESSION['origin'] == 'qualify')
        ) {
            ?>
            var eleframe1 = window.opener.top.frames['index'].document.frames['myframe'].document.getElementById('list_notes_doc');
            <?php
        } else if (isset($_SESSION['origin'])
            && $_SESSION['origin'] == "show_folder"
            ) {
            ?>
            var eleframe1 = window.opener.top.document.getElementById('list_notes_folder');
            <?php
        } else {
            ?>
            var eleframe1 = window.opener.top.document.getElementById('list_notes_doc');
            <?php
        }
        if (isset($_SESSION['origin']) && $_SESSION['origin'] == "show_folder") {
            ?>
            eleframe1.src = '<?php
            echo $_SESSION['config']['businessappurl'];
            ?>index.php?display=true&module=notes&page=frame_notes_folder<?php
            echo $extendUrl;
            ?>';
            <?php
        } else {
            ?>
            eleframe1.src = '<?php
            echo $_SESSION['config']['businessappurl'];
            ?>index.php?display=true&module=notes&size=full&page=frame_notes_doc<?php
            echo $extendUrl;
            ?>';
            <?php
        }
        ?>
        window.top.close();
    </script>
    <?php
}
} else {
    ?>
    <h2 class="tit" style="padding:10px;"><i class="fa fa-pencil fa-2x" title="<?php echo _ADD_NOTE;?>"></i> <?php
        echo _ADD_NOTE;
        ?> </h2>
        <?php if($redirect<>'' && isset($_GET['success'])){ ?><div class="error"><?php echo _NOTES_ADDED ?></div><?php } ?>
        <div class="block" style="padding:10px;">
          <form name="form1" method="post" action="<?php
          echo $_SESSION['config']['businessappurl'];
          ?>index.php?display=true&module=notes&page=note_add&identifier=<?php
          echo $_GET['identifier'];
          ?>&table=<?php
          echo $table;
          ?>&coll_id=<?php
          echo $collId;?>&<?php functions::xecho($redirect);?>" >
          <input type="hidden" name="display" value="true" />
          <input type="hidden" name="modules" value="notes" />
          <input type="hidden" name="page" value="note_add" />
          <input type="hidden" value="<?php
          echo $identifier;?>" name="identifier" id="identifier">
          <input type="hidden" value="<?php
          echo $extendUrlValue;?>" name="size" id="size">
          <textarea  cols="65" rows="5"  name="notes"  id="notes" style="width:99%;"></textarea>
          <br/>
          <p class="buttons">
            <input type="submit" name="Submit" value="<?php
            echo _ADD_NOTE;?>" class="button"/>
            <?php if($redirect==''){ ?><input type="submit" name="Submit2" value="<?php
            echo _CANCEL;?>" onclick="javascript:self.close();" class="button"/><?php } ?>
        </p>
    </br>
    <div>
        <h3 class="sstit" style="color: red"><?php echo _THIS_NOTE_IS_VISIBLE_BY;?></h3>
    </div>
    <div>
        <?php 
        $notesEntities = array();
        $notesEntities = $ent->getAllEntities();
        ?>
        <select name="entitieslist[]" id="entitieslist" size="7" style="width: 100%;"
        ondblclick='moveclick($(entitieslist), $(entities_chosen));' multiple="multiple" >
        <?php
        for ($i=0;$i<count($notesEntities);$i++) {
            $state_entity = false;
            
            if ($state_entity == false) {
                ?>
                <option value="<?php 
                echo $notesEntities[$i]->entity_id;
                ?>"><?php 
                echo $notesEntities[$i]->short_label;
                ?></option>
                <?php
            }
        }
        ?>  
    </select>
    <div style="padding-top:5px;padding-bottom:5px;text-align:center;"><input type="button" class="button" value="&#9660;" onclick='Move($(entitieslist), $(entities_chosen));' style="margin:0;"/>
        &nbsp;
        <input type="button" class="button" value="&#9650;" onclick='Move($(entities_chosen), $(entitieslist));' style="margin:0;" /></div>
        <select name="entities_chosen[]" id="entities_chosen" size="7" style="width: 100%;"
        ondblclick='moveclick($(entities_chosen), $(entitieslist));' multiple="multiple">
        <?php
        for ($i=0;$i<count($notesEntities);$i++) {
            $state_entity = false;
            if ($state_entity == true) {
                ?>
                <option value="<?php 
                echo $notesEntities[$i]->entity_id;
                ?>" selected="selected" ><?php 
                echo $notesEntities[$i]->short_label; 
                ?></option>
                <?php
            }
            
        }
        ?>
    </select>

</div>
</form>
</div>
<div class="block_end">&nbsp;</div>
<?php
}
$core->load_js();
?>
</body>
</html>
