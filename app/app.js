var app = angular.module('accountingJS', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
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
	$scope.message = "About Message";
});