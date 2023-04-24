<?php
include_once("businesslogic/simpleLogic.php");
include ("db/dbaccess.php");

$method = "";
$param = "";

isset($_GET["method"]) ? $method = $_GET["method"] : $method = $_POST["method"];
isset($_GET["param"]) ? $param = $_GET["param"] : $param = $_POST["param"];

$logic = new SimpleLogic($db_obj);

if(isset($_POST["param"]))
{
    $param = json_decode($param);
}

$result = $logic->handleRequest($method, $param);


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