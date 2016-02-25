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

.controller('showSearchCtrl', function($scope, $http, $document, $q, nHService, $ionicModal, Auth, $state, loginService, $ionicPopup, $ionicLoading) {
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
      // if more than 20 apartments, set time out...
      // console.log($scope.apartments.length);
      if($scope.apartments.length > 11) {
        // console.log('more than 11')
        for (var i = 0; i < 11; i++) {
          regGeocoder($scope.apartments[i]);
          function regGeocoder(a) {
            var promise = geocode(a.address).then(function(geocode) {
              a.lat = geocode.lat
              a.lng = geocode.lng
              return a
            })
            Promises.push(promise);
          }
        }
        // for (var i = 11; i < $scope.apartments.length; i++) {
        //   delayedGeocoder($scope.apartments[i]);
        //   function delayedGeocoder(a) {
        //     setTimeout(function(){
        //       var promise = geocode(a.address).then(function(geocode) {
        //         a.lat = geocode.lat
        //         a.lng = geocode.lng
        //         return a
        //       })
        //       Promises.push(promise);
        //     }, 2500)
        //   }
        // }
      } else {
        // console.log('less than 11')
        $scope.apartments.forEach(function(apt) {
          var promise = geocode(apt.address).then(function(geocode){
            apt.lat = geocode.lat
            apt.lng = geocode.lng
            return apt
          })
          Promises.push(promise);
        });
      }
      Promise.all(Promises).then(function(apts) {
        // console.log(Promises);
        // console.log(apts);
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
              // retrieve yelp review & append to obj
              var reviewUri = 'https://project-welive-la.herokuapp.com/apartment/rating' || 'http://localhost:8080/apartment/rating' || 'http://ec2-54-191-169-152.us-west-2.compute.amazonaws.com:8080/apartment/rating'
              $http.post(reviewUri, {apt: marker.data.name, city: marker.data.city}).then(function(data) {
                if(isNaN(data.data)==false) {
                  marker.data.rating = data.data
                }
                $scope.currentApt = marker.data;
                $scope.openModal()
              })
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
        // var url_addr = encodeURIComponent(address);
        // console.log(url_addr)
        // console.log(address.address)
        // console.log(address)
        geocoder.geocode({address: address + ', ' + location}, function(results, status) {
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
    var aptUrl = 'https://project-welive-la.herokuapp.com/apartments' || 'http://localhost:8080/apartments' || 'http://ec2-54-191-169-152.us-west-2.compute.amazonaws.com:8080/apartments'
    var aptPromise = $http({
      method: 'GET',
      url: aptUrl,
      params: {location: location}
    })
    var poiUrl = 'https://project-welive-la.herokuapp.com/poi' || 'http://localhost:8080/poi' || 'http://ec2-54-191-169-152.us-west-2.compute.amazonaws.com:8080/poi'
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

  google.maps.event.addDomListener(window, 'load', $scope.setMap($scope.currentNH, $scope.currentPOI));

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

  $scope.addApt = function(apt) {
    var addAptUri = 'https://project-welive-la.herokuapp.com/api/user/listing/add' || 'http://localhost:8080/api/user/listing/add' || 'http://ec2-54-191-169-152.us-west-2.compute.amazonaws.com:8080/api/user/listing/add'
    if(Auth.isLoggedIn()==false) {
      loginService.initialize($scope)
    } else {
      $http.post(addAptUri, {user: Auth.getUser(), apt: apt})
      .then(function(data) {
        $ionicPopup.alert({
          title: 'Apartment Saved',
          template: 'Save a couple more to compare'
        })
      }, function (err) {
        $ionicPopup.alert({
          title: 'Apartment Saved',
          template: 'Save a couple more to compare'
        })
      })
    }
  };

  $scope.user = { email: '', password: ''};
  $scope.login = function() {
    loginService.login($scope.user)
  };
  $scope.goSignup = function() {
    loginService.goSignup($scope)
  };

})

.controller('showAnalysisCtrl', function($scope, $http, Auth, $ionicModal, loginService, $state, $ionicPopup) {
  $scope.loggedIn = Auth.isLoggedIn();
  $scope.getUserApts = function(){
    if($scope.loggedIn == false) {
      loginService.initialize($scope);
    } else {
      // if logged in, get user's current listings
      var email = Auth.getUser().email;
      var listingsUri = 'https://project-welive-la.herokuapp.com/api/user/listings' || 'http://localhost:8080/api/user/listings' ||  'http://ec2-54-191-169-152.us-west-2.compute.amazonaws.com:8080/api/user/listings'
      $http({
        method: 'POST',
        url: listingsUri,
        data: {email: email}
      }).success(function(data) {
        $scope.listings = data;
      })
      // if logged in, also get user's past analyses
      var analysesUri = 'https://project-welive-la.herokuapp.com/api/user/analyses' || 'http://localhost:8080/api/user/analyses' || 'http://ec2-54-191-169-152.us-west-2.compute.amazonaws.com:8080/api/user/analyses'
      $http({
        method: 'POST',
        url: analysesUri,
        data: {email: email}
      }).success(function(data) {
        $scope.analyses = data;
        // console.log(data);
        $scope.choice = data[-1];
      })
    }
  };
  $scope.user = {email: '', password: ''};
  $scope.login = function() {
    loginService.login($scope.user)
    $state.go('tabsController.showSearch', {}, {reload: true, inherit: true})
  };
  $scope.goSignup = function() {
    loginService.goSignup($scope)
  };

  // MODAL FOR ADDING CHOICE
  $ionicModal.fromTemplateUrl('templates/choose-apt-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.chooseAptModal = modal;
    });

  // MODAL FOR NOTING
  $ionicModal.fromTemplateUrl('templates/note-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.noteModal = modal;
    });


  // $scope.choice = [];
  $scope.isChecked = false;
  $scope.checkedOrNot = function (listing, isChecked, index) {
    if($scope.choice) {
      $scope.choice = $scope.choice;
    } else {
      $scope.choice = [];
    }
    if (isChecked) {
        $scope.choice.push(listing);
    } else {
        var _index = $scope.choice.indexOf(listing);
        $scope.choice.splice(_index, 1);
    }
  };

  $scope.poi = [];
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
    modal.hide();
  };

  $scope.getDistance = function(poi) {
    $scope.choice.forEach(function(c) {
      c.currentDistance = null;
      for (var i = 0; i < c.distance.length; i++) {
        if(c.distance[i].poi == poi) {
          c.currentDistance = c.distance[i].distance;
        }
      }
    })
  };

  $scope.openNote = function(current) {
    $scope.noteModal.show()
    $scope.currentNote = current;
  };

  $scope.addNote = function(note) {
    $scope.noteModal.hide();
  };

  $scope.saveAnalysis = function() {
    var user = Auth.getUser();
    var analysis = {
                    listings: $scope.choice
                   };
    var analysisUri = 'https://project-welive-la.herokuapp.com/api/user/analysis/add' || 'http://localhost:8080/api/user/analysis/add' || 'http://ec2-54-191-169-152.us-west-2.compute.amazonaws.com:8080/api/user/analysis/add'
    $http({
      method: 'POST',
      url: analysisUri,
      data: {user: user, analysis: analysis}
    }).success(function(data) {
      $scope.analyses = data;
      $ionicPopup.alert({
        title: 'Analysis Saved'
      })
    })
  }

})

.controller('dashCtrl', function($scope, $state, Auth, loginService) {
  $scope.loggedIn = Auth.isLoggedIn();
  if($scope.loggedIn) {
    $scope.user = Auth.getUser();
  } else {
    $scope.user = { email: '', password: ''};
  }
  $scope.goLogin = function() {
    loginService.initialize($scope)
  };
  $scope.login = function() {
    loginService.login($scope.user)
    $state.go('tabsController.showSearch', {}, {reload: true, inherit: true})
  };
  $scope.goSignup = function() {
    loginService.goSignup($scope)
  };
  $scope.signup = function(){
    $state.go('signup')
  };
  $scope.logout = function() {
    Auth.logout()
  };
})

.controller('signupCtrl', function($scope, $state, $ionicPopup, $http, loginService) {
  $scope.user = { email: '', password: ''};
  $scope.signup = function() {
    var newUserUri = 'https://project-welive-la.herokuapp.com/api/user/new' ||'http://localhost:8080/api/user/new' || 'http://ec2-54-191-169-152.us-west-2.compute.amazonaws.com:8080/api/user/new'
    $http.post(newUserUri, {user: $scope.user}).success(function(data){
      if(data.success) {
        loginService.login($scope.user)
        $state.go('tabsController.showSearch', {}, {reload: false})
      } else {
        $ionicPopup.alert({
          title: 'Sign up unsuccessful',
          template: 'Please try again'
        })
      }
    })
  };
})
