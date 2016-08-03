app.directive('axEnterClick', 
  function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.on('keydown', function(event) {
          if(event.keyCode === ENTER_KEY) {
            element.click();
          }
        });

        scope.$on('$destroy', function() {
          element.off('keydown');
        });
      }
    }
  }
);