angular.module('AppToDate.Services')
.factory('googleMapService', function($q) {
	var map;
	var markers = [];
	
	var loadMap = function(divId){
		console.log("Showing map in div: "+ divId);
		var mapcanvas = document.createElement('div');
	    mapcanvas.id = 'mapcanvas';
	    mapcanvas.style.height = '100%';
	    mapcanvas.style.width = '100%';
	    
	    document.getElementById(divId).appendChild(mapcanvas);
	    var latlng = new google.maps.LatLng(28.38, 77.12);
	    var myOptions = {
	      zoom: 15,
	      mapTypeControl: false,
		  center: latlng,
	      navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
	      mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	    map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);
		console.log("Shown map in div: "+ divId);
	}
	
	return {
		showMapInDiv: function(divId, onSuccess){
			if (navigator.geolocation) {
				  loadMap(divId);
				  console.log("Shown map in div: "+ divId);
				  onSuccess();
				  var service = this;
//				  navigator.geolocation.getCurrentPosition(function(position){
//					  var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
// 					  var myOptions = {
//					    zoom: 15,
//					    center: latlng,
//					    mapTypeControl: false,
//					    navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
//					    mapTypeId: google.maps.MapTypeId.ROADMAP
//					  };
//					  map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);
//					  
//					  var marker = new google.maps.Marker({
//					      position: latlng, 
//					      map: map, 					      
//					      title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
//					  });
//				      markers.push(marker);
//				  }, function(error){
//					  console.log("Error occured while getting the location: " + JSON.stringify(error));
//				  });				  
			} else {
			  error('not supported');
			}
		},
		
		setLocationSearchbox: function(inputId, someFunction){
			var input = document.getElementById(inputId);
			
			var searchBox =  new google.maps.places.SearchBox(input);
			google.maps.event.addListener(searchBox, 'places_changed', function() {
			    var places = searchBox.getPlaces();

			    if (places.length == 0) {
			      return;
			    }
			    for (var i = 0, marker; marker = markers[i]; i++) {
			      marker.setMap(null);
			    }

			    // For each place, get the icon, place name, and location.
			    markers = [];
			    var bounds = new google.maps.LatLngBounds();
			    for (var i = 0, place; place = places[i]; i++) {
			      var image = {
			        url: place.icon,
			        size: new google.maps.Size(71, 71),
			        origin: new google.maps.Point(0, 0),
			        anchor: new google.maps.Point(17, 34),
			        scaledSize: new google.maps.Size(25, 25)
			      };

			      // Create a marker for each place.
			      var marker = new google.maps.Marker({
			        map: map,
			        icon: image,
			        title: place.name,
			        position: place.geometry.location
			      });

			      markers.push(marker);

			      bounds.extend(place.geometry.location);
			    }

			    map.fitBounds(bounds);
			  });
		  // Bias the SearchBox results towards places that are within the bounds of the
		  // current map's viewport.
		  google.maps.event.addListener(map, 'bounds_changed', function() {
		    var bounds = map.getBounds();
		    searchBox.setBounds(bounds);
		  });
		},
		
		getCurrentMapLocation: function(){
			if(!map || !map.getBounds()){
				return {
					lat: 0,
					lng: 0
				}
			}
			var bounds = map.getBounds();
			return {
				lat: bounds.getCenter().lat(),
				lng: bounds.getCenter().lng()
			}
		},
		
		setLatLng: function(lat, lng){
			for (var i = 0, marker; marker = markers[i]; i++) {
		      marker.setMap(null);
		    }

		    // For each place, get the icon, place name, and location.
		    markers = [];
			var bounds = new google.maps.LatLngBounds();
			var latlng = new google.maps.LatLng(lat, lng);
			bounds.extend(latlng);
			var marker = new google.maps.Marker({
		      position: latlng, 
		      map: map, 
		      title:"You are here!"
			});
			markers.push(marker);
			map.fitBounds(bounds);
		}
	}
});