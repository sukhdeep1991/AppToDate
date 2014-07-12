angular.module('AppToDate.Controllers')
.controller('createEventCtrl', function($scope, $filter, $location, imageService, eventService, googleMapService) {
	$scope.navTitle = "Create Event";
	$scope.minDate = new Date();
	$scope.mapLoaded = false;
	$scope.tab = 'details';
	//$scope.event = {file: "test"}
	
	$scope.uploadImage = function(){
		imageService.getPicture(true, function(imageURI){
			$scope.event = $scope.event || {};
			$scope.event.file = imageURI;
		}, function(e){
			console.log("Error occured while uploading the image");
		});
	}
	
	$scope.loadEventDetails = function(){
		$scope.tab = 'details';
	}
	
	$scope.loadAttendees = function(){
		$scope.tab = 'attendees';
	}
	$scope.loadGoogleMap = function(){
		$scope.tab = 'location';
		if(!$scope.mapLoaded){
			googleMapService.showMapInDiv('map', function(position){
				$scope.mapLoaded = true;	
				console.log("Current positions : " + JSON.stringify(position));
			});
		}
	}
	
	$scope.createEvent = function(event){
		event.start = new Date($filter('date')(event.date, 'MM-dd-yyyy'));
		event.end = new Date($filter('date')(event.date, 'MM-dd-yyyy'))
		console.log("Event to create : " +JSON.stringify(event));
		event.location = "Home";
		//Prepare the start date
		var time = event.startTime.split(":");
		event.start.setHours(time[0], time[1]);
		console.log("setting hours to start date" + JSON.stringify(time));
		
		//Prepare the end date
		time = event.endTime.split(":");
		event.end.setHours(time[0], time[1]);
		
		//Extract the utc string from the date time
		event.start = new Date( event.start.getTime() - (event.start.getTimezoneOffset() * 60000));
		event.end = new Date( event.end.getTime() - (event.end.getTimezoneOffset() * 60000));
		
		console.log("setting hours to end date" + JSON.stringify(time));
		
		console.log("Event to create : " +JSON.stringify(event));
		
		event.user_id = $scope.userDetails.user_id;
		console.log("Creating Event : " +JSON.stringify(event) )
		eventService.createEvent(event).then(function(response){
			console.log('Event created successfully : ' + JSON.stringify(event));
			//prepare calendar options
			var calOptions = window.plugins.calendar.getCalendarOptions();
			calOptions.firstReminderMinutes = 5;		
			
			window.plugins.calendar.createEvent(event.title,event.location,event.notes,
					event.start,event.end,success,error);
			
			$location.path('/calendar');
		}, 
		function(data){
			console.log('Error occured while creating event');
		});
	}
	
	var success = function(message) { console.log("Success: " + JSON.stringify(message)); };
	var error = function(message) { console.log("Error: " + message); };
});