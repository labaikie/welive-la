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

.factory('Auth', function($http, $q, AuthToken) {
  var auth = {
    login: function(user) {
      var authenticationUri = 'http://localhost:8080/api/user/authenticate' // OR DEPLOYED SITE
      return $http.post(authenticationUri, {user: user}).success(function(data) {
        AuthToken.setToken(data.token);
        auth.currentUser = data.user
        return data;
        }).error(function(err) {
          console.log(err);
        })
    },
    currentUser: {},
    logout: function() {
      AuthToken.setToken();
    },
    isLoggedIn: function() {
      if(AuthToken.getToken())
        return true;
      else
        return false;
    },
    getUser: function() {
      var getUserUri = 'http://localhost:8080/api/user' // TOBE REVISED
      if(AuthToken.getToken())
        return $http.get(getUserUri);
      else
        return $q.reject({message: 'User has no token'});
    }
  }
  return auth
})

.factory('AuthToken', function($window) {
  return {
    getToken: function() {
      return $window.localStorage.getItem('token');
    },
    setToken: function(token) {
      if(token)
        $window.localStorage.setItem('token', token);
      else
        $window.localStorage.removeItem('token');
    }
  }
})

.factory('AuthInterceptor', function ($q, $location, AuthToken) {
  return {
    request: function(config) {
      var token = AuthToken.getToken();
      if(token)
        config.headers['x-access-token'] = token;
      return config
    },
    responseError : function(res) {
      if(res.status == 403)
        $location.path('/dash');
        // $state.go('tabsController.dash');
      return $q.reject(res);
    }
  }
})

.factory('loginModal', function() {
 return {
    defineModal: function(scope) {
      $ionicModal.fromTemplateUrl('templates/login-modal.html', {
        scope: scope,
        animation: 'slide-in-up'
        }).then(function(modal) {
          scope.loginModal = modal;
        })
    },
    showModal: function(modal) {
      modal.show();
    },
    hideModal: function(modal) {
      modal.remove();
    }
  }
})


