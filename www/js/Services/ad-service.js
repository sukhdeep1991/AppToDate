angular.module('AppToDate.Services')
.factory('adService',function(httpResource,$q){
	var showAdsPluginCall = function(){
		//Admob show banner
	    admob.createBannerView(
	  	     {
	  	       'publisherId': appConfig.adMobPublisherId,
	  	       'adSize': admob.AD_SIZE.SMART_BANNER,
	  	       'positionAtTop' : true
	  	     },
	  	     function(response){
	  	    	 console.log("Success calling admob.createBannerView : " + JSON.stringify(response));
	  	    	 admob.requestAd(
	  	    		     {
	  	    		       'isTesting': true,
	  	    		     },
	  	    		     function(requestAdResponse){
	  	    		    	 console.log("Success calling admob.requestAd : " + JSON.stringify(requestAdResponse));
	  	    		     },
	  	    		     function(error){
	  	    		    	 console.log("Error occurred while calling admob.requestAd : " + JSON.stringify(error));
	  	    		     }
	  	    		 );
	  	     },
	  	     function(error){
	  	    	 console.log("Error occurred while calling admob.createBannerView : " + JSON.stringify(error));
	  	     }
	  	 );
	}
	
	return {
		showAds: function(userId){
			DB.isUserUpgraded(userId).then(function(response){
				if(!response){
					showAdsPluginCall();
				}
			}, function(error){
				console.log("Error getting upgraded info: " + JSON.stringify(error));
			});
		},
		
		upgradeUser: function(userId){
			var deferred = $q.defer();
			DB.insertUserUpgraded(userId).then(function(response){
				admob.killAd(function(){
					console.log("Ads removed successfully");
					deferred.resolve();
				},function(){
					console.log("Error while removing ads using plugin");
					deferred.reject();
				});
			}, function(error){
				console.log("Error inserting upgraded info: " + JSON.stringify(error));
				deferred.reject();
			});
			return deferred.promise;
		}
	}
});