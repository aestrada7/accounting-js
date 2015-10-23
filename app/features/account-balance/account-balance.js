app.controller('AccountBalanceController', 
  ['$scope', '$q', 'notificationService', 'translateService',

  function($scope, $q, notificationService, translateService) {
    $scope.accountBalance = {
      accountName: '',
      accountKey: ''
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
          });
        }
      });
    }

  }]
);