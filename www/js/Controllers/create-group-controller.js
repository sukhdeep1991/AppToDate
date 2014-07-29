angular.module('AppToDate.Controllers')

.controller('createGroupCtrl', 
  function($scope, userService) {
	
	if ($scope.userDetails && $scope.userDetails.user_id) {
		userService.getFriends($scope.userDetails.user_id).then(function(data){
			console.log("Got friends : " + JSON.stringify(data));
			$scope.friends = data;
		}, function(error){
			console.log("Error occured while getFriends: "+ JSON.stringify(error));
		})
	}
});