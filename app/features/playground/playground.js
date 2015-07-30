app.controller('PlaygroundController', 
  ['$scope', 

  function($scope) {
    $scope.items = [{
      name: 'Hi', id: '1'
    }];

    $scope.addingLeftItem = false;

    $scope.onAddItemClicked = function() {
      $scope.addingLeftItem = true;
    }

    $scope.onCancelAddItemClicked = function() {
      $scope.addingLeftItem = false;
    }

    $scope.onConfirmAddItemClicked = function() {
      $scope.addingLeftItem = false;
      $scope.items.push({name: 'whatever', id: 2});
    }
  }]
);