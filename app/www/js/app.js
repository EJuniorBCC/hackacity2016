angular
  .module('ondeestudar', ['ionic', 'ondeestudar.mapa', 'ondeestudar.pesquisa', 'ondeestudar.escola', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }


  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })

  .state('app.pesquisa', {
    url: '/pesquisa',
    views: {
      'menuContent': {
        templateUrl: 'templates/pesquisa.html',
        controller: 'PesquisaController'
      }
    }
  })

  .state('app.mapa', {
    url: '/mapa',
    views: {
      'menuContent': {
        templateUrl: 'templates/mapa.html',
        controller: 'MapaController'
      }
    }
  })

  .state('app.escola', {
    url: '/escola',
    params: {
      escola: {}
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/escola.html',
        controller: 'EscolaController'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/pesquisa');
});