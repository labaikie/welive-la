angular.module('app.controllers', [])

.controller('homeCtrl', function($scope, nHService) {
  $scope.neighborhoods = nHService.neighborhoods;
  $scope.poi = ["-","Grocery", "Schools", "Restaurants", "Swimming Pools", "Gyms", "Nightlife"];
  $scope.current;
  $scope.setCurrent = function(selected) {
    if(selected.la == true) {
      nHService.current = selected.name + ', Los Angeles, CA'
    } else {
      nHService.current = selected.name + ', CA'
    }
  }
})

.controller('showSearchCtrl', function($scope, $http, $document, $q, nHService, $ionicModal) {

    $scope.apartments;
    $scope.poi;
    $scope.setMap = function(location, poi) {
      // get map object data from APIs
      $scope.getMapData(location, poi, function(result){
        // for apartment objects, get additional info from YELP
        var aptObjsNames = result.apartments.
        console.log(result);
      })

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

    $scope.geocode = function(location, )
    // Tester Line
    $scope.setMap(nHService.current, 'Grocery');







    // defining modal
    $ionicModal.fromTemplateUrl('previewModal.html', {
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

})

.controller('showApartmentCtrl', function($scope) {

})

.controller('showAnalysisCtrl', function($scope) {

})

.controller('loginCtrl', function($scope) {

})

.controller('signupCtrl', function($scope) {

})

