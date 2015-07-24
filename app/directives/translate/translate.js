app.directive('axTranslate', ['$compile', '$q', function($compile, $) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var html = translate(element[0].innerText);
      element.html(html);
      $compile(element.contents())(scope);
    }
  }
}]);