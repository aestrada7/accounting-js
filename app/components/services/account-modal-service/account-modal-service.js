app.provider('accountModalService', function() {
  this.$get = ['translateService', 'notificationService', '$compile', '$rootScope', '$http',

  function(translateService, notificationService, $compile, $rootScope, $http) {

    var show = function(account) {
      var accountModalTemplate = '';
      var scope = $rootScope.$new(true);
      scope.account = {
        key: '',
        name: '',
        level: 0
      }
      if(account) scope.account = account;

      $http.get('components/services/account-modal-service/account-modal-service.html').success(function(data) {
        accountModalTemplate = $compile(data)(scope);
        angular.element(document.body).append(accountModalTemplate);
        $('#account-modal').foundation('reveal', 'open');
      });

      scope.dismiss = function() {
        $('#account-modal').foundation('reveal', 'close');
      }

      scope.saveAccount = function() {
        var accountData = { '_id': scope.account._id,
                            'key': scope.account.key,
                            'name': scope.account.name,
                            'level': 1 }; //completely temporal, this needs to be calculated
        if(scope.account._id) {
          accountsDB.update({ _id: scope.account._id }, { $set: accountData }, { multi: false }, function (err, numReplaced) {
            saveSuccess();
          });
        } else {
          accountsDB.insert(accountData, function(err, newItem) {
            saveSuccess();
          });
        }
      }

      saveSuccess = function() {
        notificationService.show('global.notifications.saved-successfully', 'success', 'top right', '', false);
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