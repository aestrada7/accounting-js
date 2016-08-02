app.provider('voucherModalService', function() {
  this.$get = ['$q', 'translateService', 'notificationService', 'confirmService', 'utilService', '$compile', '$rootScope', '$http',

  function($q, translateService, notificationService, confirmService, utilService, $compile, $rootScope, $http) {

    var show = function(voucher, voucherEntries) {
      var voucherModalTemplate = '';
      var scope = $rootScope.$new(true);
      var defer = $q.defer();
      scope.dirty = false;
      scope.voucher = {
        kind: voucher.kind
      }
      scope.voucherEntries = [];

      $http.get('components/services/voucher-modal-service/voucher-modal-service.html').success(function(data) {
        voucherModalTemplate = $compile(data)(scope);
        angular.element(document.body).append(voucherModalTemplate);
        $('#voucher-modal').foundation('reveal', 'open', {
          close_on_background_click: false,
          close_on_esc: false,
          dismiss_modal_class: 'no-class'
        });
      });

      scope.onAddVoucherEntryClicked = function() {
        scope.voucherEntries.push({item: scope.voucherEntries.length + 1, invalid: true});
        scope.dirty = true;
      }

      scope.onRemoveVoucherEntryClicked = function() {
        scope.voucherEntries.pop();
        scope.dirty = true;
      }

      scope.deleteVoucher = function() {
        var confirmOptions = {
          label: 'features.vouchers.confirm-delete',
          icon: 'fi-trash',
          kind: 'alert',
          cancelLabel: 'global.cancel',
          confirmLabel: 'global.delete'
        }

        confirmService.show(confirmOptions).then(function(result) {
          vouchersDB.remove({ _id: scope.voucher._id }, function(err, totalRemoved) {
            voucherEntriesDB.remove({ voucherId: scope.voucher._id }, function(err, totalRemoved) {
              scope.dismiss();
              invalidateList();
              notificationService.show('global.notifications.deleted-successfully', 'success', 'top right', '', false);
            });
          });
        }, function(result) {
          //delete was cancelled
        });
      }

      scope.saveVoucher = function() {
        var voucherData = { '_id': scope.voucher._id,
                            'key': scope.voucher.key,
                            'date': scope.voucher.date,
                            'description': scope.voucher.description,
                            'kind': scope.voucher.kind };
        if(scope.voucher._id) {
          vouchersDB.update({ _id: scope.voucher._id }, { $set: voucherData }, { multi: false }, function (err, numReplaced) {
            if(err && err.errorType === 'uniqueViolated') {
              saveFailure(err.key);
            } else {
              angular.forEach(scope.voucherEntries, function(value, key) {
                var voucherEntryData = { '_id': scope.voucherEntries[key]._id,
                                         'voucherId': scope.voucher._id,
                                         'item': scope.voucherEntries[key].item,
                                         'key': scope.voucherEntries[key].key,
                                         'debits': scope.voucherEntries[key].debits,
                                         'credits': scope.voucherEntries[key].credits };
                if(voucherEntryData._id) {
                  voucherEntriesDB.update({ _id: voucherEntryData._id }, { $set: voucherEntryData }, { multi: false }, function (err, numReplaced) {
                    invalidateList();
                  });
                } else {
                  voucherEntriesDB.insert(voucherEntryData, function(err, newItem) {
                    invalidateList();
                  });
                }
              });
              saveSuccess();
            }
          });
        } else {
          vouchersDB.insert(voucherData, function(err, newItem) {
            scope.voucher._id = newItem._id;
            if(err && err.errorType === 'uniqueViolated') {
              saveFailure(err.key);
            } else {
              angular.forEach(scope.voucherEntries, function(value, key) {
                var voucherEntryData = { 'voucherId': newItem._id,
                                         'item': scope.voucherEntries[key].item,
                                         'key': scope.voucherEntries[key].key,
                                         'debits': scope.voucherEntries[key].debits,
                                         'credits': scope.voucherEntries[key].credits };
                voucherEntriesDB.insert(voucherEntryData, function(err, newItem) {
                  scope.voucherEntries[key]._id = newItem._id;
                  if(scope.voucherEntries[scope.voucherEntries.length - 1] === scope.voucherEntries[key]) {
                    saveSuccess();
                  }
                });
              });
              if(scope.voucherEntries.length === 0) {
                saveSuccess();
              }
            }
          });
        }
      }

      scope.onChangeKey = function(item) {
        utilService.getAccountData({key: item.key, level: 4}).then(function(results) {
          if(results.length > 0) {
            item.name = translateService.translate(results[0].name);
            item.invalid = false;
          } else {
            item.invalid = true;
          }
        });
      }

      scope.onChangeName = function(item) {
        var itemName = '';
        utilService.getAccountData().then(function(results) {
          angular.forEach(results, function(value, key) {
            if(item.name === translateService.translate(results[key].name)) {
              itemName = results[key].name;
            }
          });
          if(itemName) {
            utilService.getAccountData({name: itemName, level: 4}).then(function(results) {
              item.key = results[0].key;
              item.invalid = false;
            });
          }
        });
      }

      scope.isValidAccount = function(item) {
        utilService.getAccountData({key: item.key, level: 4}).then(function(results) {
          item.invalid = results.length === 0;
        });
      }

      scope.hasInvalidData = function() {
        var isInvalid = false;
        angular.forEach(scope.voucherEntries, function(value, key) {
          if(scope.voucherEntries[key].invalid) {
            isInvalid = true;
          }
        });
        return isInvalid;
      }

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
            $('#voucher-modal').foundation('reveal', 'close');
            $(document).off('click');
          });
        } else {
          $('#voucher-modal').foundation('reveal', 'close');
          $(document).off('click');
        }
      }

      scope.setDirty = function() {
        scope.dirty = true;
      }

      scope.voucherTallies = function() {
        var tmpCredits = 0;
        var tmpDebits = 0;
        angular.forEach(scope.voucherEntries, function(value, key) {
          if(scope.voucherEntries[key].credits) {
            tmpCredits += parseFloat(scope.voucherEntries[key].credits);
          }
          if(scope.voucherEntries[key].debits) {
            tmpDebits += parseFloat(scope.voucherEntries[key].debits);
          }
        });
        return tmpDebits === tmpCredits;
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

      $(document).on('closed.fndtn.reveal', '#voucher-modal', function() {
        $('#voucher-modal').remove();
        $(document).off('closed.fndtn.reveal');
        defer.reject();
      });

      $(document).on('click', '.reveal-modal-bg:not(.confirm-modal-bg)', function() {
        $('#voucher-modal').focus();
      });

      if(voucher) {
        scope.voucher = voucher;
      }
      if(voucherEntries) {
        scope.voucherEntries = voucherEntries;
        angular.forEach(scope.voucherEntries, function(value, key) {
          utilService.getAccountData({key: scope.voucherEntries[key].key}).then(function(results) {
            scope.voucherEntries[key].name = translateService.translate(results[0].name);
          });
        });
      }

      return defer.promise;
    }

    return {
      show: show
    };
  }]

});