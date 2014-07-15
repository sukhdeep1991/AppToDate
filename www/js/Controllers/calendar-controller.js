angular
.module('AppToDate.Controllers')
.controller(
		'calendarCtrl',
function($scope, $filter, $location, eventService) {
	$scope.view = 'month';

	$scope.createEvent = function() {
		$location.path("/event/new")
	}

	$scope.events = [];

	$scope.changeView = function(view) {
		$scope.view = view;
		angular.element('#calendar').fullCalendar('changeView',
				view);
	}
	
	// angular.element(document.querySelector('#calendar'))
	var calendar = angular.element(document
			.querySelector('#calendar'));

	if ($scope.userDetails && $scope.userDetails.user_id) {
		eventService
				.getEvents($scope.userDetails.user_id)
				.then(
						function(data) {
							console.log("Events fetched : "
									+ JSON.stringify(data));
							$scope.events = data;
							$scope.events.map(function(event){
								event.start = new Date(event.start);
								event.url = "#/event/" + event.id;
							});
							calendar.fullCalendar({
								theme : true,
								header : {
									left : false,
									center : "title",
									right : false
								},
								defaultDate : new Date(),
								editable : true,
								events : $scope.events
							});
						},
						function(data) {
							console
									.log("Error at controller while fetching events");
						});
	} else {
		var date = new Date();
		var d = date.getDate();
		var m = date.getMonth();
		var y = date.getFullYear();
		$scope.events = [ {
			title : 'All Day Event',
			start : new Date(y, m, 1)
		}, {
			title : 'Long Event',
			start : new Date(y, m, d - 5),
			end : new Date(y, m, d - 2)
		}, {
			id : 999,
			title : 'Repeating Event',
			start : new Date(y, m, d - 3, 16, 0),
			allDay : false
		}, {
			id : 999,
			title : 'Repeating Event',
			start : new Date(y, m, d + 4, 16, 0),
			allDay : false
		}, {
			title : 'Meeting',
			start : new Date(y, m, d, 10, 30),
			allDay : false
		}, {
			title : 'Lunch',
			start : new Date(y, m, d, 12, 0),
			end : new Date(y, m, d, 14, 0),
			allDay : false
		}, {
			title : 'Birthday Party',
			start : new Date(y, m, d + 1, 19, 0),
			end : new Date(y, m, d + 1, 22, 30),
			allDay : false
		}, {
			title : 'Click for Google',
			start : new Date(y, m, 28),
			end : new Date(y, m, 29),
			url : 'http://google.com/'
		} ];
		calendar.fullCalendar({
			theme : true,
			header : {
				left : false,
				center : "title",
				right : false
			},
			defaultDate : new Date(),
			editable : true,
			events : $scope.events
		});
	}

})