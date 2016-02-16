angular.module('app.controllers', [])

.controller('homeCtrl', function($scope, nHService) {
  $scope.neighborhoods = nHService.neighborhoods;
  $scope.poi = ["-","Grocery", "Schools", "Restaurants", "Swimming Pools", "Gyms", "Nightlife"]
  // $scope.setCurrent = function(neighborhood) {
  //   if (neighborhood.la) {
  //     nHService.current = neighborhood + ', Los Angeles, CA'
  //   } else {
  //     nHService.current = neighborhood + ', CA'
  //   }
  // }
})

.controller('showSearchCtrl', function($scope, mapService, nHService) {
    mapService.getMap('Echo Park, Los Angeles, CA', 'Grocery');
})

.controller('showApartmentCtrl', function($scope) {

})

.controller('showAnalysisCtrl', function($scope) {

})

.controller('loginCtrl', function($scope) {

})

.controller('signupCtrl', function($scope) {

})

