app.directive('axValidate', 
  ['translateService', '$timeout', 

  function(translateService, $timeout) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        kind: '@'
      },
      link: function(scope, element, attrs) {
        scope.showError = false;
        element.find('input,textarea').on('blur, keyup', function() {
          $timeout(function() {
            scope.showError = element.find('input,textarea').hasClass('ng-invalid') && element.find('input,textarea').hasClass('ng-dirty');
          }, 0);
        });
      },
      templateUrl: 'components/directives/validate/validate.html'
    }
  }]
);