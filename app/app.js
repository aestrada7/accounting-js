var app = angular.module('accountingJS', ['ui.router', 'xc.indexedDB']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $indexedDBProvider) {
  //Routing
  $urlRouterProvider.otherwise('/404');
  //$locationProvider.html5Mode(true); //Needs a URL Rewrite, won't be added right now

  $stateProvider.state('home', {
    url: '/', //Needs to be an "/" if using HTML5 mode
    template: '<p>Main!</p>',
    pageTitle: translate('features.main.title')
  }).state('about', {
    url: '/about',
    templateUrl: 'features/about/about.html',
    controller: 'AboutController',
    pageTitle: translate('features.about.title')
  }).state('playground', {
    url: '/playground',
    templateUrl: 'features/playground/playground.html',
    controller: 'PlaygroundController',
    pageTitle: translate('features.playground.title')
  }).state('404', {
    url: '/404',
    templateUrl: 'features/404/404.html',
    pageTitle: translate('features.404.title')
  });

  //DB Schema
  $indexedDBProvider.connection('accountingDB').upgradeDatabase(1, function(event, db, tx) {
    var objStore = db.createObjectStore('playground-items', {keyPath: 'id'});
    objStore.createIndex('name_idx', 'name', {unique: false});
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
app.controller('AboutController', ["$scope", function($scope) {
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
}]);

//This will also be moved into its own file
app.controller('PlaygroundController', ["$scope", "$indexedDB", function($scope, $indexedDB) {
  var OBJECT_STORE_NAME = 'playground-items';
  var myObjectStore = $indexedDB.objectStore(OBJECT_STORE_NAME);

  $scope.addingLeftItem = false;

  $scope.onAddItemClicked = function() {
    $('#new-item-left').val("");
    $scope.addingLeftItem = true;
  }

  $scope.onCancelAddItemClicked = function() {
    $scope.addingLeftItem = false;
  }

  $scope.onConfirmAddItemClicked = function() {
    $scope.addingLeftItem = false;
    myObjectStore.insert({ "id": Math.random(), "name": $('#new-item-left').val() }).then(function(e) {
      invalidateList();
    });
  }

  $scope.onEditItemClicked = function(id) {
    myObjectStore.find(id).then(function(result) {
      $scope.addingLeftItem = true;
      $('#new-item-left').val(result.name);
    });
  }

  $scope.onDeleteItemClicked = function(id) {
    myObjectStore.delete(id).then(function(e) {
      invalidateList();
    });
  }

  invalidateList = function() {
    myObjectStore.getAll().then(function(results) {
      $scope.items = results;
    });
  }

  invalidateList();
}]);