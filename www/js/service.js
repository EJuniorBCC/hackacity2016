angular
	.module('starter.service', [])
	.factory('serviceEscolas', serviceEscolas);

serviceEscolas.$inject = ['$q', '$http'];

function serviceEscolas($q, $http) {
	return {
		getEscolas: function(lat, long, raio, lab, modalidade, biblioteca) {
			var deferred = $q.defer();

			$http({
				url: 'http://64111d5d.ngrok.io/app/escolas/getescola',
				method: 'POST',
				data: {
					latitude: lat,
					longitude: long,
					raio: raio,
					laboratorio: lab,
					modalidade: modalidade,
					biblioteca: biblioteca
				}
			}).success(function(data) {
				deferred.resolve(data);
			}).error(function(error) {
				deferred.reject(error);
			});
			return deferred.promise;
		}
	}
}