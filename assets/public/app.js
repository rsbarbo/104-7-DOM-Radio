var jsmediatags = window.jsmediatags;
var files = [];


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
  debugger;
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
          object.filename = file.name;
          object.data = event.target.result;
          files.push(object);
        };
        reader.readAsDataURL(file);
      });
    });

    $("#ajax-attachment-upload-form").submit(function(form) {
      $.each(files, function(index, file) {
        $.ajax({url: "http://71.229.150.148/uploadpublic",
        type: 'POST',
        data: {filename: file.filename, data: file.data},
        crossDomain : true,
        success: uploadHandler
      });
    });
    files = [];
    form.preventDefault();
  });
});
