app.controller('GeneralBalanceController', 
  ['$scope', '$q', '$controller', 'notificationService', 'translateService', 'utilService',

  function($scope, $q, $controller, notificationService, translateService, utilService) {
    $scope.generalBalance = {
      floatingAssetsTotal: 0,
      propertiesTotal: 0,
      deferredAssetsTotal: 0,
      shortTermTotal: 0,
      longTermTotal: 0,
      activeAssetsTotal: 0,
      passiveAssetsTotal: 0,
      stockholdersAccountsTotal: 0,
      reportCreated: false
    }
    $scope.floatingAssetsAccounts = [];
    $scope.propertiesAccounts = [];
    $scope.deferredAssetsAccounts = [];
    $scope.shortTermAccounts = [];
    $scope.longTermAccounts = [];

    $scope.getBalance = function() {
      $('.loading').show();

      //Floating Assets
      getChildAccountsValue(3, true, 'floatingAssetsTotal').then(function(results) {
        $scope.floatingAssetsAccounts = results;

        //Properties Assets
        return getChildAccountsValue(9, true, 'propertiesTotal');
      }).then(function(results) {
        $scope.propertiesAccounts = results;

        //Deferred Assets
        return getChildAccountsValue(14, true, 'deferredAssetsTotal');
      }).then(function(results) {
        $scope.deferredAssetsAccounts = results;
        $scope.generalBalance.activeAssetsTotal = $scope.generalBalance.floatingAssetsTotal +
                                                  $scope.generalBalance.propertiesTotal +
                                                  $scope.generalBalance.deferredAssetsTotal;

        //Short Term Passive Assets
        return getChildAccountsValue(15, false, 'shortTermTotal');
      }).then(function(results) {
        $scope.shortTermAccounts = results;

        //Long Term Passive Assets
        return getChildAccountsValue(16, false, 'longTermTotal');
      }).then(function(results) {
        $scope.longTermAccounts = results;

        $scope.generalBalance.reportCreated = true;
        $('.loading').fadeOut(200);
      });
    }

    getChildAccountsValue = function(accountId, isActiveAssetsAccount, totalVariable) {
      var defer = $q.defer();
      var accountList = [];
      $scope.generalBalance[totalVariable] = 0;
      utilService.getAccountData({ parentId: accountId }).then(function(results) {
        if(results.length === 0) defer.resolve(accountList);
        angular.forEach(results, function(value, key) {
          var account = { name: translateService.translate(results[key].name), key: results[key].key, total: 0 };
          accountList.push(account);

          utilService.getAccountData({ parentId: results[key]._id }, { key: results[key].key }).then(function(accounts) {
            angular.forEach(accounts, function(value, key) {
              utilService.getVoucherEntries({ key: accounts[key].key }, { key: accounts.extra.key }).then(function(movements) {
                var accountTotal = 0;
                angular.forEach(movements, function(value, key) {
                  if(isActiveAssetsAccount) {
                    if(!isNaN(movements[key].debits)) accountTotal += parseFloat(movements[key].debits);
                    if(!isNaN(movements[key].credits)) accountTotal -= parseFloat(movements[key].credits);
                  } else {
                    if(!isNaN(movements[key].debits)) accountTotal -= parseFloat(movements[key].debits);
                    if(!isNaN(movements[key].credits)) accountTotal += parseFloat(movements[key].credits);
                  }
                });
                angular.forEach(accountList, function(value, key) {
                  if(movements.extra.key === accountList[key].key) {
                    accountList[key].total = accountTotal;
                    $scope.generalBalance[totalVariable] += parseFloat(accountList[key].total);
                  }
                });
                defer.resolve(accountList);
              });
            });
            if(accounts.length === 0) defer.resolve(accountList);
          });
        });
      });
      return defer.promise;
    }

    $('.loading').fadeOut(200);
  }]
);