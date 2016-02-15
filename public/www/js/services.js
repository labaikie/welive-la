angular.module('app.services', [])

.factory('mapService', function($http){
  return {

    getAptsPOI : function(location, poi) {
      var aptPromise = $http({
        method: GET,
        url: 'http://localhost:8080/apartments', // || HOSTED SITE
        data: {location: location}
      })
      var poiPromise = $http({
        method: GET,
        url: 'http://localhost:8080/poi', // || HOSTED SITE
        data: {query: poi}
      })
      Promise.all([aptPromise, poiPromise]).then(function(data){
        console.log(data[0]);
        console.log(data[1]);
      }).catch(function(err) {
        console.log(err);
      })
    },

    getMap : function() {
      console.log('Google MAP Service')
    },

    getDistance : function() {
      console.log('Calculate Distance')
    }

  }
})


