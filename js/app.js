$(document).ready(function(){

	$(".js-login").click(function(){
		gapi.auth2.getAuthInstance().signIn().then(function(){
			$(".splash-screen").hide();
			$(".calendar-selection").show();
			makeApiCall();
		})
		
	})

	function makeApiCall() {
		var restRequest = gapi.client.request({
			'path': '/calendar/v3/users/me/calendarList',
		}).then(function(resp) {
			for (var i=0; i < resp.result.items.length; i++) {
				var calendar = resp.result.items[i];
				$('.calendar-choices').append("<p><a class='calendar-link' href='#'>" +  calendar.summary + "</a></p>");
			}
		}, function(reason) {
			console.log('Error: ' + reason.result.error.message);
		})
	}

	$(".calendar-choices").on("click", ".calendar-link", function(){
		$(".calendar-selection").hide();
		$(".calendar-view").show();
	})


	$(".js-logout").click(function(){
		$(".calendar-selection").hide();
		$(".splash-screen").show();
	})

	$(".js-calendarchoice").click(function(){
		$(".calendar-selection").hide();
		$(".calendar-view").show();
	})

	$(".js-changecalendar").click(function(){
		$(".calendar-view").hide();
		$(".calendar-selection").show();
	})

	function onLoadFn(){
		gapi.client.setApiKey('AIzaSyCX5Zh7ZtlaU2mvksDKQe5Z_njZ-zc7Mdo');
  gapi.auth2.init({
      client_id: '963904802029-arblg7v5te79ao18cqjc6006mr6scsmo.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/calendar.readonly'
  });
	}

	gapi.load("client:auth2", onLoadFn);


}) 

