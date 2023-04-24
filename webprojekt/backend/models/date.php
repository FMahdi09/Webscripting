<?php

class Date 
{
    public $id;
    public $date;
    public $time_begin;
    public $time_end;

    function __construct($id, $date, $time_begin, $time_end)
    {
        $this->id = $id;
        $this->date = $date;
        $this->time_begin = $time_begin;
        $this->time_end = $time_end;
    }
}