angular.module('AppToDate.Controllers',['AppToDate.Services'])
.controller('parentController', function($scope, imageService){
	$scope.imageSrc = "images/profile-icon.png";
	$scope.spinnerImgSrc = "images/spinner.gif";
	$scope.showLoader = false;
	
	$scope.showErrorMessage = function(message){
		$scope.errorMessage = message;
		setTimeout(function(){
			$scope.errorMessage = null;
		}, 8000)
	};
	
	$scope.setUserImage = function(imageURL){
		console.log("Usage image updated");
		$scope.imageSrc = imageURL;
		
		console.log("New image src is  :: " + $scope.imageSrc);
		
	}
	
	$scope.setUserDetails = function(userData){
		$scope.userDetails = userData;
		if($scope.userDetails && $scope.userDetails.user_id){
			console.log("Fetching user image");
			imageService.getUserImage($scope.userDetails.user_id).then(
					function(data) {
						if (data) {
							console.log("Image found :" + data);
							$scope.setUserImage(data);
						} else {
							console.log("Image not found :" + data);
						}
					}, function(data) {
						console.log("Error while fetching image");
					});
		}
	}
	
	$scope.setShowLoader = function(toggle){
		$scope.showLoader = toggle;
	}
});