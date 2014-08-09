angular
.module('AppToDate.Controllers')
.controller(
		'viewEventCtrl',
function($scope, $filter, $location, imageService,
		eventService, googleMapService, $stateParams) {
    $scope.setNavTitle("View Event");
	$scope.mapLoaded = false;
	$scope.tab = 'details';
	$scope.eventId = $stateParams.id
	$scope.statusMessages = {"0.0": "Wating for response"};
	$scope.userImageSource = appConfig.apiUrl + "Image/Get?clientId=";
	$scope.eventImageSource = appConfig.apiUrl + "Image/GetEventImage?eventId=";

	if ($scope.userDetails && $scope.userDetails.user_id) {
		eventService
				.getEvent($scope.eventId)
				.then(
						function(data) {
							$scope.event = data
							$scope.event.start = new Date($scope.event.start);
						},
						function(error) {
							console
									.log("Error occured while fetching the event data")
						});
	} else {
		$scope.event = {
				  "server_id": 48,
				  "id": 1,
				  "user_Id": "d464afc9-020b-4c48-9927-ea75d3cca2cf",
				  "title": "test new event",
				  "notes": "test notes",
				  "start": "Thu Jul 31 2014 15:43:00 GMT-0400 (EDT)",
				  "end": "Thu Jul 31 2014 16:43:00 GMT-0400 (EDT)",
				  "image_url": "undefined",
				  "location_title": "sector 61",
				  "lat": 28.37999999999999,
				  "lng": 77.12,
				  "remind_before": "25",
				  "attendees": [
				    {
				      "person": {},
				      "username": "undefined",
				      "first_name": "Contact1",
				      "last_name": "test",
				      "access_token": "testAccessToken",
				      "user_id": "af079bd7-af59-4e76-b33e-5d369c69b054",
				      "login_time": "undefined",
				      "expires_in": "undefined",
				      "refresh_token": "undefined",
				      "status": "0.0"
				    },
				    {
				      "person": {},
				      "username": "undefined",
				      "first_name": "Sumit",
				      "last_name": "test",
				      "access_token": "testAccessToken",
				      "user_id": "2c3d480e-62d5-4aeb-9240-ce001222b593",
				      "login_time": "undefined",
				      "expires_in": "undefined",
				      "refresh_token": "undefined",
				      "status": "0.0"
				    }
				  ]
				}

		$scope.event.start = new Date($scope.event.start);
	}

	$scope.loadEventDetails = function() {
		$scope.tab = 'details';
	}

	$scope.loadAttendees = function() {
		$scope.tab = 'attendees';
	}
	$scope.loadGoogleMap = function() {
		$scope.tab = 'location';
		if (!$scope.mapLoaded) {
			googleMapService.showMapInDiv('map', function() {
				$scope.mapLoaded = true;
			}, $scope.event);
		}
	}
	$scope.attendeeClicked = function(attendee){
		$scope.selectedAttendee = attendee;
		$scope.showModal = true;
	}
	$scope.closeModal = function(){
		$scope.showModal = false;
	}

	$scope.$on('edit_clicked', function(){
		 navigator.notification.confirm('What do you want?', confirmCallback, 'Event', 'Edit, Delete, Cancel');  
	});
	
	var confirmCallback = function(message){
		if(message == 1){
			console.log("Editing event");
			$location.path('/event/edit/' + $scope.eventId);
			$scope.$apply();
		} else if(message == 2){
			$scope.setShowLoader(true);
			console.log("Delete event");
			eventService.deleteEvent(parseInt($scope.event.server_id))
				.then(function(data){
					navigator.notification.alert('Event deleted successfully!', function(){
						$scope.setShowLoader(false);
						$location.path('/calendar');
						$scope.$apply();
					}, 'Alert', 'OK');  
				}, function(data){
					console.log("Error occured while deleting event: "+ JSON.stringify(data));
				})
		} else {
			console.log("Do nothing");
		}
	}
});