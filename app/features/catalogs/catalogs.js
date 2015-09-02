app.controller('CatalogsController', 
  ['$scope', '$q', 'notificationService',

  function($scope, $q, notificationService) {
    $scope.catalogs = {
      selectedTab: 'general'
    };

    $scope.tabSelect = function(tabName) {
      $scope.catalogs.selectedTab = tabName;
    }
  }]
);