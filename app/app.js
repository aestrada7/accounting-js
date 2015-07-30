var app = angular.module('accountingJS', ['ui.router', 'xc.indexedDB']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $indexedDBProvider) {
  $urlRouterProvider.otherwise('/404');
  //$locationProvider.html5Mode(true); //Needs a URL Rewrite, won't be added right now

  $stateProvider.state('home', {
    url: '/', //Needs to be an "/" if using HTML5 mode
    templateUrl: 'features/home/home.html',
    pageTitle: 'features.home.title'
  }).state('about', {
    url: '/about',
    templateUrl: 'features/about/about.html',
    controller: 'AboutController',
    pageTitle: 'features.about.title'
  }).state('playground', {
    url: '/playground',
    templateUrl: 'features/playground/playground.html',
    controller: 'PlaygroundController',
    pageTitle: 'features.playground.title'
  }).state('404', {
    url: '/404',
    templateUrl: 'features/404/404.html',
    pageTitle: 'features.404.title'
  });
});

app.run(['$rootScope', 'translateService', 

  function($rootScope, translateService) {
    $rootScope.$on('$stateChangeError', function(event, toState, fromState) {
      console.log("error");
      console.log(toState);
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, fromState) {
      $rootScope.index = Object.create(null);
      $rootScope.index.title = translateService.translate(toState.pageTitle);
    });
  }]

);