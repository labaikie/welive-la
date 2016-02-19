angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) { //Deleted USER_ROLES
  $httpProvider.interceptors.push('AuthInterceptor')

  $stateProvider

    .state('home', {
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'homeCtrl'
    })

    .state('tabsController', {
      url: '/tabs',
      abstract: true,
      templateUrl: 'templates/tabsController.html'
    })

    .state('tabsController.showSearch', {
      url: '/search',
      views: {
        'search': {
          templateUrl: 'templates/showSearch.html',
          controller: 'showSearchCtrl'
        }
      }
    })

    .state('tabsController.showAnalysis', {
      url: '/analysis',
      views: {
        'analysis': {
          templateUrl: 'templates/showAnalysis.html',
          controller: 'showAnalysisCtrl'
        }
      }
    })

    .state('tabsController.dash', {
      url: '/dash',
      views: {
        'dash': {
          templateUrl: 'templates/dashboard.html',
          controller: 'dashCtrl'
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
      abstract: true,
      templateUrl: 'templates/menu.html'
    })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/')

});
