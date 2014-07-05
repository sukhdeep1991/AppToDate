angular.module('AppToDate.Controllers',['AppToDate.Services'])
.controller('parentController', function($scope, imageService){
	$scope.imageSrc = "img/ionic.png";
	
	$scope.showErrorMessage = function(message){
		$scope.errorMessage = "Could not login : " + message;
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
			imageService.getUserImage($scope.userDetails.user_id).then(
					function(data) {
						if (data) {
							$scope.setUserImage(data);
						}
					}, function(data) {
						console.log("Error while fetching image");
					});
		}
	}
	
	
});