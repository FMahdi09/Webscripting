<?php
include_once("models/appointment.php");
include_once("models/date.php");
include_once("models/comment.php");

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

    public function queryAppointmentsByID($id)
    {
        $data = $this->getAppointmentsByID($id);

        return $data;
    }

    public function insertEntry($data)
    {
        $this->insertEntryDB($data);

        return true;
    }

    public function insertAppointment($data)
    {
        $this->insertAppointmentDB($data);

        return true;
    }

    public function deleteAppointment($data)
    {
        $this->deleteAppointmentDB($data);

        return true;
    }

    private function getAllAppointments()
    {
        $data = [];

        $sql_allAppointments = "SELECT * 
                                FROM appointments
                                ORDER BY id desc";

        $result_allAppointments = mysqli_query($this->db_obj, $sql_allAppointments);

        while ($allAppointments = $result_allAppointments->fetch_assoc()) 
        {
            $newAppoitnment = new Appointment($allAppointments["id"], $allAppointments["title"],
                                              $allAppointments["description"],$allAppointments["date"]);
            $data[] = $newAppoitnment;
        }

        return $data;
    }

    private function getAppointmentsByID($id)
    {
        $data = [];

        //get appointment details
        $sql_getAppointment = "SELECT *
                               FROM appointments
                               WHERE id = '$id'";

        $result_getAppointment = mysqli_query($this->db_obj, $sql_getAppointment);

        $appointment = mysqli_fetch_assoc($result_getAppointment);

        $data[] = new Appointment($appointment["id"], $appointment["title"], $appointment["description"], $appointment["date"]);

        //get possible dates
        $sql_getAppointmentDates = "SELECT *
                                    FROM dates
                                    WHERE appointment_id = '$id'";

        $result_getAppointmentDates = mysqli_query($this->db_obj, $sql_getAppointmentDates);

        while($allAppointmentsDates = $result_getAppointmentDates->fetch_assoc())
        {
            $newAppoitnmentDate = new Date($allAppointmentsDates["id"], $allAppointmentsDates["date"], $allAppointmentsDates["time_begin"], $allAppointmentsDates["time_end"]);

            $data[] = $newAppoitnmentDate;
        }

        //get user comments
        $sql_getAppointmentComments = "SELECT *
                                       FROM entries
                                       WHERE appointment_id = '$id'";
        
        $result_getAppointmentComments = mysqli_query($this->db_obj, $sql_getAppointmentComments);

        while($appointmentComments = $result_getAppointmentComments->fetch_assoc())
        {
            $newAppoitnmentComment = new Comment($appointmentComments["name"], $appointmentComments["comment"]);

            $data[] = $newAppoitnmentComment;
        }

        //get date with most votes
        $sql_mostVoted = "SELECT date_id, COUNT(date_id) as votes FROM entries WHERE appointment_id = '$id' GROUP BY date_id ORDER BY votes desc";

        $result_mostVoted = mysqli_query($this->db_obj, $sql_mostVoted);

        $mostVoted = mysqli_fetch_assoc($result_mostVoted);

        if(isset($mostVoted["date_id"]))
        {
            $voted = array(
                "date_id" => $mostVoted["date_id"],
                "votes" => $mostVoted["votes"],
            );
    
            $data[] = $voted;
        }

        return $data;
    }

    private function insertEntryDB($data)
    {
        //get appointment-id
        $sql_getID = "SELECT appointment_id
                      FROM dates
                      WHERE id = '$data->date_id'";

        $result_getID = mysqli_query($this->db_obj, $sql_getID);

        $appointment_id = $result_getID->fetch_assoc();

        //insert given data + appointment-id into db
        $sql_insertEntry = "INSERT INTO entries (appointment_id, date_id, name, comment)
                            VALUES (?,?,?,?)";

        $stmt_insertEntry = $this->db_obj->prepare($sql_insertEntry);

        $stmt_insertEntry->bind_param("iiss", $appointment_id["appointment_id"], $data->date_id, $data->name, $data->comment);

        $stmt_insertEntry->execute();
    }

    private function insertAppointmentDB($data)
    {
        //insert given data into db
        $sql_insertAppointment = "INSERT INTO appointments (title, description, date) VALUES (?,?,?)";

        $stmt_insertAppointment = $this->db_obj->prepare($sql_insertAppointment);

        $stmt_insertAppointment->bind_param("sss", $data[0]->title, $data[0]->description, $data[0]->date);

        $stmt_insertAppointment->execute();

        $title = $data[0]->title;
        $description = $data[0]->description;
        $date = $data[0]->date;

        //get id of insertet appointment
        $sql_selectAppointmentID = "SELECT id
                                    FROM appointments
                                    WHERE title = ?
                                          AND 
                                          description = ?
                                          AND
                                          date = ?";

        $stmt_selectAppointmentID = $this->db_obj->prepare($sql_selectAppointmentID);

        $stmt_selectAppointmentID->bind_param("sss", $title, $description, $date);

        $stmt_selectAppointmentID->execute();
    
        $result_selectAppointmentID = $stmt_selectAppointmentID->get_result();

        $id = mysqli_fetch_assoc($result_selectAppointmentID);

        //insert dates
        $sql_insertDate = "INSERT INTO dates (appointment_id, time_begin, time_end, date) VALUES (?,?,?,?)";

        $stmt_insertDate = $this->db_obj->prepare($sql_insertDate);

        for($i = 1; $i < sizeof($data); ++$i)
        {
            $stmt_insertDate->bind_param("isss", $id["id"] ,$data[$i]->begin, $data[$i]->end, $data[$i]->date);

            $stmt_insertDate->execute();
        }
    }

    private function deleteAppointmentDB($data)
    {
        $sql_delete = "DELETE FROM appointments WHERE id = '$data->del'";

        mysqli_query($this->db_obj, $sql_delete);
    }
}