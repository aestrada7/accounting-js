app.controller('PlaygroundController', 
  ['$scope', '$q', '$window',

  function($scope, $q, $window) {
    $scope.addingLeftItem = false;

    $scope.onAddItemClicked = function() {
      $('#new-item-left').val('');
      $scope.addingLeftItem = true;
    }

    $scope.onCancelAddItemClicked = function() {
      $scope.addingLeftItem = false;
    }

    $scope.onClearClicked = function() {
      $window.location.reload();
    }

    $scope.onConfirmAddItemClicked = function() {
      $scope.addingLeftItem = false;
      playgroundDB.insert({ 'name': $('#new-item-left').val() }, function(err, newItem) {
        invalidateList();
      });
    }

    $scope.onEditItemClicked = function(id) {
      $scope.addingLeftItem = true;
      $scope.$apply();
      fetchData({ _id: id }).then(function(result) {
        $('#new-item-left').val(result[0].name);
      });
    }

    $scope.onDeleteItemClicked = function(id) {
      playgroundDB.remove({ _id: id }, function(err, totalRemoved) {
        invalidateList();
      });
    }

    fetchData = function(args) {
      var defer = $q.defer();
      playgroundDB.find(args, function(err, results) {
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