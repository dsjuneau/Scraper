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

function getNotes() {
  $.ajax({
    method: "GET",
    url: "/api/articles/" + $(this).attr("data-id")
  }).then(function(res) {
    $("#note-title").html(res.title);
    $("#note-modal").modal("show");
  });
}

function saveNotes() {
  let title = $("#note-title").text();
  let data = { data: $("#note-body").val() };
  console.log(data);
  $.post("/api/articles/" + title, data).then(function(res) {
    $("#note-modal").modal("hide");
    console.log(res);
  });
}

$("#scrape").on("click", scrape);

$("#saved").on("hidden.bs.modal", function() {
  location.reload(true);
});

$(".notes").on("click", getNotes);

$("#save-changes").on("click", saveNotes);
