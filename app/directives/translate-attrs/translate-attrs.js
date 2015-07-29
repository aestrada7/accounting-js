app.directive('axTranslateAttrs', ['$compile', '$q', 'translateService', function($compile, $q, translateService) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var translateAttrs = scope.$root.$eval(element.attr("ax-translate-attrs"));
      var transitionObj = {};

      angular.forEach(translateAttrs, function(value, key) {
        transitionObj[key] = translateService.translate(value);
      });

      $q.all(transitionObj).then(function(translatedAttrs) {
        element.attr(translatedAttrs);
      });

      $compile(element.contents())(scope);
    }
  }
}]);