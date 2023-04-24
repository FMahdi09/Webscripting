<?php

class comment
{
    public $name;
    public $comment;

    function __construct($name, $comment)
    {
        $this->name = $name;
        $this->comment = $comment;
    }
}