var jsmediatags = window.jsmediatags;
var files = [];

// if request fails
var onFail = function(error){
  console.error(error);
};

// if request is sucessful
var onGetSuccess = function(data){
  if(data.id) {
    $('#file-listing').append('<p class="post" style="text-align: center; color:red;"><b>' + "Song: " + data.title + ", " + "posted to database"+ '</b></p>')
  }
};

function uploadHandler(path, status, xhr) {
  var file_parts = path.split(".");
  var extension = file_parts[file_parts.length - 1];
  if(["mp3", "m4a"].indexOf(extension.toLowerCase()) >= 0) {
    $("#file-listing").append("<li><a href='" + path + "' target='_blank'>" + path + "</a></li>");
  } else {
    $("#file-listing").append("<p>file format is not valid</p>");
  }
};

function fillForm(tag){
  $('#ajax-attachment-upload-form input[name="album"]').val(tag.tags.album);
  $('#ajax-attachment-upload-form input[name="title"]').val(tag.tags.title);
  $('#ajax-attachment-upload-form input[name="artist"]').val(tag.tags.artist);
  $('#ajax-attachment-upload-form input[name="genre"]').val(tag.tags.genre);
};


// From remote host
function readFile(mp3_file) {
  var tag;
  jsmediatags.read(mp3_file, {
    onSuccess: function(tag) {
      fillForm(tag);
      console.log(tag);
      tag = tag;
    },
    onError: function(error) {
      console.log(error);
    }
  });
  return tag;
};

$(function(){

  $("#attachment").change(function(event) {
    $.each(event.target.files, function(index, file) {
      var metaFile = readFile(file);
      var reader = new FileReader();
      reader.onload = function(event) {
        object = {};
        console.log(object);
        object.filename = file.name;
        object.data = event.target.result;
        files.push(object);
      };
      reader.readAsDataURL(file);
    });
  });

  $("#ajax-attachment-upload-form").submit(function(form) {

    var album = document.getElementById("album").value;
    var title = document.getElementById("title").value;
    var artist = document.getElementById("artist").value;
    var genre = document.getElementById("genre").value;
    var email = document.getElementById("email").value;

    var mp3_info = {album: album, title: title, artist: artist, genre: genre, email: email}

    var newObject = {};

    for (var attrname in mp3_info) { newObject[attrname] = mp3_info[attrname]; }
    for (var attrname in files[0]) { newObject[attrname] = files[0][attrname]; }

    $.ajax({url: "http://localhost:3000/api/v1/mp3s",
    type: 'POST',
    data: {filename: newObject.filename,
      data: newObject.data,
      album: newObject.album,
      title: newObject.title,
      artist: newObject.artist,
      genre: newObject.genre,
      email: newObject.email},
    })
    .done(onGetSuccess)
    .fail(onFail);
    files = [];
    form.preventDefault();
    setTimeout(function(){
      document.getElementById("ajax-attachment-upload-form").reset();
    },3700);
  });
});
