app.directive('axGrid', 
  function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.find('input').on('keyup', function(event) {
          var dispatcher = $(event.target);
          switch(event.keyCode) {
            case 37: //left
              var cursorLocation = dispatcher.val().slice(0, event.target.selectionStart).length;
              if(cursorLocation === 0) {
                dispatcher.parent('.columns').prev('.columns').find('input').focus();
              }
              break;
            case 38: //up
              var column = dispatcher.parent('.columns').index() + 1;
              dispatcher.parent('.columns').parent('.row').prev('.row').find('.columns:nth-child(' + column + ')').find('input').focus();
              break;
            case 39: //right
              var cursorLocation = dispatcher.val().slice(0, event.target.selectionStart).length;
              if(cursorLocation === dispatcher.val().length) {
                dispatcher.parent('.columns').next('.columns').find('input').focus();
              }
              break;
            case 40: //down
              var column = dispatcher.parent().index() + 1;
              dispatcher.parent('.columns').parent('.row').next('.row').find('.columns:nth-child(' + column + ')').find('input').focus();
              break;
          }
        });
      }
    }
  }
);