app.controller('OrganizationController', 
  ['$scope', '$q', '$window', '$timeout',

  function($scope, $q, $window, $timeout) {
    fetchData = function(args) {
      var defer = $q.defer();
      organizationDB.find(args, function(err, results) {
        defer.resolve(results);
      });
      return defer.promise;
    }

    invalidateList = function() {
      fetchData({}).then(function(results) {
        $scope.items = results;
      });
    }

    invalidateList();
  }]
);