app.directive('axFocus', 
  ['$timeout',

  function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var FOCUS_TIMEOUT = 500;
        
        $timeout(function() {
          element.focus();
        }, FOCUS_TIMEOUT);
      }
    }
  }]
);