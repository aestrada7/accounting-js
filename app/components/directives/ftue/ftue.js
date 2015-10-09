app.directive('axFtue', 
  ['$q', 'translateService',

  function($q, translateService) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        key: '@',
        text: '@',
        position: '@'
      },
      link: function(scope, element, attrs) {
        scope.canBeShown = false;

        fetchFTUEData = function(args) {
          var defer = $q.defer();
          ftuesDB.find(args, function(err, results) {
            defer.resolve(results);
          });
          return defer.promise;
        }

        loadFtueStatus = function() {
          fetchFTUEData({key: scope.key}).then(function(results) {
            if(!results[0].displayed) {
              scope.canBeShown = true;
              scope.ftueText = translateService.translate(scope.text);

              var parentPosition = element.parent().css('position');
              if(parentPosition === 'static') {
                element.parent().css('position', 'relative');
              }

              $(document).on('click', function() {
                ftuesDB.update({ key: scope.key }, { $set: { 'displayed': true }}, { multi: false }, function (err, numReplaced) {
                  scope.canBeShown = false;
                  $(document).off('click');
                  loadFtueStatus();
                });
              });
            }
          });
        }

        loadFtueStatus();
      },
      templateUrl: 'components/directives/ftue/ftue.html'
    }
  }]
);