app.provider('accountModalService', function() {
  this.$get = ['translateService', '$compile', '$rootScope', '$http',

  function(translateService, $compile, $rootScope, $http) {

    var show = function(accountId, level) {
      var accountModalTemplate = '';
      var scope = $rootScope.$new(true);
      scope.accountId = accountId;

      $http.get('components/services/account-modal-service/account-modal-service.html').success(function(data) {
        accountModalTemplate = $compile(data)(scope);
        angular.element(document.body).append(accountModalTemplate);
        $('#account-modal').foundation('reveal', 'open');
      });

      scope.dismiss = function() {
        $('#account-modal').foundation('reveal', 'close');
      }

      $(document).on('closed.fndtn.reveal', '#account-modal', function() {
        $('#account-modal').remove();
        $(document).off('closed.fndtn.reveal');
      });
    }

    return {
      show: show
    };
  }]

});