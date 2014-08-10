angular.module('AppToDate.Services')
.factory('oauthLoginService', function($q, httpResource){
	var provider = "oauth";
	var email = "test@test.com";
	var loginData = {
			user_id: 1,
			email: email,
			auth_provider: provider,
			access_token: "1_test@test.com_oauth_token",
			login_time: new Date().getTime(),
			expired_in: new Date(new Date().getTime() + 1*24*60*60*1000),
			refresh_token: "1_test@test.com_oauth_refresh_token",
			
	};
	
	return {
		login: function(user){
			var deferred = $q.defer();
            console.log('Authenticating user');
            user.accessToken = appConfig.accessToken;
            $.when(DB.selectDeviceId()).then(
	            function(deviceId) {
	            	if(deviceId){
	            		console.log("DeviceId found: " + JSON.stringify(deviceId) + " : Setting to login info");
	            		user.deviceId = deviceId;
	            		user.deviceType = 1; //1 for android
	            		console.log("User to login: " + JSON.stringify(user));
	            		httpResource.loadUrl("authentication/login", "POST", user).success(function(data){
	        				console.log("User authenticated")
	        				var userData = {};
	        				userData.username = user.username;
	        				userData.id = data.Person.Id;
	        				userData.user_id = data.Person.ClientId;
	        				userData.first_name = data.Person.FirstName;
	        				userData.last_name = data.Person.LastName;
	        				userData.access_token = appConfig.accessToken;
	        				userData.expired_in = data.TokenExpiryTime;
	        				userData.refresh_token = data.RefreshToken;
	        				userData.phone = data.PhoneNo || 0;
	        				appConfig.authorizationToken = data.AuthorizationToken;
	        				
	        				$.when(DB.insertLoginDetail(userData)).then(
	        	              function(savedData) {
	        	                console.log("Saved login information in db : " + JSON.stringify(userData));
	        					deferred.resolve(userData);
	        	              },
	        	              function(errorMsg) {
	        	                console.log("Error while saving login information");
	        					deferred.resolve(false);
	        	            });	
	        			}).error(function(data, status) {
	        				console.log("Login failed: " + JSON.stringify(user));
	        				deferred.reject(data);
	        			});
	             	} else {
	             		console.log("DeviceId not found cannot login");
	             		deferred.reject(deviceId);
	             	}
	            },
	            function(errorMsg) {
	              console.log("Error while fetching deviceId: " + JSON.stringify(errorMsg));
	              deferred.reject(errorMsg);
	          });
			
			return deferred.promise;			
		}
	}
});