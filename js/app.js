$(document).ready(function(){

	$(".js-login").click(function(){
		$(".splash-screen").hide();
		$(".calendar-selection").show();
	})

	$(".js-logout").click(function(){
		$(".calendar-selection").hide();
		$(".splash-screen").show();
	})

	$(".js-calendarchoice").click(function(){
		$(".calendar-selection").hide();
		$(".calendar-view").show();
	})
}) 

