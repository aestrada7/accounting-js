app.controller('GeneralBalanceController', 
  ['$scope', '$q', '$controller', 'notificationService', 'translateService', 'utilService',

  function($scope, $q, $controller, notificationService, translateService, utilService) {
    $scope.generalBalance = {
      floatingAssetsTotal: 900,
      propertiesTotal: 0,
      deferredAssetsTotal: 0,
      shortTermTotal: 0,
      longTermTotal: 0,
      activeAssetsTotal: 900,
      passiveAssetsTotal: 0,
      stockholdersAccountsTotal: 0,
      reportCreated: true //should be false
    }
    //mock data
    $scope.floatingAssetsAccounts = [{
      name: 'Account 1',
      total: 200
    }, {
      name: 'Account 2',
      total: 700
    }];

    $scope.getBalance = function() {
      $('.loading').show();
      //var accountBalanceScope = $scope.$new();
      //$controller('AccountBalanceController', {$scope: accountBalanceScope});

      //Floating Assets
      utilService.getAccountData({ parentId: 3 }).then(function(results) {
        console.log(results);
      });

      $scope.generalBalance.reportCreated = true;
      $('.loading').fadeOut(200);
    }

    $('.loading').fadeOut(200);
  }]
);