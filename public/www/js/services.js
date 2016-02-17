angular.module('app.services', ['http-auth-interceptor'])

.factory('nHService', function() {
  return {
    neighborhoods: [
                      {name: 'Echo Park', la: true},
                      {name: 'Silver Lake', la: true},
                      {name: 'Atwater Village', la: true},
                      {name:'Annandale', la:false},
                      {name:'Beverlywood', la:true},
                      {name:'Boyle Heights', la:true},
                      {name:'Brentwood', la:false},
                      {name:'Canndu/Avalon Garden', la:true},
                      {name:'Cheviot Hills', la:true},
                      {name:'Chinatown', la:true},
                      {name:'Crenshaw', la:true},
                      {name:'Downtown Los Angles', la:true},
                      {name:'Eagle Rock', la:true},
                      {name:'East Hollywood', la:true},
                      {name:'Echo Park', la:true},
                      {name:'Greater Culver City', la:true},
                      {name:'Highland Park', la:true},
                      {name:'Hollywood', la:false},
                      {name:'Hollywood Hills', la:true},
                      {name:'Koreatown', la:true},
                      {name:'Lincoln Heights', la:true },
                      {name: 'Los Feliz', la: true},
                      {name:'Mar Vista Los Angeles', la:true},
                      {name:'Melrose', la:true},
                      {name:'Mid-City West', la:true},
                      {name:'Mid-Wilshire', la:true},
                      {name:'Monterey Hills', la:true},
                      {name:'Palms', la:true},
                      {name:'Park Mesa Heights', la:true},
                      {name:'Pico-Robertson', la:true},
                      {name:'Poly High', la:true},
                      {name:'Silver Lake', la:true},
                      {name:'South Central La', la:true},
                      {name:'Southeast Los Angeles', la:true},
                      {name:'Vermont Harbor', la:true},
                      {name:'Vernon-Main', la:true},
                      {name:'West Adams', la:true},
                      {name:'West Hollywood', la:false},
                      {name:'West Los Angeles', la:true},
                      {name:'Westchester', la:true},
                      {name:'Westlake', la:true},
                      {name:'Westlake Village', la:false},
                      {name:'Westmont', la:true},
                      {name:'Westside', la:true},
                      {name:'Westwood', la:true},
                    ],
    current: null,
    poi: null
  }
})

.factory('AuthenticationService', function($rootScope, authService, $http) { // DELETED USER_ROLES
  return {
    login: function(user) {
      var authenticationUri = 'http://localhost:8080/user/authenticate' // OR DEPLOYED SITE
      $http({
        method: 'POST',
        url: authenticationUri,
        data: {user: user},
        config: {ignoreAuthModule: true}
      }).success(function(data, status, headers, config){
        $http.defaults.headers.common.Authorization = data.token
        authService.loginConfirmed(data, function(config) {
          config.headers.Authorization = data.token;
          return config
        })
      }).error(function (data, status, headers, config) {
        $rootScope.$broadcast('event:auth-login-failed', status);
      });
    },
    logout: function(user) {
      var logoutUri = 'http://localhost:8080/user/logout' //
      $http.post('https://logout', {}, { ignoreAuthModule: true })
      .finally(function(data) {
        delete $http.defaults.headers.common.Authorization;
        $rootScope.$broadcast('event:auth-logout-complete');
      });
    },
    loginCancelled: function() {
      authService.loginCancelled();
    }
  }
})

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});


