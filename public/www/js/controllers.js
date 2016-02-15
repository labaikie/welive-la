angular.module('app.controllers', [])

.controller('homeCtrl', function($scope) {
  $scope.neighborhoods = [
                            {name: 'Downtown Los Angeles', la: true},
                            {name: 'Echo Park', la: true},
                            {name: 'West Hollywood', la: false}
                          ];
  $scope.poi = ["-","Grocery", "Schools", "Restaurants", "Swimming Pools", "Gyms", "Nightlife"]

})

.controller('showSearchCtrl', function(mapService, $scope) {
    mapService.getMap('Echo Park, Los Angeles, CA', 'Grocery');
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

