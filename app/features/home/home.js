app.controller('HomeController', 
  ['$scope', '$controller',

  function($scope, $controller) {
    $scope.home = {
      logo: ''
    }

    var organizationScope = $scope.$new();
    $controller('OrganizationController', {$scope: organizationScope});
    $(window).on('organization.loaded', function() {
      $scope.home.logo = organizationScope.organization.logo;
    });
    
  }]
);