<?php
include_once("db/dataHandler.php");

class SimpleLogic
{
    
    private $dataHandler;

    function __construct($db_obj)
    {
        $this->dataHandler = new DataHandler($db_obj);
    }

    function handleRequest($method, $param)
    {
        switch($method)
        {
            case "all":
                $data = $this->dataHandler->queryAllAppointments();
                break;

            case "byID":
                $data = $this->dataHandler->queryAppointmentsByID($param);
                break;

            case "insertEntry":
                $data = $this->dataHandler->insertEntry($param);
                break;

            default:
                $data = null;
                break;
        }
        return $data;
    }
}