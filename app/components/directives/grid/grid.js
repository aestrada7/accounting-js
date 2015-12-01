app.directive('axGrid', 
  function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.on('keydown', function(event) {
          switch(event.keyCode) {
            case 13: //enter
              event.preventDefault();
              event.stopImmediatePropagation();
              break;
          }
        });

        element.on('keyup', 'input', function(event) {
          var dispatcher = $(event.target);
          switch(event.keyCode) {
            case 37: //left
              var cursorLocation = dispatcher.val().slice(0, event.target.selectionStart).length;
              if(cursorLocation === 0) {
                dispatcher.parents('.columns').prev('.columns').find('input').focus();
              }
              break;
            case 38: //up
              var column = dispatcher.parents('.columns').index() + 1;
              dispatcher.parents('.columns').parent('.row').prev('.row').find('.columns:nth-child(' + column + ')').find('input').focus();
              break;
            case 39: //right
              var cursorLocation = dispatcher.val().slice(0, event.target.selectionStart).length;
              if(cursorLocation === dispatcher.val().length) {
                dispatcher.parents('.columns').next('.columns').find('input').focus();
              }
              break;
            case 40: //down
              var column = dispatcher.parents('.columns').index() + 1;
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