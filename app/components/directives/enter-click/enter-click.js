app.directive('axEnterClick', 
  function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.on('$destroy', function() {
          element.off('keydown');
        });

        element.on('keydown', function(event) {
          if(event.keyCode === 13) { //enter
            element.click();
          }
        });
      }
    }
  }
);