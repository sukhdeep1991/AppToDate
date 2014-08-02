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
});