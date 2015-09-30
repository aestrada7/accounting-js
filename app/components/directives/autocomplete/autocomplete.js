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
        var searchField = element.find('input');
        var selectedFieldIndex = 0;
        scope.items = {};
        scope.showAutocomplete = false;
        selectedFieldIndex = 0;

        element.on('keydown', function(event) {
          if(event.keyCode === 38) { //up arrow
            event.preventDefault();
            if(selectedFieldIndex === 1) {
              selectedFieldIndex = element.find('.entry').length;
            } else {
              selectedFieldIndex--;
            }
          }
          if(event.keyCode === 40) { //down arrow
            event.preventDefault();
            if(selectedFieldIndex === element.find('.entry').length) {
              selectedFieldIndex = 1;
            } else {
              selectedFieldIndex++;
            }
          }
          if(event.keyCode === 13) { //enter
            event.preventDefault();
            element.find('.entry:nth-child(' + selectedFieldIndex + ')').click();
            searchField.focus();
            selectedFieldIndex = 0;
          }
          element.find('.entry:nth-child(' + selectedFieldIndex + ')').focus();
        })

        searchField.on('keyup', function(event) {
          if(event.keyCode !== 13) { //enter
            scope.showAutocomplete = searchField.val().length > 1;
            scope.$apply();
          }
        });

        element.on('blur', function() {
          scope.showAutocomplete = false;
          scope.$apply();
        });

        scope.textFilter = function(item) {
          return item[scope.field].search(searchField.val()) != -1;
        }

        scope.selectItem = function(item) {
          searchField.val(item[scope.field]);
          scope.showAutocomplete = false;
        }

        fetchData({db: scope.db, field: scope.field}).then(function(results) {
          scope.items = results;
        });

        function fetchData(args) {
          var defer = $q.defer();
          if(args.db === "accounts") {
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