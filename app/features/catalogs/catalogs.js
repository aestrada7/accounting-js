app.controller('CatalogsController', 
  ['$scope', '$q', 'notificationService', 'translateService', 'accountModalService',

  function($scope, $q, notificationService, translateService, accountModalService) {
    $scope.catalogs = {
      selectedTab: 'general'
    };

    $scope.tabSelect = function(tabName) {
      $scope.catalogs.selectedTab = tabName;
    }

    $scope.onAddAccountClicked = function() {
      accountModalService.show();
    }

    $scope.onEditAccountClicked = function(item) {
      accountModalService.show(item);
    }

    fetchData = function(args) {
      var defer = $q.defer();
      accountsDB.find(args, function(err, results) {
        defer.resolve(results);
      });
      return defer.promise;
    }

    invalidateList = function() {
      fetchData({}).then(function(results) {
        angular.forEach(results, function(value, key) {
          results[key].name = translateService.translate(results[key].name);
        });
        $scope.items = results;
      });
    }

    invalidateList();
  }]
);