var os = require('os');
var app = angular.module('accountingJS', ['ui.router']);
window.os = os;
window.app = app;

//Routing
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 
  function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/404');
    var homeURL = '/';
    var emptyURL = '';

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
    }).state('account-balance', {
      url: '/account-balance',
      templateUrl: 'features/account-balance/account-balance.html',
      controller: 'AccountBalanceController',
      pageTitle: 'features.balance.account-balance.title'
    }).state('general-balance', {
      url: '/general-balance',
      templateUrl: 'features/general-balance/general-balance.html',
      controller: 'GeneralBalanceController',
      pageTitle: 'features.balance.general-balance.title'
    }).state('income-statement', {
      url: '/income-statement',
      templateUrl: 'features/income-statement/income-statement.html',
      controller: 'IncomeStatementController',
      pageTitle: 'features.income-statement.title'
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
      $('.loading').show();
    });

    dbStartUp(notificationService, translateService, confirmService);
    nwStartUp(translateService);
  }]

);