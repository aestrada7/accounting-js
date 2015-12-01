app.controller('GeneralBalanceController', 
  ['$scope', '$q', '$controller', '$timeout', 'notificationService', 'translateService', 'utilService',

  function($scope, $q, $controller, $timeout, notificationService, translateService, utilService) {
    $scope.generalBalance = {
      floatingAssetsTotal: 0,
      propertiesTotal: 0,
      deferredAssetsTotal: 0,
      shortTermTotal: 0,
      longTermTotal: 0,
      contributedCapitalTotal: 0,
      earnedCapitalTotal: 0,
      activeAssetsTotal: 0,
      passiveAssetsTotal: 0,
      stockholdersAssetsTotal: 0,
      passivePlusCapitalAssetsTotal: 0,
      reportCreated: false
    }
    $scope.floatingAssetsAccounts = [];
    $scope.propertiesAccounts = [];
    $scope.deferredAssetsAccounts = [];
    $scope.shortTermAccounts = [];
    $scope.longTermAccounts = [];
    $scope.contributedCapitalAccounts = [];
    $scope.earnedCapitalAccounts = [];
    $scope.noStartMonth = false;
    $scope.hasOrganization = false;
    $scope.businessName = '';
    var startDate = new Date();
    var endDate = new Date();
    var voucherList = [];

    $scope.getBalance = function() {
      $('.loading').show();
      if($scope.hasOrganization) {
        utilService.getVouchers({ date: { $gte: startDate, $lt: endDate } }).then(function(voucherResults) {
          voucherList = [];
          angular.forEach(voucherResults, function(value, key) {
            voucherList.push(voucherResults[key]._id);
          });

          //Floating Assets
          return getChildAccountsValue(3, true, 'floatingAssetsTotal');
        }).then(function(results) {
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

          $scope.generalBalance.passiveAssetsTotal = $scope.generalBalance.shortTermTotal + $scope.generalBalance.longTermTotal;

          //Contributed Capital
          return getChildAccountsValue(38, false, 'contributedCapitalTotal');
        }).then(function(results) {
          $scope.contributedCapitalAccounts = results;

          //Earned Capital
          return getChildAccountsValue(41, false, 'earnedCapitalTotal');        
        }).then(function(results) {
          $scope.earnedCapitalAccounts = results;

          $timeout(function() {
            $scope.generalBalance.stockholdersAssetsTotal = $scope.generalBalance.contributedCapitalTotal +
                                                            $scope.generalBalance.earnedCapitalTotal;
            $scope.generalBalance.passivePlusCapitalAssetsTotal = $scope.generalBalance.passiveAssetsTotal +
                                                                  $scope.generalBalance.stockholdersAssetsTotal;

            $scope.generalBalance.reportCreated = true;
            $('.loading').fadeOut(200);
          }, 200);
        });
      } else {
        $scope.noStartMonth = true;
        $('.loading').fadeOut(200);
      }
    }

    $scope.getExerciseDate = function() {
      var start = utilService.getMonthName(startDate.getMonth() + 1) + ' ' + startDate.getFullYear();
      var end = utilService.getMonthName(endDate.getMonth() + 1) + ' ' + endDate.getFullYear();
      return start + ' - ' + end;
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
              var hasStartingBalance;
              try {
                hasStartingBalance = parseFloat(accounts[key].balance);
                accountTotal += !isNaN(hasStartingBalance) ? hasStartingBalance : 0;
              } catch(e) {}
            });

            angular.forEach(accounts, function(value, key) {
              var isLastItem = (key == accounts.length - 1) && accounts.extra.isLast;

              utilService.getVoucherEntries({ key: accounts[key].key, voucherId: { $in: voucherList } }, 
                                            { key: accounts.extra.key, isLast: isLastItem }).then(function(movements) {
                angular.forEach(movements, function(value, key) {
                  movements[key].debits = parseFloat(movements[key].debits);
                  movements[key].credits = parseFloat(movements[key].credits);
                  if(isActiveAssetsAccount) {
                    accountTotal += !isNaN(movements[key].debits) ? movements[key].debits : 0;
                    accountTotal -= !isNaN(movements[key].credits) ? movements[key].credits : 0;
                  } else {
                    accountTotal -= !isNaN(movements[key].debits) ? movements[key].debits : 0;
                    accountTotal += !isNaN(movements[key].credits) ? movements[key].credits : 0;
                  }
                });

                angular.forEach(accountList, function(value, key) {
                  if(movements.extra.key === accountList[key].key) {
                    accountList[key].total = accountTotal;
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
              angular.forEach(accountList, function(value, key) {
                $timeout(function() {
                  $scope.generalBalance[totalVariable] += parseFloat(accountList[key].total);
                }, 0);
              });
              defer.resolve(accountList);
            }
          });
        });
      });
      return defer.promise;
    }

    scopeStart = function() {
      var organizationScope = $scope.$new();
      var startYear = 0;
      var startMonth = 0;
      $controller('OrganizationController', {$scope: organizationScope});
      $(window).on('organization.loaded', function() {
        startMonth = organizationScope.organization.startMonth;
        startYear = organizationScope.organization.exerciseYear;
        $scope.hasOrganization = organizationScope.organization.businessName && startMonth && startYear;
        $scope.businessName = organizationScope.organization.businessName;
        startDate = new Date(startYear, startMonth - 1, 1);
        endDate = new Date(startYear, startMonth - 1, 1);
        endDate.setMonth(endDate.getMonth() + 12);
        $('.loading').fadeOut(200);
      });
    }

    scopeStart();
  }]
);