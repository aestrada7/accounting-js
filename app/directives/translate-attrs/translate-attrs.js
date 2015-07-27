app.directive('axTranslateAttrs', ['$compile', '$q', function($compile, $q) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var translateAttrs = scope.$root.$eval(element.attr("ax-translate-attrs"));
      var transitionObj = {};

      angular.forEach(translateAttrs, function(value, key) {
        transitionObj[key] = translate(value);
      });

      $q.all(transitionObj).then(function(translatedAttrs) {
        element.attr(translatedAttrs);
      });

      $compile(element.contents())(scope);
    }
  }
}]);