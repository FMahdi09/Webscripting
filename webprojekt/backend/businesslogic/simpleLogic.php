<?php
include_once("db/dataHandler.php");

class SimpleLogic
{
    
    private $dataHandler;

    function __construct($db_obj)
    {
        $this->dataHandler = new DataHandler($db_obj);
    }

    function handleRequest($method, $searchTearm)
    {
        switch($method)
        {
            case "all":
                $data = $this->dataHandler->queryAllAppointments();
                break;

            default:
                $data = null;
                break;
        }
        return $data;
    }
}