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
                dispatcher.parent().prev().find('input').focus();
              }
              break;
            case 38: //up
              var column = dispatcher.parent().index() + 1;
              dispatcher.parent().parent().prev().find('div:nth-child(' + column + ') > input').focus();
              break;
            case 39: //right
              var cursorLocation = dispatcher.val().slice(0, event.target.selectionStart).length;
              if(cursorLocation === dispatcher.val().length) {
                dispatcher.parent().next().find('input').focus();
              }
              break;
            case 40: //down
              var column = dispatcher.parent().index() + 1;
              dispatcher.parent().parent().next().find('div:nth-child(' + column + ') > input').focus();
              break;
          }
        });
      }
    }
  }
);