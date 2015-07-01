var accountingJS = angular.module('accountingJS', ['ui.router']);

accountingJS.config(function($stateProvider, $urlRouterProvider) {
	//$urlRouterProvider.otherwise('/404');

	$stateProvider.state('about', {
		url: '/about',
		templateUrl: 'features/about/about.html',
		controller: 'AboutController'
	}).state('404', {
		url: '/404',
		templateUrl: 'features/404/404.html'
	})
});

accountingJS.controller('AboutController', function($scope) {
	$scope.message = "About Message";
});