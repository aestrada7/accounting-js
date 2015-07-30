app.controller('PlaygroundController', 
  ['$scope', '$indexedDB', 

  function($scope, $indexedDB) {
    var OBJECT_STORE_NAME = 'playground-items';
    var myObjectStore = $indexedDB.objectStore(OBJECT_STORE_NAME);

    $scope.addingLeftItem = false;

    $scope.onAddItemClicked = function() {
      $('#new-item-left').val("");
      $scope.addingLeftItem = true;
    }

    $scope.onCancelAddItemClicked = function() {
      $scope.addingLeftItem = false;
    }

    $scope.onConfirmAddItemClicked = function() {
      $scope.addingLeftItem = false;
      myObjectStore.insert({ "id": Math.random(), "name": $('#new-item-left').val() }).then(function(e) {
        invalidateList();
      });
    }

    $scope.onEditItemClicked = function(id) {
      myObjectStore.find(id).then(function(result) {
        $scope.addingLeftItem = true;
        $('#new-item-left').val(result.name);
      });
    }

    $scope.onDeleteItemClicked = function(id) {
      myObjectStore.delete(id).then(function(e) {
        invalidateList();
      });
    }

    invalidateList = function() {
      myObjectStore.getAll().then(function(results) {
        $scope.items = results;
      });
    }

    invalidateList();
  }]
);