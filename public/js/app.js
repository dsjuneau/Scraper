$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  }).then(function(data) {
    $("#notes").empty();
  });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});

function scrape(event) {
  event.preventDefault();
  $.ajax({
    method: "GET",
    url: "/api/scrape"
  }).then(function(res) {
    console.log(res);
    $("#num-articles").html(res.number);
    $("#saved").modal("show");
  });
}

$("#scrape").on("click", scrape);

$("#saved").on("hidden.bs.modal", function() {
  location.reload(true);
});
