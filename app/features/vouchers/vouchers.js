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
        //mock data below, remove later
        $scope.items = [
          { _id: 1, date: '1/1/2015', kind: '1', key: '1', description: 'whatever' },
          { _id: 2, date: '1/2/2015', kind: '1', key: '2', description: 'some text' },
          { _id: 3, date: '1/12/2015', kind: '1', key: '3', description: 'some other text' },
          { _id: 4, date: '1/19/2015', kind: '1', key: '4', description: 'dunno' },
          { _id: 5, date: '1/20/2015', kind: '1', key: '5', description: 'zzzz' },
          { _id: 6, date: '1/21/2015', kind: '1', key: '6', description: 'lol' },
          { _id: 7, date: '1/22/2015', kind: '1', key: '7', description: 'haha' },
          { _id: 8, date: '1/23/2015', kind: '1', key: '8', description: 'nice1' },
          { _id: 9, date: '1/26/2015', kind: '1', key: '9', description: 'yo' },
          { _id: 10, date: '1/31/2015', kind: '1', key: '10', description: ':|' },
          { _id: 11, date: '1/31/2015', kind: '1', key: '11', description: 'oops' }
        ];
        $(document).foundation();
      });
    }

    invalidateList();
  }]
);