angular.module('AppToDate.Services')
.factory('eventService',function($http,$q,$filter, $location, $window){
	return {
		createEvent : function(event){
			var deferred = $q.defer();

            $.when(DB.insertEvent(event)).then(
              function(data) {
                console.log("event saved successfully : " + JSON.stringify(event));
                deferred.resolve(event);
              },
              function(errorMsg) {
                console.log("Error while saving event");
                deferred.reject(errorMsg);
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