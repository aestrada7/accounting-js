app.controller('AccountBalanceController', 
  ['$scope', '$q', 'notificationService', 'translateService',

  function($scope, $q, notificationService, translateService) {
    $scope.accountBalance = {
      accountName: '',
      accountKey: '',
      isValid: false,
      items: []
    }

    getAccountData = function(args) {
      var defer = $q.defer();
      accountsDB.find(args, function(err, results) {
        if(err) {
          defer.reject();
        }
        defer.resolve(results);
      });
      return defer.promise;
    }

    $scope.onChangeKey = function() {
      getAccountData({key: $scope.accountBalance.accountKey}).then(function(results) {
        if(results.length > 0) {
          $scope.accountBalance.accountName = translateService.translate(results[0].name);
          $scope.accountBalance.isValid = true;
        } else {
          $scope.accountBalance.isValid = false;
        }
      });
    }

    $scope.onChangeName = function() {
      var itemName = '';
      getAccountData().then(function(results) {
        angular.forEach(results, function(value, key) {
          if($scope.accountBalance.accountName === translateService.translate(results[key].name)) {
            itemName = results[key].name;
          }
        });
        if(itemName) {
          getAccountData({name: itemName}).then(function(results) {
            $scope.accountBalance.accountKey = results[0].key;
            $scope.accountBalance.isValid = true;
          });
        } else {
          $scope.accountBalance.isValid = false;
        }
      });

      $scope.getAccountMovements = function() {
        // mock data
        var accountMovements = [{
          accountKey: '1100',
          accountName: 'Test',
          credits: 0,
          debits: 200
        }, {
          accountKey: '1101',
          accountName: 'Test 2',
          credits: 200,
          debits: 0
        }];
        $scope.accountBalance.items = [];
        $scope.accountBalance.items.push({ month: 1, monthName: 'January', movements: accountMovements });
      }
    }

  }]
);