app.directive('axAutocomplete', 
  ['$compile', '$q', 'translateService', '$timeout',

  function($compile, $q, translateService, $timeout) {
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
            element.find('.entry:nth-child(' + selectedFieldIndex + ')').focus();
          }
          if(event.keyCode === 40) { //down arrow
            event.preventDefault();
            if(selectedFieldIndex === element.find('.entry').length) {
              selectedFieldIndex = 1;
            } else {
              selectedFieldIndex++;
            }
            element.find('.entry:nth-child(' + selectedFieldIndex + ')').focus();
          }
          if(event.keyCode === 13) { //enter
            event.preventDefault();
            element.find('.entry:nth-child(' + selectedFieldIndex + ')').click();
            searchField.focus();
            selectedFieldIndex = 0;
            scope.$apply();
          }
          if(event.keyCode === 8) { //backspace
            if($(event.target).hasClass('entry')) {
              event.preventDefault();
              searchField.focus();
            }
          }
          if(event.keyCode === 27) { //escape
            searchField.focus();
            scope.showAutocomplete = false;
            scope.$apply();
          }
          if(event.keyCode === 9) { //tab
            element.find('.entry:nth-child(' + selectedFieldIndex + ')').click();
            searchField.focus();
            scope.showAutocomplete = false;
            scope.$apply();
          }
        });

        searchField.on('keyup', function(event) {
          if(event.keyCode !== 13 && event.keyCode !== 27) { //enter, esc
            scope.showAutocomplete = searchField.val().length > 1;
            scope.$apply();
          }
        });

        searchField.on('blur', function(event) {
          $timeout(function() {
            if(element.find( ':focus' ).length === 0) {
              scope.showAutocomplete = false;
              scope.$apply();
            }
          }, 100);
        });

        scope.textFilter = function(item) {
          return item[scope.field].toLowerCase().search(searchField.val().toLowerCase()) != -1;
        }

        scope.selectItem = function(item) {
          searchField.val(item[scope.field]);
          searchField.trigger('change');
          scope.showAutocomplete = false;
        }

        fetchData({db: scope.db, field: scope.field}).then(function(results) {
          angular.forEach(results, function(value, key) {
            results[key].name = translateService.translate(results[key].name);
          });
          scope.items = results;
        });

        function fetchData(args) {
          var defer = $q.defer();
          if(args.db === 'accounts') {
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