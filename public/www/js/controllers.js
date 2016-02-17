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

.controller('showSearchCtrl', function($scope, $http, $document, $q, nHService, $ionicModal, Auth){

  $scope.apartment = {distance: null, data: null};
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
      var Promises = [];
      $scope.apartments.forEach(function(apt) {
        var promise = geocode(apt.address).then(function(geocode){
          apt.lat = geocode.lat
          apt.lng = geocode.lng
          return apt
        })
        Promises.push(promise);
      });

      Promise.all(Promises).then(function(apts) {
        $scope.apartments = apts
        $scope.apartments.forEach(function(apt) {
          var marker = createMarker(apt, true)
          apt.marker = marker;
          $scope.markers.push(marker)
          bounds.extend(marker.getPosition())
          marker.setMap(map);
          // SETTING EVENT LISTENERS TO MARKERS
          marker.addListener('click', function() {
            // calculate distance & append to obj
            getDistance(marker.getPosition()).then(function(distance){
              marker.data.distance = []
              distance = distance.distance
              for (var i = 0; i < distance.length; i++) {
                var distanceObj = {
                  distance: distance[i],
                  poi: $scope.poi[i].name
                }
                marker.data.distance.push(distanceObj)
              }
              console.log(marker.data);
              $scope.currentApt = marker.data;
              $scope.openModal();
            });
          })
        })
      });
      // INITIALIZE MAP
      var mapOptions = {
        center: new google.maps.LatLng(34.0483572,-118.2746524),
        zoom: 14
      };
      var map = new google.maps.Map(document.getElementById('map'), mapOptions);
      var bounds = new google.maps.LatLngBounds();
      // CREATE MARKERS AND ADD MARKERS
      $scope.poi.forEach(function(poi) {
        var marker = createMarker(poi, false)
        poi.marker = marker;
        $scope.markers.push(marker)
        bounds.extend(marker.getPosition())
        marker.setMap(map);
      });
      map.fitBounds(bounds);
    })

    function getDistance(origin){
      var service = new google.maps.DistanceMatrixService;
      $scope.poiLL = [];
      $scope.poi.forEach(function(poi) {
        var position = poi.marker.getPosition()
        $scope.poiLL.push(position);
      })
      var distancePromise = $q(function (resolve, reject) {
        service.getDistanceMatrix({
          origins: [origin],
          destinations: $scope.poiLL,
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        }, function(res, status) {
          if(status !== google.maps.DistanceMatrixStatus.OK) {
            alert('Error was: ' + status);
          } else {
            resolve({distance: res.rows[0].elements})
          }
        })
      })
      // returning promise for eventlistener in addAptMarker to grab
      return distancePromise;
    };

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
    };

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
        })
      })
    };
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

  // MODAL FOR SHOW APT
  $ionicModal.fromTemplateUrl('templates/preview-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    })

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

  // $scope.addApt = function(apt) {
  //   if(!Auth.isLoggedIn()) {
  //     $scope.loginModal
  //   }
  // }

  $ionicModal.fromTemplateUrl('templates/login-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.loginModal = modal;
      $scope.promptLogin = function () {
          if (!Auth.isLoggedIn()) {
            $scope.loginModal.show()
          } else {
          }
        }
    })

})


.controller('showAnalysisCtrl', function($scope, Auth, $ionicModal) {
  $scope.loggedIn = Auth.isLoggedIn();

   // MODAL FOR LOG-IN
  $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
  $scope.openModal = function() {
    $scope.modal.show();
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  }

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


})

.controller('dashCtrl', function($scope, $state, $http, Auth) {

  $scope.logout = function() {
    Auth.logout();
    $state.go('home');
  };
})

.controller('loginCtrl', function($scope, $state, Auth) {
  $scope.message = '';
  $scope.user = {
    email: null,
    password: null
  };

  $scope.login = function() {
    Auth.login($scope.user);
  };

})

.controller('signupCtrl', function($scope, $state, $ionicPopup) {
  $scope.signup = function(user) {
    var newUserUri = 'http://localhost:8080/user/signup' //OR DEPLOYED SITE
    $http.post(newUserUri, {user: user}).success(function(data){
      $state.go('tabsController.login');
    }).error(function(err){
      $ionicPopup.alert({
        title: 'Unsuccessful',
        template: 'Sign up was unsuccessful, please try again'
      });
    })
  }
})


.controller('showApartmentCtrl', function($scope) {

})

