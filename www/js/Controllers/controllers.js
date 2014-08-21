angular.module('AppToDate.Controllers',['AppToDate.Services'])
.controller('parentController', function($scope, imageService, $location, $timeout, userService){
	$scope.imageSrc = "images/profile-icon.png";
	$scope.spinnerImgSrc = "images/spinner.gif";
	$scope.showLoader = false;
	var history = [];
	 $scope.msg = {
			 'success' : '',
			 'error' : ''
	 }
	//Keep pushing into the history
	$scope.$on("$locationChangeStart", function(e, currentLocation, previousLocation){
		var hashUrl = currentLocation.substring(currentLocation.lastIndexOf('#/')+1);
		if(hashUrl == "/login" && $scope.userDetails != undefined){
			e.preventDefault();
			return;
		}
		history.push(hashUrl);
	});
	
	$scope.goBack = function(){
		var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
        $location.path(prevUrl);
	}
	
	$scope.setUserImage = function(imageURL){
		console.log("Usage image updated");
		$scope.imageSrc = imageURL;
		
		console.log("New image src is  :: " + $scope.imageSrc);
		
	}
	
	//$scope.userDetails = {first_name: "Zufir"};
	
	$scope.setUserDetails = function(userData){
		$scope.userDetails = userData;
		if($scope.userDetails && $scope.userDetails.user_id){
			$scope.setUserImage(appConfig.apiUrl + "Image/Get?clientId=" + $scope.userDetails.user_id);
			userService.processUninvitedContacts($scope.userDetails.user_id);
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
	
	$scope.setNavTitle = function(title){
		$scope.navTitle = title;
	}
	$scope.editClicked = function(){
		$scope.$broadcast('edit_clicked');
	}
	
	$scope.showResponseMessage = function(msg, isSuccess){
		$timeout.cancel($scope.msgTimeout);
		if(isSuccess){
			$scope.msg.success = msg;
		} else {
			$scope.msg.error = msg;
		}
		$scope.msgTimeout = $timeout($scope.clearMsg, 8000);
	}
	
	$scope.clearMsg = function(){
		$scope.msg.error = '';
		$scope.msg.success = '';
	}
});