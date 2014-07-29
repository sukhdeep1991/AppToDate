angular.module('AppToDate.Controllers')

.controller('createGroupCtrl', 
  function($scope, userService, $filter) {
	 $scope.navTitle = "Group";
	 $scope.success = false;
	 $scope.group = {
		 'title' : ''
	 }
	 $scope.selectAll = false;
	 $scope.msg = {
			 'success' : '',
			 'error' : ''
	 }
	 
	if ($scope.userDetails && $scope.userDetails.user_id) {
		userService.getFriends($scope.userDetails.user_id).then(function(data){
			console.log("Got friends : " + JSON.stringify(data));
			$scope.friends = data;
		}, function(error){
			console.log("Error occured while getFriends: "+ JSON.stringify(error));
		})
	}
	
	$scope.selectAllFriends = function(list, searchKey, flag){
		if(list){
			var filtered = flag ? $filter('filter')(list, {'first_name': searchKey}) : list;
			if(filtered && filtered.length > 0){
				angular.forEach(filtered, function(item){
					item.isSelected = flag;
				});
			}
		}
	}
	
	$scope.createGroup = function(title){
		if(!title || title.length == 0){
			$scope.msg.error = 'Please enter the title!';
			return
		}
		if($scope.friends && $scope.friends.length > 0){
			var selectedFriends = $filter('filter')($scope.friends, {'isSelected': true});
			if(selectedFriends && selectedFriends.length > 0){
				var group = {};
				group.title = title;
				group.groupPersonAssociations = selectedFriends;
				group.Owner = {
						'ClientId': $scope.userDetails.user_id,
						'FirstName' : $scpope.userDetails.first_name,
						'LastName': $scope.userDetails.last_name
				}
				userService.createGroup(group).then(function(response){
					console.log("Group Inserted : " + JSON.stringify(response));
					$scope.msg.success = 'Group created successfully';
					$scope.group.title = '';
					$scope.selectAllFriends($scope.friends, '', false)
				}, function(error){
					console.log("Error occured userService.createGroup : " + JSON.stringify(error));
				});
				return
			}
		} 
		$scope.msg.error = 'No attendees selected!';
		return
	}
	
	$scope.clearMsg = function(){
		$scope.msg.error = '';
		$scope.msg.success = '';
	}
});