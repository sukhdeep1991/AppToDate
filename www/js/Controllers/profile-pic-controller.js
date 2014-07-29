angular
.module('AppToDate.Controllers')
.controller(
		'profilePicCtrl',
function($scope, imageService) {
	$scope.navTitle = "Profile Pic";
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
		var options = new FileUploadOptions();
	    options.fileKey="file";
	    options.fileName=imageURL.substr(imageURL.lastIndexOf('/')+1);
	    options.mimeType="image/jpeg";
	    options.params = {};

	    var ft = new FileTransfer();
	    var serverUrl = appConfig.apiUrl + "Image/UploadPicture?clientId=" + $scope.userDetails.user_id;
	    console.log("Uploading image to : " + serverUrl);
	    ft.upload(imageURL, serverUrl, 
    		function(response){
	    	$scope.$apply(function(){
	    		console.log("Image uploaded: " + JSON.stringify(response));		    
				$scope.setUserImage("about:blank");
				setTimeout(function(){
					$scope.$apply(function(){
						$scope.setUserImage(appConfig.apiUrl + "Image/Get?clientId=" + $scope.userDetails.user_id);
					});
				}, 500);
	    	});
	    	
	    }, function(response){
	    	console.log("Image upload failed: " + JSON.stringify(response));
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