app.controller('VouchersController', 
  ['$scope', '$q', 'notificationService', 'translateService', 'voucherModalService', 'confirmService',

  function($scope, $q, notificationService, translateService, voucherModalService, confirmService) {
    $scope.JRN = 1;
    $scope.CHQ = 2;
    $scope.DIS = 3;
    $scope.CSH = 4;
    $scope.menuVisible = false;

    $scope.vouchers = {
      textFilter: '',
      orderColumn: 'key',
      isReverse: false
    };

    $scope.onAddVoucherWithMenuClicked = function() {
      $scope.menuVisible = !$scope.menuVisible;
    }

    $scope.onAddVoucherClicked = function(kind) {
      $scope.menuVisible = false;
      var item = {};
      item.kind = kind;
      voucherModalService.show(item).then(function(result) {
        invalidateList();
      }, function(reject) {
        invalidateList();
      });
    }

    getVoucherEntries = function(args) {
      var defer = $q.defer();
      voucherEntriesDB.find(args, function(err, results) {
        defer.resolve(results);
      });
      return defer.promise;
    }

    getKindText = function(kind) {
      switch(kind) {
        case $scope.JRN:
          return translateService.translate('features.vouchers.journal.short-title');
          break;
        case $scope.CHQ:
          return translateService.translate('features.vouchers.cheques.short-title');
          break;
        case $scope.DIS:
          return translateService.translate('features.vouchers.disimbursement.short-title');
          break;
        case $scope.CSH:
          return translateService.translate('features.vouchers.cash-receipt.short-title');
          break;
      }
    }

    $scope.onEditVoucherClicked = function(item) {
      getVoucherEntries({voucherId: item._id}).then(function(results) {
        voucherModalService.show(item, results).then(function(result) {
          invalidateList();
        }, function(reject) {
          invalidateList();
        });
      });
    }

    $scope.setOrderColumn = function(column) {
      if($scope.vouchers.orderColumn === column) {
        $scope.vouchers.isReverse = !$scope.vouchers.isReverse;
      }
      $scope.vouchers.orderColumn = column;
    }

    fetchData = function(args) {
      var defer = $q.defer();
      vouchersDB.find(args, function(err, results) {
        defer.resolve(results);
      });
      return defer.promise;
    }

    invalidateList = function() {
      fetchData({}).then(function(results) {
        angular.forEach(results, function(value, key) {
          results[key].kindText = getKindText(results[key].kind);
          results[key].credits = 0;
          results[key].debits = 0;
          if(!results[key].description) results[key].description = '-';
          getVoucherEntries({voucherId: results[key]._id}).then(function(itemList) {
            angular.forEach(itemList, function(itemValue, itemKey) {
              if(itemList[itemKey].credits) {
                results[key].credits += parseFloat(itemList[itemKey].credits);
              }
              if(itemList[itemKey].debits) {
                results[key].debits += parseFloat(itemList[itemKey].debits);
              }
            });
          });
        });
        $scope.items = results;
      });
    }

    invalidateList();
  }]
);