angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading, $compile, $cordovaGeolocation, serviceEscolas) {

  $scope.content = 'map';
  $scope.title = "Mapa";
  $scope.useClass = "icon-r";
  $scope.escolas = [];
  $scope.data = {
    raio: 5
  };
  $scope.markers = [];
  $scope.escolaSelecionada = "";
  /**
   * Funções do Mapa
   */

  var posOptions = {
    timeout: 10000,
    enableHighAccuracy: false
  };

  function initialize() {

    $cordovaGeolocation
      .getCurrentPosition(posOptions)

    .then(function(position) {
      $scope.myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var mapOptions = {
        center: $scope.myLatlng,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);

      var marker = new google.maps.Marker({
        position: $scope.myLatlng,
        map: map,
        title: 'My Position',
        icon: 'img/ico_user.png'
      });

      $scope.map = map;
    }, function(err) {
      // error
    });
  }
  google.maps.event.addDomListener(window, 'load', initialize);

  $scope.centerOnMe = function() {
    if (!$scope.map) {
      return;
    }

    $cordovaGeolocation
      .getCurrentPosition(posOptions)

    .then(function(position) {
      $scope.map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    }, function(err) {
      // error
    });
  };

  /**
   * Funções do Fluxos
   */

  $scope.showList = function() {
    $scope.content = 'list';
    $scope.title = "Lista de Escolas";
    $scope.useClass = 'icon-back';
  }

  $scope.showMap = function() {
    $scope.content = 'map';
    $scope.title = "Mapa";
    $scope.useClass = 'icon-r';
  }

  $scope.clickTest = function(escola) {
    console.log(escola);
    alert('Example of infowindow with ng-click')
  };

  $scope.action = function() {
    if ($scope.useClass == 'icon-r') {
      $scope.content = 'filtros';
      $scope.title = "Filtrar";
      $scope.useClass = 'icon-back';
    } else if ($scope.useClass == 'icon-back') {
      $scope.content = 'map';
      $scope.title = "Mapa";
      $scope.useClass = 'icon-r';
    }
  };

  $scope.setEscola = function(escola) {
    $scope.escolaSelecionada = escola;
    $scope.selecionarEscola();
  }

  $scope.selecionarEscola = function() {
    $scope.content = "detalhe";
    $scope.title = "Detalhe";
    $scope.useClass = 'icon-back';
    console.log($scope.escolaSelecionada);
  }

  /**
   * Funções dos Filtros
   */

  $scope.aplicarFiltros = function() {
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function(position) {
        $scope.loading = $ionicLoading.show({
          content: 'Buscando Escolas...',
          showBackdrop: false
        });
        if ($scope.data.laboratorio == true) {
          $scope.data.laboratorio = 1;
        } else {
          $scope.data.laboratorio = 0;
        }
        if ($scope.data.biblioteca == true) {
          $scope.data.biblioteca = 1;
        } else {
          $scope.data.biblioteca = 0;
        }
        serviceEscolas.getEscolas(position.coords.latitude, position.coords.longitude,
            $scope.data.raio, $scope.data.laboratorio, $scope.data.modalidade, $scope.data.biblioteca)
          .then(function(data) {
            console.log(data);
            $scope.escolas = data.data;
            $scope.content = "map";
            $scope.title = "Mapa";
            $scope.useClass = 'icon-r';
            drawMarkers();
            $scope.loading.hide();
            $scope.data = {
              raio: 5
            };
          });
      }, function(err) {
        // error
      });

    //
  }


  function drawMarkers() {

    if ($scope.markers == undefined)
      $scope.markers = [];

    var infoWindow = new google.maps.InfoWindow();

    var createMarker = function(escola) {
      var marker = new google.maps.Marker({
        map: $scope.map,
        position: new google.maps.LatLng(escola.loc[0], escola.loc[1]),
        title: escola.nome,
        icon: 'img/ico_map.png'
      });
      marker.content = '<div>' + escola.nome + '</div>';
      var contentString = "<div class='contentInfo'><p>" + escola.nome + "</p><p>" + escola.endereco + ', ' + escola.endereco_numero + ', ' + escola.bairro + "</p><p class='details' ng-click='selecionarEscola()'>Mais Detalhes</p></div>";
      var compiled = $compile(contentString)($scope);

      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(compiled[0]);
        infoWindow.open($scope.map, marker);
        $scope.escolaSelecionada = escola;
      });

      $scope.markers.push(marker);

    }


    if ($scope.escolas.length > 0) {

      for (i = 0; i < $scope.escolas.length; i++) {
        createMarker($scope.escolas[i]);
      }

      $scope.openInfoWindow = function(e, selectedMarker) {
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
      }
    }
  }


  /**
   * Apresentação das Escolas
   */

  $scope.getImg = function(escola) {
    if (escola.regular_creche == 1) {
      return "img/creche.png";
    } else {
      return "img/escola.png";
    }
  }

  $scope.getInfo = function(escola) {
    if (escola.regular_creche == 1) {
      return "Creche";
    } else {
      return "Escola";
    }
  }

  $scope.getInfoB = function(escola) {
    if (escola.dependencia_bercario == 1) {
      return 'Sim';
    } else {
      return 'Não'
    }
  }
  $scope.getInfoR = function(escola) {
    if (escola.dependencia_refeitorio == 1) {
      return 'Sim';
    } else {
      return 'Não'
    }
  }
  $scope.getInfoBi = function(escola) {
    if (escola.dependencia_biblioteca == 1) {
      return 'Sim';
    } else {
      return 'Não'
    }
  }
  $scope.getInfoLab = function(escola) {
    if (escola.dependencia_laboratorio_informatica == 1) {
      return 'Sim';
    } else {
      return 'Não'
    }
  }
});