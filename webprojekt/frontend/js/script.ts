$(function(){

    $("#details").hide();
    $("#appointment-creation").hide();

    showAppointmentList();

    $("#submitEntry").on("click", submitEntry);
    
    $("#goBack").on("click", hideDetails);

    $("#create").on("click", showAppointmentCreation);

    $("#creation-cancel").on("click", hideAppointmentCreation);

    $("#creation-submit").on("click", submitAppointment);

    $("#user_name").on("keydown", function(){
        $("#user_name").removeClass("is-invalid");
    })
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
            hideDetails();
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
    
    showAppointmentList();
}

function showAppointmentDetails(response : any)
{
    hideAppointmentList();

    $("#title").text(response[0]["title"]);
    $("#description").text(response[0]["description"]);

    $("#dates").empty();

    for(var i = 1; i < response.length; ++i)
    {
        if(response[i]["time_begin"] != undefined)
        {
            createDate(response[i]);
        }
        else
        {
            createComment(response[i]);
        }
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

    let $data = {title: $title, description: $description, date: $date};

    sendData("insertAppointment", JSON.stringify($data));
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
    var $date = $("<p>", {id : "date"});
    $($date).text(response["date"]);

    var $time = $("<p>", {id: "time"});
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
        $($header).text("Closes " + $appointment.date);
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