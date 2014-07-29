angular.module('AppToDate.Services')
.factory('userService', function($q, httpResource){
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
		},
		
		createGroup: function(group){
			var deferred = $q.defer();
            console.log('saving group');
            angular.forEach(group.groupPersonAssociations, function(item){
            	item.Person = {};
            	item.Person.ClientId = item.user_id;
            	item.Person.FirstName = item.first_name;
            	item.Person.LastName = item.last_name;            	
            });
        	httpResource.loadUrl("Group/Post", "POST", group).success(function(response){
        		DB.insertGroup(group);
        		deferred.resolve(group);
        	}).error(function(error){
        		console.log("Error occured while calling group save api: " + JSON.stringify(error));
        	});
    		return deferred.promise;
		},
		
		addInvitedAttendees: function(users, user_id){
			if(users && users.length > 0){
				httpResource.loadUrl("Authentication/GenerateDummyClientIds?count=" + users.length, "POST", null).success(function(response){
					users.map(function(user, index){
						user.user_id = response[index];
						$.when(DB.insertLoginDetail(user)).then(
		        	              function(savedData) {
		        	            	  console.log("Saved information information in db : " + JSON.stringify(savedData));
		        	            	  DB.insertFriend(user_id, user.user_id);
		        	              },
		        	              function(errorMsg) {
		        	                console.log("Error while saving login information");
		        	            });	
					});
				}).error(function(error){
	        		console.log("Error occured while calling group save api: " + JSON.stringify(error));
	        	});
			}
		}
	}
});