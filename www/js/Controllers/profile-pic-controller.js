angular
.module('AppToDate.Controllers')
.controller(
		'profilePicCtrl',
function($scope, imageService) {
	$scope.profilePic = "images/profile-pic.png";
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
		$scope.setUserImage(imageURL);
		imageService.saveOrUpdateUserImage($scope.userDetails.user_id, imageURL).then(
				function(data) {
					console.log("image saved successfully");
				}, function(data) {
					console.log("Error while saving image");
				});
	}
	
	function onError(message) {
		alert('Failed because: ' + message);

	}
});