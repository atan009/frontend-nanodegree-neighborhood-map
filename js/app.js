var map;
var center;
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.0902, lng: -95.7129},
        zoom: 4
    });

	google.maps.event.addDomListener(window, 'resize', function() {
		center = map.getCenter();
		google.maps.event.trigger(map, "resize");
    	map.setCenter(center);
	});
}

//opens Filter Menu to 25%
function openNav() {
	document.getElementById("mySidenav").style.width = "25%";
}

//closes Filter Menu
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

$(function() {
	// This function takes in a COLOR, and then creates a new marker
    // icon of that color. The icon will be 21 px wide by 34 high, have an origin
    // of 0, 0 and be anchored at 10, 34).
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21,34));
        return markerImage;
    }

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');
    var defaultIcon = makeMarkerIcon('FE7569');

	//array with all the information
	var topCities = [
		{ "name": "New York City, NY",
			"loc": { lat: 40.7128, lng: -74.0059 }
		},
	    { "name": "San Francisco, CA",
	    	"loc": { lat: 37.7749, lng: -122.4194 }
	    },
	    { "name": "Las Vegas, NV",
	    	"loc": { lat: 36.1699, lng: -115.1398 }
	    },
	    { "name": "Chicago, IL",
	    	"loc": { lat: 41.8781, lng: -87.6298 }
	    },
	    { "name": "Los Angeles, CA",
	    	"loc": { lat: 34.0522, lng: -118.2437 }
	    }
	];

	var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

	var markers = [];
	for (var i = 0; i < topCities.length; i++) {
		var marker = new google.maps.Marker({
            position: topCities[i].loc,
            map: map,
            title: topCities[i].name,
            animation: google.maps.Animation.DROP,
            id: i,
            icon: defaultIcon
        });
        

        marker.addListener('click', function() {
        	if (marker.getAnimation() === null) {
            	this.setAnimation(google.maps.Animation.BOUNCE);
            }
            populateInfoWindow(this, largeInfowindow);

        });

        marker.addListener('mouseover', function() {
        	this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });

        markers.push(marker);
	}

	function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick',function(){
            	infowindow.setMarker = null;
            	marker.setAnimation(null);
            });
        }
    }

	//filterList display
	var viewModel = {
		locations: ko.observableArray(topCities),

		query: ko.observable(''),

		search: function(value) {
			viewModel.locations.removeAll();
			for(var x in topCities) {
	  			if(topCities[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
	    			viewModel.locations.push(topCities[x]);
	    			//markers.push(topCities[x]);
	  			}
			}

			//remove all markers
			for (var i = 0; i < markers.length; i++) {
				markers[i].setMap(null);
			}

			//only show filtered markers
			for (var i = 0; i < viewModel.locations().length; i++) {
				for (var k = 0; k < markers.length; k++) {
					if (viewModel.locations()[i].name === markers[k].title) {
						markers[k].setMap(map);
					}
				}
			}
		}

	};

	//marker display
	var viewMarker = {
		display: console.log(viewModel.locations())
	};

	viewModel.query.subscribe(viewModel.search);

	ko.applyBindings(viewModel);
});