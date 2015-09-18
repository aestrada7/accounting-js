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
        scope.errorDescription = '';
        var field = element.find('input,textarea,select');
        field.on('blur, keyup', function() {
          $timeout(function() {
            scope.showError = field.hasClass('ng-invalid') && field.hasClass('ng-dirty');

            switch(scope.kind) {
              case 'text':
                scope.errorDescription = translateService.translate('global.errors.missing-value');
                break;
              case 'number':
                scope.errorDescription = translateService.translate('global.errors.invalid-value');
                break;
            }
          }, 0);
        });
      },
      templateUrl: 'components/directives/validate/validate.html'
    }
  }]
);