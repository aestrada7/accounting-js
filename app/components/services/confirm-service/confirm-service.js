app.provider('confirmService', function() {
  this.$get = ['$q', 'translateService', 'notificationService', '$compile', '$rootScope', '$http',

  function($q, translateService, notificationService, $compile, $rootScope, $http) {

    var show = function(account) {
      var confirmDeleteModalTemplate = '';
      var scope = $rootScope.$new(true);
      var defer = $q.defer();

      $http.get('components/services/confirm-service/confirm-service.html').success(function(data) {
        confirmModalTemplate = $compile(data)(scope);
        angular.element(document.body).append(confirmModalTemplate);
        $('#confirm-modal').foundation('reveal', 'open');
      });

      scope.confirmAction = function() {
        $('#confirm-modal').foundation('reveal', 'close');
        defer.resolve();
      }

      scope.dismiss = function() {
        $('#confirm-modal').foundation('reveal', 'close');
        defer.reject();
      }

      $(document).on('closed.fndtn.reveal', '#confirm-modal', function() {
        $('#confirm-modal').remove();
        $(document).off('closed.fndtn.reveal');
        defer.reject();
      });

      return defer.promise;
    }

    return {
      show: show
    };
  }]

});