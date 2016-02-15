angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('home', {
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'homeCtrl'
    })

    .state('tabsController.showResult', {
      url: '/result',
      views: {
        'result': {
          templateUrl: 'templates/showResult.html',
          controller: 'showResultCtrl'
        }
      }
    })

    .state('showApartment', {
      url: '/apartment/show',
      templateUrl: 'templates/showApartment.html',
      controller: 'showApartmentCtrl'
    })

    .state('tabsController.showAnalysis', {
      url: '/analysis',
      views: {
        'tab2': {
          templateUrl: 'templates/showAnalysis.html',
          controller: 'showAnalysisCtrl'
        }
      }
    })

    .state('tabsController', {
      url: '/tabs',
      abstract:true,
      templateUrl: 'templates/tabsController.html'
    })

    .state('tabsController.login', {
      url: '/login',
      views: {
        'tab3': {
          templateUrl: 'templates/login.html',
          controller: 'loginCtrl'
        }
      }
    })

    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'signupCtrl'
    })

    .state('menu', {
      url: '/side-menu',
      abstract:true,
      templateUrl: 'templates/menu.html'
    })

    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

});
