app.controller('CatalogsController', 
  ['$scope', '$q', 'notificationService', 'translateService', 'accountModalService', 'confirmService',

  function($scope, $q, notificationService, translateService, accountModalService, confirmService) {
    $scope.catalogs = {
      selectedFilter: 'all',
      selectedFilterName: translateService.translate('features.catalogs.all'),
      level: undefined
    };

    $scope.tabSelect = function(tabName) {
      $scope.catalogs.selectedTab = tabName;
    }

    $scope.onAddAccountClicked = function() {
      accountModalService.show({}, $scope.items, $scope.catalogs.level).then(function(result) {
        invalidateList();
      });
    }

    $scope.onEditAccountClicked = function(item) {
      accountModalService.show(item, $scope.items, $scope.catalogs.level).then(function(result) {
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

    $scope.setSelectedFilter = function() {
      $scope.catalogs.selectedFilterName = translateService.translate('features.catalogs.' + $scope.catalogs.selectedFilter);

      switch($scope.catalogs.selectedFilter) {
        case 'all':
          $scope.catalogs.level = undefined;
          break;
        case 'general':
          $scope.catalogs.level = 1;
          break;
        case 'categories':
          $scope.catalogs.level = 2;
          break;
        case 'accounts':
          $scope.catalogs.level = 3;
          break;
        case 'sub-accounts':
          $scope.catalogs.level = 4;
          break;
      }
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