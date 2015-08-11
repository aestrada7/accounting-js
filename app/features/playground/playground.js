app.controller('PlaygroundController', 
  ['$scope', '$q', '$window',

  function($scope, $q, $window) {
    $scope.addingItem = false;
    $scope.editingItem = -1; //Id of the item being edited

    $scope.onAddItemClicked = function() {
      $('#new-item').val('');
      $scope.addingItem = true;
    }

    $scope.onCancelAddItemClicked = function() {
      $scope.addingItem = false;
    }

    $scope.onClearClicked = function() {
      $window.location.reload();
    }

    $scope.onConfirmAddItemClicked = function() {
      $scope.addingItem = false;
      playgroundDB.insert({ 'name': $('#new-item').val() }, function(err, newItem) {
        invalidateList();
      });
    }

    $scope.onEditItemClicked = function(id) {
      $scope.editingItem = id;
      $scope.$apply();
      fetchData({ _id: id }).then(function(result) {
        $('#new-item').val(result[0].name);
      });
    }

    $scope.onDeleteItemClicked = function(id) {
      playgroundDB.remove({ _id: id }, function(err, totalRemoved) {
        invalidateList();
      });
    }

    $scope.onCancelEditItemClicked = function() {
      $scope.editingItem = -1;
    }

    $scope.onSaveItemClicked = function() {
      var value = $('#edit-item-' + $scope.editingItem).val();
      playgroundDB.update({ _id: $scope.editingItem }, { $set: { 'name': value }}, { multi: false }, function (err, numReplaced) {
        $scope.editingItem = -1;
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