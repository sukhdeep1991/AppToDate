angular.module('AppToDate.Controllers')
.controller('homeCtrl', function($scope, $location) {
 $scope.setNavTitle("Home");
 
 $scope.NavigateToCalendar = function()
 {
	$location.path('/calendar');
 };
 
 $scope.ChangeProfilePic = function(){
	 $location.path('/profile');
 };
 
 $scope.invitePeopleClicked = function(){
	 $location.path('/invite');
 };
	
	$scope.shareOnFacebook = function(){
		facebookConnectPlugin.showDialog({
			method: "feed",
		    link: "http://google.com",
		    caption: "AppToDate Invitation"
		}, function(){
			$scope.showResponseMessage('Successfully posted on facebook!', true);
		}, function(){
			$scope.showResponseMessage('Error occured while posting to facebook', false);
		});
	};
});