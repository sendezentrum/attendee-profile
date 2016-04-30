import $ from 'jquery'
import Dropzone from './dropzone'

$(function() {
	$('.page__project').each(function(index, el) {
		var projectDropzone = new Dropzone(el, {
			'url': '#',
			'autoProcessQueue': false,
			'acceptedFiles': 'image/*',
			'maxFiles': 1,
			'clickable': $('.button', el).get(0),
			'thumbnailWidth': 400,
			'thumbnailHeight': 400,
			'previewTemplate': document.getElementById('project-upload-preview').innerHTML
		})

		projectDropzone.on("addedfile", function(file) {
			$('.page__project-inner--with-button', el).hide()
			$('.page__project-overlay').hide()
		})
	})
})
