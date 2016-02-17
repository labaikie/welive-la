    //   // initialize map
    //   var mapOptions = {
    //     center: new google.maps.LatLng(34.0483572,-118.2746524),
    //     zoom: 14
    //   }
    //   var map = new google.maps.Map(document.getElementById('map'), mapOptions)
    //   var bounds = new google.maps.LatLngBounds();

    //   // create and set apartment markers
    //   var aptMarkers = [];
    //   addAptMarkers();
    //   // create and set poi markers
    //   var poiMarkers = [];
    //   addPOIMarkers();
    //   // Map Set to Fit Bounds
    //   map.fitBounds(bounds)

    //   // Distance Service

    //   function getDistance(origin){
    //     var service = new google.maps.DistanceMatrixService;
    //     var poiLL = [];
    //     poiMarkers.forEach(function(marker) {
    //       var position = marker.getPosition()
    //       poiLL.push(position);
    //     })
    //     var distancePromise = $q(function (resolve, reject) {
    //       service.getDistanceMatrix({
    //         origins: [origin],
    //         destinations: poiLL,
    //         travelMode: google.maps.TravelMode.DRIVING,
    //         unitSystem: google.maps.UnitSystem.METRIC,
    //         avoidHighways: false,
    //         avoidTolls: false
    //       }, function(res, status) {
    //         if(status !== google.maps.DistanceMatrixStatus.OK) {
    //           alert('Error was: ' + status);
    //         } else {
    //           resolve({distance: res.rows[0].elements})
    //         }
    //       })
    //     })
    //     // returning promise for eventlistener in addAptMarker to grab
    //     return distancePromise;
    //   }

    //   function addPOIMarkers(){
    //     // setting POI icon
    //     var icon = new google.maps.MarkerImage("./img/black-dot.png")
    //     // creating markers
    //     var poi = result.poi;
    //     poi.forEach(function(poi){
    //       var lat = poi.location.coordinate.latitude
    //       var lng = poi.location.coordinate.longitude
    //       var marker = createMarker(poi.name, icon, lat, lng)
    //       poiMarkers.push(marker)
    //     })
    //     setMarkers(map, poiMarkers);
    //   }

    //   function addAptMarkers(){
    //     var apts = result.apartments;
    //     // setting apartment icon
    //     var icon = new google.maps.MarkerImage("./img/house.png")
    //     // pushing Async geocode promises to array
    //     var latLngPromises = [];
    //     apts.forEach(function(apt){
    //       latLngPromises.push(geocode(apt.address))
    //     })
    //     // after the array of promises is fulfilled, create markers
    //     $q.all(latLngPromises).then(function(data){
    //       console.log(apts);
    //       data.forEach(function(d) {
    //         var data = {what: 'yes', who: 'no'}; // NEED TO DEFINE
    //         var marker = createMarker('apartment', icon, d.lat, d.lng, data)
    //         aptMarkers.push(marker)
    //         // addEventListener for DISTANCE & INFO
    //         marker.addListener('click', function() {
    //           // get distance
    //           getDistance(marker.getPosition()).then(function(data){
    //             $scope.apartment.distance = data.distance;
    //             $scope.apartment.data = marker.mData;
    //             $scope.openModal();
    //           });
    //         })
    //       })
    //       // set markers on map
    //       setMarkers(map, aptMarkers);
    //     })
    //   }

    //   function createMarker(name, icon, lat, lng, data) {
    //     var latlng = new google.maps.LatLng(lat,lng)
    //     var marker = new google.maps.Marker({
    //       position: latlng,
    //       icon: icon,
    //       mData: data,
    //       title: name
    //     })
    //     bounds.extend(latlng)
    //     return marker;
    //   }

    //   function setMarkers(map, markers) {
    //     for(var i = 0; i < markers.length; i++) {
    //       markers[i].setMap(map)
    //     }
    //   }

    // })
