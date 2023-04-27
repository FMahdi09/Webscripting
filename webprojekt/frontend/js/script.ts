$(function(){

    $("#details").hide();
    $("#appointment-creation").hide();

    showAppointmentList();

    $("#delete").on("click", deleteAppointment);

    $("#add-meeting").on("click", addMeeting);

    $("#submitEntry").on("click", submitEntry);
    
    $("#goBack").on("click", hideDetails);

    $("#create").on("click", showAppointmentCreation);

    $("#creation-cancel").on("click", hideAppointmentCreation);

    $("#creation-submit").on("click", submitAppointment);

    $("#user_name").on("keydown", function(){
        $("#user_name").removeClass("is-invalid");
    });
});

function loadData(searchMethod : string, searchTerm : string)
{
    $.ajax({
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: {method: searchMethod, param: searchTerm},
        dataType: "json",
        success: function(response)
        {
            console.log(response);
            switch(searchMethod)
            {
                case "all": createAppointments(response);
                break;
                case "byID": showAppointmentDetails(response);
                break;
            } 
        },
        statusCode: 
        {
            400: function()
            {
                showModal("Unable to access appointment details.", "An error has occured");
            },
            404: function()
            {
                setError("No appointments found.");
            }
        },
        error: function (error) 
        {
            console.log(error);
        }
    });
}

function sendData(postMethod : string, data : string)
{
    $.ajax({
        type: "POST",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: {method: postMethod, param: data},
        dataType: "json",
        success: function(response)
        {
            showModal("Your entry has been made.", "Success");
            
            //hide Details
            $("#details").hide();
            $("#user_name").val("");
            $("#user_comment").val("");
            $("#submitError").text("");
            $("#user_name").removeClass("is-invalid");
            $(".cmt").remove();
            $("#mostVoted").text("");
            

            //hide creation and open list
            hideAppointmentCreation();
        },
        error: function(error)
        {
            console.log(error);
        }
    });
}

function setError(errorMsg : string)
{
    $("#error").addClass("text-center text-danger fw-bold text-center bg-danger-subtle p-3 border border-danger rounded");
    $("#error").text(errorMsg);
}

function showModal(modalMsg : string, modalTitle : string)
{
    $("#modalTitle").text(modalTitle);
    $("#modalErrorMsg").text(modalMsg);
    $("#modal").modal("show");
}

function showAppointmentCreation()
{
    hideAppointmentList();

    $("#details").hide();
    $("#user_name").val("");
    $("#user_comment").val("");
    $("#submitError").text("");
    $("#user_name").removeClass("is-invalid");
    $(".cmt").remove();
    $("#mostVoted").text("");

    addMeeting();

    $("#appointment-creation").show();
}


function hideAppointmentList()
{
    $("#appointment-body").empty();

    $("#appointment-list").hide();
}

function showAppointmentList()
{
    loadData("all", "-");

    $("#appointment-list").show();
}

function hideDetails()
{
    $("#details").hide();
    $("#user_name").val("");
    $("#user_comment").val("");
    $("#submitError").text("");
    $("#user_name").removeClass("is-invalid");
    $(".cmt").remove();
    $("#mostVoted").text("");
    
    showAppointmentList();
}

function showAppointmentDetails(response : any)
{
    hideAppointmentList();

    $("#details").attr("number", response[0]["id"]);

    $("#title").text(response[0]["title"]);
    $("#description").text(response[0]["description"]);

    $("#dates").empty();

    for(var i = 1; i < response.length; ++i)
    {
        if(response[i]["time_begin"] != undefined)
        {
            createDate(response[i]);
        }
        else if(response[i]["date_id"] != undefined)
        {
            var mostVoted_id = response[i]['date_id'];

            $('p[date_id= ' + mostVoted_id + ']').each(function(){
                $("#mostVoted").append($(this).text());
                $("#mostVoted").append("  ");
            })

            $("#mostVoted").append("Votes: " + response[i]['votes']);
        }
        else
        {
            createComment(response[i]);
        }
    }

    //check if appointment is closed
    let today = new Date().toISOString().slice(0, 10);

    if(today > response[0]["date"])
    {
        //disable inputs
        $("#user_name").hide();
        $("#user_comment").hide();
        $("#submitEntry").hide();  
        $('.custom-checkbox').prop('disabled', 'disabled');
    }
    else
    {
        //enable inputs
        $("#user_name").show();
        $("#user_comment").show();
        $("#submitEntry").show();
        $('.custom-checkbox').prop('disabled', false);
    }

    $("#details").show();
}

function hideAppointmentCreation()
{
    $("#create-title").val("");
    $("#create-title").removeClass("is-invalid");
    $("#create-description").val("");
    $("#create-description").removeClass("is-invalid");
    $("#create-date").val("");
    $("#create-date").removeClass("is-invalid");
    $("#createError").text("");
    $("#appointment-creation").hide();
    $(".meeting-entry").remove();

    showAppointmentList();
}

function submitEntry()
{
    //get commment
    var $comment = $("#user_comment").val() as string | null;

    //get name
    const $name = $("#user_name").val() as string;

    if($name === "")
    {
        $("#user_name").addClass("is-invalid");
        $("#submitError").text("Please enter a name");
        return;
    }

    //get checked radio button
    const $radios = $("input[name=radio_check]");

    const $checkedValue = $radios.filter(":checked").attr("id") as string;

    if($checkedValue === undefined)
    {
        $("#submitError").text("Please select a date");
        return;
    }

    let $data = {comment: $comment, name: $name, date_id: $checkedValue}

    sendData("insertEntry", JSON.stringify($data));
}

function submitAppointment()
{
    $("#createError").text("");

    //get title
    var $title = $("#create-title").val() as string;

    if($title === "")
    {
        $("#create-title").addClass("is-invalid");
        $("#createError").text("Please enter a title");
        return;
    }

    $("#create-title").removeClass("is-invalid");

    //get description
    var $description = $("#create-description").val() as string;

    if($description === "")
    {
        $("#create-description").addClass("is-invalid");
        $("#createError").text("Please enter a description");
        return;
    }

    $("#create-description").removeClass("is-invalid");

    //get date
    var $date = $("#create-date").val() as string;

    if($date === "")
    {
        $("#createError").text("Please enter a date");
        return;
    }

    var $data = [];

    $data.push({title: $title, description: $description, date: $date});

    
    $("#meeting-dates").children(".meeting-entry").each(function(){

        var $meeting_date = $(this).children("#meetin-date").val() as string;

        var $meeting_begin = $(this).children("#meetin-begintime").val() as string;

        var $meeting_end = $(this).children("#meetin-endtime").val() as string;

        if ($meeting_date === "" ||
            $meeting_begin === "" ||
            $meeting_end === "")
        {
            $("#createError").text("Please enter all fields");
            return;
        }

        $data.push({date: $meeting_date, begin: $meeting_begin, end: $meeting_end});
    });

    if($("#createError").text() === "")
    {
        console.log($data);
        sendData("insertAppointment", JSON.stringify($data));
    }
}

function createComment(response : any)
{
    const $comment = $("<div>", {"class" : "cmt py-2 px-2 border"});

    if(response["comment"] != "")
    {
        $comment.text(response["name"] + ": " + response["comment"]);

        $("#comments").append($comment);
    }
}

function createDate(response : any)
{
    //create MainElement
    var $main = $("<div>", {"class": "row border-bottom border-black mb-3"});

    //create and append columns
    var $col_left = $("<div>", {"class": "col-8"});
    var $col_right = $("<div>", {"class": "col-4 d-flex justify-content-center align-items-center pb-3"});

    $($main).append($col_left);
    $($main).append($col_right);

    //create field for date and time
    var $date = $("<p>", {id : "date", "date_id": response["id"]});
    $($date).text(response["date"]);

    var $time = $("<p>", {id: "time", "date_id": response["id"]});
    $($time).text(response["time_begin"] + " - " + response["time_end"]);

    $($col_left).append($date);
    $($col_left).append($time);

    //create checkbox
    var $check_div = $("<div>", {"class" : "form-check"});

    var $checkbox = $("<input>", {id : response["id"] ,"class" : "form-check-input custom-checkbox", "type" : "radio", "name" : "radio_check"});

    $($col_right).append($check_div);
    $($check_div).append($checkbox);

    //append to page
    $("#dates").append($main);
}

function createAppointments(response: any)
{
    for(var i = 0; i < response.length; ++i)
    {
        const $appointment = response[i];

        /* create card */
        var $card = $("<div>", {id: $appointment.id, "class": "card mb-3"});

        /* create card-header */
        var $header = $("<div>", {"class": "card-header"});

        //check if appointment is closed
        let today = new Date().toISOString().slice(0, 10)

        if(today > $appointment.date)
        {
            $($header).text("Closed");
        }
        else
        {
            $($header).text("Closes " + $appointment.date);
        }

        $($card).append($header);

        /* create card-body */
        var $body = $("<div>", {"class": "card-body"});
        $($card).append($body);

        /* create card elements */
        var $title = $("<h5>", {"class": "card-title pb-3"});
        $($title).text($appointment.title)
        $($body).append($title);

        var $text = $("<p>", {"class": "card-text pb-3"});
        $($text).text($appointment.description);
        $($body).append($text);

        /* append card to list */
        $("#appointment-body").append($card);
    }

    $(".card").on("mouseover", function(){
        $(this).addClass("border-dark");
    });
    $(".card").on("mouseleave", function () {
        $(this).removeClass("border-dark");
    });
    $(".card").on("click", function () {
        loadData("byID", $(this).attr("id") as string);
    });
}

function addMeeting()
{
    var $body = $("<div>", {"class": "meeting-entry mt-3"});

    var $date = $("<input>", {id: "meetin-date", "type": "date"});
    $body.append($date);

    var $titlebegin = $("<span>", {text: " Begin: "});
    $body.append($titlebegin);

    var $begin = $("<input>", {id: "meetin-begintime", "type": "time"});
    $body.append($begin);

    var $titleEnd = $("<span>", {text: " End: "});
    $body.append($titleEnd);

    var $end = $("<input>", {id: "meetin-endtime", "type": "time"});
    $body.append($end);

    $("#meeting-dates").append($body);
}

function deleteAppointment()
{
    var toDelete = $("#details").attr("number");

    let $data = {del: toDelete};
    
    //Funktionsaufruf
    sendData("delete", JSON.stringify($data));
}