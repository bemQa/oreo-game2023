$(document).ready(function() {
	$('body').on('click', '.rates__tr', function() {
		if(!$(this).hasClass('active')) {
			$('.rates__tr').removeClass('active');
			$(this).addClass('active');
		} else $(this).removeClass('active');
	});
});