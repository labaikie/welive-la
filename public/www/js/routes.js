angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) { //Deleted USER_ROLES

  $stateProvider

  // states before log-in
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
        'login': {
          templateUrl: 'templates/login.html',
          controller: 'loginCtrl'
        },
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

  // states after log-in

    // .state('showApartment', {
    //   url: '/apartment/show',
    //   templateUrl: 'templates/showApartment.html',
    //   controller: 'showApartmentCtrl'
    // })

    // .state('admin', {
    //   url: '/admin',
    //   templateUrl: 'templates/admin.html',
    //   data: {
    //     authorizedRoles: [USER_ROLES.admin]
    //   }
    // })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/')

});
