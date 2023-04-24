$(function () {
    $("#details").hide();
    loadData("all", "-");
    $("#submitEntry").on("click", submitEntry);
    $("#goBack").on("click", hideDetails);
    $("#user_name").on("keydown", function () {
        $("#user_name").removeClass("is-invalid");
    });
});
function loadData(searchMethod, searchTerm) {
    $.ajax({
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: { method: searchMethod, param: searchTerm },
        dataType: "json",
        success: function (response) {
            console.log(response);
            switch (searchMethod) {
                case "all":
                    createAppointments(response);
                    break;
                case "byID":
                    showAppointmentDetails(response);
                    break;
            }
        },
        statusCode: {
            400: function () {
                showModal("Unable to access appointment details.", "An error has occured");
            },
            404: function () {
                setError("No appointments found.");
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}
function sendData(postMethod, data) {
    $.ajax({
        type: "POST",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: { method: postMethod, param: data },
        dataType: "json",
        success: function (response) {
            showModal("Your entry has been made.", "Success");
            hideDetails();
        },
        error: function (error) {
            console.log(error);
        }
    });
}
function setError(errorMsg) {
    $("#error").addClass("text-center text-danger fw-bold text-center bg-danger-subtle p-3 border border-danger rounded");
    $("#error").text(errorMsg);
}
function showModal(modalMsg, modalTitle) {
    $("#modalTitle").text(modalTitle);
    $("#modalErrorMsg").text(modalMsg);
    $("#modal").modal("show");
}
function hideDetails() {
    $("#details").hide();
    $("#user_name").val("");
    $("#user_comment").val("");
    $("#submitError").text("");
    $("#user_name").removeClass("is-invalid");
    $(".cmt").remove();
    $("#appointment-list").show();
}
function showAppointmentDetails(response) {
    $("#appointment-list").hide();
    $("#title").text(response[0]["title"]);
    $("#description").text(response[0]["description"]);
    $("#dates").empty();
    for (var i = 1; i < response.length; ++i) {
        if (response[i]["time_begin"] != undefined) {
            createDate(response[i]);
        }
        else {
            createComment(response[i]);
        }
    }
    $("#details").show();
}
function submitEntry() {
    //get commment
    var $comment = $("#user_comment").val();
    //get name
    var $name = $("#user_name").val();
    if ($name === "") {
        $("#user_name").addClass("is-invalid");
        $("#submitError").text("Please enter a name");
        return;
    }
    //get checked radio button
    var $radios = $("input[name=radio_check]");
    var $checkedValue = $radios.filter(":checked").attr("id");
    if ($checkedValue === undefined) {
        $("#submitError").text("Please select a date");
        return;
    }
    var $data = { comment: $comment, name: $name, date_id: $checkedValue };
    sendData("insertEntry", JSON.stringify($data));
}
function createComment(response) {
    var $comment = $("<div>", { "class": "cmt py-2 px-2 border" });
    if (response["comment"] != "") {
        $comment.text(response["name"] + ": " + response["comment"]);
        $("#comments").append($comment);
    }
}
function createDate(response) {
    //create MainElement
    var $main = $("<div>", { "class": "row border-bottom border-black mb-3" });
    //create and append columns
    var $col_left = $("<div>", { "class": "col-8" });
    var $col_right = $("<div>", { "class": "col-4 d-flex justify-content-center align-items-center pb-3" });
    $($main).append($col_left);
    $($main).append($col_right);
    //create field for date and time
    var $date = $("<p>", { id: "date" });
    $($date).text(response["date"]);
    var $time = $("<p>", { id: "time" });
    $($time).text(response["time_begin"] + " - " + response["time_end"]);
    $($col_left).append($date);
    $($col_left).append($time);
    //create checkbox
    var $check_div = $("<div>", { "class": "form-check" });
    var $checkbox = $("<input>", { id: response["id"], "class": "form-check-input custom-checkbox", "type": "radio", "name": "radio_check" });
    $($col_right).append($check_div);
    $($check_div).append($checkbox);
    //append to page
    $("#dates").append($main);
}
function createAppointments(response) {
    for (var i = 0; i < response.length; ++i) {
        var $appointment = response[i];
        /* create card */
        var $card = $("<div>", { id: $appointment.id, "class": "card mb-3" });
        /* create card-header */
        var $header = $("<div>", { "class": "card-header" });
        $($header).text("Closes " + $appointment.date);
        $($card).append($header);
        /* create card-body */
        var $body = $("<div>", { "class": "card-body" });
        $($card).append($body);
        /* create card elements */
        var $title = $("<h5>", { "class": "card-title pb-3" });
        $($title).text($appointment.title);
        $($body).append($title);
        var $text = $("<p>", { "class": "card-text pb-3" });
        $($text).text($appointment.description);
        $($body).append($text);
        /* append card to list */
        $("#appointment-body").append($card);
    }
    $(".card").on("mouseover", function () {
        $(this).addClass("border-dark");
    });
    $(".card").on("mouseleave", function () {
        $(this).removeClass("border-dark");
    });
    $(".card").on("click", function () {
        loadData("byID", $(this).attr("id"));
    });
}
