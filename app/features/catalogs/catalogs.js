app.controller('CatalogsController', 
  ['$scope', '$q', 'notificationService', 'translateService', 'accountModalService', 'confirmService',

  function($scope, $q, notificationService, translateService, accountModalService, confirmService) {
    $scope.catalogs = {
      selectedTab: 'general'
    };

    $scope.tabSelect = function(tabName) {
      $scope.catalogs.selectedTab = tabName;
    }

    $scope.onAddAccountClicked = function() {
      accountModalService.show({}, $scope.items).then(function(result) {
        invalidateList();
      });
    }

    $scope.onEditAccountClicked = function(item) {
      accountModalService.show(item, $scope.items).then(function(result) {
        invalidateList();
      });
    }

    $scope.onDeleteAccountClicked = function(item) {
      var confirmOptions = {
        label: 'features.accounts.confirm-delete',
        icon: 'fi-trash',
        kind: 'alert',
        cancelLabel: 'global.cancel',
        confirmLabel: 'global.delete'
      }

      confirmService.show(confirmOptions).then(function(result) {
        accountsDB.remove({ _id: item._id }, function(err, totalRemoved) {
          invalidateList();
        });
      }, function(result) {
        //delete was cancelled
      });
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