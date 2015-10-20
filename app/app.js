var os = require('os');
var app = angular.module('accountingJS', ['ui.router']);

//Routing
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 
  function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/404');

    //Linux/Mac
    if(os.platform() === 'linux' || os.platform() === 'darwin') {
      homeURL = '';
      emptyURL = '/';
    }
    //Windows
    if(os.platform() === 'win32') {
      homeURL = '/';
      emptyURL = '';
    }

    $stateProvider.state('home', {
      url: homeURL,
      templateUrl: 'features/home/home.html',
      controller: 'HomeController',
      pageTitle: 'features.home.title'
    }).state('empty', {
      url: emptyURL,
      templateUrl: 'features/home/home.html',
      controller: 'HomeController',
      pageTitle: 'features.home.title'
    }).state('about', {
      url: '/about',
      templateUrl: 'features/about/about.html',
      controller: 'AboutController',
      pageTitle: 'features.about.title'
    }).state('catalogs', {
      url: '/catalogs',
      templateUrl: 'features/catalogs/catalogs.html',
      controller: 'CatalogsController',
      pageTitle: 'features.accounts.title'
    }).state('vouchers', {
      url: '/vouchers',
      templateUrl: 'features/vouchers/vouchers.html',
      controller: 'VouchersController',
      pageTitle: 'features.vouchers.title'
    }).state('playground', {
      url: '/playground',
      templateUrl: 'features/playground/playground.html',
      controller: 'PlaygroundController',
      pageTitle: 'features.playground.title'
    }).state('organization', {
      url: '/organization',
      templateUrl: 'features/organization/organization.html',
      controller: 'OrganizationController',
      pageTitle: 'features.organization.title'
    }).state('dev', {
      url: '/dev',
      templateUrl: 'dev/dev.html',
      pageTitle: 'Dev'
    }).state('404', {
      url: '/404',
      templateUrl: 'features/404/404.html',
      pageTitle: 'features.404.title'
    });
  }]
);

app.run(['$rootScope', 'translateService', 'notificationService', 'confirmService', 

  function($rootScope, translateService, notificationService, confirmService) {
    $rootScope.$on('$stateChangeError', function(event, toState, fromState) {
      console.log('error');
      console.log(toState);
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, fromState) {
      $rootScope.index = Object.create(null);
      $rootScope.index.title = translateService.translate(toState.pageTitle) + ' - AccountingJS';
    });

    dbStartUp(notificationService, translateService, confirmService);
    nwStartUp(translateService);
  }]

);