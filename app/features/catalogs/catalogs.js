app.controller('CatalogsController', 
  ['$scope', '$q', 'notificationService', 'translateService', 'accountModalService', 'confirmService', 'utilService',

  function($scope, $q, notificationService, translateService, accountModalService, confirmService, utilService) {
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
      if(level) {
        item.level = level;
      }
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
      utilService.getAccountData({ parentId: item._id }).then(function(results) {
        if(results.length > 0) {
          errorText = translateService.translate('features.accounts.has-child-accounts');
          errorText = errorText.split('{{number}}').join(results.length);
          notificationService.show(errorText, 'alert', 'top right');
        } else {
          utilService.getVoucherEntries({ key: item.key }).then(function(entries) {
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

    $scope.onExpandClicked = function(item) {
      item.childrenCollapsed = false;
      changeItemVisibility(item, false);      
    }

    $scope.onCollapseClicked = function(item) {
      item.childrenCollapsed = true;
      changeItemVisibility(item, true);
    }

    changeItemVisibility = function(item, hide) {
      angular.forEach($scope.items, function(value, key) {
        if($scope.items[key].parentId === item._id) {
          $scope.items[key].hide = hide;
          changeItemVisibility($scope.items[key], hide);
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
      if(!zeroCount) {
        zeroCount = 3;
      }
      text = text.toString();
      while(text.length < zeroCount) {
        text = '0' + text;
      }
      return text;
    }

    getFullTree = function(catalog, rootCatalog, fullTree) {
      var parentCatalog;
      for(var i = 0; i < $scope.items.length; i++) {
        if(catalog.parentId === $scope.items[i]._id) {
          $scope.items[i].hasChildren = true;
          parentCatalog = $scope.items[i];
          var currentTree = fullTree ? addZero(parentCatalog._id) + '-' + fullTree : addZero(parentCatalog._id);
          return getFullTree(parentCatalog, rootCatalog, currentTree);
        }
      }
      fullTree = !fullTree ? '' : fullTree + '-';
      return fullTree + addZero(rootCatalog._id);
    }

    getColor = function(_id) {
      var totalColors = 8; //list of $global-colors
      var itemColor = 1;
      try {
        var parsedId = parseInt(_id.replace(/\D/g, ''));
        if(isNaN(parsedId)) {
          parsedId = 0;
        }
        itemColor = (parsedId % totalColors) + 1;
      } catch(e) {
        //do nothing
      }
      return itemColor;
    }

    invalidateList = function() {
      utilService.getAccountData({}).then(function(results) {
        angular.forEach(results, function(value, key) {
          results[key].name = translateService.translate(results[key].name);
          results[key].color = getColor(results[key]._id + '');
        });
        $scope.items = results;
        angular.forEach(results, function(value, key) {
          results[key].fullTree = getFullTree(results[key], results[key]);
        });
        $(window).trigger('catalogs.loaded');
        $('.loading').fadeOut(FADE_OUT_MILLISECONDS);
      });
    }

    invalidateList();
  }]
);