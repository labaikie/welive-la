angular.module('app.services', [])

.factory('mapService', function($http, $document, $q){
  return {

    getMap : function(location, poi) {
      this.getMapData(location, poi, function (result) {

        // initialize map
        var mapOptions = {
          center: new google.maps.LatLng(34.0483572,-118.2746524),
          zoom: 10
        }
        var map = new google.maps.Map(document.getElementById('map'), mapOptions)

        // create and set apartment markers
        addAptMarkers();
        // create and set poi markers
        addPOIMarkers();

        function addPOIMarkers(){
          // setting POI icon
          var icon = new google.maps.MarkerImage("./img/black-dot.png")
          // creating markers
          var poiMarkers = [];
          result.poi.forEach(function(poi){
            var lat = poi.location.coordinate.latitude
            var lng = poi.location.coordinate.longitude
            poiMarkers.push(createMarker(icon, lat, lng))
          })
          setMarkers(map, poiMarkers);
        }


        function addAptMarkers(){
          // setting apartment icon
          var icon = new google.maps.MarkerImage("./img/house.png")
          // pushing Async geocode promises to array
          var latLngPromises = [];
          result.apartments.forEach(function(apt){
            latLngPromises.push(geocode(apt.address))
          })
          // after the array of promises is fulfilled, create markers
          $q.all(latLngPromises).then(function(data){
            var aptMarkers = [];
            data.forEach(function(d) {
              aptMarkers.push(createMarker(icon, d.lat, d.lng))
            })
            // set markers on map
            setMarkers(map, aptMarkers);
          })
        }

        function geocode(address) {
          var geocoder = new google.maps.Geocoder()
          return $q(function (resolve, reject) {
            geocoder.geocode( {address: address + location}, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                var lat = results[0].geometry.location.lat()
                var lng = results[0].geometry.location.lng()
                resolve({ lat: lat, lng: lng})
              } else {
                reject("Geocode unsuccessful")
                console.log("Geocode unsuccessful because: " + status);
              }
            });
          })
        }

        function createMarker(icon, lat, lng) {
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat,lng),
            icon: icon
          })
          return marker;
        }

        function setMarkers(map, markers) {
          for(var i = 0; i < markers.length; i++) {
            markers[i].setMap(map)
          }
        }

      })
    },

    getMapData : function(location, poi, complete) {
      var result = {apartments:'', poi: ''};
      var aptPromise = $http({
        method: 'GET',
        url: 'http://localhost:8080/apartments', // || HOSTED SITE
        params: {location: location}
      })
      var poiPromise = $http({
        method: 'GET',
        url: 'http://localhost:8080/poi', // || HOSTED SITE
        params: {query: poi, location: location}
        })
      Promise.all([aptPromise, poiPromise]).then(function(data){
        result.apartments = data[0].data;
        result.poi = data[1].data;
        complete(result)
      }).catch(function(err) {
        console.log(err);
      })
    },


    getDistance : function() {
      console.log('Calculate Distance')
    }

  }
})


