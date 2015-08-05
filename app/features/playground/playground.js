app.controller('PlaygroundController', 
  ['$scope', '$indexedDB', '$window',

  function($scope, $indexedDB, $window) {
    $scope.addingLeftItem = false;

    $scope.onAddItemClicked = function() {
      $('#new-item-left').val('');
      $scope.addingLeftItem = true;
    }

    $scope.onCancelAddItemClicked = function() {
      $scope.addingLeftItem = false;
    }

    $scope.onClearClicked = function() {
      indexedDB.deleteDatabase('accountingDB');
      $window.location.reload();
    }

    $scope.onConfirmAddItemClicked = function() {
      $scope.addingLeftItem = false;
      playgroundDB.insert({ 'name': $('#new-item-left').val() }, function(err, newItem) {
        invalidateList();
      });
    }

    $scope.onEditItemClicked = function(id) {
      /*
      myObjectStore.find(id).then(function(result) {
        $scope.addingLeftItem = true;
        $('#new-item-left').val(result.name);
      });
      */
    }

    $scope.onDeleteItemClicked = function(id) {
      playgroundDB.remove({ _id: id }, function(err, totalRemoved) {
        invalidateList();
      });
    }

    invalidateList = function() {
      playgroundDB.find({}, function(err, results) {
        $scope.items = results;
        $scope.apply();
      });
    }

    invalidateList();
  }]
);