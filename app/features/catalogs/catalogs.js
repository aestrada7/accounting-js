app.controller('CatalogsController', 
  ['$scope', '$q', 'notificationService', 'translateService', 'accountModalService', 'confirmService',

  function($scope, $q, notificationService, translateService, accountModalService, confirmService) {
    $scope.menuVisible = false;
    $scope.catalogs = {
      selectedFilter: 'all',
      selectedFilterName: translateService.translate('features.accounts.all.title'),
      level: undefined
    };

    $scope.tabSelect = function(tabName) {
      $scope.catalogs.selectedTab = tabName;
    }

    $scope.onAddAccountWithMenuClicked = function() {
      $scope.menuVisible = !$scope.menuVisible;
    }

    $scope.onAddAccountClicked = function(level) {
      $scope.menuVisible = false;
      var item = {};
      item.level = $scope.catalogs.level;
      if(level) item.level = level;
      accountModalService.show(item, $scope.items).then(function(result) {
        invalidateList();
      }, function(reject) {
        invalidateList();
      });
    }

    $scope.onAddChildClicked = function(item) {
      accountModalService.show({parentId: item._id, level: item.level + 1}, $scope.items).then(function(result) {
        invalidateList();
      }, function(reject) {
        invalidateList();
      });
    }

    $scope.onEditAccountClicked = function(item) {
      accountModalService.show(item, $scope.items, $scope.catalogs.level).then(function(result) {
        invalidateList();
      }, function(reject) {
        invalidateList();
      });
    }

    $scope.onDeleteAccountClicked = function(item) {
      var errorText = '';
      fetchData({ parentId: item._id }).then(function(results) {
        if(results.length > 0) {
          errorText = translateService.translate('features.accounts.has-child-accounts');
          errorText = errorText.split('{{number}}').join(results.length);
          notificationService.show(errorText, 'alert', 'top right');
        } else {
          fetchVoucherEntriesData({ key: item.key }).then(function(entries) {
            if(entries.length > 0) {
              errorText = translateService.translate('features.accounts.is-in-use-vouchers');
              errorText = errorText.split('{{number}}').join(entries.length);
              notificationService.show(errorText, 'alert', 'top right');
            } else {
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
                  notificationService.show('global.notifications.deleted-successfully', 'success', 'top right');
                });
              }, function(result) {
                //delete was cancelled
              });
            }
          });
        }
      });
    }

    $scope.setSelectedFilter = function() {
      $scope.catalogs.selectedFilterName = translateService.translate('features.accounts.' + $scope.catalogs.selectedFilter + '.title');

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

    addZero = function(text, zeroCount) {
      text = text.toString();
      while(text.length < zeroCount) {
        text = '0' + text;
      }
      return text;
    }

    getFullTree = function(catalog, rootCatalog, fullTree) {
      var parentCatalog;
      for(var i = 0; i < $scope.items.length; i++) {
        if(catalog.parentId == $scope.items[i]._id) {
          parentCatalog = $scope.items[i];
          var currentTree = fullTree ? addZero(parentCatalog._id, 3) + '-' + fullTree : addZero(parentCatalog._id, 3);
          return getFullTree(parentCatalog, rootCatalog, currentTree);
          break;
        }
      }
      fullTree = !fullTree ? '' : fullTree + '-';
      return fullTree + addZero(rootCatalog._id, 3);
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

    fetchVoucherEntriesData = function(args) {
      var defer = $q.defer();
      voucherEntriesDB.find(args, function(err, results) {
        defer.resolve(results);
      });
      return defer.promise;      
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
        $(window).trigger('catalogs.loaded');
        $(document).foundation();
      });
    }

    invalidateList();
  }]
);