app.directive('axAutocomplete', 
  ['$compile', '$q', 'translateService', '$timeout',

  function($compile, $q, translateService, $timeout) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        db: '@',
        field: '@',
        filter: '='
      },
      templateUrl: 'components/directives/autocomplete/autocomplete.html',
      link: function(scope, element, attrs) {
        var searchField = element.find('input');
        var selectedFieldIndex = 0;
        scope.items = {};
        scope.showAutocomplete = false;
        selectedFieldIndex = 0;

        element.on('keydown', function(event) {
          if(event.keyCode === UP_KEY) {
            event.preventDefault();
            if(selectedFieldIndex === 1) {
              selectedFieldIndex = element.find('.entry').length;
            } else {
              selectedFieldIndex--;
            }
            element.find('.entry:nth-child(' + selectedFieldIndex + ')').focus();
          }
          if(event.keyCode === DOWN_KEY) {
            event.preventDefault();
            if(selectedFieldIndex === element.find('.entry').length) {
              selectedFieldIndex = 1;
            } else {
              selectedFieldIndex++;
            }
            element.find('.entry:nth-child(' + selectedFieldIndex + ')').focus();
          }
          if(event.keyCode === ENTER_KEY) {
            event.preventDefault();
            element.find('.entry:nth-child(' + selectedFieldIndex + ')').click();
            searchField.focus();
            selectedFieldIndex = 0;
            scope.$apply();
          }
          if(event.keyCode === BACKSPACE_KEY) {
            if($(event.target).hasClass('entry')) {
              event.preventDefault();
              searchField.focus();
            }
          }
          if(event.keyCode === ESCAPE_KEY) {
            searchField.focus();
            scope.showAutocomplete = false;
            scope.$apply();
          }
          if(event.keyCode === TAB_KEY) {
            element.find('.entry:nth-child(' + selectedFieldIndex + ')').click();
            searchField.focus();
            scope.showAutocomplete = false;
            scope.$apply();
          }
        });

        searchField.on('keyup', function(event) {
          if(event.keyCode !== ENTER_KEY && event.keyCode !== ESCAPE_KEY) {
            scope.showAutocomplete = searchField.val().length > 1;
            scope.$apply();
          }
        });

        searchField.on('blur', function(event) {
          var BLUR_TIMEOUT = 100;
          $timeout(function() {
            if(element.find(':focus').length === 0) {
              scope.showAutocomplete = false;
              scope.$apply();
            }
          }, BLUR_TIMEOUT);
        });

        scope.textFilter = function(item) {
          return item[scope.field].toLowerCase().search(searchField.val().toLowerCase()) !== -1;
        }

        scope.selectItem = function(item) {
          searchField.val(item[scope.field]);
          searchField.trigger('change');
          scope.showAutocomplete = false;
        }

        scope.$on('$destroy', function() {
          element.off('keydown');
          searchField.off('keyup');
          searchField.off('blur');
        });

        fetchData({db: scope.db, field: scope.field, filter: scope.filter}).then(function(results) {
          angular.forEach(results, function(value, key) {
            results[key].name = translateService.translate(results[key].name);
          });
          scope.items = results;
        });

        function fetchData(args) {
          var defer = $q.defer();
          var filter = {};
          if(args.filter) {
            filter = args.filter;
          }
          if(args.db === 'accounts') {
            accountsDB.find(filter, function(err, results) {
              defer.resolve(results);
            });
          }
          return defer.promise;
        }
      }
    }
  }]
);