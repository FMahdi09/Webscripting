<?php
class Appointment 
{
    public $id;
    public $title;
    public $description;
    public $date;

    function __construct($id, $title, $desc, $date)
    {
        $this->id = $id;
        $this->title = $title;
        $this->description = $desc;
        $this->date = $date;
    }
}