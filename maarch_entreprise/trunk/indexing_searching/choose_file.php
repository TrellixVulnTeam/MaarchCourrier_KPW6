<?php

/*
*   Copyright 2008-2014 Maarch
*
*   This file is part of Maarch Framework.
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
*   along with Maarch Framework.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
* @brief  Frame to choose a file to index
*
* @file choose_file.php
* @author Claire Figueras <dev@maarch.org>
* @date $date$
* @version $Revision$
* @ingroup indexing_searching_mlb
*/

$core_tools = new core_tools();
$core_tools->load_lang();
$func = new functions();
$db = new dbquery();
$db->connect();
$core_tools->load_html();
$core_tools->load_header('', true, false);
$upFileOK = false;
?>
    <body>
    <?php
    $_SESSION['upfile']['error'] = 0;
    if (isset($_FILES['file']['error']) && $_FILES['file']['error'] == 1) {
        $_SESSION['upfile']['error'] = $_FILES['file']['error'];
        if ($_SESSION['upfile']['error'] == 1) {
            ?>
            <script language="javascript" type="text/javascript">
                var test = window.top.document.getElementById('file_iframe');
                if (test != null)
                {
                    test.src = '<?php
                        echo $_SESSION['config']['businessappurl'];
                        ?>index.php?display=true&dir=indexing_searching&page=file_iframe&#navpanes=0';
                }
            </script>
            <?php
        }
    } elseif (!empty($_FILES['file']['tmp_name']) && $_FILES['file']['error'] <> 1) {
        $extension = explode(".",$_FILES['file']['name']);
        $count_level = count($extension)-1;
        $the_ext = $extension[$count_level];
        $fileNameOnTmp = 'tmp_file_' . $_SESSION['user']['UserId']
            . '_' . rand() . '.' . strtolower($the_ext);
        $filePathOnTmp = $_SESSION['config']['tmppath'] . $fileNameOnTmp;
        //$md5 = md5_file($_FILES['file']['tmp_name']);
        if (!is_uploaded_file($_FILES['file']['tmp_name'])) {
                $_SESSION['error'] = _FILE_NOT_SEND . ". " . _TRY_AGAIN
                    . ". " . _MORE_INFOS . " (<a href=\"mailto:"
                    . $_SESSION['config']['adminmail'] . "\">"
                    . $_SESSION['config']['adminname'] . "</a>)";
        } elseif (!@move_uploaded_file($_FILES['file']['tmp_name'], $filePathOnTmp)) {
            $_SESSION['error'] = _FILE_NOT_SEND . ". " . _TRY_AGAIN . ". "
                . _MORE_INFOS . " (<a href=\"mailto:"
                . $_SESSION['config']['adminmail'] . "\">"
                . $_SESSION['config']['adminname'] . "</a>)";
        } else {
            $_SESSION['upfile']['size'] = $_FILES['file']['size'];
            $_SESSION['upfile']['mime'] = $_FILES['file']['type'];
            $_SESSION['upfile']['local_path'] = $filePathOnTmp;
            //$_SESSION['upfile']['name'] = $_FILES['file']['name'];
            $_SESSION['upfile']['name'] = $fileNameOnTmp;
            $_SESSION['upfile']['format'] = $the_ext;
            require_once 'core/docservers_tools.php';
            $arrayIsAllowed = array();
            $arrayIsAllowed = Ds_isFileTypeAllowed($_SESSION['upfile']['local_path']);
            if ($arrayIsAllowed['status'] == false) {
                $_SESSION['error'] = _WRONG_FILE_TYPE . ' ' . $arrayIsAllowed['mime_type'];
                $_SESSION['upfile'] = array();
            }
            $upFileOK = true;
        }
    } elseif ($_REQUEST['with_file'] == 'true') {
        $pathToFile = 'apps/' . $_SESSION['config']['app_id'] . '/_no_file.pdf';
        $_SESSION['upfile']['size'] = filesize($pathToFile);
        $_SESSION['upfile']['mime'] = 'application/pdf';
        $fileNameOnTmp = 'tmp_file_' . $_SESSION['user']['UserId']
            . '_' . rand() . '.pdf';
        $_SESSION['upfile']['name'] = $fileNameOnTmp;
        $filePathOnTmp = $_SESSION['config']['tmppath'] . $fileNameOnTmp;
        $_SESSION['upfile']['local_path'] = $filePathOnTmp;
        if (copy($pathToFile, $filePathOnTmp)) {
            $upFileOK = true;
        }
    } elseif ($_REQUEST['with_file'] == 'false') {
        $_SESSION['upfile'] = array();
        $upFileOK = true;
    }
    if ($upFileOK) {
        ?>
        <script language="javascript" type="text/javascript">
            function refreshFrame(frameId) {
                frameId.src = '<?php
                    echo $_SESSION['config']['businessappurl'];
                    ?>index.php?display=true&dir=indexing_searching&page=file_iframe';
            }

            var test = window.top.document.getElementById('file_iframe');
            if (test.src == '<?php
                echo $_SESSION['config']['businessappurl'];
                ?>index.php?display=true&dir=indexing_searching&page=file_iframe&#navpanes=0') {
                //test.location.refresh();
                //test.src = '';
                refreshFrame(test);
            }

            if (test != null) {
                //fix pb with toolbar of pdf
                test.src = '<?php
                    echo $_SESSION['config']['businessappurl'];
                    ?>index.php?display=true&dir=indexing_searching&page=file_iframe&#navpanes=0';
            }
        </script>
        <?php
    }
    ?>
    <form name="select_file_form" id="select_file_form" method="get" enctype="multipart/form-data" action="<?php
        echo $_SESSION['config']['businessappurl'];
        ?>index.php?display=true&dir=indexing_searching&page=choose_file" class="forms">
        <input type="hidden" name="display" value="true" />
        <input type="hidden" name="dir" value="indexing_searching" />
        <input type="hidden" name="page" value="choose_file" />
        <p>
            <label for="file" >
            <?php
             if (
                !empty($_SESSION['upfile']['local_path'])
                && empty($_SESSION['error'])
            ) {
                ?><img src="<?php
                    echo $_SESSION['config']['businessappurl'];
                    ?>static.php?filename=picto_stat_enabled.gif" />
                <?php
                echo  _DOWNLOADED_FILE;
            } else {
                ?><img src="<?php
                    echo $_SESSION['config']['businessappurl'];
                    ?>static.php?filename=picto_stat_disabled.gif" />
                    <?php
                    echo _CHOOSE_FILE;
            }
            ?>
            </label>
            <input type="file" name="file" id="file" onchange="this.form.method = 'post';this.form.submit();" value="<?php
                if (isset($_SESSION['file_path'])) {
                    echo $_SESSION['file_path'];
                } ?>" style="width:200px;margin-left:33px;" />
        </p>
        <p>
            <label for="with_file">
                <?php echo _WITHOUT_FILE;?>
            </label>
            <div align="center">
            <?php echo _YES;?><input <?php
                if ($_REQUEST['with_file'] == 'true') { echo 'checked="checked"';}
            ?> type="radio" name="with_file" id="with_file" value="true" onclick="this.form.method = 'post';this.form.submit();" />
            <?php echo _NO;?><input <?php
                if ($_REQUEST['with_file'] == 'false' || $_REQUEST['with_file'] == '') { echo 'checked="checked"';}
            ?> type="radio" name="with_file" id="with_file" value="false" onclick="this.form.method = 'post';this.form.submit();" />
            </div>
        </p>
    </form>
    <?php $core_tools->load_js();?>
    </body>
</html>
