app.provider('voucherModalService', function() {
  this.$get = ['$q', 'translateService', 'notificationService', 'confirmService', '$compile', '$rootScope', '$http',

  function($q, translateService, notificationService, confirmService, $compile, $rootScope, $http) {

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
        $('#voucher-modal').foundation('reveal', 'open', {
          close_on_background_click: false,
          close_on_esc: false
          //dismiss_modal_class: ''
        });
      });

      scope.onAddVoucherEntryClicked = function() {
        scope.voucherEntries.push({});
      }

      scope.onRemoveVoucherEntryClicked = function() {
        scope.voucherEntries.pop();
      }

      scope.saveVoucher = function() {
        var voucherData = { '_id': scope.voucher._id,
                            'key': scope.voucher.key,
                            'date': scope.voucher.date,
                            'description': scope.voucher.description,
                            'kind': scope.voucher.kind };
        if(scope.voucher._id) {
          //edit, not working yet
        } else {
          vouchersDB.insert(voucherData, function(err, newItem) {
            if(err && err.errorType === 'uniqueViolated') {
              saveFailure(err.key);
            } else {
              angular.forEach(scope.voucherEntries, function(value, key) {
                var voucherEntryData = { '_id': scope.voucherEntries[key]._id,
                                         'item': scope.voucherEntries[key].item,
                                         'key': scope.voucherEntries[key].key,
                                         'debits': scope.voucherEntries[key].debits,
                                         'credits': scope.voucherEntries[key].credits };
                console.log(voucherEntryData);
                if(voucherEntryData._id) {
                  //edit, not working yet
                } else {
                  voucherEntriesDB.insert(voucherEntryData, function(err, newItem) {
                    //console.log('save');
                  });
                }
              });
              saveSuccess();
            }
          });
        }
      }

      getAccountData = function(args) {
        var defer = $q.defer();
        accountsDB.find(args, function(err, results) {
          defer.resolve(results);
        });
        return defer.promise;
      }

      scope.onChangeKey = function(item) {
        getAccountData({key: item.key}).then(function(results) {
          item.name = translateService.translate(results[0].name);
        });
      }

      scope.onChangeName = function(item) {
        var itemName = '';
        getAccountData().then(function(results) {
          angular.forEach(results, function(value, key) {
            if(item.name === translateService.translate(results[key].name)) {
              itemName = results[key].name;
            }
          });
          getAccountData({name: itemName}).then(function(results) {
            item.key = results[0].key;
          });
        });
      }

      scope.dismiss = function() {
        $('#voucher-modal').foundation('reveal', 'close');
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