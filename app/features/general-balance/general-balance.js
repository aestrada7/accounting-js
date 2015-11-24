app.controller('GeneralBalanceController', 
  ['$scope', '$q', '$controller', 'notificationService', 'translateService', 'utilService',

  function($scope, $q, $controller, notificationService, translateService, utilService) {
    $scope.generalBalance = {
      floatingAssetsTotal: 0,
      propertiesTotal: 0,
      deferredAssetsTotal: 0,
      shortTermTotal: 0,
      longTermTotal: 0,
      activeAssetsTotal: 900,
      passiveAssetsTotal: 0,
      stockholdersAccountsTotal: 0,
      reportCreated: false
    }
    $scope.floatingAssetsAccounts = [];
    $scope.deferredAssetsAccounts = [];

    $scope.getBalance = function() {
      $('.loading').show();

      //Floating Assets
      getChildAccountsValue(3, true).then(function(results) {
        $scope.floatingAssetsAccounts = results;
        $scope.generalBalance.floatingAssetsTotal = 0;
        angular.forEach(results, function(value, key) {
          $scope.generalBalance.floatingAssetsTotal += parseFloat(results[key].total);
        });
      });

      //Deferred Assets
      getChildAccountsValue(14, true).then(function(results) {
        $scope.deferredAssetsAccounts = results;
        $scope.generalBalance.deferredAssetsTotal = 0;
        angular.forEach(results, function(value, key) {
          $scope.generalBalance.deferredAssetsTotal += parseFloat(results[key].total);
        });
      });

      $scope.generalBalance.reportCreated = true;
      $('.loading').fadeOut(200);
    }

    getChildAccountsValue = function(accountId, isActiveAssetsAccount) {
      var defer = $q.defer();
      var accountList = [];
      utilService.getAccountData({ parentId: accountId }).then(function(results) {
        angular.forEach(results, function(value, key) {
          var accountTotal = 0;
          utilService.getAccountData({ parentId: results[key]._id }, { key: results[key].key }).then(function(accounts) {
            angular.forEach(accounts, function(value, key) {
              utilService.getVoucherEntries({ key: accounts[key].key }, { key: accounts.extra.key }).then(function(movements) {
                angular.forEach(movements, function(value, key) {
                  if(isActiveAssetsAccount) {
                    if(!isNaN(movements[key].debits)) accountTotal += parseFloat(movements[key].debits);
                    if(!isNaN(movements[key].credits)) accountTotal -= parseFloat(movements[key].credits);
                  } else {
                    //To Do
                  }
                });
                angular.forEach(accountList, function(value, key) {
                  if(movements.extra.key === accountList[key].key) {
                    accountList[key].total = accountTotal;
                  }
                });
                defer.resolve(accountList);
              });
            });
          });
          var account = { name: translateService.translate(results[key].name), key: results[key].key, total: 0 };
          accountList.push(account);
        });
      });
      return defer.promise;
    }

    $('.loading').fadeOut(200);
  }]
);