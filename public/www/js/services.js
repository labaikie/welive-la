angular.module('app.services', [])

.factory('nHService', function() {
  return {
    neighborhoods: [
                      {name: 'Downtown Los Angeles', la: true},
                      {name: 'Echo Park', la: true},
                      {name: 'West Hollywood', la: false},
                      {name: 'Los Feliz', la: true},
                      {name: 'Silver Lake', la: true},
                      {name: 'Atwater Village', la: true}
                    ],
    current: null,
    poi: null
  }
})

.service('AuthService', function($q, $http, USER_ROLES) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var username = '';
  var isAuthenticated = false;
  var role = '';
  var authToken;

  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }
 )


