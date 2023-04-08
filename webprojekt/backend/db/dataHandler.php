<?php
include_once("models/appointment.php");

class DataHandler
{
    public function queryAllAppointments()
    {
        $data = $this->getTestData();

        return $data;
    }

    private static function getTestData()
    {
        $data = [
            new Appointment(1, "Meeting", "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam", "12.04"),
            new Appointment(2, "Review", "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam", "13.04"),
            new Appointment(3, "Test", "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam", "10.04"),
            new Appointment(4, "Stand-Up", "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam", "12.06")
        ];

        return $data;
    }
}