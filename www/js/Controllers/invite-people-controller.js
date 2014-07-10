angular
.module('AppToDate.Controllers')
.controller(
		'invitePeopleCtrl',
		function($scope, $timeout, $filter) {
			$scope.contacts = [];
			$scope.searchKey = "";
			$scope.limit = 40;

			$scope.searchKeyChanged = function(searchKey) {
				$scope.limit = 40;
			}
			
			$scope.loadMore = function(){
				$scope.limit += 20;
			}
			
			var fetchContacts = function(searchKey) {
				var options = {};
				options.filter = searchKey;
				var fields = [ "displayName",
						"phoneNumbers", "emails" ];
				if(navigator.contacts){
					navigator.contacts.find(fields, function(contacts) {
						$scope.$apply(function() {
							$scope.contacts = contacts;
							
							//console.log('Contacts fetched : ' + JSON.stringify($scope.contacts));
						});
					}, onError, options);
				}
				
				console.log("Fetching friend facebook");
				facebookConnectPlugin.api("/me/friends",["user_friends"], function(response){
					console.log("Friend api response : " + JSON.stringify(response));
				}, function(response){
					console.log("Error friend api response: " + JSON.stringify(response));
				});
			}

			var onError = function(contactError) {
				console.log("Error while fetching phone contacts");
			}

			fetchContacts($scope.searchKey);

			$scope.sendInvites = function(contacts) {
				var phones = [];
				var emails = [];
				if(contacts){
					$filter('filter')(contacts, $scope.searchKey).map(function(contact) {
						var selectedPhoneNumbers = $filter('filter')(contact.phoneNumbers, {isSelected: true});
						var selectedEmails = $filter('filter')(contact.emails, {isSelected: true});
						if(selectedPhoneNumbers){
							selectedPhoneNumbers.map(function(phoneNumber){
								phones.push(phoneNumber.value);
							});
						}
						if(selectedEmails){
							selectedEmails.map(function(email){
								emails.push(email.value);
							});
						}
					});
					sendPhoneInvites(phones);
					sendEmailInvites(emails);
				} else {
					console.log("Empty contacts");
				}
			}
			
			var sendPhoneInvites = function(phones){
				if(phones && phones.length > 0){
					console.log("Seding sms to : " + JSON.stringify(phones));
					phones.map(function(phone){
						SmsPlugin.prototype
						.send(
							phone,
							appConfig.inviteMessage,
							'',
							function() {							
							},
							function(e) {
								console.log('Message Failed:'
										+ e);
							});
					});
					alert('Message sent successfully');
				}
			}
			
			var sendEmailInvites = function(emails){
				if(emails && emails.length >0){
					console.log("Seding sms to : " + JSON.stringify(emails));
					window.plugin.email.open({
					    to:      emails,
					    subject: 'AppToDate Invitation',
					    body:    appConfig.inviteMessage,
					    isHtml:  true
					});
				}
			}			
		})