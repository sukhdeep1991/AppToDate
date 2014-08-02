angular
.module('AppToDate.Controllers')
.controller(
		'editEventCtrl',
function($scope, $filter, $location, imageService,
		eventService, googleMapService, $stateParams) {
	$scope.setNavTitle("Edit Event");
	$scope.mapLoaded = false;
	$scope.tab = 'details';
	$scope.eventId = $stateParams.id;
	$scope.timeSpans = ['5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60'];
	$scope.showModal = false;
	$scope.contacts = [];
	$scope.groups = [];
	$scope.selectedContacts = [];
	$scope.selectedGroups = [];
	
	$scope.addSelected = function(event){
		if(event.attendees && event.attendees.length > 0){
			angular.forEach(event.attendees, function(iten){
				$scope.selectedContacts.push(iten.server_id);
			});
			console.log("selected attendees of event: " + JSON.stringify($scope.selectedContacts));
			if($scope.contacts.length > 0){
				$scope.setSelected($scope.contacts, $scope.selectedContacts);
			} else {
				console.log("friends not found yet")
			}
		}
	}
	
	$scope.setSelected = function(contacts, selectedList){
		if(selectedList && selectedList.length > 0){
			console.log("Setting selected attendees");
			angular.forEach(selectedList, function(item){
				var filtered = $filter('filter')(contacts, {'server_id': item});
				if(filtered && filtered.length > 0){
					console.log("Setting selected to attendee: " + JSON.stringify(filtered[0]));
					filtered[0].isSelected = true;
				}
			});
		} else {
			console.log("No selected friends");
		}
	}
	
	$scope.setEventOnUI = function(event){
		$scope.event = angular.copy(event);
		$scope.event.client_id = $scope.event.id;
		$scope.event.id = parseInt($scope.event.server_id);
		var startDate = new Date($scope.event.start);
		var month = startDate.getMonth() + 1;
		$scope.event.date = month + "/" + startDate.getDate() + "/" + startDate.getFullYear();
		$scope.event.startTime = startDate.getHours() + ":" + startDate.getMinutes();
		var endDate = new Date($scope.event.end);
		$scope.event.endTime = endDate.getHours() + ":" + endDate.getMinutes();
		$scope.event.file = $scope.event.imageUrl;
		angular.element("#enterlocation").val($scope.event.location_title);
		$scope.event.start = undefined;
		$scope.event.end = undefined;
	}
	
	//Set the map
	$scope.loadGoogleMap = function() {
		console.log("Edit event map loading");
		if (!$scope.mapLoaded) {
			googleMapService.showMapInDiv('map', function() {
				$scope.mapLoaded = true;
			}, $scope.event);
		}
	}
	
	if ($scope.userDetails && $scope.userDetails.user_id) {
		eventService
				.getEvent($scope.eventId)
				.then(
						function(data) {
							$scope.event = data
							$scope.event.start = new Date($scope.event.start);
							$scope.addSelected($scope.event);
							$scope.setEventOnUI($scope.event);
						},
						function(error) {
							console
									.log("Error occured while fetching the event data")
						});
	} else {
		$scope.event = {
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
		$scope.addSelected($scope.event);
		$scope.setEventOnUI($scope.event);
	}
});