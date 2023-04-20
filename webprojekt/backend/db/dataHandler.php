<?php
include_once("models/appointment.php");

class DataHandler
{
    private $db_obj;

    function __construct($db_obj)
    {
        $this->db_obj = $db_obj;
    }

    public function queryAllAppointments()
    {
        $data = $this->getAllAppointments();

        return $data;
    }

    private function getAllAppointments()
    {
        $sql_allAppointments = "SELECT * 
                                FROM appointments";

        $result_allAppointments = mysqli_query($this->db_obj, $sql_allAppointments);

        $data = [];

        while ($allAppointments = $result_allAppointments->fetch_assoc()) {
            $newAppoitnment = new Appointment($allAppointments["id"], $allAppointments["title"],
                                              $allAppointments["description"],$allAppointments["date"]);
            $data[] = $newAppoitnment;
        }

        return $data;
    }
}