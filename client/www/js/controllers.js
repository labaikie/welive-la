angular.module('app.controllers', [])

.controller('homeCtrl', function($scope, nHService, $ionicPopup, $state) {
  $scope.neighborhoods = nHService.neighborhoods;
  $scope.poi = ["-","Grocery", "Schools", "Restaurants", "Swimming Pools", "Gyms", "Nightlife"];
  $scope.setCurrent = function(selected) {
    if(selected.la == true) {
      nHService.current = selected.name + ', Los Angeles, CA'
    } else {
      nHService.current = selected.name + ', CA'
    }
  };
  $scope.setPOI = function(selected) {
    nHService.poi = selected
  };
  $scope.checkEntries = function() {
    if(nHService.current != null) {
      $state.go('tabsController.showSearch')
    } else {
      $ionicPopup.alert({
        template: '<div>Please specify your search</div>'
      })
    }
  };
})

.controller('showSearchCtrl', function($scope, $http, $document, $q, nHService, $ionicModal, Auth, $state, $location, $ionicPopup){
  $scope.currentNH = nHService.current;
  $scope.currentPOI = nHService.poi;
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
        poi.marker = marker
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
    var aptUrl = 'http://localhost:8080/apartments' || 'http://ec2-54-191-169-152.us-west-2.compute.amazonaws.com:8080/apartments'
    var aptPromise = $http({
      method: 'GET',
      url: aptUrl,
      params: {location: location}
    })
    var poiUrl = 'http://localhost:8080/poi' || 'http://ec2-54-191-169-152.us-west-2.compute.amazonaws.com:8080/poi'
    var poiPromise = $http({
      method: 'GET',
      url: poiUrl,
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

  $ionicModal.fromTemplateUrl('templates/login-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.loginModal = modal;
    })

  $scope.addApt = function(apt) {
    var addAptUri = 'http://localhost:8080/api/user/listing/add' || 'http://ec2-54-191-169-152.us-west-2.compute.amazonaws.com:8080/api/user/listing/add'
    if(Auth.isLoggedIn()==false) {
      $scope.loginModal.show();
    } else {
      $http.post(addAptUri, {user: Auth.currentUser, apt: apt}).then(function(data) {
        $ionicPopup.alert({
          title: 'Apartment Saved',
          template: 'Save a couple more to compare'
        })
      })
    }
  };

  $scope.user = {
    email: null,
    password: null
  };

  $scope.login = function() {
    Auth.login($scope.user).success(function(data) {
      Auth.currentUser = data.user;
      $scope.loginModal.remove();
    })
  };

  $scope.goSignup = function() {
    $scope.loginModal.hide();
    $scope.modal.hide();
    $state.go('signup');
  }

})

.controller('showAnalysisCtrl', function($scope, $http, Auth, $ionicModal, loginModal, $state) {
  $scope.loggedIn = Auth.isLoggedIn();
  $scope.getUserApts = function(){
    if($scope.loggedIn != true) {
      var modalPromise = loginModal.initialize($scope);
        modalPromise.then(function(modal) {
          $scope.loginModal = modal;
          $scope.loginModal.show();
      })
    } else {
      var email = Auth.currentUser.email;
      var listingsUri = 'http://localhost:8080/api/user/listings' || 'http://ec2-54-191-169-152.us-west-2.compute.amazonaws.com:8080/api/user/listings'
      $http({
        method: 'POST',
        url: listingsUri,
        data: {email: email}
      }).success(function(data) {
        $scope.listings = data;
      })
    }
  };

  $scope.login = function() {
    $scope.user = {email: '', password: ''};
    Auth.login($scope.user).success(function(data) {
      $scope.loginModal.remove()
      $scope.listings = Auth.currentUser.listings;
    })
  };
  $scope.goSignup = function() {
    $scope.loginModal.hide()
    $state.go('signup')
  };
  // $scope.listings = Auth.currentUser.listings;
  $scope.choice = [];
  $scope.poi = [];

  // MODAL FOR ADDING CHOICE
  $ionicModal.fromTemplateUrl('templates/choose-apt-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.chooseAptModal = modal;
    });

  // MODAL FOR ADDING CRITERIA
  $ionicModal.fromTemplateUrl('templates/choose-criteria-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.chooseCritModal = modal;
    });

  // MODAL FOR NOTING
  $ionicModal.fromTemplateUrl('templates/note-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.noteModal = modal;
    });

  $scope.openModal = function(modal) {
    modal.show()
  };
  $scope.closeModal = function(modal) {
    modal.hide()
  };

  $scope.isChecked = false;
  $scope.checkedOrNot = function (listing, isChecked, index) {
      if (isChecked) {
          $scope.choice.push(listing);
      } else {
          var _index = $scope.choice.indexOf(listing);
          $scope.choice.splice(_index, 1);
      }
  };

  $scope.populatePOI = function(modal) {
    var choices = $scope.choice;
    choices.forEach(function(choice) {
      var poi = choice.distance;
      poi.forEach(function(p) {
        if($scope.poi.indexOf(p) < 0) {
          $scope.poi.push(p)
        }
      })
    })
    $scope.closeModal(modal)
  }

  $scope.criterias = [];
  $scope.setCritera = function(modal) {
    if($scope.criteria) {
      $scope.criterias.push($scope.criteria)
    }
  }

})

.controller('dashCtrl', function($scope, $http, Auth, $state, loginModal, $q) {
  $scope.loggedIn = Auth.isLoggedIn();
  $scope.login = function() {
    var modalPromise = loginModal.initialize($scope);
    modalPromise.then(function(modal) {
      $scope.loginModal = modal;
      $scope.loginModal.show();
    })
  };
  $scope.goSignup = function(){
    $scope.loginModal.hide()
    $state.go('signup')
  }

  $scope.logout = function() {
    Auth.logout();
    $state.go('home');
  };
})

.controller('signupCtrl', function($scope, $state, $ionicPopup, $http) {
  $scope.user = {
    email: '',
    password: ''
  }

  $scope.signup = function(user) {
    var newUserUri = 'http://localhost:8080/api/user/new' || 'http://ec2-54-191-169-152.us-west-2.compute.amazonaws.com:8080/api/user/new'
    $http.post(newUserUri, {user: $scope.user}).success(function(data){
      $state.go('tabsController.showSearch');
    }).error(function(err){
      $ionicPopup.alert({
        title: 'Sign up unsuccessful',
        template: 'Please try again'
      });
    })
  }
})