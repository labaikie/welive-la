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

    if (email == 'admin') {
      role = USER_ROLES.admin
    }
    if (email == 'user') {
      role = USER_ROLES.public
  }

 )


