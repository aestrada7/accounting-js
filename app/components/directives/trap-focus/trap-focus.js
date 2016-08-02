app.directive('axTrapFocus', 
  function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.on('keydown', function(event) {
          if(event.keyCode === TAB_KEY) {
            var dispatcher = $(event.target)[0];
            var firstElement = element.find('input, textarea, button, select').filter(':enabled:first')[0];
            var lastElement = element.find('input, textarea, button, select').filter(':enabled:last')[0];

            if(dispatcher === lastElement && !event.shiftKey) {
              event.preventDefault();
              firstElement.focus();
            }

            if(dispatcher === firstElement && event.shiftKey) {
              event.preventDefault();
              lastElement.focus();
            }
          }
        });

        scope.$on('$destroy', function() {
          element.off('keydown');
        });
      }
    }
  }
);