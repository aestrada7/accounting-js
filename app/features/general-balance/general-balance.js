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
    $scope.noIncomeStatement = false;
    $scope.hasOrganization = false;
    $scope.businessName = '';
    var startDate = new Date();
    var endDate = new Date();
    var voucherList = [];

    $scope.getBalance = function() {
      $scope.generalBalance.reportCreated = false;
      $('.loading').show();
      if($scope.hasOrganization) {
        if(utilService.incomeStatementGenerated()) {
          utilService.getVouchers({ date: { $gte: startDate, $lt: endDate } }).then(function(voucherResults) {
            voucherList = [];
            angular.forEach(voucherResults, function(value, key) {
              voucherList.push(voucherResults[key]._id);
            });

            //Floating Assets
            return utilService.getChildAccountsValue(3, true, $scope.generalBalance, 'floatingAssetsTotal', voucherList, true);
          }).then(function(results) {
            $scope.floatingAssetsAccounts = results;

            //Properties Assets
            return utilService.getChildAccountsValue(9, true, $scope.generalBalance, 'propertiesTotal', voucherList, true);
          }).then(function(results) {
            $scope.propertiesAccounts = results;

            //Deferred Assets
            return utilService.getChildAccountsValue(14, true, $scope.generalBalance, 'deferredAssetsTotal', voucherList, true);
          }).then(function(results) {
            $scope.deferredAssetsAccounts = results;

            //Short Term Passive Assets
            return utilService.getChildAccountsValue(15, false, $scope.generalBalance, 'shortTermTotal', voucherList, true);
          }).then(function(results) {
            $scope.shortTermAccounts = results;

            //Long Term Passive Assets
            return utilService.getChildAccountsValue(16, false, $scope.generalBalance, 'longTermTotal', voucherList, true);
          }).then(function(results) {
            $scope.longTermAccounts = results;

            //Contributed Capital
            return utilService.getChildAccountsValue(38, false, $scope.generalBalance, 'contributedCapitalTotal', voucherList, true);
          }).then(function(results) {
            $scope.contributedCapitalAccounts = results;

            //Earned Capital
            return utilService.getChildAccountsValue(41, false, $scope.generalBalance, 'earnedCapitalTotal', voucherList, true);        
          }).then(function(results) {
            $scope.earnedCapitalAccounts = results;

            $timeout(function() {
              $scope.generalBalance.passiveAssetsTotal = $scope.generalBalance.shortTermTotal + 
                                                         $scope.generalBalance.longTermTotal;
              $scope.generalBalance.activeAssetsTotal = $scope.generalBalance.floatingAssetsTotal +
                                                        $scope.generalBalance.propertiesTotal +
                                                        $scope.generalBalance.deferredAssetsTotal;
              $scope.generalBalance.stockholdersAssetsTotal = $scope.generalBalance.contributedCapitalTotal +
                                                              $scope.generalBalance.earnedCapitalTotal;
              $scope.generalBalance.passivePlusCapitalAssetsTotal = $scope.generalBalance.passiveAssetsTotal +
                                                                    $scope.generalBalance.stockholdersAssetsTotal;

              $scope.generalBalance.reportCreated = true;
              $('.loading').fadeOut(200);
            }, 2400);
          });
        } else {
          $scope.noIncomeStatement = true;
          $('.loading').fadeOut(200);
        }
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

      incomeDB.find({ _id: 1 }, function(err, results) {
        if(results.length > 0) {
          $scope.noIncomeStatement = results[0].dirty;
        } else {
          $scope.noIncomeStatement = true;
        }
      });
    }

    scopeStart();
  }]
);