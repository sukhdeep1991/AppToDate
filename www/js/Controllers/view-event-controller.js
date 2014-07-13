angular
.module('AppToDate.Controllers')
.controller(
		'viewEventCtrl',
function($scope, $filter, $location, imageService,
		eventService, googleMapService, $stateParams) {
	$scope.navTitle = "View Event";
	$scope.mapLoaded = false;
	$scope.tab = 'details';
	$scope.eventId = $stateParams.id

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
			"id" : 3,
			"user_Id" : "435e357c-aad1-4b5a-b914-5a9e39e92184",
			"title" : "this time",
			"notes" : "Test",
			"start" : "Wed Jul 16 2014 02:00:00 GMT+0530 (IST)",
			"end" : "Wed Jul 16 2014 03:00:00 GMT+0530 (IST)",
			"image_url" : "content://media/external/images/media/12261",
			"location_title" : "Sector 61, Noida, Uttar Pradesh, India",
			"lat" : "28.5960874999341",
			"lng" : "77.3683318999999"
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
			googleMapService.showMapInDiv('map', function(
					position) {
				googleMapService.setLatLng($scope.event);
				$scope.mapLoaded = true;
				console.log("Current positions : "
						+ JSON.stringify(position));
			});
		}
	}
});