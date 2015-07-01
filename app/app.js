var accountingJS = angular.module('accountingJS', ['ui.router']);

accountingJS.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	$urlRouterProvider.otherwise('/404');
	$locationProvider.html5Mode(true);

	$stateProvider.state('home', {
		url: '/',
		template: '<p>Main!</p>'
	}).state('about', {
		url: '/about',
		templateUrl: 'features/about/about.html',
		controller: 'AboutController'
	}).state('404', {
		url: '/404',
		templateUrl: 'features/404/404.html'
	})
});

//This will be moved to its own file eventually
accountingJS.controller('AboutController', function($scope) {
	$scope.message = "About Message";
});