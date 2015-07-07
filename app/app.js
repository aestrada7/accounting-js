var app = angular.module('accountingJS', ['ui.router', 'xc.indexedDB']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $indexedDBProvider) {
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
	});
});

app.run(['$rootScope', function($rootScope) {
  $rootScope.$on('$stateChangeError', function(event, toState, fromState) {
  	console.log("error");
  	console.log(toState);
  });
  $rootScope.$on('$stateChangeSuccess', function(event, toState, fromState) {
  	console.log(toState);
  });
}]);

//This will be moved to its own file eventually
app.controller('AboutController', function($scope) {
	$scope.components = [{ name: 'node.js', kind: 'JS' },
										   { name: 'Angular.js', kind: 'JS' },
										   { name: 'nw.js', kind: 'JS' },
										   { name: 'jQuery', kind: 'JS' },
										   { name: 'SASS', kind: 'node' },
										   { name: 'CSS3', kind: 'CSS' },
										   { name: 'HTML5', kind: 'HTML' },
										   { name: 'Bower', kind: 'node' },
										   { name: 'Grunt', kind: 'node' },
										   { name: 'Git', kind: 'other'}];
	$scope.message = "About Message";
});