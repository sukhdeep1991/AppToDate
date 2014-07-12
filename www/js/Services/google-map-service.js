angular.module('AppToDate.Services')
.factory('googleMapService', function($q) {
	return {
		showMapInDiv: function(divId, onSuccess){
			if (navigator.geolocation) {
				  console.log("Showing map in div: "+ divId);
				  navigator.geolocation.getCurrentPosition(function(position){
					  var mapcanvas = document.createElement('div');
					  mapcanvas.id = 'mapcanvas';
					  mapcanvas.style.height = '100%';
					  mapcanvas.style.width = '100%';
					    
					  document.getElementById(divId).appendChild(mapcanvas);
					  
					  var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					  var myOptions = {
					    zoom: 15,
					    center: latlng,
					    mapTypeControl: false,
					    navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
					    mapTypeId: google.maps.MapTypeId.ROADMAP
					  };
					  var map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);
					  
					  var marker = new google.maps.Marker({
					      position: latlng, 
					      map: map, 
					      title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
					  });
					  console.log("Shown map in div: "+ divId);
					  onSuccess(position);
				  }, function(error){
					  console.log("Error occured while getting the location: " + JSON.stringify(error));
				  });				  
			} else {
			  error('not supported');
			}
		}
	}
});