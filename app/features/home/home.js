app.controller('HomeController', 
  ['$scope', '$controller',

  function($scope, $controller) {
    $scope.home = {
      logo: '',
      organizationName: '',
      organizationTIN: '',
      totalAccounts: 0,
      totalVouchers: 0
    }

    var organizationScope = $scope.$new();
    $controller('OrganizationController', {$scope: organizationScope});
    $(window).on('organization.loaded', function() {
      $scope.home.logo = organizationScope.organization.logo;
      $scope.home.organizationName = organizationScope.organization.businessName;
      $scope.home.organizationTIN = organizationScope.organization.tin;
    });

    var catalogsScope = $scope.$new();
    $controller('CatalogsController', {$scope: catalogsScope});
    $(window).on('catalogs.loaded', function() {
      $scope.home.totalAccounts = catalogsScope.items.length;
    });

    var vouchersScope = $scope.$new();
    $controller('VouchersController', {$scope: vouchersScope});
    $(window).on('vouchers.loaded', function() {
      $scope.home.totalVouchers = vouchersScope.items.length;
    });
    
  }]
);