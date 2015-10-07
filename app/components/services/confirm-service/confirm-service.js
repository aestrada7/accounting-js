app.provider('confirmService', function() {
  this.$get = ['$q', 'translateService', '$compile', '$timeout', '$rootScope', '$http',

  function($q, translateService, $compile, $timeout, $rootScope, $http) {

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
        $('#confirm-modal').css('top', window.scrollY);
        $timeout(function() {
          $('#confirm-modal').addClass('shown');
          $('.confirm-modal-bg').addClass('shown');
          $('.confirm-modal-confirm').focus();
        }, 0);
      });

      scope.confirmAction = function() {
        closeConfirmation();
        defer.resolve();
      }

      scope.dismiss = function() {
        closeConfirmation();
        defer.reject();
      }

      closeConfirmation = function() {
        $('#confirm-modal').removeClass('shown');
        $('.confirm-modal-bg').removeClass('shown');
        $timeout(function() {
          $('#confirm-modal').trigger('modalClosed');
        }, 350);
      }

      $(document).on('modalClosed', '#confirm-modal', function() {
        $('#confirm-modal').remove();
        $('.confirm-modal-bg').remove();
        $(document).off('modalClosed');
        defer.reject();
      });

      return defer.promise;
    }

    return {
      show: show
    };
  }]

});