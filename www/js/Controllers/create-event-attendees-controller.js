angular.module('AppToDate.Controllers')
.controller('createEvent.attendeesCtrl', function($scope, $filter, $location, imageService, eventService, googleMapService) {
	$scope.attendeeTab = 'emails';
	$scope.searchAttendees = {
		email : '',
		group: '',
		contact: '',
		facebook: ''
	}
	
	$scope.selectAll = function(list, searchValue, flag){
		var filtered = flag ? $filter('filter')(list, {'value' : searchValue}) : list; 
		if(filtered && filtered.length > 0){
			filtered.map(function(item){
				item.isSelected = flag;
			});
		}
	}
	
	$scope.emails = [
	                 {"value" :"test@123.com"},
	                 {"value" :"test@097.com"},
	                 {"value" :"test@457.com"},
	                 {"value" :"test@sfg.com"},
	                 {"value" :"test@000.com"}
	                 ];
	
	$scope.groups = [
	                 { "id": 123, "value": "Group 1"},
	                 { "id": 123, "value": "Group 2"},
	                 { "id": 123, "value": "Group 3"},
	                 { "id": 123, "value": "Group 4"},
	                 { "id": 123, "value": "Group 5"}
	                 ];
	
	$scope.contacts = [
	                   {"value" : "123"},
	                   {"value" : "4564"},
	                   {"value" : "678"},
	                   {"value" : "356"},
	                   {"value" : "9999"}
	                   ];
	
	$scope.facebookFriends = [
	                          {"id": 123, "value": "Friend1"},
	                          {"id": 123, "value": "Friend2"},
	                          {"id": 123, "value": "Friend3"},
	                          {"id": 123, "value": "Friend4"},
	                          {"id": 123, "value": "Friend5"}
	                          ];
});