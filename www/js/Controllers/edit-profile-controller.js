angular.module('AppToDate.Controllers')

.controller('editProfileCtrl', function($scope, $location, userService) {
	$scope.user = angular.copy($scope.userDetails);
	
	$scope.saveProfile = function(user){
		$scope.setShowLoader(true);
		userService.saveUserProfile(user).then(function(response){
			$scope.setUserDetails(response);
			$scope.showResponseMessage('Profile saved successfully', true);
			$scope.setShowLoader(true);
		}, function(error){
			$scope.showResponseMessage(error.Message||'An error occured', false);
			$scope.setShowLoader(false);
		});
	}
});