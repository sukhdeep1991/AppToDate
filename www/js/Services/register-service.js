angular.module('AppToDate.Services')
.factory('registerService', function($q, httpResource) {
	var registerIncomingUser = function(user, deferred)
	{
		console.log("Registering user : " + JSON.stringify(user));
		httpResource.loadUrl("authentication/register", "POST", user).success(function(data){
			console.log("Registering user api done: " + JSON.stringify(data));
			var loginData = {};
			loginData.username = user.username;
			loginData.auth_provider = "oauth";
			loginData.user_id = data.Person.ClientId;
			loginData.access_token = appConfig.accessToken;
			loginData.expired_in = data.TokenExpiryTime;
			loginData.refresh_token = data.RefreshToken;
			loginData.first_name = data.Person.FirstName;
			loginData.last_name = data.Person.LastName;
			appConfig.authorizationToken = data.AuthorizationToken;
			
			$.when(DB.insertLoginDetail(loginData)).then(
              function(data) {
                console.log("Saved register information in db : " + JSON.stringify(loginData));
				deferred.resolve(loginData);
              },
              function(errorMsg) {
                console.log("Error while saving register information");
				deferred.resolve(false);
            });
		}).error(function(data){
        	console.log("Error occured while registering : " + JSON.stringify(data));
        	deferred.reject(data);
        });
	}
	
	return {
		registerUser : function(user){
			var deferred = $q.defer();
			user.AccessToken = appConfig.accessToken;
			user.type = 2;
			user.person.timeZoneInfo = "UTC";
			user.person.LastName = "test";
			
			registerIncomingUser(user, deferred);
			return deferred.promise;
		},
		
		facebookRegister : function(fbLoginResponse){
			var deferred = $q.defer();
			$.when(DB.getLoggedInUser(fbLoginResponse.user.email)).then(
	              function(existing) {
			    	if(existing){
			            console.log('Found the user. No need to register');
			            console.log('Updating details');
			            var loginData = {};
						loginData.username = fbLoginResponse.user.email;
						loginData.auth_provider = "facebook";
						loginData.user_id = existing.user_id,
						loginData.access_token = appConfig.accessToken;
						loginData.expired_in = fbLoginResponse.authResponse.expiresIn;
						//loginData.refresh_token = data.RefreshToken;
						loginData.first_name = fbLoginResponse.user.first_name;
						loginData.last_name = fbLoginResponse.user.last_name;
						//appConfig.authorizationToken = data.AuthorizationToken;
						
						$.when(DB.insertLoginDetail(loginData)).then(
			              function(data) {
			                console.log("Saved register information in db : " + JSON.stringify(loginData));
							deferred.resolve(loginData);
			              },
			              function(errorMsg) {
			                console.log("Error while saving register information");
							deferred.resolve(false);
			            });
			    	} else {
	              		var userToRegister = {};
	              		userToRegister.Person = {
	              			FirstName: fbLoginResponse.user.first_name,
	              			LastName: fbLoginResponse.user.last_name,
	              			timeZoneInfo: "UTC"
	              		};
	              		userToRegister.username = fbLoginResponse.user.email;
	              		userToRegister.phone = "0";
	              		userToRegister.AccessToken = appConfig.accessToken;
	              		userToRegister.type = 1;
	              		
	        			registerIncomingUser(userToRegister, deferred);
	              	}
	             },
		    	 function(error){
	            	console.log("Error while calling local db");
		    	 }
				    	
			  );
			return deferred.promise;
		}
	}
});