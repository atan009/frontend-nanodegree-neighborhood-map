$(window).on("load", function() {
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
    //var bounds = new google.maps.LatLngBounds();


    //stores all markers
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

		//marker listeners and effects
        marker.addListener('click', handleclick);
        marker.addListener('mouseover', handlemouseover);
        marker.addListener('mouseout', handlemouseout);
        markers.push(marker);
	}

	function handleclick() {
		this.setAnimation(google.maps.Animation.BOUNCE);
        populateInfoWindow(this, largeInfowindow);
	}

	function handlemouseover() {
		this.setIcon(highlightedIcon);
	}

	function handlemouseout() {
		this.setIcon(defaultIcon);
	}

	//Foursquare url request
	var ll = "";
	var limit = "&limit=1";
	var query = "&query=coffee";
	var intent = "&intent=checkin";
	var client_id = "&client_id=SOLANGOZASSDBV4XL23XFJ3PKNNGDIDPKV125VU1B4UF3B03";
	var client_secret = "&client_secret=VJOIFV1UFBZDSR3GNADBOJJ15ZF1XU2JDRQ2JP3NOKNVLACR";
	var url = "";


	//marker info window
	function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker !== undefined && infowindow.marker !== marker) {
        	infowindow.marker.setAnimation(null);
        }

        //set url latlng based on clicked marker
        ll = "ll=" + marker.position.lat() + "%2C%20" + marker.position.lng();
        url = "https://api.foursquare.com/v2/venues/explore?v=20161016&" + ll + limit + query + intent + client_id + client_secret;
		
		//gets information from url and stores them into infobox + error checking
        $.getJSON(url, function(data) {
        	infowindow.marker = marker;

			var innerHTML = '<div>';
	        if (data.response.groups[0].items[0].venue.name) {
	            innerHTML += '<strong>' + data.response.groups[0].items[0].venue.name + '</strong>';
	        }
	        if (data.response.groups[0].items[0].venue.location.address) {
	            innerHTML += '<br>' + data.response.groups[0].items[0].venue.location.address;
	        }
	        if (data.response.groups[0].items[0].venue.location.city) {
	            innerHTML += '<br>' + data.response.groups[0].items[0].venue.location.city;
	        }
	        if (data.response.groups[0].items[0].venue.location.state) {
	            innerHTML += '<br>' + data.response.groups[0].items[0].venue.location.state;
	        }
	        if (data.response.groups[0].items[0].venue.location.postalCode) {
	            innerHTML += ' ' + data.response.groups[0].items[0].venue.location.postalCode;
	        }

	        if (data.response.groups[0].items[0].venue.categories.icon) {
            innerHTML += '<br><br><img src="' + data.response.groups[0].items[0].venue.categories.icon.prefix + data.response.groups[0].items[0].venue.categories.icon.suffix + '">';
          	}

	        innerHTML += '</div>';
	        infowindow.setContent(innerHTML);
		}).error(function(e) {
			alert("Could not request url");
		});        

        //infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
        	infowindow.close();
        	marker.setAnimation(null);
        });
        
    }


	//filterList display
	var viewModel = {
		//observable array of locations
		locations: ko.observableArray(topCities),

		//search query
		query: ko.observable(''),

		//filter based on search query
		search: function(value) {
			viewModel.locations.removeAll();
			for(var x in topCities) {
	  			if(topCities[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
	    			viewModel.locations.push(topCities[x]);
	  			}
			}

			//remove all markers
			for (i = 0; i < markers.length; i++) {
				markers[i].setMap(null);
			}

			//only show filtered markers
			for (i = 0; i < viewModel.locations().length; i++) {
				for (var k = 0; k < markers.length; k++) {
					if (viewModel.locations()[i].name === markers[k].title) {
						markers[k].setMap(map);
					}
				}
			}
		}

	};

	//opens info window on button click
	this.openInfoWin = function() {	
		var btnClk = (this.name.trim());
		for (var i = 0; i < markers.length; i++) {
			if (markers[i].title === btnClk) {
				markers[i].setAnimation(google.maps.Animation.BOUNCE);
				populateInfoWindow(markers[i], largeInfowindow);
			}
		}
	};

	viewModel.query.subscribe(viewModel.search);

	ko.applyBindings(viewModel);
});