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

.factory()


