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
			httpResource.loadUrl("authentication/login", "POST", user).success(function(data){
				console.log("User authenticated")
				var userData = {};
				userData.user_id = data.Person.ClientId;
				userData.first_name = data.Person.FirstName;
				userData.last_name = data.Person.LastName;
				userData.access_token = appConfig.accessToken;
				userData.expired_in = data.TokenExpiryTime;
				userData.refresh_token = data.RefreshToken;
				appConfig.authorizationToken = data.AuthorizationToken;
				
				$.when(DB.insertLoginDetail(userData)).then(
	              function(data) {
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
			return deferred.promise;			
		}
	}
});