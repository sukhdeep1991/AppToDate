angular.module('AppToDate.Services')
.factory('eventService',function(httpResource,$q,$filter, $location, $window){
	return {
		createEvent : function(event){
			var deferred = $q.defer();
			httpResource.loadUrl("Calendar/Create", "POST", event).success(function(eventData){
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
              function(data) {
                console.log("event found successfully : " + JSON.stringify(data));
                deferred.resolve(data);
              },
              function(errorMsg) {
                console.log("Error while fetching event");
                deferred.reject(errorMsg);
            });

            return deferred.promise;
		}
	}
});