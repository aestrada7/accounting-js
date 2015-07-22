var app = angular.module('accountingJS', ['ui.router', 'xc.indexedDB']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $indexedDBProvider) {
  $urlRouterProvider.otherwise('/404');
  //$locationProvider.html5Mode(true); //Needs a URL Rewrite, won't be added right now

  $stateProvider.state('home', {
    url: '/', //Needs to be an "/" if using HTML5 mode
    template: '<p>Main!</p>',
    pageTitle: 'Main'
  }).state('about', {
    url: '/about',
    templateUrl: 'features/about/about.html',
    controller: 'AboutController',
    pageTitle: 'About'
  }).state('playground', {
    url: '/playground',
    templateUrl: 'features/playground/playground.html',
    controller: 'PlaygroundController',
    pageTitle: 'Playground'
  }).state('404', {
    url: '/404',
    templateUrl: 'features/404/404.html',
    pageTitle: "404 Error"
  });
});

app.run(['$rootScope', function($rootScope) {
  $rootScope.$on('$stateChangeError', function(event, toState, fromState) {
    console.log("error");
    console.log(toState);
  });
  $rootScope.$on('$stateChangeSuccess', function(event, toState, fromState) {
    $rootScope.index = Object.create(null);
    $rootScope.index.title = toState.pageTitle;
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

//This will also be moved into its own file
app.controller('PlaygroundController', function($scope) {

});