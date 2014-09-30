angular
.module('AppToDate.Controllers')
.controller(
		'logoutCtrl',
function($scope, $filter, $location, userService) {
	$scope.setNavTitle("Calendar");
	
	$scope.setShowLoader(true);
	userService.logout().then(function(){
		$scope.showResponseMessage('Logged out successfully', true);
		$scope.setShowLoader(false);
		$location.path("/login");
	}, function(error){
		console.log("Error while logout the user");
		$scope.setShowLoader(false);
		$scope.showResponseMessage(error.Message||'An error occured', false);
	})
});