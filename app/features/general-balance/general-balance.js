app.controller('GeneralBalanceController', 
  ['$scope', '$q', '$controller', '$timeout', 'notificationService', 'translateService', 'utilService',

  function($scope, $q, $controller, $timeout, notificationService, translateService, utilService) {
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
          var isLastItem = key == results.length - 1;

          utilService.getAccountData({ parentId: results[key]._id }, { key: results[key].key, isLast: isLastItem }).then(function(accounts) {
            var accountTotal = 0;
            angular.forEach(accounts, function(value, key) {
              //console.log(accounts[key]);
              //console.log(' ' + key + '==' + (accounts.length - 1) + ' && ' + accounts.extra.isLast);
              //console.log((key == accounts.length - 1) && accounts.extra.isLast);
              var isLastItem = (key == accounts.length - 1) && accounts.extra.isLast;
              utilService.getVoucherEntries({ key: accounts[key].key }, { key: accounts.extra.key, isLast: isLastItem }).then(function(movements) {
                angular.forEach(movements, function(value, key) {
                  if(isActiveAssetsAccount) {
                    if(!isNaN(movements[key].debits)) accountTotal -= parseFloat(movements[key].debits);
                    if(!isNaN(movements[key].credits)) accountTotal += parseFloat(movements[key].credits);
                    //console.log(movements[key].key + ' ' + movements[key].debits + ' ' + movements[key].credits + ' = ' + accountTotal);
                  } else {
                    if(!isNaN(movements[key].debits)) accountTotal += parseFloat(movements[key].debits);
                    if(!isNaN(movements[key].credits)) accountTotal -= parseFloat(movements[key].credits);
                    //console.log(movements[key].key + ' ' + movements[key].debits + ' ' + movements[key].credits + ' = ' + accountTotal);
                  }
                });
                //console.log(accountList);
                angular.forEach(accountList, function(value, key) {
                  if(movements.extra.key === accountList[key].key) {
                    accountList[key].total = accountTotal;
                    //console.log(movements.extra.key + ' ' + accountTotal);
                  }
                }); 
                if(movements.extra.isLast) {
                  angular.forEach(accountList, function(value, key) {
                    $timeout(function() {
                      $scope.generalBalance[totalVariable] += parseFloat(accountList[key].total);
                    }, 0);
                  });
                  defer.resolve(accountList);
                }
              });
            });
            if(accounts.length === 0 && accounts.extra.isLast) {
              //console.log("?")
              angular.forEach(accountList, function(value, key) {
                $timeout(function() {
                  $scope.generalBalance[totalVariable] += parseFloat(accountList[key].total);
                }, 0);
              });
              //console.log(accountList[1].total)
              //console.log(accountList[3].total)
              defer.resolve(accountList);
            }
          });
        });
      });
      return defer.promise;
    }

    $('.loading').fadeOut(200);
  }]
);