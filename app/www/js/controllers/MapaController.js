angular
    .module('ondeestudar.mapa')
    .controller('MapaController', MapaController);

MapaController.$inject = ['$scope', '$state', '$stateParams', '$cordovaGeolocation', '$compile', 'pesquisaService'];


function MapaController($scope, $state, $stateParams, $cordovaGeolocation, $compile, pesquisaService) {

    var map;

    $scope.markers = [];
    $scope.escolas = [];

    $scope.lastInfo;
    $scope.escolaSelecionada;
    $scope.tab = 'mapa';

    $scope.showDetails = showDetails;
    $scope.loadMap = loadMap;
    $scope.selectTab = selectTab;
    $scope.isSelected = isSelected;

    $scope.mapOptions = {
        timeout: 4000,
        enableHighAccuracy: false
    };


    /**
     * Carrega o mapa onde serão mostradas as
     * escolas pesquisadas.
     */
    function loadMap() {
        $cordovaGeolocation
            .getCurrentPosition($scope.mapOptions)
            .then(function(position) {
                console.log(position);
                var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                var mapCenter = {
                    center: latLng,
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                map = new google.maps.Map(document.getElementById('map'), mapCenter);

                var userPoint = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    icon: 'img/ico_user.png'
                });

                getEscolas();
            }, function(error) {

            });
    }


    /**
     * Pesquisa as escolas a partir dos filtros
     * de busca
     */
    function getEscolas() {
        pesquisaService.getEscolas()
            .then(function(data) {
                $scope.escolas = data;
                mapearEscolas();
            });
    }

    /**
     * Adicionar uma escola no mapa.
     */
    function setMarker(escola) {
        var lat = escola.latitude.replace(/,/g, ".");
        var lng = escola.longitude.replace(/,/g, ".");
        var infoWindow = new google.maps.InfoWindow();
        var schoolLocation = new google.maps.LatLng(lat, lng);

        var marker = new google.maps.Marker({
            position: schoolLocation,
            map: map,
            icon: 'img/ico_map.png'
        });

        /*
         * Informação da Escola
         */
        marker.content = '<div>' + escola.nome + '</div>';
        var contentString = "<div class='marker-info'><p>" + escola.nome + "</p><p>" + escola.endereco + ', ' + escola.endereco_numero + ', ' + escola.bairro + "</p><p class='details' ng-click='showDetails()'>Mais Detalhes</p></div>";
        var compiled = $compile(contentString)($scope);

        google.maps.event.addListener(marker, 'click', function() {
            closeLastMarker();
            infoWindow.setContent(compiled[0]);
            infoWindow.open($scope.map, marker);
            $scope.lastInfo = infoWindow;
            $scope.escolaSelecionada = escola;
        });

        $scope.markers.push(marker);

    }

    /**
     * Mapeia todas as escolas retornadas
     * no filtro de busca.
     */
    function mapearEscolas() {
        var numEscolas = $scope.escolas.length;
        for (var i = 0; i < numEscolas; i++) {
            setMarker($scope.escolas[i]);
        }
    }

    /**
     * Fecha o ultimo infoWindow ao clicar
     * em um novo marker
     */
    function closeLastMarker() {
        if ($scope.lastInfo) {
            $scope.lastInfo.close();
        }
    }

    /**
     * Apresenta informações da escola selecionada.
     */
    function showDetails() {
        console.log($scope.escolaSelecionada);
        $state.go('app.escola', {
            escola: $scope.escolaSelecionada
        });
    }

    function selectTab(tab) {
        $scope.tab = tab;
    }

    function isSelected(tab) {
        if ($scope.tab == tab) {
            return true;
        }
        return false;
    }

}