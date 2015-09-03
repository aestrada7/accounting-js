app.directive('axOnChange',
  function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var onChangeHandler = scope.$eval(attrs.axOnChange);
        element.bind('change', onChangeHandler);
      }
    }
  }
);