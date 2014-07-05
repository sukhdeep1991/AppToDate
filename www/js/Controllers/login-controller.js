angular.module('AppToDate.Controllers')

.controller('loginCtrl', 
  function($scope,$state,$rootScope,LoaderService,sessionService,Authentication, $location, registerService) {
	
	$scope.setUserDetails(undefined);
	
  $scope.register = function(){
	  $location.path('/register');
  }
  $scope.navTitle = "Login";
  
  $scope.signIn=function(data){
	  if(!data || !data.username || !data.password){
		  return;
	  }
	  Authentication.oa.login(data).then(function(response){
		  if(response){
			  $scope.setUserDetails(response);
			  $location.path('/home');
		  } else {
			  $scope.showErrorMessage("Username/password combination does not exist.");
		  }
	  }, function(data){
		  console.log("Login failded due to : " + JSON.stringify(data));
		  $scope.showErrorMessage("Username/password combination does not exist.");
	  });	  
  } 
  
  $scope.facebookLogin = function(){
	  console.log("Loging into facebook");
	  var fbLoginSuccess = function (userData) {
		  console.log("Login successfull : " + JSON.stringify(userData));
		  $scope.$apply(function(){
			  registerService.facebookRegister(userData).then(function(response){
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
		  });
		  
//		    facebookConnectPlugin.getAccessToken(function(token) {
//		        alert("Token: " + token);
//		    }, function(err) {
//		        alert("Could not get access token: " + err);
//		    });
		}

		facebookConnectPlugin.login(["email"],
		    fbLoginSuccess,
		    function (error) { alert("" + error) }
		);
	  
//	  FB.login(function(response){
//		  console.log("Login successfull : " + JSON.stringify(response));
//		  $location.path('/home');
//		});
  }
})

