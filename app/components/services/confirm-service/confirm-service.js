app.provider('confirmService', function() {
  this.$get = ['$q', 'translateService', 'notificationService', '$compile', '$rootScope', '$http',

  function($q, translateService, notificationService, $compile, $rootScope, $http) {

    var show = function(options) {
      var confirmModalTemplate = '';
      var scope = $rootScope.$new(true);
      var defer = $q.defer();
      scope.options = {
        label: translateService.translate(options.label),
        icon: options.icon,
        kind: options.kind,
        cancelLabel: translateService.translate(options.cancelLabel),
        confirmLabel: translateService.translate(options.confirmLabel)
      }

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
        $(document).off('opened.fndtn.reveal');
        defer.reject();
      });

      $(document).on('opened.fndtn.reveal', '#confirm-modal', function() {
        $('.confirm-modal-confirm').focus();
      });

      return defer.promise;
    }

    return {
      show: show
    };
  }]

});