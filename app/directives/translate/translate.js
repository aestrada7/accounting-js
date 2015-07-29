app.directive('axTranslate', ['$compile', '$q', 'translateService', function($compile, $, translateService) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var html = translateService.translate(element[0].innerText);
      element.html(html);
      $compile(element.contents())(scope);
    }
  }
}]);