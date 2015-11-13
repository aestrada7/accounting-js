app.controller('GeneralBalanceController', 
  ['$scope', '$q', '$controller', 'notificationService', 'translateService',

  function($scope, $q, $controller, notificationService, translateService) {
    $scope.generalBalance = {
    }

    $('.loading').fadeOut(200);
  }]
);