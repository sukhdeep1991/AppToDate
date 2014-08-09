angular.module('AppToDate.Controllers')

.controller('loginCtrl', 
		function($scope,$state,$rootScope,LoaderService,sessionService,Authentication, $location, registerService, userService) {




	$scope.register = function(){
		$location.path('/register');
	}
	$scope.navTitle = "Login";

	$scope.signIn=function(data){
		if(!data || !data.username || !data.password){
			return;
		}
		data.type = 2;
		callLoginService(data, false);
	} 

	$scope.facebookLogin = function(){
		console.log("Loging into facebook");
		var fbLoginSuccess = function (userData) {
			$scope.setShowLoader(true);
			console.log("Login successfull : " + JSON.stringify(userData));
			$scope.$apply(function(){
				var user = {};
				user.Person = {
						FirstName: userData.user.first_name,
						LastName: userData.user.last_name,
						timeZoneInfo: "UTC"
				};
				user.username = userData.user.email;
				user.phone = "0";
				user.type = 1;
				console.log("Calling login for user: " + JSON.stringify(user));
				callLoginService(user, false)

//				registerService.facebookRegister(userData).then(function(response){
//				if(response){
//				$scope.setUserDetails(response);
//				$location.path('/home');					
//				} else {
//				$scope.showErrorMessage('Could not register user');
//				}
//				$scope.setShowLoader(false);
//				},
//				function(errorData){
//				$scope.showErrorMessage('Could not register user');
//				console.log("Registering request failed : " + JSON.stringify(errorData));
//				$scope.setShowLoader(false);
//				});			  
			});
		}

		facebookConnectPlugin.login(["user_friends", "email"],
				fbLoginSuccess,
				function (error) { 
			console.log("Error occured" + error); 
		}
		);
	}

	var callLoginService = function(data, alreadyLoggedIn)
	{
		$scope.setShowLoader(true);
		Authentication.oa.login(data).then(function(response){
			if(response){
				if(!alreadyLoggedIn){
					userService.insertLoggedInUser({username: data.username, password: data.password, 
						type: data.type}).then(function(flag){
							$scope.setUserDetails(response);
							$location.path('/home');
						}, function(error){
							console.log("Error while inserting data in logged in user: " + JSON.stringify(error));
						})
				} else {
					$scope.setUserDetails(response);
					$location.path('/home');
				}
			} else {
				$scope.showErrorMessage("Username/password combination does not exist.");
			}
			$scope.setShowLoader(false);
		}, function(data){
			console.log("Login failded due to : " + JSON.stringify(data));
			$scope.showErrorMessage("Username/password combination does not exist.");
			$scope.setShowLoader(false);
		});
	}
})

