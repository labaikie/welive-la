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

.controller('showSearchCtrl', function($scope, mapService, nHService, $ionicModal) {
    // getting service
    mapService.getMap(nHService.current, 'Grocery');











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

