angular.module('AppToDate.Services')
.factory('httpResource', function($q, $http){
	return {
		loadUrl : function(url, method, data){
			return $http.post(appConfig.apiUrl + url, data);
		}
	}
});