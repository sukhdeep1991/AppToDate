angular.module('AppToDate.Controllers',['AppToDate.Services'])
.controller('parentController', function($scope, imageService, $location){
	$scope.imageSrc = "images/profile-icon.png";
	$scope.spinnerImgSrc = "images/spinner.gif";
	$scope.showLoader = false;
	var history = [];
	//Keep pushing into the history
	$scope.$on("$locationChangeStart", function(e, currentLocation, previousLocation){
		history.push(currentLocation.substring(currentLocation.lastIndexOf('#/')+1));
	});
	
	$scope.goBack = function(){
		var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
        $location.path(prevUrl);
	}
	
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
	
	//$scope.userDetails = {};
	
	$scope.setUserDetails = function(userData){
		$scope.userDetails = userData;
		if($scope.userDetails && $scope.userDetails.user_id){
			$scope.setUserImage(appConfig.apiUrl + "Image/Get?clientId=" + $scope.userDetails.user_id);
//			console.log("Fetching user image");
//			imageService.getUserImage($scope.userDetails.user_id).then(
//					function(data) {
//						if (data) {
//							console.log("Image found :" + data);
//							$scope.setUserImage(data);
//						} else {
//							console.log("Image not found :" + data);
//						}
//					}, function(data) {
//						console.log("Error while fetching image");
//					});
		}
	}
	
	$scope.setShowLoader = function(toggle){
		$scope.showLoader = toggle;
	}
});