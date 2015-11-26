app.controller('AccountBalanceController', 
  ['$scope', '$q', '$controller', 'notificationService', 'translateService', 'utilService',

  function($scope, $q, $controller, notificationService, translateService, utilService) {
    $scope.accountBalance = {
      id: 0,
      accountName: '',
      accountKey: '',
      isValid: false,
      items: [],
      ready: false,
      startBalance: 0
    }
    $scope.noStartMonth = false;
    $scope.accountList = [];
    $scope.endBalance = 0;

    $scope.onChangeKey = function() {
      utilService.getAccountData({key: $scope.accountBalance.accountKey}).then(function(results) {
        if(results.length > 0) {
          $scope.accountBalance.accountName = translateService.translate(results[0].name);
          $scope.accountBalance.isValid = true;
          $scope.accountBalance.startBalance = parseInt(results[0].balance) || 0;
          $scope.accountList = [results[0].key];
          getAccountList(results[0]);
        } else {
          $scope.accountBalance.isValid = false;
        }
      });
      $scope.accountBalance.ready = false;
    }

    $scope.onChangeName = function() {
      var itemName = '';
      utilService.getAccountData().then(function(results) {
        $scope.accountBalance.startBalance = 0;
        angular.forEach(results, function(value, key) {
          if($scope.accountBalance.accountName === translateService.translate(results[key].name)) {
            itemName = results[key].name;
          }
        });
        if(itemName) {
          utilService.getAccountData({name: itemName}).then(function(results) {
            $scope.accountBalance.accountKey = results[0].key;
            $scope.accountBalance.isValid = true;
            $scope.accountBalance.startBalance = parseInt(results[0].balance) || 0;
            $scope.accountList = [results[0].key];
            getAccountList(results[0]);
          });
        } else {
          $scope.accountBalance.isValid = false;
        }
      });
      $scope.accountBalance.ready = false;
    }

    getAccountList = function(obj) {
      utilService.getAccountData({parentId: obj._id}).then(function(results) {
        if(results.length > 0) {
          angular.forEach(results, function(value, key) {
            $scope.accountBalance.startBalance += parseInt(results[key].balance) || 0;
            $scope.accountList.push(results[key].key);
            getAccountList(results[key]);
          });
        }
      });
    }

    $scope.getAccountMovements = function() {
      $('.loading').show();
      var startMonth = null;
      var startYear = null;
      var organizationScope = $scope.$new();
      $scope.endBalance = 0;
      $controller('OrganizationController', {$scope: organizationScope});
      $(window).on('organization.loaded', function() {
        startMonth = organizationScope.organization.startMonth;
        startYear = organizationScope.organization.exerciseYear;

        if(organizationScope.organization.businessName && startMonth && startYear) {
          for(var i = 0; i < 12; i++) {
            var currentMonth = parseInt(startMonth) + i;
            var currentYear = startYear;
            if(currentMonth > 12) {
              currentMonth -= 12;
              currentYear++;
            }
            var start = new Date(currentYear, currentMonth - 1, 1);
            var end = new Date(currentYear, currentMonth - 1, 1);
            end.setMonth(end.getMonth() + 1);

            utilService.getVouchers({date: {$gte: start, $lt: end}}, { month: currentMonth, 
                                                                       year: currentYear,
                                                                       index: i }).then(function(voucherResults) {
              var voucherList = [];
              var accountMovements = [];
              angular.forEach(voucherResults, function(value, key) {
                voucherList.push(voucherResults[key]._id);
              });
              utilService.getVoucherEntries({key: {$in: $scope.accountList}, voucherId: {$in: voucherList}}, 
                                            { month: voucherResults.extra.month,
                                              year: voucherResults.extra.year,
                                              index: voucherResults.extra.index }).then(function(results) {
                var balanceStart = (results.extra.index === 0) ? $scope.accountBalance.startBalance : $scope.balanceEnd;
                $scope.balanceEnd = balanceStart;
                angular.forEach(results, function(value, key) {
                  var accountMovement = {
                    accountKey: results[key].key,
                    debits: results[key].debits || 0,
                    credits: results[key].credits || 0
                  }
                  $scope.balanceEnd += parseInt(accountMovement.debits);
                  $scope.balanceEnd -= parseInt(accountMovement.credits);
                  accountMovements.push(accountMovement);
                });
                if(results.extra.index === 0) {
                  $scope.accountBalance.items = [];
                }

                $scope.accountBalance.items.push({
                  month: results.extra.month,
                  monthName: utilService.getMonthName(results.extra.month) + ' ' + results.extra.year,
                  movements: accountMovements,
                  startBalance: balanceStart,
                  endBalance: $scope.balanceEnd
                });

                if(results.extra.index === 11) {
                  $('.loading').fadeOut(200);
                  $scope.accountBalance.ready = true;
                }
              });
            });
          }
        } else {
          $scope.noStartMonth = true;
          $('.loading').fadeOut(200);
        }
      });
    }

    getVoucherEntries = function(args, month, year, index) {
      var defer = $q.defer();
      voucherEntriesDB.find(args, function(err, results) {
        results.month = month;
        results.year = year;
        results.index = index;
        defer.resolve(results);
      });
      return defer.promise;
    }

    getVouchers = function(args, month, year, index) {
      var defer = $q.defer();
      vouchersDB.find(args, function(err, results) {
        results.month = month;
        results.year = year;
        results.index = index;
        defer.resolve(results);
      });
      return defer.promise;
    }

    $('.loading').fadeOut(200);
  }]
);