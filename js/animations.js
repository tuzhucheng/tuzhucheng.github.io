$(document).ready(function() {
	$("#introduction").animate({"margin-top": "+=150px" }, 800);
	
	// Change background of badges on hover
	
	$("#github_logo").hover(function() {
			$(this).animate({backgroundColor: jQuery.Color("rgb(65,131,196)")}, 200);
		}, function() {
			$(this).animate({backgroundColor: jQuery.Color("rgba(38,38,38,0.8)")}, 200);
	});
	
	$("#linkedin_logo").hover(function() {
			$(this).animate({backgroundColor: jQuery.Color("rgb(0,127,177)")}, 200);
		}, function() {
			$(this).animate({backgroundColor: jQuery.Color("rgba(38,38,38,0.8)")}, 200);
	});

	$("#email_logo").hover(function() {
			$(this).animate({backgroundColor: jQuery.Color("rgb(255,153,0)")}, 200);
		}, function() {
			$(this).animate({backgroundColor: jQuery.Color("rgba(38,38,38,0.8)")}, 200);
	});
	
	// Expand details
	$(".see_details").on('click', function() {
		var $details = $(this).closest(".project").find(".project_details");
		if ($details.is(":hidden")) {
			$details.slideDown('slow');
			$(this).text("Hide Details");
		} else {
			$details.slideUp('slow');
			$(this).text("View Details");
		}	
	});
});