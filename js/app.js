$(document).ready(function(){

	gapi.load("client:auth2", onLoadFn);

	function startGeoLookup() {
			navigator.geolocation.getCurrentPosition(handleGeoLookup);
				$('.loading').show();
				$('.js-login').hide();

		}

	function handleGeoLookup(position, showError){
		$('.loading').hide();
		$('.js-login').show();
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
	}

	function showError(error) {
		switch(error.code){
			case error.PERMISSION_DENIED:
				alert("User denied the request for Geolocation.")
				break;
			case error.POSITION_UNAVAILABLE:
				alert("Location information is unavailable.")
				break;
			case error.TIMEOUT:
				alert("The request to get user location timed out.")
				break;
			case error.UNKNOWN_ERROR:
				alert("An unknonw error occurred.")
				break;
		}
	}

	function onLoadFn(){
		startGeoLookup();
		gapi.client.setApiKey('AIzaSyCX5Zh7ZtlaU2mvksDKQe5Z_njZ-zc7Mdo');
		gapi.auth2.init({
			client_id: '963904802029-arblg7v5te79ao18cqjc6006mr6scsmo.apps.googleusercontent.com',
			scope: 'https://www.googleapis.com/auth/calendar.readonly',
			cookiepolicy: 'single_host_origin'
		}).then(function(){
			gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
			updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
			
		});
	}

	$(".js-login").click(function(){
		gapi.auth2.getAuthInstance().signIn().then(function(){
			$(".splash-screen").hide();
		})
	})
	

	function getLocation(){
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(function(position) {
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
			});
		}
	}
	function updateSigninStatus(isSignedIn) {
		if (isSignedIn){
			$(".splash-screen").hide();
			$(".calendar-selection").show();
			makeApiCall();
			
		} else {
			$(".calendar-selection").hide();
			$(".splash-screen").show();
			$('.calendar-choices').empty();
		}
	}

	$(".js-logout").click(function(){
		gapi.auth2.getAuthInstance().signOut();
		$('.calendar-choices').empty();
	})

	function makeApiCall() {
		$('.loading').show();
		gapi.client.request({
			'path': '/calendar/v3/users/me/calendarList',
		}).then(function(resp) {
			$('.loading').hide();
			$(".calendar-selection").show();
			for (var i=0; i < resp.result.items.length; i++) {
				var calendar = resp.result.items[i];
				$('.calendar-choices').append("<p><a class='calendar-link' href='#' data-id='"+ calendar.id +"'>" +  calendar.summary + "</a></p>");
			}
		}, function(reason) {
			alert('Error: ' + reason.result.error.message);
		})
	}
	var events; 
	var currentEvent = 0;

	function getCalendarEvents(calendarId){
		gapi.client.request({
			'path': '/calendar/v3/calendars/' + encodeURIComponent(calendarId) +'/events',
			'params': {
				timeMin: new Date().toISOString(),
				singleEvents: true,
				orderBy: 'startTime',
			}
		}).then(function(resp){
		
		events = resp.result.items;
		getWeather();
	}, function(reason) {
		console.log(reason);
	})
	}

	function showEvents (){
		$('.js-appt').html("<p>" + moment(getEventDate()).format('dddd, MM/DD/YY, hh:mm a') + "<br>" + events[currentEvent].summary  + "</p>");
	}

	function showPrevious(){
		if (currentEvent > 0) {
			$('#previous-button').css('display', 'inline-block');
		} else {
			$('#previous-button').css('display', 'none');
		}
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
		showPrevious();
		getWeather();

	})

	$("#previous-button").on("click", function(){
		currentEvent = currentEvent - 1;
		showPrevious();
		getWeather();
	})


	$(".calendar-choices").on("click", ".calendar-link", function(){
		$(".calendar-selection").hide();
		$(".loading").show();
		getCalendarEvents($(this).data("id"));


	})

	var latitude;
	var longitude;



	function getWeather(){
		var eventDate = getEventDate();
		$.ajax({
			url: 'https://api.forecast.io/forecast/1c97c1a55e35b5e41528f7a66520f182/' + latitude + ',' + longitude + ',' + eventDate,
			dataType: 'jsonp'
		}).done(function(data) {
			$(".calendar-view").show();
			$(".loading").hide();
			showEvents();
			var tempInfo = data.daily.data[0];
			$('.temp').html("<p>" + "Temperature: " + data.currently.temperature + "</p>");
			$('.temp-min').html("<p>" + "Min" + " " + tempInfo.temperatureMin + "- Max:" + " " +tempInfo.temperatureMax +  "</p>");
			$('.forecast').attr('class', 'forecast');
			$('.forecast').addClass("-" + tempInfo.icon);
			$('.summary').html("<p>" + "Summary: " + tempInfo.summary + "</p>");
			$('.prec').html("<p>" + "Prec: " + (tempInfo.precipProbability *100) + "%" + "</p>");
			$('.sunrise').html("<p>" + "Sunrise: " + moment.unix(tempInfo.sunriseTime).format("hh:mm a") + "</p>");
			$('.sunset').html("<p>" + "Sunset: " + moment.unix(tempInfo.sunsetTime).format("hh:mm a") + "</p>"); 
		})
	}


	$(".js-changecalendar").click(function(){
		$(".calendar-view").hide();
		$(".calendar-selection").show();
	})

	
	
	
})



