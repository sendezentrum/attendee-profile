import $ from 'jquery'
import Dropzone from './dropzone'

$(function() {
	var photoDropzone = new Dropzone('#photo-upload', {
		'url': '#',
		'autoProcessQueue': false,
		'acceptedFiles': 'image/*',
		'maxFiles': 1,
		'clickable': '#photo-upload .button',
		'thumbnailWidth': 700,
		'thumbnailHeight': null,
		'previewTemplate': document.getElementById('photo-upload-preview').innerHTML
	})

	photoDropzone.on("addedfile", function(file) {
		$('#photo-upload-helper').hide()
	})
})
