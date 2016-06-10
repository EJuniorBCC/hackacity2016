angular
	.module('ondeestudar.escola')
	.controller('EscolaController', EscolaController);


EscolaController.$inject = ['$scope', '$state', '$stateParams'];

function EscolaController($scope, $state, $stateParams) {

	console.log($stateParams);

}