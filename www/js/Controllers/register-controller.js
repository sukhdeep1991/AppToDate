angular.module('AppToDate.Controllers')

.controller('registerCtrl', function($scope, $location, registerService) {
  	$scope.navTitle = "Register";
	
	$scope.Register = function(user)
	{
		if(user.password == user.confirm_password){
		    $scope.setShowLoader(true);
			registerService.registerUser(user).then(function(response){
				if(response){
					$scope.setUserDetails(response);
					$location.path('/home');					
				} else {
					$scope.showResponseMessage('An error occured', false);
				}
				$scope.setShowLoader(false);
			},
			function(errorData){
				$scope.showResponseMessage(errorData.Message||'An error occured', false);
				console.log("Registering request failed : " + JSON.stringify(errorData));
				$scope.setShowLoader(false);
			});
		} else {
			$scope.showErrorMessage('Passwords do not match');
		}
	}
});


