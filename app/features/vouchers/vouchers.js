app.controller('VouchersController', 
  ['$scope', '$q', 'notificationService', 'translateService', 'voucherModalService', 'confirmService', 'utilService',

  function($scope, $q, notificationService, translateService, voucherModalService, confirmService, utilService) {
    $scope.JRN = 1;
    $scope.CHQ = 2;
    $scope.DIS = 3;
    $scope.CSH = 4;
    $scope.menuVisible = false;

    $scope.vouchers = {
      textFilter: '',
      selectedFilter: 'all',
      selectedFilterName: translateService.translate('features.vouchers.all.short-title'),
      orderColumn: 'key',
      isReverse: false,
      kind: undefined
    };

    $scope.onAddVoucherWithMenuClicked = function() {
      $scope.menuVisible = !$scope.menuVisible;
    }

    $scope.onAddVoucherClicked = function(kind) {
      $scope.menuVisible = false;
      var item = {};
      item.kind = $scope.vouchers.kind;
      if(kind) {
        item.kind = kind;
      }
      voucherModalService.show(item).then(function(result) {
        invalidateList();
      }, function(reject) {
        invalidateList();
      });
    }

    $scope.setSelectedFilter = function() {
      $scope.vouchers.selectedFilterName = translateService.translate('features.vouchers.' + $scope.vouchers.selectedFilter + '.short-title');

      switch($scope.vouchers.selectedFilter) {
        case 'all':
          $scope.vouchers.kind = undefined;
          break;
        case 'journal':
          $scope.vouchers.kind = 1;
          break;
        case 'cheques':
          $scope.vouchers.kind = 2;
          break;
        case 'disimbursement':
          $scope.vouchers.kind = 3;
          break;
        case 'cash-receipt':
          $scope.vouchers.kind = 4;
          break;
      }
    }

    getKindText = function(kind) {
      var textKind = '';
      switch(kind) {
        case $scope.JRN:
          textKind = translateService.translate('features.vouchers.journal.short-title');
          break;
        case $scope.CHQ:
          textKind = translateService.translate('features.vouchers.cheques.short-title');
          break;
        case $scope.DIS:
          textKind = translateService.translate('features.vouchers.disimbursement.short-title');
          break;
        case $scope.CSH:
          textKind = translateService.translate('features.vouchers.cash-receipt.short-title');
          break;
      }

      return textKind;
    }

    $scope.onEditVoucherClicked = function(item) {
      utilService.getVoucherEntries({voucherId: item._id}).then(function(results) {
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

    invalidateList = function() {
      utilService.getVouchers({}).then(function(results) {
        angular.forEach(results, function(value, key) {
          results[key].kindText = getKindText(results[key].kind);
          results[key].credits = 0;
          results[key].debits = 0;
          if(!results[key].description) {
            results[key].description = '-';
          }

          utilService.getVoucherEntries({voucherId: results[key]._id}).then(function(itemList) {
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
        $(window).trigger('vouchers.loaded');
        $('.loading').fadeOut(FADE_OUT_MILLISECONDS);
      });
    }

    invalidateList();
  }]
);