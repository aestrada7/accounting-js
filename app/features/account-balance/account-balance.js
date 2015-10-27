app.controller('AccountBalanceController', 
  ['$scope', '$q', '$controller', 'notificationService', 'translateService',

  function($scope, $q, $controller, notificationService, translateService) {
    $scope.accountBalance = {
      accountName: '',
      accountKey: '',
      isValid: false,
      items: [],
      ready: false
    }
    $scope.noStartMonth = false;

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
      $scope.accountBalance.ready = false;
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
      $scope.accountBalance.ready = false;
    }

    $scope.getAccountMovements = function() {
      $('.loading').show();
      var startMonth = null;
      var startYear = null;
      var organizationScope = $scope.$new();
      $controller('OrganizationController', {$scope: organizationScope});
      $(window).on('organization.loaded', function() {
        startMonth = organizationScope.organization.startMonth;
        startYear = organizationScope.organization.exerciseYear;
        startYear = 2015;

        if(organizationScope.organization.businessName && startMonth && startYear) {
          $scope.accountBalance.items = [];

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

            getVouchers({date: {$gte: start, $lt: end}}, currentMonth).then(function(voucherResults) {
              var voucherList = [];
              var accountMovements = [];
              angular.forEach(voucherResults, function(value, key) {
                voucherList.push(voucherResults[key]._id);
              });
              getVoucherEntries({key: $scope.accountBalance.accountKey, voucherId: {$in: voucherList}}, voucherResults.month).then(function(results) {
                angular.forEach(results, function(value, key) {
                  var accountMovement = {
                    voucherKey: 'key goes here',//todo: real key must go here
                    debits: results[key].debits || 0,
                    credits: results[key].credits || 0
                  }
                  accountMovements.push(accountMovement);
                });
                $scope.accountBalance.items.push({ month: results.month, monthName: getMonthName(results.month), movements: accountMovements });

                if(i === 12) {
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

    getVoucherEntries = function(args, month) {
      var defer = $q.defer();
      voucherEntriesDB.find(args, function(err, results) {
        results.month = month;
        defer.resolve(results);
      });
      return defer.promise;
    }

    getVouchers = function(args, month) {
      var defer = $q.defer();
      vouchersDB.find(args, function(err, results) {
        results.month = month;
        defer.resolve(results);
      });
      return defer.promise;
    }

    getMonthName = function(currentMonth) {
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

    $('.loading').fadeOut(200);
  }]
);