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
    $("#num-articles").html(res.number);
    $("#saved").modal("show");
  });
}

function getNotes() {
  $.ajax({
    method: "GET",
    url: "/api/articles/" + $(this).attr("data-id")
  }).then(function(res) {
    if (res.note !== undefined) {
      $("#note-body").val(res.note.data);
    }
    $("#note-title").html(res.title);
    $("#note-modal").modal("show");
  });
}

function saveNotes() {
  let title = $("#note-title").text();
  let data = { data: $("#note-body").val() };

  $.post("/api/articles/" + title, data).then(function(res) {
    $("#note-modal").modal("hide");
    location.reload(true);
  });
}

function deleteArticle() {
  $.ajax({
    method: "DELETE",
    url: "/api/articles/" + $(this).attr("data-id")
  }).then(function(res) {
    location.reload(true);
  });
}

$("#scrape").on("click", scrape);

$("#saved").on("hidden.bs.modal", function() {
  location.reload(true);
});

$(".notes").on("click", getNotes);

$("#save-changes").on("click", saveNotes);
$(".delete-article").on("click", deleteArticle);
