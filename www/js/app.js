// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('AppToDate', [
                            'ionic',
                            'AppToDate.Controllers',
                            'AppToDate.Services',
                            'AppToDate.Directives',
                            'AppToDate.Filters'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    StatusBar.styleDefault();
  //Admob show banner
    admob.createBannerView(
  	     {
  	       'publisherId': 'ca-app-pub-9570512162432804/8372030973',
  	       'adSize': admob.AD_SIZE.SMART_BANNER,
  	       'positionAtTop' : true
  	     },
  	     function(response){
  	    	 console.log("Success calling admob.createBannerView : " + JSON.stringify(response));
  	    	 admob.requestAd(
  	    		     {
  	    		       'isTesting': true,
  	    		     },
  	    		     function(requestAdResponse){
  	    		    	 console.log("Success calling admob.requestAd : " + JSON.stringify(requestAdResponse));
  	    		     },
  	    		     function(error){
  	    		    	 console.log("Error occurred while calling admob.requestAd : " + JSON.stringify(error));
  	    		     }
  	    		 );
  	     },
  	     function(error){
  	    	 console.log("Error occurred while calling admob.createBannerView : " + JSON.stringify(error));
  	     }
  	 );
    document.addEventListener('onDismissScreen', function(data){
    	console.log("On dismiss screen response");
    });
    document.addEventListener('onReceiveAd', function(data){
    	console.log("onReceiveAd response");
    });
  });
})

.config(function($stateProvider, $urlRouterProvider, $compileProvider) {

	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|content):/);
	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|content|file):/);
	
  $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: 'js/Templates/login.html',
        controller:'loginCtrl'
      })

      .state('register', {
        url: '/register',
        templateUrl: 'js/Templates/register.html',
        controller:'registerCtrl'
      })

      .state('profile', {
        url: '/profile',
        templateUrl: 'js/Templates/profilePicUpload.html',
        controller:'profilePicCtrl'
      })

      .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "js/Templates/tabs.html"
      })

      .state('home', {
        url: "/home",
		templateUrl: 'js/Templates/home.html',
        controller:'homeCtrl'
      })

      .state('calendar', {
        url: "/calendar",
		templateUrl: "js/Templates/calendar.html",
        controller: 'calendarCtrl'
      })

      .state('tabs.navstack', {
        url: "/navstack",
        views: {
          'about-tab': {
            templateUrl: "js/Templates/nav-stack.html"
          }
        }
      })

      .state('tabs.groups', {
        url: "/groups",
        views: {
          'groups-tab': {
            templateUrl: "js/Templates/groups.html",
            controller: 'groupCtrl'
          }
        }
      })

      .state('tabs.contact', {
        url: "/contact",
        views: {
          'contact-tab': {
            templateUrl: "js/Templates/contact.html"
          }
        }
      })
      
      .state('invite', {
        url: "/invite",
		templateUrl: "js/Templates/invite.html",
        controller: 'invitePeopleCtrl'
      })
      .state('newEvent', {
        url: "/event/new",
		templateUrl: "js/Templates/event.html",
        controller: 'createEventCtrl'
      })
      .state('viewEvent', {
          url: "/event/:id",
  		templateUrl: "js/Templates/viewEvent.html",
          controller: 'viewEventCtrl'
        })


  $urlRouterProvider.otherwise('/login');

})


