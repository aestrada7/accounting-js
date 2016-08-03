app.provider('confirmService', function() {
  this.$get = ['$q', 'translateService', '$compile', '$timeout', '$rootScope', '$http',

  function($q, translateService, $compile, $timeout, $rootScope, $http) {

    var show = function(options) {
      setMenuBarEnabled(false);
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
        var CONFIRMATION_CLOSE_TIMEOUT = 350;
        $('#confirm-modal').removeClass('shown');
        $('.confirm-modal-bg').removeClass('shown');
        $timeout(function() {
          $('#confirm-modal').trigger('modalClosed');
          $(document).off('click');
        }, CONFIRMATION_CLOSE_TIMEOUT);
        setMenuBarEnabled(true);
      }

      $(document).on('modalClosed', '#confirm-modal', function() {
        $('#confirm-modal').remove();
        $('.confirm-modal-bg').remove();
        $(document).off('modalClosed');
        $('.reveal-modal').focus();
        defer.reject();
      });

      $(document).on('click', '#confirm-modal-bg', function() {
        $('#confirm-modal button').focus();
      });

      return defer.promise;
    }

    return {
      show: show
    };
  }]

});