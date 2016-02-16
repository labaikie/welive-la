angular.module('app.controllers', [])

.controller('homeCtrl', function($scope, nHService) {
  $scope.neighborhoods = nHService.neighborhoods;
  $scope.poi = ["-","Grocery", "Schools", "Restaurants", "Swimming Pools", "Gyms", "Nightlife"]

})

.controller('showSearchCtrl', function(mapService, $scope) {
    $scope.neighborhood = 'Atwater Village, Los Angeles, CA'
    // $scope.neighborhood = 'Venice, CA'
    mapService.getMap($scope.neighborhood, 'Grocery');
    // mapService.getMapData('Echo Park, Los Angeles, CA','Grocery');

})

.controller('showApartmentCtrl', function($scope) {

})

.controller('showAnalysisCtrl', function($scope) {

})

.controller('loginCtrl', function($scope) {

})

.controller('signupCtrl', function($scope) {

})

