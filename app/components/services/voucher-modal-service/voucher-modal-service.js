app.provider('voucherModalService', function() {
  this.$get = ['$q', 'translateService', 'notificationService', '$compile', '$rootScope', '$http',

  function($q, translateService, notificationService, $compile, $rootScope, $http) {

    var show = function(voucher) {
      var voucherModalTemplate = '';
      var scope = $rootScope.$new(true);
      var defer = $q.defer();
      scope.voucher = {
        kind: voucher.kind
      }
      scope.voucherEntries = [];

      $http.get('components/services/voucher-modal-service/voucher-modal-service.html').success(function(data) {
        voucherModalTemplate = $compile(data)(scope);
        angular.element(document.body).append(voucherModalTemplate);
        $('#voucher-modal').foundation('reveal', 'open');
      });

      scope.onAddVoucherEntryClicked = function() {
        scope.voucherEntries.push({});
      }

      scope.dismiss = function() {
        $('#voucher-modal').foundation('reveal', 'close');
        defer.reject();
      }

      saveSuccess = function() {
        notificationService.show('global.notifications.saved-successfully', 'success', 'top right', '', false);
        defer.resolve();
      }

      saveFailure = function(key) {
        var errorText = translateService.translate('global.notifications.duplicate-values');
        errorText = errorText.split('{{key}}').join(key);
        notificationService.show(errorText, 'alert', 'top right', '', false);
      }

      $(document).on('closed.fndtn.reveal', '#voucher-modal', function() {
        $('#voucher-modal').remove();
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