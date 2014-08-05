angular.module('AppToDate.Services')
.factory('eventService',function(httpResource,$q,$filter, $location, $window){
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
		    	            	console.log("Event with groups: " + JSON.stringify(event))
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
		}
	}
});