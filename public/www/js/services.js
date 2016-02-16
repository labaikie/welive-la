angular.module('app.services', [])

.factory('nHService', function() {
  return {
    neighborhoods: [
                      {name: 'Downtown Los Angeles', la: true},
                      {name: 'Echo Park', la: true},
                      {name: 'West Hollywood', la: false}
                    ]
  }
})

.factory('mapService', function($http, $document, $q){
  return {

    getMap : function(location, poi) {
      this.getMapData(location, poi, function (result) {

        // initialize map
        var mapOptions = {
          center: new google.maps.LatLng(34.0483572,-118.2746524),
          zoom: 14
        }
        var map = new google.maps.Map(document.getElementById('map'), mapOptions)
        var bounds = new google.maps.LatLngBounds();

        // create and set apartment markers
        var aptMarkers = [];
        addAptMarkers();
        // create and set poi markers
        var poiMarkers = [];
        addPOIMarkers();
        // Map Set to Fit Bounds
        map.fitBounds(bounds)

        // Distance Service

        function getDistance(origin){
          var service = new google.maps.DistanceMatrixService;
          var poiLL = [];
          var distance;
          poiMarkers.forEach(function(marker) {
            var position = marker.getPosition()
            poiLL.push(position);
          })
          return $q(function (resolve, reject) {
            service.getDistanceMatrix({
              origins: [origin],
              destinations: poiLL,
              travelMode: google.maps.TravelMode.DRIVING,
              unitSystem: google.maps.UnitSystem.METRIC,
              avoidHighways: false,
              avoidTolls: false
            }, function(res, status) {
              if(status !== google.maps.DistanceMatrixStatus.OK) {
                alert('Error was: ' + status);
              } else {
                // console.log(res.rows[0].elements);
                resolve({distance: res.rows[0].elements})
              }
            })
          })
        }

        // var poiMarkers = [];
        function addPOIMarkers(){
          // setting POI icon
          var icon = new google.maps.MarkerImage("./img/black-dot.png")
          // creating markers
          var poi = result.poi;
          poi.forEach(function(poi){
            var lat = poi.location.coordinate.latitude
            var lng = poi.location.coordinate.longitude
            var marker = createMarker(poi.name, icon, lat, lng)
            poiMarkers.push(marker)
          })
          setMarkers(map, poiMarkers);
        }

        function addAptMarkers(){
          var apts = result.apartments;
          // setting apartment icon
          var icon = new google.maps.MarkerImage("./img/house.png")
          // pushing Async geocode promises to array
          var latLngPromises = [];
          apts.forEach(function(apt){
            latLngPromises.push(geocode(apt.address))
          })
          // after the array of promises is fulfilled, create markers
          $q.all(latLngPromises).then(function(data){
            data.forEach(function(d) {
              var marker = createMarker('apartment', icon, d.lat, d.lng)
              aptMarkers.push(marker)
              // addEventListener for distance service
              marker.addListener('click', function() {
                console.log(getDistance(marker.getPosition()));
              })
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

        function createMarker(name, icon, lat, lng) {
          var latlng = new google.maps.LatLng(lat,lng)
          var marker = new google.maps.Marker({
            position: latlng,
            icon: icon,
            label: name,
            title: name
          })
          bounds.extend(latlng)
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


