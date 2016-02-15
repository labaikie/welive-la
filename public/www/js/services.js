angular.module('app.services', [])

.factory('mapService', function($http, $document){
  return {

    getMap : function(location, poi) {
      this.getMapData(location, poi, function (result) {

        function initialize(){
          var mapOptions = {
            center: new google.maps.LatLng(34.0483572,-118.2746524),
            zoom: 10
          }
          var map = new google.maps.Map(document.getElementById('map'), mapOptions)
          setMarkers()
        }
        var apts = result.apartments;
        var poi = result.poi;

        function geocode(apts) {
          var geocoder = new google.maps.Geocoder()
          for(var i = 0; i < apts.length; i++) {
            geocoder.geocode( {address: apts[i].address + location}, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                var lat = results[0].geometry.location.lat()
                var lng = results[0].geometry.location.lng()
                createMarker(apts[i].name, lat, lng); // creating markers with geocode
              } else {
                console.log("Geocode unsuccessful because: " + status);
              }
            });
          }
        }

        function createMarker(name, lat, lng) {

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


