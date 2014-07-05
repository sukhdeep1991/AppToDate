angular.module('AppToDate.Services')
.factory('imageService', function($q) {

	  // Trigger the loading indicator
	  return {
	        saveOrUpdateUserImage : function(userId, imageData) {

	            var deferred = $q.defer();

	            $.when(DB.saveOrUpdateUserImage(userId, imageData)).then(
	              function(data) {
	                console.log("Image saved or updated successfully");
	                deferred.resolve(data);
	              },
	              function(errorMsg) {
	                console.log("Error while saving user image");
	                deferred.reject(errorMsg);
	            });

	            return deferred.promise;
	        },
	        
	        getUserImage: function(userId){
	        	var deferred = $q.defer();

	            $.when(DB.getUserImage(userId)).then(
	              function(data) {
	                console.log("Image found");
	                deferred.resolve(data);
	              },
	              function(errorMsg) {
	                console.log("Error while fetching user image");
	                deferred.reject(data);
	            });

	            return deferred.promise;
	        }
	  }
	    
	});