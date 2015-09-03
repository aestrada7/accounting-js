app.controller('HomeController', 
  ['$scope', '$controller',

  function($scope, $controller) {
    $scope.home = {
      logo: ''
    }

    var organizationScope = $scope.$new();
    $controller('OrganizationController', {$scope: organizationScope});
    setTimeout(function() {
      $scope.home.logo = organizationScope.organization.logo;
      $scope.$apply();
    }, 500);
    
  }]
);