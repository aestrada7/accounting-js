app.directive('axAutocomplete', 
  ['$compile', '$q', 

  function($compile, $q) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        db: '@',
        field: '@'
      },
      templateUrl: 'components/directives/autocomplete/autocomplete.html',
      link: function(scope, element, attrs) {
        scope.items = {};

        fetchData({db: scope.db, field: scope.field}).then(function(results) {
          scope.items = results;
        });

        function fetchData(args) {
          var defer = $q.defer();
          if(args.db === "accounts") { // && args.field === "key"
            accountsDB.find({}, function(err, results) {
              defer.resolve(results);
            });
          }
          return defer.promise;
        }
      }
    }
  }]
);