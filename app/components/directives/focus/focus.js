app.directive('axFocus', 
  ['$timeout',

  function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        $timeout(function() {
          element.focus();
        }, 500);
      }
    }
  }]
);