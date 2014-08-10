angular.module('AppToDate.Services')
.factory('userService', function($q, httpResource, $filter){
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
        		group.server_id = response.Id;
        		DB.insertGroup(group).then(function(data){
        			deferred.resolve(group);
        		}, function(error){
        			console.log("errror in createGroup: "+ JSON.stringify(error));
        		});
        		
        	}).error(function(error){
        		console.log("Error occured while calling group save api: " + JSON.stringify(error));
        		deferred.reject(error);
        	});
    		return deferred.promise;
		},
		
		addInvitedAttendees: function(users, user_id){
			var deferred = $q.defer();
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
					deferred.resolve(null);
				}).error(function(error){
	        		console.log("Error occured while generate dummy api: " + JSON.stringify(error));
	        		deferred.resolve(null);
	        	});
			}
    		return deferred.promise;
		},
		getGroups: function(userId){
			var deferred = $q.defer();
            console.log('Fetching groups');
            $.when(DB.getGroupsForOwner(userId)).then(
	            function(data) {
	            	deferred.resolve(data);
	            },
	            function(errorMsg) {
	              console.log("Error while fetching groups: " + JSON.stringify(errorMsg));
	              deferred.reject(errorMsg);
	          });
			
			return deferred.promise;			
		},
		getLoggedInUser: function(){
			var deferred = $q.defer();
            console.log('Fetching logged in user');
            $.when(DB.getCurrentLoggedInUser()).then(
	            function(data) {
	            	deferred.resolve(data);
	            },
	            function(errorMsg) {
	              console.log("Error while fetching logged in user: " + JSON.stringify(errorMsg));
	              deferred.reject(errorMsg);
	          });
			
			return deferred.promise;	
		},
		insertLoggedInUser: function(user){
			var deferred = $q.defer();
            console.log('inserting logged in user');
            $.when(DB.insertCurrentLoggedInUser(user)).then(
	            function(data) {
	            	deferred.resolve(data);
	            },
	            function(errorMsg) {
	              console.log("Error while inserting logged in user: " + JSON.stringify(errorMsg));
	              deferred.reject(errorMsg);
	          });
			
			return deferred.promise;	
		},
		
		getUninvitedFriends: function(userId, searchKey){
			var deferred = $q.defer();
			this.getFriends(userId).then(function(invitedFriends){
				console.log("Already invited friends: "+ JSON.stringify(invitedFriends));
				
				//Calling plugin to get friends
				var options = {};
				options.filter = searchKey;
				var fields = ["displayName",
						"phoneNumbers", "emails" ];
				if(navigator.contacts){
					navigator.contacts.find(fields, function(contacts) {
						console.log("All friends from plugin length: " + JSON.stringify(contacts.length));
						var filteredContacts = [];
						angular.forEach(contacts, function(contact){
							var isInvited = false;
							if(contact.emails && contact.emails.length > 0){
								angular.forEach(invitedFriends, function(friend){
									if(friend.username && friend.username != "null" && friend.username != "undefined"){
										var filteredEmail = $filter('filter')(contact.emails, {value:  friend.username});
										if(filteredEmail.length > 0){
											isInvited = true;
										}
									}
								});
							}
							if(contact.phoneNumbers && contact.phoneNumbers.length > 0 && !isInvited){
								angular.forEach(invitedFriends, function(friend){
									if(friend.phone && friend.phone != 0){
										var filteredPhone = $filter('filter')(contact.phoneNumbers, {value:  friend.phone});
										if(filteredPhone.length > 0){
											isInvited = true;
										}
									}
								});
							}
							if(!isInvited){
								filteredContacts.push(contact);
							} else {
								console.log("Filtered friend: " + JSON.stringify(contact));
							}
						});
						console.log("Filtered contacts :"+ JSON.stringify(filteredContacts.length));
						deferred.resolve(filteredContacts);
					}, function(error){
						console.log("Error while fetching contacts from plugin: " + JSON.stringify(error));
					}, options);
				} else {
					console.log("navigator.contacts cannot be resolved");
				}
			}, function(error){
				console.log("Error while getting friends of user: "+ JSON.stringify(error));
			});
			return deferred.promise;
		},
		
		sendInvites: function(invites){
			if(invites && invites.length > 0){
				console.log("Inviting people: " + JSON.stringify(invites));
				httpResource.loadUrl("Person/InvitePeople", "POST", invites)
					.success(function(response){
						console.log("Success invite API: " + JSON.stringify(response));
					}).error(function(error){
						console.log("Error while calling the invite API: " + JSON.stringify(error));
					});
			}			
		}
	}
});