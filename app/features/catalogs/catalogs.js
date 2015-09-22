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

    getFullTree = function(catalog, rootCatalog, fullTree) {
      var parentCatalog;
      for(var i = 0; i < $scope.items.length; i++) {
        if(catalog.parentId == $scope.items[i]._id) {
          parentCatalog = $scope.items[i];
          var currentTree = fullTree ? parentCatalog._id + '-' + fullTree : parentCatalog._id;
          return getFullTree(parentCatalog, rootCatalog, currentTree);
          break;
        }
      }
      fullTree = !fullTree ? '' : fullTree + '-';
      return fullTree + rootCatalog._id;
    }

    getColor = function(_id) {
      var totalColors = 8; //list of $global-colors
      var itemColor = 1;
      try {
        var parsedId = parseInt(_id.replace(/\D/g, ''));
        if(isNaN(parsedId)) parsedId = 0;
        itemColor = (parsedId % totalColors) + 1;
      } catch(e) {}
      return itemColor;
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
          results[key].color = getColor(results[key]._id + '');
        });
        $scope.items = results;
        angular.forEach(results, function(value, key) {
          results[key].fullTree = getFullTree(results[key], results[key]);
        });
      });
    }

    invalidateList();
  }]
);