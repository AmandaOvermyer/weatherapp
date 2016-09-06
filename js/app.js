$(document).ready(function(){

	$(".js-login").click(function(){
		gapi.auth2.getAuthInstance().signIn().then(function(){
			$(".splash-screen").hide();
			$(".calendar-selection").show();
			makeApiCall();
		})
		
	})

	function makeApiCall() {
		gapi.client.request({
			'path': '/calendar/v3/users/me/calendarList',
		}).then(function(resp) {
			for (var i=0; i < resp.result.items.length; i++) {
				var calendar = resp.result.items[i];
				$('.calendar-choices').append("<p><a class='calendar-link' href='#' data-id='"+ calendar.id +"'>" +  calendar.summary + "</a></p>");
			}
		}, function(reason) {
			console.log('Error: ' + reason.result.error.message);
		})
	}
	var events; 
	var currentEvent = 0;

	function getCalendarEvents(calendarId){
		gapi.client.request({
			'path': '/calendar/v3/calendars/' + calendarId +'/events',
			'params': {
				timeMin: new Date().toISOString(),
				singleEvents: true,
				orderBy: 'startTime',
			}
		}).then(function(resp){
			console.log(resp);
			events = resp.result.items;
			showEvents();
		}, function(reason) {
			console.log(reason);
		})
	}

	function showEvents (){
		if (!events[currentEvent].start.dateTime) {
			$('.js-appt').html("<p>" + events[currentEvent].start.date + " - " + events[currentEvent].summary  + "</p>");
		} else {
			$('.js-appt').html("<p>" + events[currentEvent].start.dateTime + " - " + events[currentEvent].summary + "</p>");
		}
	}


	//function showCalendarData(resp){

	//}
	
	

	$("#next-button").on("click", function(){
		currentEvent = currentEvent + 1;
		showEvents();
	})
	
	$("#previous-button").on("click", function(){
		currentEvent = currentEvent - 1;
		showEvents();
	})


	$(".calendar-choices").on("click", ".calendar-link", function(){
		$(".calendar-selection").hide();
		$(".calendar-view").show();
		getCalendarEvents($(this).data("id"));


	})
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(function(position) {
			console.log(position);

		});
	}

	$.ajax({
		url: 'https://api.forecast.io/forecast/d299977ab42174cd2e68b01aa3257fc5/37.8267,-122.423,2016-09-10T12:00:00-0400',
		dataType: 'jsonp'
	}).done(function(data) {
		console.log(data);
	})

	$(".js-logout").click(function(){
		$(".calendar-selection").hide();
		$(".splash-screen").show();
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



