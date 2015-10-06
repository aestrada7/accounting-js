app.controller('VouchersController', 
  ['$scope', '$q', 'notificationService', 'translateService', 'voucherModalService', 'confirmService',

  function($scope, $q, notificationService, translateService, voucherModalService, confirmService) {
    $scope.JRN = 1;
    $scope.CHQ = 2;
    $scope.DIS = 3;
    $scope.CSH = 4;

    $scope.vouchers = {
      textFilter: '',
      orderColumn: 'key',
      isReverse: false
    };

    $scope.onAddVoucherClicked = function(kind) {
      var item = {};
      item.kind = kind;
      voucherModalService.show(item).then(function(result) {
        invalidateList();
      }, function(reject) {
        invalidateList();
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