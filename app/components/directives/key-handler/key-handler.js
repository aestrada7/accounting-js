app.directive('axKeyHandler', 
  ['$q', 

  function($q) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var keyHandlerAttrs = scope.$root.$eval(element.attr("ax-key-handler"));
        var transitionObj = {};

        angular.forEach(keyHandlerAttrs, function(value, key) {
          if(key === 'enter') key = 13;
          if(key === 'space') key = 32;
          if(key === 'backspace') key = 8;
          if(key === 'tab') key = 9;
          if(key === 'esc') key = 27;
          transitionObj[key] = value; //must be a selector
        });

        $q.all(transitionObj).then(function(keyHandlerAttrs) {
          element.on('keyup', function(event) {
            handleKey(event.keyCode, transitionObj);
          });
        });

        handleKey = function(keyCode) {
          angular.forEach(transitionObj, function(value, key) {
            if(keyCode === parseInt(key)) {
              $(value).click();
            }
          });
        }
      }
    }
  }]
);