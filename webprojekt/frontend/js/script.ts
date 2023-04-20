$(function(){
    loadData("all", "-");
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
            switch(searchMethod)
            {
                case "all": createAppointments(response);
                break;
            } 
        },
        statusCode: 
        {
            400: function(error)
            {
                showModal("Unable to access appointment details.");
            },
            404: function(error)
            {
                setError("No appointments found.");
            }
        },
        error: function (error) 
        {
            
        }
    });
}

function setError(errorMsg : string)
{
    $("#error").addClass("text-center text-danger fw-bold text-center bg-danger-subtle p-3 border border-danger rounded");
    $("#error").text(errorMsg);
}

function showModal(modalMsg : string)
{
    //create Modal
    var $modal = $("<div>", {"class": "modal fade"});
    var $modalDialog = $("<div>", {"class" : "modal-dialog"});
    var $modalContent = $("<div>", {"class" : "modal-content"});
    var $modalHeader = $("<div>", {"class" : "modal-header"});
    var $modalBody = $("<div>", {"class" : "modal-body"});

    $($modal).append($modalDialog);
    $($modalDialog).append($modalContent);
    $($modalContent).append($modalHeader);
    $($modalContent).append($modalBody);
    $($modalBody).text(modalMsg);

    $($modalHeader).append("<h5 class='modal-title'>An error has occured</h5><button type='button' class='btn-close' data-bs-dismiss='modal'></button>")

    //show Modal
    $($modal).modal("show");
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
        $("#appointment-list").append($card);
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