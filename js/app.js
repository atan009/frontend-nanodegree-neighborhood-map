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

var fullList = ko.observableArray([
    { loc: "New York City, NY", latitude: "40.7128", longitude: "-74.0059" },
    { loc: "San Francisco, CA", latitude: "37.7749", longitude: "-122.4194" },
    { loc: "Las Vegas, NV", latitude: "36.1699", longitude: "-115.1398" },
    { loc: "Chicago, IL", latitude: "41.8781", longitude: "-87.6298" },
    { loc: "Los Angeles, CA", latitude: "34.0522", longitude: "-118.2437" }
]);
ko.applyBindings(fullList);