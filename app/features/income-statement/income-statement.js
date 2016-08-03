app.controller('IncomeStatementController', 
  ['$scope', '$q', '$controller', '$timeout', 'notificationService', 'utilService',

  function($scope, $q, $controller, $timeout, notificationService, utilService) {
    $scope.incomeStatement = {
      netSales: 0,
      costOfSale: 0,
      operativeExpenses: 0,
      financingCost: 0,
      grossIncome: 0,
      operativeIncome: 0,
      incomeBeforeTaxes: 0,
      incomeTaxes: 0,
      profitShare: 0,
      taxes: 0,
      netIncome: 0
    }
    $scope.hasOrganization = false;
    $scope.businessName = '';
    $scope.noStartMonth = false;
    $scope.statementGenerated = false;
    var startDate = new Date();
    var endDate = new Date();
    var voucherList = [];

    var incomeChildAccounts = [];
    var costOfSalesAccounts = [];
    var expensesAccounts = [];
    var financingCostAccounts = [];
    var taxesAccounts = [];

    var INCOME_TAXES_PERCENTAGE = 0.3;
    var PROFIT_SHARE_PERCENTAGE = 0.1;

    $scope.getStatement = function() {
      $('.loading').show();
      if($scope.hasOrganization) {
        utilService.getVouchers({ date: { $gte: startDate, $lt: endDate } }).then(function(voucherResults) {
          voucherList = [];
          angular.forEach(voucherResults, function(value, key) {
            voucherList.push(voucherResults[key]._id);
          });

          //Income
          return utilService.getAccountData({ parentId: 45 });
        }).then(function(results) {
          angular.forEach(results, function(value, key) {
            incomeChildAccounts.push(results[key]._id);
          });

          //Cost of Sales
          return utilService.getAccountData({ parentId: 51 });
        }).then(function(results) {
          angular.forEach(results, function(value, key) {
            costOfSalesAccounts.push(results[key]._id);
          });

          //Expenses
          var EXPENSES_ADMINISTRATION_ID = 57;
          var EXPENSES_SALES_ID = 93
          return utilService.getAccountData({ parentId: { $in: [EXPENSES_ADMINISTRATION_ID, EXPENSES_SALES_ID] } });
        }).then(function(results) {
          angular.forEach(results, function(value, key) {
            expensesAccounts.push(results[key]._id);
          });

          //Financing Cost
          return utilService.getAccountData({ parentId: 129 });
        }).then(function(results) {
          angular.forEach(results, function(value, key) {
            financingCostAccounts.push(results[key]._id);
          });

        }).then(function(results) {
          //Income
          return utilService.getChildAccountsValue(incomeChildAccounts, false, $scope.incomeStatement, 'netSales', voucherList, true);
        }).then(function(results) {
          //Cost of Sales
          return utilService.getChildAccountsValue(costOfSalesAccounts, false, $scope.incomeStatement, 'costOfSale', voucherList, true);
        }).then(function(results) {
          //Expenses
          return utilService.getChildAccountsValue(expensesAccounts, false, $scope.incomeStatement, 'operativeExpenses', voucherList, true);
        }).then(function(results) {
          //Financing Cost
          return utilService.getChildAccountsValue(financingCostAccounts, false, $scope.incomeStatement, 'financingCost', voucherList, true);
        }).then(function(results) {
          $timeout(function() {
            $scope.incomeStatement.grossIncome = $scope.incomeStatement.netSales - $scope.incomeStatement.costOfSale;
            $scope.incomeStatement.operativeIncome = $scope.incomeStatement.grossIncome - $scope.incomeStatement.operativeExpenses;
            $scope.incomeStatement.incomeBeforeTaxes = $scope.incomeStatement.operativeIncome - $scope.incomeStatement.financingCost;

            //Taxes
            if($scope.incomeStatement.incomeBeforeTaxes > 0) {
              $scope.incomeStatement.incomeTaxes = $scope.incomeStatement.incomeBeforeTaxes * INCOME_TAXES_PERCENTAGE;
              $scope.incomeStatement.profitShare = $scope.incomeStatement.incomeBeforeTaxes * PROFIT_SHARE_PERCENTAGE;

              accountsDB.update({ _id: 158 }, { $set: { balance: $scope.incomeStatement.incomeTaxes } }, { multi: false }, function (err, numReplaced) {
                if(err && err.errorType === 'uniqueViolated') {
                  saveFailure(err.key);
                }
              });

              accountsDB.update({ _id: 165 }, { $set: { balance: $scope.incomeStatement.profitShare } }, { multi: false }, function (err, numReplaced) {
                if(err && err.errorType === 'uniqueViolated') {
                  saveFailure(err.key);
                }
              });
            }

            $scope.incomeStatement.taxes = $scope.incomeStatement.incomeTaxes + $scope.incomeStatement.profitShare;

            $scope.incomeStatement.netIncome = $scope.incomeStatement.incomeBeforeTaxes - $scope.incomeStatement.taxes;

            accountsDB.update({ _id: 157 }, { $set: { balance: $scope.incomeStatement.netIncome } }, { multi: false }, function (err, numReplaced) {
              if(err && err.errorType === 'uniqueViolated') {
                saveFailure(err.key);
              } else {
                var incomeData = { '_id': 1, 'dirty': false, 'timestamp': new Date() };
                incomeDB.insert(incomeData, function(err, newItem) {
                  if(err) {
                    incomeDB.update({ _id: 1 }, { $set: incomeData }, { multi: false }, function (err, numReplaced) {
                      saveSuccessIncome();
                    });
                  } else {
                    saveSuccessIncome();
                  }
                });
              }
            });

            $scope.statementGenerated = true;
            $('.loading').fadeOut(FADE_OUT_MILLISECONDS);
          }, GLOBAL_TIMEOUT);
        });
      } else {
        $scope.noStartMonth = true;
        $('.loading').fadeOut(FADE_OUT_MILLISECONDS);
      }
    }

    $scope.getExerciseDate = function() {
      var start = utilService.getMonthName(startDate.getMonth() + 1) + ' ' + startDate.getFullYear();
      var end = utilService.getMonthName(endDate.getMonth() + 1) + ' ' + endDate.getFullYear();
      return start + ' - ' + end;
    }

    saveSuccessIncome = function() {
      notificationService.show('global.notifications.saved-successfully', 'success', 'top right', '', false);
    }

    scopeStart = function() {
      var organizationScope = $scope.$new();
      var startYear = 0;
      var startMonth = 0;

      $controller('OrganizationController', { $scope: organizationScope });

      $(window).on('organization.loaded', function() {
        startMonth = organizationScope.organization.startMonth;
        startYear = organizationScope.organization.exerciseYear;
        $scope.hasOrganization = organizationScope.organization.businessName && startMonth && startYear;
        $scope.businessName = organizationScope.organization.businessName;
        startDate = new Date(startYear, startMonth - 1, 1);
        endDate = new Date(startYear, startMonth - 1, 1);
        endDate.setMonth(endDate.getMonth() + MONTHS_IN_A_YEAR);
        $('.loading').fadeOut(FADE_OUT_MILLISECONDS);
      });
    }

    scopeStart();
  }]
);