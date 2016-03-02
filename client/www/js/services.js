angular.module('app.services', [])

.factory('nHService', function() {
  return {
    neighborhoods: [
                      {name:'Echo Park', la: true},
                      {name:'Silver Lake', la: true},
                      {name:'Atwater Village', la: true},
                      {name:'Annandale', la:false},
                      {name:'Beverlywood', la:true},
                      {name:'Boyle Heights', la:true},
                      {name:'Brentwood', la:false},
                      // {name:'Canndu/Avalon Garden', la:true},
                      {name:'Cheviot Hills', la:true},
                      {name:'Chinatown', la:true},
                      {name:'Crenshaw', la:true},
                      // {name:'Downtown Los Angles', la:true},
                      {name:'Eagle Rock', la:true},
                      {name:'East Hollywood', la:true},
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

.factory('Auth', function($http, $q, $state, $ionicHistory, $window, AuthToken, nHService) {
  var auth = {
    login: function(user) {
      var authenticationUri = 'https://project-welive-la.herokuapp.com/api/user/authenticate' || 'http://localhost:8080/api/user/authenticate' || 'http://ec2-54-191-169-152.us-west-2.compute.amazonaws.com:8080/api/user/authenticate'
      var login = $http.post(authenticationUri, {user: user}).success(function(data) {
        if(data.success) {
          AuthToken.setToken(data.token);
          $window.localStorage.setItem('email', data.user.email);
          $window.localStorage.setItem('password', data.user.password);
          return data;
        } else {
          return data;
        }
      })
      return login;
    },
    logout: function() {
      AuthToken.setToken();
      $window.localStorage.removeItem('email');
      $window.localStorage.removeItem('password');
      $ionicHistory.clearCache();
      $state.go('home');
      // $window.reload();
    },
    isLoggedIn: function() {
      if(AuthToken.getToken())
        return true;
      else
        return false;
    },
    getUser: function() {
      var email = $window.localStorage.getItem('email')
      var password = $window.localStorage.getItem('password')
      var user = {email: email, password: password}
      return user
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
        // config.headers['Access-Control-Allow-Origin'] = '*';
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

.factory('loginService', function($ionicModal, $state, $stateParams, $ionicPopup, Auth) {
  var loginService = {
    modal: {},
    initialize: function(scope) {
      $ionicModal.fromTemplateUrl('templates/login-modal.html', {
        scope: scope,
        animation: 'slide-in-up'
        }).then(function(modal) {
          loginService.modal = modal
          loginService.modal.show();
        })
    },
    login: function(user) {
      Auth.login(user).success(function(data) {
        if(data.success) {
          $ionicPopup.alert({
            title: 'Sign-in Successful',
            template: 'Now you have access to more services'
          });
          loginService.modal.remove();
          // $state.go($state.current, $stateParams, {reload: true, inherit: true})
        } else {
          $ionicPopup.alert({
            title: 'Log-in Unsuccessful',
            template: data.message
          });
        }
      })
    },
    goSignup: function(scope) {
      var modal = loginService.modal;
      if(modal) {
        modal.hide();
        if(scope.modal) {
          scope.modal.hide();
        }
      }
      $state.go('signup');
    }
  }
  return loginService
})


