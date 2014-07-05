angular.module('AppToDate.Services')
.factory('registerService', function($q, httpResource) {
	return {
		registerUser : function(user){
			var deferred = $q.defer();
			user.AccessToken = appConfig.accessToken;
			user.type = 2;
			user.person.timeZoneInfo = "UTC";
			user.person.LastName = "test";
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
			
			return deferred.promise;
		}
	}
});