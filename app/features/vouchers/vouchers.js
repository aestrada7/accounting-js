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

    $scope.onEditVoucherClicked = function(item) {
      getVoucherEntries({voucherId: item._id}).then(function(results) {
        voucherModalService.show(item, results).then(function(result) {
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
        $scope.items = results;
        $(document).foundation();
      });
    }

    invalidateList();
  }]
);