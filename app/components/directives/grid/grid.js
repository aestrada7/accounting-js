app.directive('axGrid', 
  function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.on('keydown', function(event) {
          switch(event.keyCode) {
            case ENTER_KEY:
              event.preventDefault();
              event.stopImmediatePropagation();
              break;
          }
        });

        element.on('keyup', 'input', function(event) {
          var dispatcher = $(event.target);
          var cursorLocation = 0;
          var column = 0;
          switch(event.keyCode) {
            case LEFT_KEY:
              cursorLocation = dispatcher.val().slice(0, event.target.selectionStart).length;
              if(cursorLocation === 0) {
                dispatcher.parents('.columns').prev('.columns').find('input').focus();
              }
              break;
            case UP_KEY:
              column = dispatcher.parents('.columns').index() + 1;
              dispatcher.parents('.columns').parent('.row').prev('.row').find('.columns:nth-child(' + column + ')').find('input').focus();
              break;
            case RIGHT_KEY:
              cursorLocation = dispatcher.val().slice(0, event.target.selectionStart).length;
              if(cursorLocation === dispatcher.val().length) {
                dispatcher.parents('.columns').next('.columns').find('input').focus();
              }
              break;
            case DOWN_KEY:
              column = dispatcher.parents('.columns').index() + 1;
              dispatcher.parents('.columns').parent('.row').next('.row').find('.columns:nth-child(' + column + ')').find('input').focus();
              break;
          }
        });

        scope.$on('$destroy', function() {
          element.off('keydown');
          element.off('keyup');
        });
      }
    }
  }
);