<?php
include_once("businesslogic/simpleLogic.php");
include ("db/dbaccess.php");

$method = "";
$searchTerm = "";

isset($_GET["method"]) ? $method = $_GET["method"] : false;
isset($_GET["param"]) ? $searchTerm = $_GET["param"] : false;

$logic = new SimpleLogic($db_obj);

$result = $logic->handleRequest($method, $searchTerm);

if($result == null)
{
    response("GET", 400, null);
} 
else
{
    response("GET", 200, $result);
}

function response($method, $httpStatus, $data)
{
    header('Content-Type: application/json');
    switch($method)
    {
        case "GET":
            http_response_code($httpStatus);
            echo(json_encode($data));
            break;
        default:
            http_response_code(405);
    }
}