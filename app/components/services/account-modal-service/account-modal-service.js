app.provider('accountModalService', function() {
  this.$get = ['$q', 'translateService', 'notificationService', 'confirmService', '$compile', '$rootScope', '$http',

  function($q, translateService, notificationService, confirmService, $compile, $rootScope, $http) {

    var show = function(account, items) {
      var accountModalTemplate = '';
      var scope = $rootScope.$new(true);
      var defer = $q.defer();
      scope.dirty = false;
      scope.account = {
        key: '',
        name: '',
        parentId: account.parentId || 0,
        level: account.level || 0,
        balance: account.balance || 0
      }
      scope.parentAccounts = items;
      if(account) scope.account = account;

      $http.get('components/services/account-modal-service/account-modal-service.html').success(function(data) {
        accountModalTemplate = $compile(data)(scope);
        angular.element(document.body).append(accountModalTemplate);
        $('#account-modal').foundation('reveal', 'open', {
          close_on_background_click: false,
          close_on_esc: false,
          dismiss_modal_class: 'no-class'
        });
      });

      scope.dismiss = function() {
        if(scope.dirty) {
          var confirmOptions = {
            label: 'components.confirmation.confirm-overwrite',
            icon: 'fi-alert',
            kind: 'warning',
            cancelLabel: 'global.cancel',
            confirmLabel: 'global.ok'
          }

          confirmService.show(confirmOptions).then(function(result) {
            $('#account-modal').foundation('reveal', 'close');
            $(document).off('click');
          });
        } else {
          $('#account-modal').foundation('reveal', 'close');
          $(document).off('click');
        }
      }

      scope.setDirty = function() {
        scope.dirty = true;
      }

      scope.saveAccount = function() {
        var isUnique = true;
        var accountData = { '_id': scope.account._id,
                            'key': scope.account.key,
                            'name': scope.account.name,
                            'parentId': scope.account.parentId,
                            'level': scope.account.level,
                            'balance': scope.account.balance };

        if(scope.account._id) {
          accountsDB.update({ _id: scope.account._id }, { $set: accountData }, { multi: false }, function (err, numReplaced) {
            if(err && err.errorType === 'uniqueViolated') {
              saveFailure(err.key);
            } else {
              saveSuccess();
            }
          });
        } else {
          accountsDB.insert(accountData, function(err, newItem) {
            if(err && err.errorType === 'uniqueViolated') {
              saveFailure(err.key);
            } else {
              saveSuccess();
            }
          });
        }
      }

      saveSuccess = function() {
        incomeDB.update({ _id: 1 }, { $set: { dirty: true } }, { multi: false }, function (err, numReplaced) {});
        scope.dirty = false;
        notificationService.show('global.notifications.saved-successfully', 'success', 'top right', '', false);
        defer.resolve();
      }

      saveFailure = function(key) {
        scope.dirty = true;
        var errorText = translateService.translate('global.notifications.duplicate-values');
        errorText = errorText.split('{{key}}').join(key);
        notificationService.show(errorText, 'alert', 'top right', '', false);
      }

      $(document).on('closed.fndtn.reveal', '#account-modal', function() {
        $('#account-modal').remove();
        $(document).off('closed.fndtn.reveal');
        defer.reject();
      });

      $(document).on('click', '.reveal-modal-bg:not(.confirm-modal-bg)', function() {
        $('#account-modal').focus();
      });

      return defer.promise;
    }

    return {
      show: show
    };
  }]

});