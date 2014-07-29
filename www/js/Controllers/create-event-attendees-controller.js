angular.module('AppToDate.Controllers')
.controller('createEvent.attendeesCtrl', function($scope, $filter, $location, imageService, eventService, googleMapService, userService) {
	$scope.attendeeTab = 'contacts';
	$scope.searchAttendees = {
		group: '',
		contact: ''
	}
	
	$scope.selectAllContacts = function(list, searchValue, flag){
		var filtered = flag ? $filter('filter')(list, {'first_name' : searchValue}) : list; 
		if(filtered && filtered.length > 0){
			filtered.map(function(item){
				item.isSelected = flag;
			});
		}
	}
	
	$scope.groups = [
	                 { "id": 123, "value": "Group 1"},
	                 { "id": 123, "value": "Group 2"},
	                 { "id": 123, "value": "Group 3"},
	                 { "id": 123, "value": "Group 4"},
	                 { "id": 123, "value": "Group 5"}
	                 ];
	
	
	if ($scope.userDetails && $scope.userDetails.user_id) {
		userService.getFriends($scope.userDetails.user_id).then(function(data){
			console.log("Got friends : " + JSON.stringify(data));
			angular.forEach(data,function(item){
				$scope.contacts.push(item);
			});
		}, function(error){
			console.log("Error occured while getFriends: "+ JSON.stringify(error));
		})
	}
});