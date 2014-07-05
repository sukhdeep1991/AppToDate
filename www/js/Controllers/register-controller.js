angular.module('AppToDate.Controllers')

.controller('registerCtrl', function($scope, $location, registerService) {
  	$scope.navTitle = "Register";
	
	$scope.Register = function(user)
	{
		if(user.password == user.confirm_password){
			registerService.registerUser(user).then(function(response){
				if(response){
					$scope.setUserDetails(response);
					$location.path('/home');					
				} else {
					$scope.showErrorMessage('Could not register user');
				}
			},
			function(errorData){
				$scope.showErrorMessage('Could not register user');
				console.log("Registering request failed : " + JSON.stringify(errorData));
			});
		}		
	}
});


