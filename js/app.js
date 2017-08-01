function openNav() {
	document.getElementById("mySidenav").style.width = "25%";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

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

