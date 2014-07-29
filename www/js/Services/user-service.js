angular.module('AppToDate.Services')
.factory('userService', function($q){
	return {
		getFriends: function(userId){
			var deferred = $q.defer();
            console.log('Fetching friends');
            $.when(DB.getFriendsByUserId(userId)).then(
	            function(data) {
	            	deferred.resolve(data);
	            },
	            function(errorMsg) {
	              console.log("Error while fetching friends: " + JSON.stringify(errorMsg));
	              deferred.reject(errorMsg);
	          });
			
			return deferred.promise;			
		}
	}
});