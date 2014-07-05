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
			$.when(DB.getLoggedInUser(user.username)).then(
              function(userData) {
            	if(userData){
	                console.log('Found the user');
	                user.accessToken = userData.access_token;
	    			user.person = {
	    				"clientId": userData.user_id
	    			};
	    			httpResource.loadUrl("authentication/login", "POST", user).success(function(data){
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
              	} else {
              		console.log('user not found');
                  	deferred.resolve(false);              		
              	}
              },
              function(errorMsg) {
                console.log("Error while saving login information");
				deferred.resolve(false);
            });
			return deferred.promise;			
		},
	}
});