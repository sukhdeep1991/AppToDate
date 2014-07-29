angular.module('AppToDate.Controllers')
.controller('createEvent.attendeesCtrl', function($scope, $filter, $location, imageService, eventService, googleMapService, userService) {
	$scope.attendeeTab = 'contacts';
	$scope.searchAttendees = {
		group: '',
		contact: ''
	}
	
	if ($scope.userDetails && $scope.userDetails.user_id) {
		userService.getFriends($scope.userDetails.user_id).then(function(data){
			console.log("Got friends : " + JSON.stringify(data));
			angular.forEach(data,function(item){
				$scope.contacts.push(item);
			});
		}, function(error){
			console.log("Error occured while getFriends: "+ JSON.stringify(error));
		})
		
		userService.getGroups($scope.userDetails.user_id).then(function(data){
			console.log("Got groups : " + JSON.stringify(data));
			angular.forEach(data,function(item){
				console.log("Pushing to groups : " + JSON.stringify(item));
				$scope.groups.push(item);
			});
		}, function(error){
			console.log("Error occured while getGroups: "+ JSON.stringify(error));
		})
	}
	
	$scope.selectAllContacts = function(list, searchValue, flag){
		var filtered = flag ? $filter('filter')(list, {'first_name' : searchValue}) : list; 
		if(filtered && filtered.length > 0){
			filtered.map(function(item){
				item.isSelected = flag;
			});
		}
	}
	
	$scope.selectAllGroups = function(list, searchValue, flag){
		var filtered = flag ? $filter('filter')(list, {'group_name' : searchValue}) : list; 
		if(filtered && filtered.length > 0){
			filtered.map(function(item){
				item.isSelected = flag;
			});
		}
	}
});