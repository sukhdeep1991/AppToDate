(function(window) {
function AppToDateDB() {};

AppToDateDB.prototype = function() {
  var db = window.openDatabase("AppToDate", "1.0", "AppToDate", 1024*1000);
	var initialize=function(){
		//var db = window.openDatabase("AppToDate", "1.0", "AppToDate", 1024*1000);
    db.transaction(function(tx) {
    	 tx.executeSql('CREATE TABLE IF NOT EXISTS Login(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id TEXT,email TEXT,access_token TEXT,login_time TEXT,expires_in TEXT,auth_provider TEXT,refresh_token TEXT, first_name TEXT, last_name TEXT)',[],
            function(t,results){
              console.log("table Login created");
            },function(t,e){
              console.log("Error while creating Login table : "+e.message);
            });
    	 tx.executeSql('drop TABLE IF EXISTS Group_Master',[],
            function(t,results){
              console.log("Group_Master table dropped");
            },function(t,e){
              console.log("Error while dropping Group_Master table : "+e.message);
            });
          tx.executeSql('CREATE TABLE IF NOT EXISTS AttendeeGroup(id INTEGER PRIMARY KEY AUTOINCREMENT,group_name TEXT, owner_id TEXT, server_id TEXT)',[],
            function(t,results){
              console.log("Group_Master table created");
            },function(t,e){
              console.log("Error while creating Group_Master table : "+e.message);
            });
          tx.executeSql('SELECT server_id FROM AttendeeGroup LIMIT 1', [], 
                  function(t,r){
              	  console.log("Column server_id for AttendeeGroup exists");
                }, function(err){
              	  console.log("Column server_id for AttendeeGroup does not exist");
              	  console.log("Creating server_id column");
      	          tx.executeSql('ALTER TABLE AttendeeGroup ADD COLUMN server_id TEXT', [], 
      	                  function(t,r){
      	              	  console.log("server_id column added to AttendeeGroup");
                      }, function(err){
                    	  console.log("Error : server_id column added to AttendeeGroup");
                      });
            });
          tx.executeSql('CREATE TABLE IF NOT EXISTS User_Group(id INTEGER PRIMARY KEY AUTOINCREMENT,group_Id INTEGER,user_Name)',[],
            function(t,results){
              console.log("User_Group table created");
            },function(t,e){
              console.log("Error while creating User_Group table : "+e.message);
            });
          
          tx.executeSql('CREATE TABLE IF NOT EXISTS User_Images(id INTEGER PRIMARY KEY AUTOINCREMENT, user_Id INTEGER, image_data)',[],
            function(t,results){
              console.log("User_Images table created");
            },function(t,e){
              console.log("Error while creating User_Images table : "+e.message);
            });
          
          tx.executeSql('CREATE TABLE IF NOT EXISTS Events (id INTEGER PRIMARY KEY AUTOINCREMENT, user_Id INTEGER, title TEXT, notes TEXT,' +
        		  		'start, end, image_url, location_title, lat, lng, remind_before, server_id TEXT)',[],
    	          function(t,results){
    	            console.log("Events table created");
    	          },function(t,e){
    	            console.log("Error while creating Events table : "+e.message);
    	          });
          /*Add not created tables*/
          tx.executeSql('SELECT remind_before FROM Events LIMIT 1', [], 
                  function(t,r){
              	  console.log("Column exists");
                }, function(err){
              	  console.log("Column remind_before does not exist");
              	  console.log("Creating remind_before column");
      	          tx.executeSql('ALTER TABLE Events ADD COLUMN remind_before TEXT', [], 
      	                  function(t,r){
      	              	  console.log("remind_before column added");
                      }, function(err){
                    	  console.log("Error : remind_before column added");
                      });
            });
          /*Add not created tables*/
          tx.executeSql('SELECT server_id FROM Events LIMIT 1', [], 
                  function(t,r){
              	  console.log("Column server_id exists in events");
                }, function(err){
              	  console.log("Column server_id does not exist in events");
              	  console.log("Creating server_id column");
      	          tx.executeSql('ALTER TABLE Events ADD COLUMN server_id TEXT', [], 
      	                  function(t,r){
      	              	  console.log("server_id column added");
                      }, function(err){
                    	  console.log("Error : server_id column added");
                      });
            });
          tx.executeSql('SELECT location_title FROM Events LIMIT 1', [], 
            function(t,r){
        	  console.log("Column exists");
          }, function(err){
        	  console.log("Column does not exist");
        	  console.log("Creating columns");
	          tx.executeSql('ALTER TABLE Events ADD COLUMN location_title TEXT', [], 
	                  function(t,r){
	              	  console.log("location_title column added");
                }, function(err){
              	  console.log("Error : location_title column added");
                });
	          tx.executeSql('ALTER TABLE Events ADD COLUMN lat TEXT', [], 
	                  function(t,r){
              	  console.log("lat column added");
              }, function(err){
            	  console.log("Error : lat column added");
                });
	          tx.executeSql('ALTER TABLE Events ADD COLUMN lng TEXT', [], 
	                  function(t,r){
              	  console.log("lng column added");
              }, function(err){
            	  console.log("Error : lng column added");
                });
          });
          
          tx.executeSql('CREATE TABLE IF NOT EXISTS DeviceId (id INTEGER PRIMARY KEY AUTOINCREMENT, device_id TEXT)',[],
	          function(t,results){
	            console.log("DeviceId table created");
	          },function(t,e){
	            console.log("Error while creating DeviceId table : "+e.message);
	          });
          
          tx.executeSql('CREATE TABLE IF NOT EXISTS user_friends (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, friend_id TEXT)',[],
	          function(t,results){
	            console.log("DeviceId table created");
	          },function(t,e){
	            console.log("Error while creating DeviceId table : "+e.message);
	          });
          
          tx.executeSql('CREATE TABLE IF NOT EXISTS event_attendees (id INTEGER PRIMARY KEY AUTOINCREMENT, event_id INTEGER, user_id TEXT, status TEXT)',[],
	          function(t,results){
	            console.log("event_attendees table created");
	          },function(t,e){
	            console.log("Error while creating event_attendees table : "+e.message);
	          });
          tx.executeSql('CREATE TABLE IF NOT EXISTS LoggedInUser (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, type TEXT)',[],
          function(t,results){
            console.log("LoggedInUser table created");
          },function(t,e){
            console.log("Error while creating LoggedInUser table : "+e.message);
          });
        });
	}
	
	var insertCurrentLoggedInUser = function(user){
		console.log("Inserting logged in user");
		var deferred = $.Deferred();
		db.transaction(function(tx) {
			tx.executeSql('INSERT INTO LoggedInUser (username, password, type) VALUES (?, ?, ?)', 
	        		[user.username, user.password, user.type],
	        		function(t,r){
	            console.log("Data inserted LoggedInUser usename: " + user.username + " : friend " + user.password);
	            deferred.resolve(true);
	          },function(t,e){
	            console.log("Error Data inserted in LoggedInUser table:  "+ e.message);
	            deferred.reject(e);
	          });
		});
		return deferred.promise();
	}
	
	var getCurrentLoggedInUser = function(){
		console.log("Getting logged in user");
		var deferred = $.Deferred();
		db.transaction(function(tx) {
            tx.executeSql('SELECT username, password, type FROM LoggedInUser LIMIT 1', [],
            	function(t, r){
            	if(r.rows.length){
            		var row = r.rows.item(0);
                	deferred.resolve({
                		username: row["username"],
                		password: row["password"],
                		type: parseInt(row["type"])
                	});
            	} else {
            		deferred.resolve(null);
            	}
            }, function(t,e){
            	console.log("Error while getting logged in user: "+ e.message);
            	deferred.reject(e);
            });
		});
		return deferred.promise();
	}
	
	var deleteEvent = function(eventServerId){
		console.log("delete event");
		var deferred = $.Deferred();
		db.transaction(function(tx) {
			tx.executeSql('delete from Events where server_id = ?', 
	        		[eventServerId],
	        		function(t,r){
	            console.log("event with server id is deleted: " + eventServerId );
	            deferred.resolve(r);
	          },function(t,e){	
	            console.log("Error Data deleting event "+ e.message);
	            deferred.reject(e.message);
	          });
		});
		return deferred.promise();
	}
	
	var getAttendeesByEvent = function(eventId){
		console.log("Attendees for event");
		var deferred = $.Deferred();
		db.transaction(function(tx) {
            tx.executeSql('SELECT user_id, status FROM event_attendees where event_id = ?', [eventId],
            	function(t, r){
            	if(r.rows.length){
            		var attendeeIds = [];
            		var status = {};
                	for(var i = 0 ; i < r.rows.length ; i ++){
                    	var row = r.rows.item(i);
                    	attendeeIds.push(row['user_id']);
                    	status[row['user_id']] = row['status']
                	}
                	var tempDeferred = $.Deferred();
                	tempDeferred.promise().then(function(attendees){
                		attendees.map(function(attendee){
                			attendee.status = status[attendee.user_id];
                		});
                		deferred.resolve(attendees);
                	});
                	getUsers(attendeeIds, tempDeferred, tx);
            	} else {
            		deferred.resolve(null);
            	}
            }, function(t,e){
            	console.log("Error while selecting attendees data : "+ e.message);
            	deferred.reject(e);
            });
		});
		return deferred.promise();
	}
	
	var getGroupsForOwner = function(ownerId){
		console.log("Fetching groups data for userId : " + ownerId);
		var deferred = $.Deferred();
		db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM AttendeeGroup where owner_id = ?', [ownerId], 
              function(t,r){
                if(r.rows.length){
                	console.log("groups found");
                	var groups = [];
                	for(var i = 0 ; i < r.rows.length ; i ++){
                    	var row = r.rows.item(i);
                    	groups.push(row);                    	
                	}
                	deferred.resolve(groups);
                } else {
                	console.log("no groups found");
                	deferred.resolve(null);
                }
            }, function(t,e){
            	console.log("Error while selecting groups data : "+ e.message);
            	deferred.reject(e);
            });
    	});            
        return deferred.promise();
	}
	
	var insertFriend = function(user_id, friend_id){
		db.transaction(function(tx) {
			tx.executeSql('INSERT INTO user_friends (user_id, friend_id) VALUES (?, ?)', 
	        		[user_id, friend_id],
	        		function(t,r){
	            console.log("Data inserted in frinds table for user " + user_id + " : friend " + friend_id);
	            
	          },function(t,e){
	
	            console.log("Error Data inserted in frinds table for user :10031 : "+ e.message);
	          });
		});
	}
	
	var insertGroup = function(group){
		var deferred = $.Deferred();
		db.transaction(function(tx) {
			tx.executeSql('INSERT INTO AttendeeGroup (group_name, owner_id, server_id) VALUES (?, ?, ?)', [group.title, group.Owner.ClientId, group.server_id], 
			function(t,r){
				console.log("Result of insert query + " + JSON.stringify(r));
				var personIds = [];
				group.groupPersonAssociations.map(function(item){
					tx.executeSql('INSERT INTO User_Group (group_id, user_name) VALUES (?, ?)', [r.insertId, item.user_id], 
					function(t,r){
						console.log("row inserted : " + item.user_id)
					},function(t,e){
			          console.log("Error while inserting group : "+ e.message);
			          deferred.reject(e.message);
			        });
				});
				deferred.resolve(group);
			},function(t,e){
	          console.log("Error while inserting group : "+ e.message);
	          deferred.reject(e.message);
	        });
		});
        return deferred.promise();
	}
	
	var getUsers = function(ids, deferred, tx){
		var query = "select * FROM Login where user_id in (";
		for(var i = 0 ; i < ids.length ; i++){
			query += "?, ";
		}
		query = query.substring(0, query.lastIndexOf(",")) + ")";
		console.log("Resulting query : " + query);
		console.log("ids : " + JSON.stringify(ids));
		tx.executeSql(query, ids, 
          function(t,r){
	          if(r.rows.length){
	        	  console.log("users found : "+ r.rows.length);
	        	  var users = [];
	        	  for(var j = 0 ; j < r.rows.length ; j++){
		        	  var row = r.rows.item(j);
		        	  users.push(toUserData(row));
	        	  }
	        	  deferred.resolve(users);
	          } else {
	        	  deferred.resolve(null);
	          }
	      },function(t,e){
          console.log("Error while selecting user image : "+ e.message);
          deferred.reject(e.message);
        });
	}
	
	var getFriendsByUserId = function(userId){
		console.log("Fetching friends data for userId : " + userId);
		var deferred = $.Deferred();
    	db.transaction(function(tx) {
            tx.executeSql('SELECT friend_id FROM user_friends where user_id = ?', [userId], 
              function(t,r){
                if(r.rows.length){
                	console.log("friends found");
                	var friendIds = [];
                	for(var i = 0 ; i < r.rows.length ; i ++){
                    	var row = r.rows.item(i);
                    	friendIds.push(row['friend_id']);                    	
                	}
                	getUsers(friendIds, deferred, tx);
                } else {
                	console.log("no friends found");
                	deferred.resolve(null);
                }
            }, function(t,e){
            	console.log("Error while selecting DeviceId data : "+ e.message);
            	deferred.reject(e);
            });
    	});            
        return deferred.promise();
	}
	
	var insertDeviceId = function(deviceId){
    	console.log('Inserting into DeviceId ' + JSON.stringify(deviceId));
    	db.transaction(function(tx) {
			tx.executeSql('INSERT INTO DeviceId (device_id) VALUES (?)', 
	        		[deviceId],
	        		function(t,r){
	            console.log("Data inserted in DeviceId table count : "+r.rowsAffected);
	          },function(t,e){
	
	            console.log("Error while inserting data in DeviceId table : "+ e.message);
	          });
    	});
	}
	
	var selectDeviceId = function(){
		var deferred = $.Deferred();
    	db.transaction(function(tx) {
            tx.executeSql('SELECT device_id FROM DeviceId LIMIT 1', [], 
              function(t,r){
                if(r.rows.length){
                	console.log("device_id found");
                	var row = r.rows.item(0);
                	deferred.resolve(row['device_id']);
                } else {
                	deferred.resolve(null);
                }
            }, function(t,e){
            	console.log("Error while selecting DeviceId data : "+ e.message);
            	deferred.reject(e);
            });
    	});            
        return deferred.promise();
	}
	
	var updateEvent = function(event){
		var deferred = $.Deferred();    	
    	console.log('Inserting into events ' + JSON.stringify(event));
    	db.transaction(function(tx) {
	    	tx.executeSql('update Events set user_id=?, title=?, notes=?,start=?,end=?,image_url=?,'+
	    				'location_title=?, lat=?, lng=?, remind_before=?, server_id=? where id = ?', 
	        		[event.user_id, event.title, event.notes, event.start, event.end, event.imageUrl, 
	        		 event.location.displayName, event.location.latitude, event.location.longitude,
	        		 event.remindBefore, event.server_id, event.client_id],
	        		function(t,r){
	    			tx.executeSql('delete from event_attendees where event_id = ?',
	    				[event.client_id],
	    				function(a, b){
	    					console.log("Data deleted in event_attendees table count : "+r.rowsAffected);
	    				}, function(t,e){
	    					console.log("Error while deleting data in event_attendees table : "+ e.message);
	    		            deferred.reject(e.message);
	    				});
	    		if(event.EventAttendeeAssociations && event.EventAttendeeAssociations.length > 0){
	    			event.EventAttendeeAssociations.map(function(item){
	    				tx.executeSql('INSERT INTO event_attendees (event_id, user_id, status) values(?, ?, ?)',
	    				[r.insertId, item.AppToDateAttendee.Person.ClientId, eventStatus.unknown],
	    				function(a, b){
	    					console.log("Data inserted in event_attendees table count : "+r.rowsAffected);
	    				}, function(t,e){
	    					console.log("Error while inserting data in event_attendees table : "+ e.message);
	    		            deferred.reject(e.message);
	    				});
	    			});
	    			
	    		}
	    		deferred.resolve(event);
	            console.log("Data inserted in Events table count : "+r.rowsAffected);
	          },function(t,e){
	            console.log("Error while inserting data in Events table : "+ e.message);
	            deferred.reject(e.message);
	          });
    	});
    	return deferred.promise();
	}
	
    var insertEvent = function(event){
    	if(event.client_id){
    		return updateEvent(event);
    	}
		var deferred = $.Deferred();    	
    	console.log('Inserting into events ' + JSON.stringify(event));
    	db.transaction(function(tx) {
	    	tx.executeSql('INSERT INTO Events (user_id, title, notes,start,end,image_url, location_title, lat, lng, remind_before, server_id)'+ 
	    			'VALUES (?, ?, ?,?,?,?, ?, ?, ?, ?, ?)', 
	        		[event.user_id, event.title, event.notes, event.start, event.end, event.imageUrl, 
	        		 event.location.displayName, event.location.latitude, event.location.longitude, event.remindBefore, event.server_id],
	        		function(t,r){
	    		if(event.EventAttendeeAssociations && event.EventAttendeeAssociations.length > 0){
	    			event.EventAttendeeAssociations.map(function(item){
	    				tx.executeSql('INSERT INTO event_attendees (event_id, user_id, status) values(?, ?, ?)',
	    				[r.insertId, item.AppToDateAttendee.Person.ClientId, eventStatus.unknown],
	    				function(a, b){
	    					console.log("Data inserted in event_attendees table count : "+r.rowsAffected);
	    				}, function(t,e){
	    					console.log("Error while inserting data in event_attendees table : "+ e.message);
	    		            deferred.reject(e.message);
	    				});
	    			});
	    			
	    		}
	    		deferred.resolve(event);
	            console.log("Data inserted in Events table count : "+r.rowsAffected);
	          },function(t,e){
	            console.log("Error while inserting data in Events table : "+ e.message);
	            deferred.reject(e.message);
	          });
    	});
    	return deferred.promise();
    }
    
    var getUserEvents = function(userId){
    	var deferred = $.Deferred();
    	db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM Events WHERE (user_id=?)', [userId], 
              function(t,r){
                if(r.rows.length){
                	console.log("events found");
                	var events = [];
                	for(i = 0 ; i < r.rows.length ; i++){
                		events.push(r.rows.item(i));
                	}
                	deferred.resolve(events);
                } else {
                	deferred.resolve([]);
                }
            }, function(t,e){
            	console.log("Error while selecting events data : "+ e.message);
            	deferred.reject(e);
            });
    	});            
        return deferred.promise();
    }
    
    var getEventById = function(eventId){
    	var deferred = $.Deferred();
    	db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM Events WHERE (id=?)', [eventId], 
              function(t,r){
                if(r.rows.length){
                	console.log("event found");
                	deferred.resolve(r.rows.item(0));
                } else {
                	deferred.resolve([]);
                }
            }, function(t,e){
            	console.log("Error while selecting events data : "+ e.message);
            	deferred.reject(e);
            });
    	});            
        return deferred.promise();
    }

  var insertLoginDetail=function(data){
	  var deferred = $.Deferred();
    db.transaction(function(tx) {
          tx.executeSql('SELECT * FROM Login WHERE (user_id=? and email=? and auth_provider=?)', [data.user_id,data.username,data.auth_provider], 
            function(t,r){
              if(r.rows.length){

                var row = r.rows.item(0);
                var record_id=row["id"];
                tx.executeSql("UPDATE Login SET access_token=?, login_time=?, expires_in=?, refresh_token=?, first_name=?, last_name=? WHERE id = ?", 
                		[data.access_token, data.login_time, data.expired_in, data.refresh_token, data.first_name, data.last_name, record_id],
                  function(t,r){
                    console.log("Login table record updated count : "+r.rowsAffected);
                    deferred.resolve(r);

                  },function(t,e){
                    console.log("Error while Updating Login table : "+ e.message);
                    deferred.reject(e);
                  });


              }
              else{
        	  	console.log('Inserting int login with email id : ' + data.username);
                tx.executeSql('INSERT INTO Login (user_id, email, access_token,login_time,expires_in,auth_provider,refresh_token, first_name, last_name) VALUES (?, ?, ?,?,?,?,?,?,?)', 
                		[data.user_id,data.username,data.access_token,data.login_time,data.expired_in,data.auth_provider,data.refresh_token, data.first_name, data.last_name],
                		function(t,r){
                    console.log("Data inserted in login table count : "+r.rowsAffected);
                    deferred.resolve(r);
                  },function(t,e){
                    console.log("Error while inserting data in Login table : "+ e.message);
                    deferred.reject(e);
                  });
              }

            },function(t,e){
              //debugger;
              console.log("Error while inserting login detail : "+e.message);
              deferred.resolve(e);

            });     
          
        });
    return deferred.promise();
  }
  
  var toUserData = function(row){
	  var userData = { person : {}};
	  userData.username = row['email'];
	  userData.first_name = row['first_name'];
	  userData.last_name = row['last_name'];
	  userData.access_token = row['access_token'];
	  userData.user_id = row['user_id'];
	  userData.server_id = row['user_id'];
	  userData.login_time = row['login_time'];
	  userData.expires_in = row['expires_in'];
	  userData.refresh_token = row['refresh_token'];
	  
	  console.log("toUserData: " + JSON.stringify(userData));
	  return userData;
  }
  
  var getLoggedInUser = function(username){
	  var deferred = $.Deferred();
	  console.log('finding user with email : ' + username)
	  db.transaction(function(tx) {
		  tx.executeSql('SELECT * FROM Login WHERE (email=?)', [username], 
	        function(t,r){
	          if(r.rows.length){
	        	  var row = r.rows.item(0);
	        	  var userData = toUserData(row);
	        	  deferred.resolve(userData);
	          } else {
	        	  deferred.resolve(null);
	          }
	      },function(t,e){
          console.log("Error while selecting user image : "+ e.message);
          deferred.reject(e.message);
        });
     });

     return deferred.promise();
  }
  
  var getUserImage = function(userId){
	  var deferred = $.Deferred();
	  
	  db.transaction(function(tx) {
	      tx.executeSql('SELECT * FROM User_Images WHERE (user_Id=?)', [userId], 
	        function(t,r){
	          if(r.rows.length){
	        	  var row = r.rows.item(0);
	        	  deferred.resolve(row['image_data']);
	          } else {
	        	  deferred.resolve(null);
	          }
	      },function(t,e){
          console.log("Error while selecting user image : "+ e.message);
          deferred.reject(e.message);
        });
     });

     return deferred.promise();
  }
  
  var saveOrUpdateUserImage = function(userId, imageData){	  
	  getUserImage()
      .then(function(data){
    	  if(data){
    		  console.log("updating user image: " + JSON.stringify(imageData));
    		  updateUserImage(userId, imageData);
    	  } else {
    		  insertUserImage(userId, imageData);
    	  }
      });
  }
  
  var insertUserImage = function(userId, imageData){
	  db.transaction(function(tx) {
		  tx.executeSql('INSERT INTO User_Images (user_Id, image_data) VALUES (?, ?)', [userId,imageData],function(t,r){
	          console.log("Data inserted in images table count : "+r.rowsAffected);
	        },function(t,e){
	
	          console.log("Error while inserting data in images table : "+ e.message);
	        });
	  });
  }
  
  var updateUserImage = function(userId, imageData){
	  db.transaction(function(tx) {
		  tx.executeSql('UPDATE User_Images SET image_data=? WHERE (user_Id=?)', [imageData, userId],function(t,r){
	          console.log("Data updated in images table count : "+r.rowsAffected);
	        },function(t,e){	
	          console.log("Error while updating data in images table : "+ e.message);
	        });
	  });
  }

  /*var addGroup=function(groupName,ContactsNames){
     db.transaction(function(tx) {
      tx.executeSql('INSERT INTO Group_Master (group_Name) VALUES (?)', [group_Name],function(t,r){
                console.log("Data inserted in Group_Master table count : "+r.rowsAffected);
            },function(t,e){
                console.log("Error while inserting data in Group_Master table : "+ e.message);
      });

      tx.executeSql('SELECT * FROM Group_Master WHERE (group_Name=?)', [data.user_id,data.email,data.auth_provider], 
            function(t,r){

      ContactsNames.forEach(function(userName) {
        console.log(entry);
      });

     });

  }*/

  var checkSession=function(data){
     var deferred = $.Deferred();
     console.log(JSON.stringify(data));

     db.transaction(function(tx) {
      tx.executeSql('SELECT * FROM Login WHERE (auth_provider=?)', [data.provider], 
        function(t,r){
          //debugger;
          if(r.rows.length){
            var row = r.rows.item(0);
            var loggedInTime=row["expires_in"];
            var provider=row["auth_provider"];
            console.log(JSON.stringify(data));
            if(provider=="Facebook"){
              deferred.resolve(true);
            }
            if(provider=="Google"){
              if(loggedInTime>new Date().getTime()){
              console.log("session is not expired yet");
              deferred.resolve(true);
              }else{
                var data={};
                data.status=false;
                data.user_id=row["user_id"];
                data.email=row["email"];
                data.refresh_token=row["refresh_token"];
                deferred.resolve(data);
                //deferred.resolve(false);
              }

            }
            if(loggedInTime>new Date().getTime()){
              console.log("session is not expired yet");
              deferred.resolve(true);
            }else{
              deferred.resolve(false);
            }
          }
          else{
           deferred.resolve(false);
          }

        },function(t,e){
          console.log("Error while checking session existance : "+ e.message);
          deferred.resolve(e.message);
        });
     });

     return deferred.promise();

  }


  return{
    init:initialize,
    insertLoginDetail:insertLoginDetail,
    isAppSessionExists:checkSession,
    saveOrUpdateUserImage: saveOrUpdateUserImage,
    getUserImage: getUserImage,
    getLoggedInUser : getLoggedInUser,
    insertEvent: insertEvent,
    getUserEvents: getUserEvents,
    getEventById: getEventById,
    insertDeviceId: insertDeviceId,
    selectDeviceId: selectDeviceId,
    getFriendsByUserId : getFriendsByUserId,
    insertGroup: insertGroup,
    insertFriend: insertFriend,
    getGroupsForOwner: getGroupsForOwner,
    getAttendeesByEvent: getAttendeesByEvent,
    deleteEvent: deleteEvent,
    getCurrentLoggedInUser: getCurrentLoggedInUser,
    insertCurrentLoggedInUser: insertCurrentLoggedInUser
  }
}();
return window.AppToDate=AppToDateDB;
})(window);