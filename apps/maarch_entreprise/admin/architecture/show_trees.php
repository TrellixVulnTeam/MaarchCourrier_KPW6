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
* @brief Show the tree
*
* @file
* @author Laurent Giovannoni <dev@maarch.org>
* @date $date$
* @version $Revision$
* @ingroup admin
*/

require_once("core".DIRECTORY_SEPARATOR."class".DIRECTORY_SEPARATOR."class_request.php");

$core_tools = new core_tools();
$core_tools->load_lang();
$func = new functions();
$db = new Database();

$nb_trees = 0;
if(isset($_SESSION['doctypes_chosen_tree']))
{
    $nb_trees = count($_SESSION['doctypes_chosen_tree']);
}
$core_tools->load_html();
$core_tools->load_js();

$core_tools->load_header('', true, false);
$f_level = array();
$folder_module = $core_tools->is_module_loaded('folder');

?>
<body>
<?php
if($nb_trees < 1 && $folder_module)
{
    echo _NO_DEFINED_TREES;
}
else
{
    if ((
    	(isset($_SESSION['doctypes_chosen_tree']) && ! empty($_SESSION['doctypes_chosen_tree'])) 
    	&& $folder_module 
    	) || ! $folder_module)
    {
        ?>
        <?php
        $search_customer_results = array();
        $f_level = array();
        if($folder_module)
        {
            $query="SELECT d.doctypes_first_level_id, d.doctypes_first_level_label FROM ".$_SESSION['tablename']['fold_foldertypes_doctypes_level1']." g, ".$_SESSION['tablename']['doctypes_first_level']." d WHERE g.foldertype_id = ? and g.doctypes_first_level_id = d.doctypes_first_level_id and d.enabled = 'Y' order by d.doctypes_first_level_label";
        
            $stmt = $db->query($query, array($_SESSION['doctypes_chosen_tree']));
        }
        else
        {
            $query="SELECT d.doctypes_first_level_id, d.doctypes_first_level_label FROM  ".$_SESSION['tablename']['doctypes_first_level']." d WHERE d.enabled = 'Y' order by d.doctypes_first_level_label";
            $stmt = $db->query($query);
        }

        while($res1 = $stmt->fetchObject())
        {
            $s_level = array();
            $stmt2 = $db->query("SELECT doctypes_second_level_id, doctypes_second_level_label FROM ".$_SESSION['tablename']['doctypes_second_level']." WHERE doctypes_first_level_id = ? and enabled = 'Y'", array($res1->doctypes_first_level_id));
            while($res2 = $stmt2->fetchObject())
            {
                $doctypes = array();
                $stmt3 = $db->query("SELECT type_id, description FROM ".$_SESSION['tablename']['doctypes']." WHERE doctypes_first_level_id = ? and doctypes_second_level_id = ? and enabled = 'Y' ", array($res1->doctypes_first_level_id, $res2->doctypes_second_level_id));
                while($res3 = $stmt3->fetchObject())
                {
                    $results = array();
                    array_push($doctypes, array('type_id' => $res3->type_id, 'description' => $func->show_string($res3->description), "results" => $results));
                }
                array_push($s_level, array('doctypes_second_level_id' => $res2->doctypes_second_level_id, 'doctypes_second_level_label' => $func->show_string($res2->doctypes_second_level_label, true), 'doctypes' => $doctypes));
            }
            array_push($f_level, array('doctypes_first_level_id' => $res1->doctypes_first_level_id, 'doctypes_first_level_label' => $func->show_string($res1->doctypes_first_level_label, true), 'second_level' => $s_level));
        }
        if($folder_module)
        {
            for($i=0;$i<count($_SESSION['tree_foldertypes']);$i++)
            {
                if($_SESSION['tree_foldertypes'][$i]['ID'] == $_SESSION['doctypes_chosen_tree'])
                $fLabel = $_SESSION['tree_foldertypes'][$i]['LABEL'];
            }
            array_push($search_customer_results, array('folder_id' => $fLabel, 'content' => $f_level));
        }
        else
        {
            array_push($search_customer_results, array('folder_id' => _TREE_ROOT, 'content' => $f_level));
        }
        
        ?>
        <script type="text/javascript">            
        
            function treeHtml (struct)
            {
                for (var i=0;i<struct.length;i++){

                    treeConcat='<ul>';
                    treeConcat+='<li>';
                    treeConcat+='<span class="root">';
                    treeConcat+='<i class ="fa">';
                    treeConcat+='</i>';
                    treeConcat+=struct[i].txt;
                    treeConcat+='</span>';

                    for(var j=0;j<struct[i].items.length;j++){

                        treeConcat+='<ul>';
                        treeConcat+='<li>';
                        treeConcat+='<span class="node">';
                        treeConcat+='<i class ="fa">';
                        treeConcat+='</i>';
                        treeConcat+=struct[i].items[j].txt;
                        treeConcat+='</span>';
                        treeConcat+='<ul>';
                        
                        for(var k=0;k<struct[i].items[j].items.length;k++){
                          
                            treeConcat+='<li id="childs-'+j+'-'+k+'"'+'>';
                            treeConcat+='<span class="node">';
                            treeConcat+='<i class ="fa" >';
                            treeConcat+='</i>';
                            treeConcat+= struct[i].items[j].items[k].txt;
                            treeConcat+='</span>';
                            treeConcat+='<ul>';

                            for(var l=0;l<struct[i].items[j].items[k].items.length;l++){
                                
                                treeConcat+='<li>';
                                treeConcat+= struct[i].items[j].items[k].items[l].txt;
                                treeConcat+='</li>';
                            }

                            treeConcat+='</ul>';
                            treeConcat+='</li>';
                        }
                       
                        treeConcat+='</ul>';
                        treeConcat+='</ul>';

                    }
                    treeConcat+='</li>';
                        treeConcat+='</li>';

                    treeConcat+='</ul>';
                }
                return treeConcat;
            }
            
            function TreeInit ()
            {
                var struct = [
                <?php
                    for($i=0;$i<count($search_customer_results);$i++)
                    {
                            ?>
                            {
                                'id':'<?php functions::xecho(addslashes($search_customer_results[$i]['folder_id']));?>',
                                'txt':'<b><?php functions::xecho(addslashes($search_customer_results[$i]['folder_id']));?></b>',
                                'items':[
                                            <?php
                                            for($j=0;$j<count($search_customer_results[$i]['content']);$j++)
                                            {
                                                ?>
                                                {
                                                    'id':'<?php functions::xecho(addslashes($search_customer_results[$i]['content'][$j]['doctypes_first_level_id']));?>',
                                                    'txt':'<?php functions::xecho(addslashes($search_customer_results[$i]['content'][$j]['doctypes_first_level_label']));?>',
                                                    'items':[
                                                                <?php
                                                                for($k=0;$k<count($search_customer_results[$i]['content'][$j]['second_level']);$k++)
                                                                {
                                                                    ?>
                                                                    {
                                                                        'id':'<?php functions::xecho(addslashes($search_customer_results[$i]['content'][$j]['second_level'][$k]['doctypes_second_level_id']));?>',
                                                                        'txt':'<?php functions::xecho(addslashes($search_customer_results[$i]['content'][$j]['second_level'][$k]['doctypes_second_level_label']));?>',
                                                                        'items':[
                                                                                    <?php
                                                                                    for($l=0;$l<count($search_customer_results[$i]['content'][$j]['second_level'][$k]['doctypes']);$l++)
                                                                                    {
                                                                                        ?>
                                                                                        {
                                                                                            <?php
                                                                                            ?>
                                                                                            'txt':'<span style="font-style:italic;"><small><small><a href="#" onclick="window.open(\'<?php echo $_SESSION['config']['businessappurl'];?>index.php?page=types_up&id=<?php functions::xecho($search_customer_results[$i]['content'][$j]['second_level'][$k]['doctypes'][$l]['type_id']);?>\');"><?php functions::xecho(addslashes($search_customer_results[$i]['content'][$j]['second_level'][$k]['doctypes'][$l]['description']));?></a></small></small></span>',
                                                                                            'img':'empty.gif'
                                                                                        }
                                                                                        <?php
                                                                                        if($l <> count($search_customer_results[$i]['content'][$j]['second_level'][$k]['doctypes']) - 1)
                                                                                        echo ',';
                                                                                    } ?>
                                                                                ]
                                                                    }
                                                                    <?php
                                                                    if($k <> count($search_customer_results[$i]['content'][$j]['second_level']) - 1)
                                                                    echo ',';
                                                                }
                                                                ?>
                                                            ]
                                                }
                                                <?php
                                                if($j <> count($search_customer_results[$i]['content']) - 1)
                                                    echo ',';
                                            }
                                            ?>
                                        ]
                            }
                            <?php
                            if ($i <> count($search_customer_results) - 1)
                                echo ',';
                        }

                                ?>
                            ];
                            
                document.getElementById('trees_div').innerHTML = treeHtml(struct);
            }

        </script>
       
        <div id="trees_div" class="tree">
           
        </div>

        <script type="text/javascript">

            TreeInit();
            BootstrapTree.init($j('#trees_div'),'fa fa-minus-square','fa fa-plus-square');
       
        </script>
        <?php
    }
}
?>
</body>
</html>
