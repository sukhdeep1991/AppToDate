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
		navigator.camera
				.getPicture(
						cameraSuccess,
						cameraError,
						{
							quality : 50,
							destinationType : navigator.camera.DestinationType.FILE_URI,
							sourceType : navigator.camera.PictureSourceType.PHOTOLIBRARY
						});

	}

	$scope.capturePic = function() {
		navigator.camera
				.getPicture(
						cameraSuccess,
						cameraError,
						{
							quality : 50,
							destinationType : navigator.camera.DestinationType.NATIVE_URI
						});
	}
	
	function cameraSuccess(imageURL) {		
		$scope.setUserImage(imageURL);
		imageService.saveOrUpdateUserImage($scope.userDetails.user_id, imageURL).then(
				function(data) {
					console.log("image saved successfully");
				}, function(data) {
					console.log("Error while saving image");
				});
	}
	
	function cameraError(message) {
		alert('Failed because: ' + message);

	}
});