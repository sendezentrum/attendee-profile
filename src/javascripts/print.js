import $ from 'jquery'

$(document).on('click', '[data-action="print"]', function(event) {
	event.preventDefault()
	window.print()
})
