<?php

class ViewController
    extends DOMXPath
{
    //*************************************************************************
    // Constructor
    //*************************************************************************
    function ViewController()
    {
        
    }
    
    function loadView($viewFile)
    {
        $view = new View();
        $view->loadView($viewFile);
        
        parent::__construct($view);
        $this->view = $this->document;
        return $view;
    }
    
    function showView()
    {
        print $this->document->saveHTML();
    }  
    
    function getElementById($id)
    {
        $elements = $this->query("//*[@id='$id']");
        if($elements->length == 0) return false;
        return $elements->item(0);
    }
    
    function getLabelFor($for)
    {
        $labels = $this->query("//label[@for='$for']");
        if($labels->length == 0) return false;
        return $labels->item(0);
    }
    
    function setLabelFor($for, $text)
    {
        $label = $this->getlabelFor($for);
        echo "<br/>Get label for $for returned " . $label->getAttribute('for');
        if($label) $label->nodeValue = htmlentities($text);
        echo "<br/>Set label with $text " . htmlentities($text);
    }
    
}

//*****************************************************************************
// HTML PAGE / FRAGMENT
//*****************************************************************************
class View
    extends DOMDocument
{
    
    //*************************************************************************
    // Constructor
    //*************************************************************************
    function View() 
    {
        parent::__construct();
        $this->registerNodeClass('DOMElement', 'ViewElement');
        $this->registerNodeClass('DOMAttr', 'ViewAttribute');
        $this->registerNodeClass('DOMText', 'ViewText');
    }
    
    function loadView($viewFile) {
        $this->load($viewFile);
    }

    //*************************************************************************
    // Create tags
    //*************************************************************************
    function createSelect()
    {
        $select = $this->createElement('select');
        $this->appendChild($select);
        return $select;
    }
    
    function createOption($value, $label)
    {
        $option = $this->createElement('option', $label);
        $option->setAttribute('value', $value);
        return $option;
    }
    
    function createOptionGroup($label)
    {
        $optionGroup = $this->document->createElement('optgroup');
        $optionGroup->setAttribute('label', $label);
        return $optionGroup;
    }
}


//*****************************************************************************
// HTML TAGS
//*****************************************************************************
class ViewElement   
    extends DOMElement
{
    
    //*************************************************************************
    // Retrieve / display
    //*************************************************************************
    function getSource()
    {
        return $this->C14N();
    }
    
    function show() 
    { 
        echo $this->getSource();
    }
    
    //*************************************************************************
    // Standard attributes
    //*************************************************************************
    // class dir id lang title style 
    function setId($id) 
    {
        $this->setAttribute('id', $id);
    }
    
    function setName($name) 
    {
        $this->setAttribute('name', $name);
    }
    
    function setValue($value)
    {
        $this->setAttribute('value', $value);
    }
    
    //*************************************************************************
    // Text
    //*************************************************************************
    
    //*************************************************************************
    // Inputs
    //*************************************************************************
    function addOption($value, $label)
    {
        $option = $this->ownerDocument->createOption($value, $label);
        $this->appendChild($option);
    }
        
    function disable()
    {
        $this->setAttribute('disabled', 'disabled');
    }
    
    function enable() 
    {
        $this->removeAttribute('disabled');
    }
    
    function select()
    {
        $this->setAttribute('selected', 'selected');
    }
    
    function unselect()
    {
        $this->removeAttribute('selected');
    }
    
}

//*****************************************************************************
// ATTRIBUTES
//*****************************************************************************
class ViewAttribute
    extends DOMAttr
{

}

//*****************************************************************************
// TEXT
//*****************************************************************************
class ViewText
    extends DOMText
{

}
