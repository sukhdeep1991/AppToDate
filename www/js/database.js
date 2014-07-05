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

          tx.executeSql('CREATE TABLE IF NOT EXISTS Group_Master(id INTEGER PRIMARY KEY AUTOINCREMENT,group_Name TEXT)',[],
            function(t,results){
              console.log("Group_Master table created");
            },function(t,e){
              console.log("Error while creating Group_Master table : "+e.message);
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
          
          tx.executeSql('CREATE TABLE IF NOT EXISTS User_Images(id INTEGER PRIMARY KEY AUTOINCREMENT, user_Id INTEGER, image_data)',[],
	          function(t,results){
	            console.log("User_Images table created");
	          },function(t,e){
	            console.log("Error while creating User_Images table : "+e.message);
	          });
          
          tx.executeSql('CREATE TABLE IF NOT EXISTS Events (id INTEGER PRIMARY KEY AUTOINCREMENT, user_Id INTEGER, title TEXT, notes TEXT,' +
        		  		'start, end, image_url)',[],
    	          function(t,results){
    	            console.log("Events table created");
    	          },function(t,e){
    	            console.log("Error while creating Events table : "+e.message);
    	          });
          //tx.executeSql('INSERT INTO Login (user_id, email, access_token,expires_in,auth_provider) VALUES (?, ?, ?,?,?)', ['123456','sprajjobid@gmail.com','132asdasd','23423','Facebook']);
        });
	}
	
    var insertEvent = function(event){
    	console.log('Inserting into events ' + JSON.stringify(event));
    	db.transaction(function(tx) {
	    	tx.executeSql('INSERT INTO Events (user_id, title, notes,start,end,image_url) VALUES (?, ?, ?,?,?,?)', 
	        		[event.user_id, event.title, event.notes, event.start, event.end, event.image_url],
	        		function(t,r){
	            console.log("Data inserted in Events table count : "+r.rowsAffected);
	          },function(t,e){
	
	            console.log("Error while inserting data in Events table : "+ e.message);
	          });
    	});
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

  var insertLoginDetail=function(data){
    db.transaction(function(tx) {
          tx.executeSql('SELECT * FROM Login WHERE (user_id=? and email=? and auth_provider=?)', [data.user_id,data.username,data.auth_provider], 
            function(t,r){
              if(r.rows.length){

                var row = r.rows.item(0);
                var record_id=row["id"];
                tx.executeSql("UPDATE Login SET access_token=?, login_time=?, expires_in=?, refresh_token=? WHERE id = ?", [data.access_token, data.login_time, data.expired_in, data.refresh_token,record_id],
                  function(t,r){
                    console.log("Login table record updated count : "+r.rowsAffected);

                  },function(t,e){
                    console.log("Error while Updating Login table : "+ e.message);

                  });


              }
              else{
        	  	console.log('Inserting int login with email id : ' + data.username);
                tx.executeSql('INSERT INTO Login (user_id, email, access_token,login_time,expires_in,auth_provider,refresh_token, first_name, last_name) VALUES (?, ?, ?,?,?,?,?,?,?)', 
                		[data.user_id,data.username,data.access_token,data.login_time,data.expired_in,data.auth_provider,data.refresh_token, data.first_name, data.last_name],
                		function(t,r){
                    console.log("Data inserted in login table count : "+r.rowsAffected);
                  },function(t,e){

                    console.log("Error while inserting data in Login table : "+ e.message);
                  });
              }

            },function(t,e){
              //debugger;
              console.log("Error while inserting login detail : "+e.message);

            });     
          
        });
  }
  
  var getLoggedInUser = function(username){
	  var deferred = $.Deferred();
	  console.log('finding user with email : ' + username)
	  db.transaction(function(tx) {
		  tx.executeSql('SELECT * FROM Login WHERE (email=?)', [username], 
	        function(t,r){
	          if(r.rows.length){
	        	  var row = r.rows.item(0);
	        	  var userData = { person : {}};
	        	  userData.first_name = row['first_name'];
	        	  userData.last_name = row['last_name'];
	        	  userData.access_token = row['access_token'];
	        	  userData.user_id = row['user_id'];
	        	  userData.login_time = row['login_time'];
	        	  userData.expires_in = row['expires_in'];
	        	  userData.refresh_token = row['refresh_token'];
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
    getUserEvents: getUserEvents
  }
}();
return window.AppToDate=AppToDateDB;
})(window);