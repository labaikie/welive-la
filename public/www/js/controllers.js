angular.module('app.controllers', [])

.controller('homeCtrl', function($scope, nHService) {
  $scope.neighborhoods = nHService.neighborhoods;
  $scope.poi = ["-","Grocery", "Schools", "Restaurants", "Swimming Pools", "Gyms", "Nightlife"];
  $scope.setCurrent = function(selected) {
    if(selected.la == true) {
      nHService.current = selected.name + ', Los Angeles, CA'
    } else {
      nHService.current = selected.name + ', CA'
    }
  }
  $scope.setPOI = function(selected) {
    nHService.poi = selected
  }
})

.controller('showSearchCtrl', function($scope, $http, $document, $q, nHService, $ionicModal) {
  $scope.apartment = {distance: null, data: null}
  $scope.apartments;
  $scope.poi;
  $scope.markers = [];
  $scope.setMap = function(location, poi) {
    // GET APT & POI OBJECTS FROM API
    $scope.getMapData(location, poi, function(result){
      // SET SCOPE-WIDE APARTMENTS, POI VARIABLES
      $scope.apartments = result.apartments;
      $scope.poi = result.poi;
      // ADD GEOCODES TO APARTMENTS
      $scope.apartments.forEach(function(apt) {
        geocode(apt.address).then(function(geocode){
          apt.lat = geocode.lat
          apt.lng = geocode.lng
        })
      })
      // INITIALIZE MAP
      var mapOptions = {
        center: new google.maps.LatLng(34.0483572,-118.2746524),
        zoom: 14
      }
      var map = new google.maps.Map(document.getElementById('map'), mapOptions)
      var bounds = new google.maps.LatLngBounds();
      // CREATE MARKERS AND ADD MARKERS
      $scope.apartments.forEach(function(apt) {
        var marker = createMarker(apt, true)
        apt.marker = marker;
        $scope.markers.push(marker)
      })
      $scope.poi.forEach(function(poi) {
        var marker = createMarker(poi, false)
        poi.marker = marker;
        $scope.markers.push(marker)
      })
      console.log('here')
      // EXTEND MAP BOUNDS AND SET MARKER
      $scope.markers.forEach(function(marker){
        // bounds.extend(marker.getPosition())
          marker.setMap(map)

      })
      console.log($scope.markers);
    })

    function createMarker(obj, type) {
      var params;
      if(type) {
        params = {
          position: new google.maps.LatLng(obj.lat, obj.lng),
          icon: new google.maps.MarkerImage("./img/house.png"),
          title: obj.name,
          data: obj
        }
      } else {
        params = {
          position: new google.maps.LatLng(obj.location.coordinate.latitude, obj.location.coordinate.longitude),
          icon: new google.maps.MarkerImage("./img/black-dot.png"),
          title: obj.name,
          data: obj
        }
      }
      var marker = new google.maps.Marker(params)
      return marker
    }

    function geocode(address) {
      var geocoder = new google.maps.Geocoder()
      return $q(function (resolve, reject) {
        var url_addr = encodeURIComponent(address);
        geocoder.geocode({address: address + location}, function(results, status) {
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

  };

  $scope.getMapData = function(location, poi, callback) {
    var result = {apartments:'', poi:''}
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
      result.apartments = data[0].data
      result.poi = data[1].data
      callback(result);
    }).catch(function(err) {
      console.log(err);
    })
  };

  // TESTER LINE
  $scope.setMap(nHService.current, nHService.poi);

  // Define Modal
  $ionicModal.fromTemplateUrl('templates/preview-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

  // $scope.setApt = function() {

  // }

  // $scope.add() = function() {
  //   // when an object is passed in, save the current apartment's data,
  //   // including distance to the database
  // }

})

.controller('showApartmentCtrl', function($scope) {

})

.controller('showAnalysisCtrl', function($scope) {

})

.controller('loginCtrl', function($scope) {

})

.controller('signupCtrl', function($scope) {

})

