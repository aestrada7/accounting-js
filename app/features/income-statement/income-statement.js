app.controller('IncomeStatementController', 
  ['$scope', '$q', 'utilService',

  function($scope, $q, utilService) {
    $scope.incomeStatement = {
      netSales: 0
    }

    $('.loading').fadeOut(200);
  }]
);