app.controller('CatalogsController', 
  ['$scope', '$q', 'notificationService', 'translateService',

  function($scope, $q, notificationService, translateService) {
    $scope.catalogs = {
      selectedTab: 'general'
    };

    $scope.tabSelect = function(tabName) {
      $scope.catalogs.selectedTab = tabName;
    }

    fetchData = function(args) {
      var defer = $q.defer();
      accountsDB.find(args, function(err, results) {
        defer.resolve(results);
      });
      return defer.promise;
    }

    invalidateList = function() {
      fetchData({}).then(function(results) {
        angular.forEach(results, function(value, key) {
          results[key].name = translateService.translate(results[key].name);
        });
        $scope.items = results;
      });
    }

    invalidateList();
  }]
);