app.controller('GeneralBalanceController', 
  ['$scope', '$q', '$controller', 'notificationService', 'translateService',

  function($scope, $q, $controller, notificationService, translateService) {
    $scope.generalBalance = {
      floatingAssetsTotal: 900,
      propertiesTotal: 0,
      deferredAssetsTotal: 0,
      shortTermTotal: 0,
      longTermTotal: 0,
      activeAssetsTotal: 900,
      passiveAssetsTotal: 0,
      stockholdersAccountsTotal: 0
    }
    //mock data
    $scope.floatingAssetsAccounts = [{
      name: 'Account 1',
      total: 200
    }, {
      name: 'Account 2',
      total: 700
    }];

    $('.loading').fadeOut(200);
  }]
);