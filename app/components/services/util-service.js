app.provider('utilService', function() {
  this.$get = ['$q', '$timeout', 'translateService', function($q, $timeout, translateService) {

    var getParentAccount = function(args) {
      var defer = $q.defer();
      var parentAccount = [];
      getAccountData(args).then(function(results) {
        parentAccount = results[0];
        if(!results[0].parentId) {
          defer.resolve(parentAccount);
        } else {
          getAccountData({ _id: results[0].parentId }).then(function(results) {
            parentAccount = results[0];
            if(!results[0].parentId) {
              defer.resolve(parentAccount);
            } else {
              getAccountData({ _id: results[0].parentId }).then(function(results) {
                parentAccount = results[0];
                if(!results[0].parentId) {
                  defer.resolve(parentAccount);
                } else {
                  getAccountData({ _id: results[0].parentId }).then(function(results) {
                    parentAccount = results[0];
                    defer.resolve(parentAccount);
                  });
                }
              });
            }
          });
        }
      });
      return defer.promise;
    }

    var getAccountData = function(args, extraArguments) {
      var defer = $q.defer();
      accountsDB.find(args, function(err, results) {
        if(err) {
          defer.reject();
        }
        if(extraArguments) results.extra = extraArguments;
        defer.resolve(results);
      });
      return defer.promise;
    }

    var getVouchers = function(args, extraArguments) {
      var defer = $q.defer();
      vouchersDB.find(args, function(err, results) {
        if(err) {
          defer.reject();
        }
        if(extraArguments) results.extra = extraArguments;
        defer.resolve(results);
      });
      return defer.promise;
    }

    var getVoucherEntries = function(args, extraArguments) {
      var defer = $q.defer();
      voucherEntriesDB.find(args, function(err, results) {
        if(err) {
          defer.reject();
        }
        if(extraArguments) results.extra = extraArguments;
        defer.resolve(results);
      });
      return defer.promise;
    }

    var getMonthName = function(currentMonth) {
      var monthName = '';
      switch(currentMonth) {
        case 1:
          monthName = translateService.translate('global.months.january');
          break;
        case 2:
          monthName = translateService.translate('global.months.february');
          break;
        case 3:
          monthName = translateService.translate('global.months.march');
          break;
        case 4:
          monthName = translateService.translate('global.months.april');
          break;
        case 5:
          monthName = translateService.translate('global.months.may');
          break;
        case 6:
          monthName = translateService.translate('global.months.june');
          break;
        case 7:
          monthName = translateService.translate('global.months.july');
          break;
        case 8:
          monthName = translateService.translate('global.months.august');
          break;
        case 9:
          monthName = translateService.translate('global.months.september');
          break;
        case 10:
          monthName = translateService.translate('global.months.october');
          break;
        case 11:
          monthName = translateService.translate('global.months.november');
          break;
        case 12:
          monthName = translateService.translate('global.months.december');
          break;
      }
      return monthName;
    }

    var getChildAccountsValue = function(accountId, isActiveAssetsAccount, scopeInstance, totalVariable, voucherList, withTimeout) {
      var defer = $q.defer();
      var accountList = [];
      var timeoutInterval = withTimeout ? FADE_OUT_MILLISECONDS : 0;
      scopeInstance[totalVariable] = 0;
      if(!isNaN(accountId)) accountId = [accountId];
      getAccountData({ parentId: { $in: accountId } }).then(function(results) {
        if(results.length === 0) defer.resolve(accountList);
        angular.forEach(results, function(value, key) {
          var account = { name: translateService.translate(results[key].name), key: results[key].key, total: 0 };
          accountList.push(account);
          var isLastItem = key === results.length - 1;

          getAccountData({ parentId: results[key]._id }, { key: results[key].key, isLast: isLastItem }).then(function(accounts) {
            var accountTotal = 0;
            angular.forEach(accounts, function(value, key) {
              var hasStartingBalance;
              try {
                hasStartingBalance = parseFloat(accounts[key].balance);
                accountTotal += !isNaN(hasStartingBalance) ? hasStartingBalance : 0;
              } catch(e) {}
            });

            angular.forEach(accounts, function(value, key) {
              var isLastItem = (key === accounts.length - 1) && accounts.extra.isLast;

              getVoucherEntries({ key: accounts[key].key, voucherId: { $in: voucherList } }, 
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
                      scopeInstance[totalVariable] += parseFloat(accountList[key].total);
                    }, timeoutInterval);
                  });
                  defer.resolve(accountList);
                }
              });
            });

            if(accounts.length === 0 && accounts.extra.isLast) {
              angular.forEach(accountList, function(value, key) {
                $timeout(function() {
                  scopeInstance[totalVariable] += parseFloat(accountList[key].total);
                }, timeoutInterval);
              });
              defer.resolve(accountList);
            }
          });
        });
      });
      return defer.promise;
    }

    var incomeStatementGenerated = function() {
      //account id 157
      //income.db
      return true;
    }

    return {
      getParentAccount: getParentAccount,
      getAccountData: getAccountData,
      getVouchers: getVouchers,
      getVoucherEntries: getVoucherEntries,
      getMonthName: getMonthName,
      getChildAccountsValue: getChildAccountsValue,
      incomeStatementGenerated: incomeStatementGenerated
    };
  }]
});