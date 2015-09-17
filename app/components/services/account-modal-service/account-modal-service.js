app.provider('accountModalService', function() {
  this.$get = ['$q', 'translateService', 'notificationService', '$compile', '$rootScope', '$http',

  function($q, translateService, notificationService, $compile, $rootScope, $http) {

    var show = function(account) {
      var accountModalTemplate = '';
      var scope = $rootScope.$new(true);
      var defer = $q.defer();
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
        defer.reject();
      }

      scope.saveAccount = function() {
        var isUnique = true;
        var accountData = { '_id': scope.account._id,
                            'key': scope.account.key,
                            'name': scope.account.name,
                            'level': 1 }; //completely temporal, this needs to be calculated

        if(scope.account._id) {
          accountsDB.update({ _id: scope.account._id }, { $set: accountData }, { multi: false }, function (err, numReplaced) {
            if(err.errorType === "uniqueViolated") {
              saveFailure(err.key);
            } else {
              saveSuccess();
            }
          });
        } else {
          accountsDB.insert(accountData, function(err, newItem) {
            if(err.errorType === "uniqueViolated") {
              saveFailure(err.key);
            } else {
              saveSuccess();
            }
          });
        }
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

      $(document).on('closed.fndtn.reveal', '#account-modal', function() {
        $('#account-modal').remove();
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