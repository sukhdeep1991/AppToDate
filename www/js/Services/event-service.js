angular.module('AppToDate.Services')
.factory('eventService',function(httpResource,$q,$filter, $location, $window){
	var convertServerToClientEvent = function(eventData){		
		var event = {
				user_id: eventData.Organizer.ClientId,
				title: eventData.Title,
				notes: eventData.Notes,
				start: eventData.Start,
				end: eventData.End,
				imageUrl: eventData.ImageUrl,
				location: {
					displayName: eventData.Location.DisplayName,
					latitude: eventData.Location.Latitude,
					longitude: eventData.Location.Longitude
				},
				remindBefore: eventData.RemindBefore,
				server_id: eventData.Id,
				EventAttendeeAssociations: eventData.EventAttendeeAssociations,
				GroupAssociations: eventData.GroupAssociations
			};
		return event;
	}
	
	var insertEventInDevice = function(title, location, notes, start, end, remindBefore){
		console.log("Inserting event in device");
		//prepare calendar options
		var calOptions = window.plugins.calendar.getCalendarOptions();
		calOptions.firstReminderMinutes = remindBefore;		
		
		window.plugins.calendar.createEventWithOptions(title,location.displayName,notes,
				start,end,calOptions,function(response){
			console.log("Plugin create event success: " + JSON.stringify(response));
		},function(error){
			console.log("Plugin create event error: " + JSON.stringify(error));				
		});
	}
	
	return {
		createEvent : function(event){
			var deferred = $q.defer();
			var url = "Calendar/Create";
			if(event.client_id){
				url = "Calendar/Edit";
			}
			httpResource.loadUrl(url, "POST", event).success(function(eventData){
				event.server_id = eventData.Id;
	            $.when(DB.insertEvent(event)).then(
	              function(data) {
	                console.log("event saved successfully : " + JSON.stringify(event));
	            	insertEventInDevice(event.title,event.location,event.notes,
        					event.start,event.end, event.remindBefore);
	                deferred.resolve(event);
	              },
	              function(errorMsg) {
	                console.log("Error while saving event");
	                deferred.reject(errorMsg);
	            });
			}).error(function(data){
				console.log("Error occured while saving the event : "+ JSON.stringify(data));
                deferred.reject(data);
			});
            return deferred.promise;
		},
		
		getEvents : function(userId){
			var deferred = $q.defer();

            $.when(DB.getUserEvents(userId)).then(
              function(data) {
                console.log("events found successfully : " + JSON.stringify(data));
                deferred.resolve(data);
              },
              function(errorMsg) {
                console.log("Error while fetching event");
                deferred.reject(errorMsg);
            });

            return deferred.promise;
		},
		
		getEvent : function(eventId){
			var deferred = $q.defer();

            $.when(DB.getEventById(eventId)).then(
              function(event) {
                console.log("event found successfully : " + JSON.stringify(event));
                console.log("Fetching attendees");
                $.when(DB.getAttendeesByEvent(eventId)).then(
    	            function(data) {
    	            	event.attendees = data;
    	            	console.log("Event with attendees: " + JSON.stringify(event))
    	            	console.log("Fetching attendees");
		                $.when(DB.getGroupsByEvent(eventId)).then(
		    	            function(groupsData) {
		    	            	event.groups = groupsData;
		    	            	console.log("Event with groups: " + JSON.stringify(event));
		    	            	deferred.resolve(event);
		    	            },
		    	            function(errorMsg) {
		    	              console.log("Error while fetching attendees: " + JSON.stringify(errorMsg));
		    	              deferred.reject(errorMsg);
		    	          });
    	            },
    	            function(errorMsg) {
    	              console.log("Error while fetching attendees: " + JSON.stringify(errorMsg));
    	              deferred.reject(errorMsg);
    	          });
              },
              function(errorMsg) {
                console.log("Error while fetching event");
                deferred.reject(errorMsg);
            });

            return deferred.promise;
		},
		
		deleteEvent: function(eventId){
			var deferred = $q.defer();
			httpResource.loadUrl("Calendar/Delete?appEventId="+eventId, "DELETE", null).success(function(response){
				$.when(DB.deleteEvent(eventId)).then(
	              function(data) {
	                console.log("event deleted successfully : " + JSON.stringify(response));
	                deferred.resolve(true);
	              },
	              function(errorMsg) {
	                console.log("Error while deleting event");
	                deferred.reject(errorMsg);
	            });
			}).error(function(data){
				console.log("Error occured while deleting the event : "+ JSON.stringify(data));
                deferred.reject(data);
			});
            return deferred.promise;
		},
		
		insertEventFromNotification: function(eventId){
			$.when(DB.getEventClientIdFromServerId(eventId)).then(
              function(clientId) {
            	  console.log("Client id for event found: "+ clientId)
            	  if(!clientId){
          			console.log("insertEventFromNotification: fetching event from api");
            		  httpResource.loadUrl("Calendar/Get?appEventId="+eventId, "GET", event).success(function(eventData){
          				console.log("Fetched event :" + JSON.stringify(eventData));
          				//event.server_id = eventData.Id;
          				var event = convertServerToClientEvent(eventData);
          	            $.when(DB.insertEvent(event)).then(
          	              function(data) {
          	                console.log("event saved successfully : " + JSON.stringify(event));
	    	            	insertEventInDevice(event.title,event.location,event.notes,
	            					event.start,event.end, event.remindBefore);
          	              },
          	              function(errorMsg) {
          	                console.log("Error while saving event");
          	            });
          			}).error(function(data){
          				console.log("Error occured while saving the event : "+ JSON.stringify(data));
          			});
            	  } else {
            		  console.log("Event already created, no need to create again");
            	  }
              },
              function(errorMsg) {
                console.log("Error while saving event");
            });
			
		},
		
		updateEventFromNotification: function(eventId){
			console.log("insertEventFromNotification: fetching event from api")
			httpResource.loadUrl("Calendar/Get?appEventId="+eventId, "GET", event).success(function(eventData){
				console.log("Fetched event :" + JSON.stringify(eventData));
	            $.when(DB.getEventClientIdFromServerId(eventId)).then(
	              function(clientId) {
	            	  if(clientId){
	      				  var event = convertServerToClientEvent(eventData);
	      				  event.client_id = clientId;
	            		  $.when(DB.insertEvent(event)).then(
	        	              function(data) {
	        	                console.log("event updated successfully : " + JSON.stringify(event));
	        	              },
	        	              function(errorMsg) {
	        	                console.log("Error while saving event");
	        	            });
	            	  } else {
	            		  console.log("Event in client db not found");
	            	  }
	              },
	              function(errorMsg) {
	                console.log("Error while saving event");
	            });
			}).error(function(data){
				console.log("Error occured while saving the event : "+ JSON.stringify(data));
			});
		},
		
		deleteEventFromNotification: function(eventId){
			$.when(DB.deleteEvent(eventId)).then(
              function(data) {
                console.log("event deleted successfully : " + JSON.stringify(data.rowsAffected));
              },
              function(errorMsg) {
                console.log("Error while deleting event");
                deferred.reject(errorMsg);
            });
		},
		
		testMethod: function(){
			console.log("Test method called from injector");
		}
	}
});