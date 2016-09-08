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
		//console.log(resp);
		events = resp.result.items;
		getWeather();
	}, function(reason) {
		console.log(reason);
	})
	}

	function showEvents (){
		 	$('.js-appt').html("<p>" + moment(getEventDate()).format('dddd, MM/DD/YY, HH:mm') + " - " + events[currentEvent].summary  + "</p>");
		
	}

	function getEventDate (){
		if (!events[currentEvent].start.dateTime) {
			 return new Date(events[currentEvent].start.date).toISOString().slice(0,-5); 
		} else {
			return events[currentEvent].start.dateTime;
		}
	}

$("#next-button").on("click", function(){
	currentEvent = currentEvent + 1;
	getWeather();
})

$("#previous-button").on("click", function(){
	currentEvent = currentEvent - 1;
	getWeather();
})


$(".calendar-choices").on("click", ".calendar-link", function(){
	$(".calendar-selection").hide();
	$(".calendar-view").show();
	getCalendarEvents($(this).data("id"));


})

var latitude;
var longitude;

if ("geolocation" in navigator) {
	navigator.geolocation.getCurrentPosition(function(position) {
		console.log(position);
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
	});
}

function getWeather(){
	var eventDate = getEventDate();
	console.log(eventDate);
	$.ajax({
		url: 'https://api.forecast.io/forecast/1c97c1a55e35b5e41528f7a66520f182/' + latitude + ',' + longitude + ',' + eventDate,
		dataType: 'jsonp'
	}).done(function(data) {
		showEvents();
		console.log(data);
		var tempInfo = data.daily.data[0];
		$('.temp').html("<p>" + "Temperature: " + data.currently.temperature + "</p>");
		$('.temp-min').html("<p>" + "Min" + " " + tempInfo.temperatureMin + "- Max:" + " " +tempInfo.temperatureMax +  "</p>");
		$('.forecast').html("<p>" + tempInfo.icon + "</p>");
		$('.prec').html("<p>" + "Prec:" + data.currently.precipProbability + "%" + "</p>");
		$('.sunrise').html("<p>" + "Sunrise: " + moment.unix(tempInfo.sunriseTime).format("hh:mm a") + "</p>");
		$('.sunset').html("<p>" + "Sunset: " + moment.unix(tempInfo.sunsetTime).format("hh:mm a") + "</p>"); 
	})
}

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



