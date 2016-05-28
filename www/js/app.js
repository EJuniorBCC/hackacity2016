angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives', 'starter.service', 'ngCordova'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
});
