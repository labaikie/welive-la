angular.module('app.services', [])

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

.service('AuthService', function($q, $http) { // DELETED USER_ROLES
  var LOCAL_TOKEN_KEY = 'laskilaskalasko';
  var email = '';
  var isAuthenticated = false;
  var role = '';
  var authToken;

  // should change to API CALL to server '/user/authenticate'
  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }

  function useCredentials(token) {
    email = token.split('.')[0];
    isAuthenticated = true;
    authToken = token;

    // if (email == 'admin') {
    //   role = USER_ROLES.admin
    // }
    // if (email == 'user') {
    //   role = USER_ROLES.public
    // }
    // Set the token as header for your requests!
    $http.defaults.headers.common['x-access-token'] = token;
  }

  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['x-access-token'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

  var login = function(email, pw) {
    return $q(function(resolve, reject) {
      if ((email == 'admin' && pw == '1') || (email == 'user' && pw == '1')) {
        // Make a request and receive your auth token from your server
        storeUserCredentials(email + '.yourServerToken');
        resolve('Login success.');
      } else {
        reject('Login Failed.');
      }
    });
  };

  var logout = function() {
    destroyUserCredentials();
  };

  var isAuthorized = function(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
  };

  loadUserCredentials();

  return {
    login: login,
    logout: logout,
    isAuthorized: isAuthorized,
    isAuthenticated: function() {return isAuthenticated;},
    email: function() {return user;},
    // role: function() {return role;}
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


