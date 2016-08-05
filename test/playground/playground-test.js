describe('PlaygroundController', function() {
  beforeEach(module('accountingJS'));

  var $controller;

  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  describe('$scope', function() {
    it('Should not be adding any item by default', function() {
      var $scope = {};
      var controller = $controller('PlaygroundController', { $scope: $scope });

      expect($scope.addingItem).toEqual(false);
    });
  });
});