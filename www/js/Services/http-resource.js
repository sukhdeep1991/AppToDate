angular.module('AppToDate.Services')
.factory('httpResource', function($q, $http){
	return {
		loadUrl : function(url, method, data){
			if(method == "DELETE"){
				console.log("Deleting with url : " + appConfig.apiUrl + url)
				return $http.delete(appConfig.apiUrl + url);
			} else {
				return $http.post(appConfig.apiUrl + url, data);
			}
		}
	}
});