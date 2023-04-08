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
        },
        error: function(error)
        {
            setError();
        }
    });
}

function setError()
{
    $("#error").addClass("text-center text-danger fw-bold text-center bg-danger-subtle p-3 border border-danger rounded");
    $("#error").text("No Appointments found");
}