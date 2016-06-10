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
angular.module('ondeestudar.escola', []);
angular.module('ondeestudar.mapa', []);
angular.module('ondeestudar.pesquisa', []);
angular
	.module('ondeestudar.escola')
	.controller('EscolaController', EscolaController);


EscolaController.$inject = ['$scope', '$state', '$stateParams'];

function EscolaController($scope, $state, $stateParams) {

	console.log($stateParams);

}
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
angular
    .module('ondeestudar.pesquisa')
    .controller('PesquisaController', PesquisaController);


PesquisaController.$inject = ['$scope', '$state'];

function PesquisaController($scope, $state) {
   
}

angular
	.module('ondeestudar.pesquisa')
	.factory('pesquisaService', pesquisaService);

pesquisaService.$inject = ['$q'];

function pesquisaService($q) {
	var escolas = [{
		"inep_escola": 26121786,
		"codigo_escola": 1,
		"nome": "ESCOLA MUNICIPAL REITOR JOAO ALFREDO",
		"latitude": "-8,064733012",
		"longitude": "-34,89548539",
		"cep": 50070460,
		"endereco": "SENADOR JOSE HENRIQUE",
		"endereco_numero": 160,
		"endereco_complemento": 0,
		"bairro_codigo": 78,
		"bairro": "ILHA DO LEITE",
		"telefone": 33553804,
		"fax": 34237321,
		"email": "CMNJA@HOTMAIL.COM",
		"orgao_regional": 1,
		"regulamentacao": 1,
		"funcionamento_predio_escolar": 1,
		"funcionamento_templo": 0,
		"funcionamento_empresa": 0,
		"funcionamento_outras_escolas": 0,
		"funcionamento_galpao": 0,
		"funcionamento_outros": 0,
		"forma_ocupacao": 1,
		"agua_rede_publica": 1,
		"agua_poco_artesiano": 0,
		"agua_cacimba": 0,
		"agua_fonte": 0,
		"esgoto_rede_publica": 1,
		"esgoto_fossa": 0,
		"esgoto_inexistente": 0,
		"lixo_coleta_periodica": 1,
		"lixo_outra area": 0,
		"dependencia_diretoria": 1,
		"dependencia_professores": 1,
		"dependencia_secretaria": 1,
		"dependencia_laboratorio_informatica": 1,
		"dependencia_laboratorio_ciencias": 0,
		"dependencia_aee": 1,
		"dependencia_quadra_coberta": 0,
		"dependencia_quadra_descoberta": 1,
		"dependencia_cozinha": 1,
		"dependencia_biblioteca": 1,
		"dependencia_leitura": 0,
		"dependencia_parque_infantil": 0,
		"dependencia_bercario": 0,
		"dependencia_banheiro_fora": 0,
		"dependencia_banheiro_dentro": 1,
		"dependencia_banheiro_infantil": 0,
		"dependencia_banheiro_deficiencia": 1,
		"dependencia_vias_adequadas_deficiencia": 0,
		"dependencia_banheiro_chuveiro": 1,
		"dependencia_refeitorio": 1,
		"dependencia_despensa": 1,
		"dependencia_almoxarifado": 1,
		"dependencia_auditorio": 1,
		"dependencia_patio_coberto": 0,
		"dependencia_patio_descoberto": 1,
		"dependencia_alojamento_aluno": 0,
		"dependencia_alojamento_professor": 0,
		"dependencia_area_verde": 0,
		"dependencia_lavanderia": 0,
		"quantidade_salas_existentes": 18,
		"quantidade_salas_utilizadas_fora_e_dentro": 18,
		"equipamentos_televisao": 2,
		"equipamentos_videocassete": 0,
		"equipamentos_dvd": 2,
		"equipamentos_antena_parabolica": 0,
		"equipamentos_copiadora": 1,
		"equipamentos_retroprojetor": 1,
		"equipamentos_impressora": 3,
		"equipamentos_aparelho_som": 2,
		"equipamentos_projetor_multimidia": 2,
		"equipamentos_fax": 0,
		"equipamentos_maquina_fotografica": 1,
		"equipamentos_computadores": 1,
		"computadores_quantidade": 19,
		"computadores_qtd_administrativo": 6,
		"computadores_qtd_alunos": 13,
		"acesso_internet": 1,
		"banda_larga": 1,
		"total_funcionarios": 94,
		"brasil_alfabetizado": 0,
		"abre_finais_semana": 0,
		"modalidade_regular": 1,
		"modalidade_especial": 1,
		"modalidade_eja": 1,
		"regular_creche": 0,
		"regular_preescolar": 0,
		"regular_fundamental9": 1,
		"especial_fundamental9": 1,
		"especial_eja_fundamental": 0,
		"eja_fundamental": 1,
		"eja_projovem": 0
	}, {
		"inep_escola": 26123550,
		"codigo_escola": 2,
		"nome": "ESCOLA MUNICIPAL DE TEJIPIO",
		"latitude": "-8,0864",
		"longitude": "-34,96858",
		"cep": 50930100,
		"endereco": "TUTOIA",
		"endereco_numero": 165,
		"endereco_complemento": 0,
		"bairro_codigo": 892,
		"bairro": "TEJIPIO",
		"telefone": 33556897,
		"fax": 32516769,
		"email": "EM.DETEJIPIO@EDUCARECIFE.COM",
		"orgao_regional": 2,
		"regulamentacao": 1,
		"funcionamento_predio_escolar": 1,
		"funcionamento_templo": 0,
		"funcionamento_empresa": 0,
		"funcionamento_outras_escolas": 0,
		"funcionamento_galpao": 0,
		"funcionamento_outros": 0,
		"forma_ocupacao": 2,
		"agua_rede_publica": 1,
		"agua_poco_artesiano": 0,
		"agua_cacimba": 0,
		"agua_fonte": 0,
		"esgoto_rede_publica": 0,
		"esgoto_fossa": 1,
		"esgoto_inexistente": 0,
		"lixo_coleta_periodica": 1,
		"lixo_outra area": 0,
		"dependencia_diretoria": 1,
		"dependencia_professores": 1,
		"dependencia_secretaria": 1,
		"dependencia_laboratorio_informatica": 1,
		"dependencia_laboratorio_ciencias": 0,
		"dependencia_aee": 0,
		"dependencia_quadra_coberta": 0,
		"dependencia_quadra_descoberta": 0,
		"dependencia_cozinha": 1,
		"dependencia_biblioteca": 1,
		"dependencia_leitura": 0,
		"dependencia_parque_infantil": 0,
		"dependencia_bercario": 0,
		"dependencia_banheiro_fora": 0,
		"dependencia_banheiro_dentro": 1,
		"dependencia_banheiro_infantil": 0,
		"dependencia_banheiro_deficiencia": 0,
		"dependencia_vias_adequadas_deficiencia": 1,
		"dependencia_banheiro_chuveiro": 0,
		"dependencia_refeitorio": 0,
		"dependencia_despensa": 1,
		"dependencia_almoxarifado": 1,
		"dependencia_auditorio": 0,
		"dependencia_patio_coberto": 0,
		"dependencia_patio_descoberto": 0,
		"dependencia_alojamento_aluno": 0,
		"dependencia_alojamento_professor": 0,
		"dependencia_area_verde": 0,
		"dependencia_lavanderia": 0,
		"quantidade_salas_existentes": 9,
		"quantidade_salas_utilizadas_fora_e_dentro": 9,
		"equipamentos_televisao": 8,
		"equipamentos_videocassete": 1,
		"equipamentos_dvd": 9,
		"equipamentos_antena_parabolica": 0,
		"equipamentos_copiadora": 2,
		"equipamentos_retroprojetor": 0,
		"equipamentos_impressora": 0,
		"equipamentos_aparelho_som": 0,
		"equipamentos_projetor_multimidia": 0,
		"equipamentos_fax": 0,
		"equipamentos_maquina_fotografica": 0,
		"equipamentos_computadores": 0,
		"computadores_quantidade": 0,
		"computadores_qtd_administrativo": 0,
		"computadores_qtd_alunos": 0,
		"acesso_internet": 0,
		"banda_larga": 0,
		"total_funcionarios": 0,
		"brasil_alfabetizado": 0,
		"abre_finais_semana": 0,
		"modalidade_regular": 0,
		"modalidade_especial": 0,
		"modalidade_eja": 0,
		"regular_creche": 0,
		"regular_preescolar": 0,
		"regular_fundamental9": 0,
		"especial_fundamental9": 0,
		"especial_eja_fundamental": 0,
		"eja_fundamental": 0,
		"eja_projovem": 0
	}, {
		"inep_escola": 26127369,
		"codigo_escola": 3,
		"nome": "ESCOLA MUNICIPAL ARRAIAL NOVO DO BOM JESUS",
		"latitude": "-8,058692214",
		"longitude": "-34,93191297",
		"cep": 50640000,
		"endereco": "DO FORTE",
		"endereco_numero": 1340,
		"endereco_complemento": 0,
		"bairro_codigo": 701,
		"bairro": "TORROES",
		"telefone": 33554123,
		"fax": 33554598,
		"email": "ESCOLAARRAIALNOVO@HOTMAIL.COM",
		"orgao_regional": 2,
		"regulamentacao": 1,
		"funcionamento_predio_escolar": 1,
		"funcionamento_templo": 0,
		"funcionamento_empresa": 0,
		"funcionamento_outras_escolas": 0,
		"funcionamento_galpao": 0,
		"funcionamento_outros": 0,
		"forma_ocupacao": 1,
		"agua_rede_publica": 1,
		"agua_poco_artesiano": 0,
		"agua_cacimba": 0,
		"agua_fonte": 0,
		"esgoto_rede_publica": 1,
		"esgoto_fossa": 0,
		"esgoto_inexistente": 0,
		"lixo_coleta_periodica": 1,
		"lixo_outra area": 0,
		"dependencia_diretoria": 1,
		"dependencia_professores": 1,
		"dependencia_secretaria": 1,
		"dependencia_laboratorio_informatica": 1,
		"dependencia_laboratorio_ciencias": 0,
		"dependencia_aee": 0,
		"dependencia_quadra_coberta": 0,
		"dependencia_quadra_descoberta": 1,
		"dependencia_cozinha": 1,
		"dependencia_biblioteca": 1,
		"dependencia_leitura": 0,
		"dependencia_parque_infantil": 0,
		"dependencia_bercario": 0,
		"dependencia_banheiro_fora": 0,
		"dependencia_banheiro_dentro": 1,
		"dependencia_banheiro_infantil": 0,
		"dependencia_banheiro_deficiencia": 1,
		"dependencia_vias_adequadas_deficiencia": 0,
		"dependencia_banheiro_chuveiro": 0,
		"dependencia_refeitorio": 1,
		"dependencia_despensa": 0,
		"dependencia_almoxarifado": 1,
		"dependencia_auditorio": 0,
		"dependencia_patio_coberto": 0,
		"dependencia_patio_descoberto": 1,
		"dependencia_alojamento_aluno": 0,
		"dependencia_alojamento_professor": 0,
		"dependencia_area_verde": 0,
		"dependencia_lavanderia": 0,
		"quantidade_salas_existentes": 11,
		"quantidade_salas_utilizadas_fora_e_dentro": 11,
		"equipamentos_televisao": 2,
		"equipamentos_videocassete": 0,
		"equipamentos_dvd": 2,
		"equipamentos_antena_parabolica": 0,
		"equipamentos_copiadora": 1,
		"equipamentos_retroprojetor": 1,
		"equipamentos_impressora": 2,
		"equipamentos_aparelho_som": 4,
		"equipamentos_projetor_multimidia": 1,
		"equipamentos_fax": 1,
		"equipamentos_maquina_fotografica": 2,
		"equipamentos_computadores": 1,
		"computadores_quantidade": 16,
		"computadores_qtd_administrativo": 5,
		"computadores_qtd_alunos": 11,
		"acesso_internet": 1,
		"banda_larga": 1,
		"total_funcionarios": 77,
		"brasil_alfabetizado": 1,
		"abre_finais_semana": 1,
		"modalidade_regular": 1,
		"modalidade_especial": 0,
		"modalidade_eja": 1,
		"regular_creche": 0,
		"regular_preescolar": 0,
		"regular_fundamental9": 1,
		"especial_fundamental9": 0,
		"especial_eja_fundamental": 0,
		"eja_fundamental": 1,
		"eja_projovem": 0
	}];

	return {
		getEscolas: function(){
			var deferred = $q.defer();
			deferred.resolve(escolas);
			return deferred.promise;
		}
	}
}