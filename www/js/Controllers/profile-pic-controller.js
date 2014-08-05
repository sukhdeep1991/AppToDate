angular
.module('AppToDate.Controllers')
.controller(
		'profilePicCtrl',
function($scope, imageService) {
	$scope.setNavTitle("Profile");
	$scope.uploadBtnText = "Upload New";
	$scope.captureBtnText = "Capture New";
	$scope.cancelBtnText = "Later";

	$scope.UploadPic = function() {
		imageService.getPicture(true, onSuccess, onError);
	}

	$scope.capturePic = function() {
		imageService.getPicture(false, onSuccess, onError);
	}
	
	function onSuccess(imageURL) {		
		$scope.setShowLoader(true);
	    var serverUrl = appConfig.apiUrl + "Image/UploadPicture?clientId=" + $scope.userDetails.user_id;
	    imageService.uploadImageToServer(imageURL, serverUrl, 
    		function(response){
	    	$scope.$apply(function(){
	    		console.log("Image uploaded: " + JSON.stringify(response));		    
				$scope.setUserImage("about:blank");
				setTimeout(function(){
					$scope.$apply(function(){
						$scope.setUserImage(appConfig.apiUrl + "Image/Get?clientId=" + $scope.userDetails.user_id);	
						$scope.setShowLoader(false);
					});
				}, 500);
	    	});
	    	
	    }, function(response){
	    	console.log("Image upload failed: " + JSON.stringify(response));	
			$scope.setShowLoader(false);
	    }, options);
//		imageService.saveOrUpdateUserImage($scope.userDetails.user_id, imageURL).then(
//				function(data) {
//					console.log("image saved successfully");
//				}, function(data) {
//					console.log("Error while saving image");
//				});
	}
	
	function onError(message) {
		alert('Failed because: ' + message);

	}
});