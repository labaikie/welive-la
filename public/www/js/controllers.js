angular.module('app.controllers', [])

.controller('homeCtrl', function($scope) {

})

.controller('showResultCtrl', function(mapService, $document) {
  var vm = this;
    mapService.getMap();
    mapService.getMapData('Echo Park','Grocery');
  return vm;
})

.controller('showApartmentCtrl', function($scope) {

})

.controller('showAnalysisCtrl', function($scope) {

})

.controller('loginCtrl', function($scope) {

})

.controller('signupCtrl', function($scope) {

})

