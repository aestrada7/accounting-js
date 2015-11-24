app.provider('utilService', function() {
  this.$get = ['$q', 'translateService', function($q, translateService) {

    var getAccountData = function(args, extraArguments) {
      var defer = $q.defer();
      accountsDB.find(args, function(err, results) {
        if(err) {
          defer.reject();
        }
        if(extraArguments) results.extra = extraArguments;
        defer.resolve(results);
      });
      return defer.promise;
    }

    var getVouchers = function(args, extraArguments) {
      var defer = $q.defer();
      vouchersDB.find(args, function(err, results) {
        if(err) {
          defer.reject();
        }
        if(extraArguments) results.extra = extraArguments;
        defer.resolve(results);
      });
      return defer.promise;
    }

    var getVoucherEntries = function(args, extraArguments) {
      var defer = $q.defer();
      voucherEntriesDB.find(args, function(err, results) {
        if(err) {
          defer.reject();
        }
        if(extraArguments) results.extra = extraArguments;
        defer.resolve(results);
      });
      return defer.promise;
    }

    var getMonthName = function(currentMonth) {
      var monthName = '';
      switch(currentMonth) {
        case 1:
          monthName = translateService.translate('global.months.january');
          break;
        case 2:
          monthName = translateService.translate('global.months.february');
          break;
        case 3:
          monthName = translateService.translate('global.months.march');
          break;
        case 4:
          monthName = translateService.translate('global.months.april');
          break;
        case 5:
          monthName = translateService.translate('global.months.may');
          break;
        case 6:
          monthName = translateService.translate('global.months.june');
          break;
        case 7:
          monthName = translateService.translate('global.months.july');
          break;
        case 8:
          monthName = translateService.translate('global.months.august');
          break;
        case 9:
          monthName = translateService.translate('global.months.september');
          break;
        case 10:
          monthName = translateService.translate('global.months.october');
          break;
        case 11:
          monthName = translateService.translate('global.months.november');
          break;
        case 12:
          monthName = translateService.translate('global.months.december');
          break;
      }
      return monthName;
    }

    return {
      getAccountData: getAccountData,
      getVouchers: getVouchers,
      getVoucherEntries: getVoucherEntries,
      getMonthName: getMonthName
    };
  }]
});