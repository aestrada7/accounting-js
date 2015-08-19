app.directive('axMonthSelect', 
  ['translateService', 

  function(translateService) {
    return {
      restrict: 'E',
      scope: {
        id: '@',
        selectedMonth: '@'
      },
      link: function(scope, element, attrs) {
        scope.months = [{ name: '', id: 0 },
                        { name: translateService.translate('global.months.january'), id: 1 },
                        { name: translateService.translate('global.months.february'), id: 2 },
                        { name: translateService.translate('global.months.march'), id: 3 },
                        { name: translateService.translate('global.months.april'), id: 4 },
                        { name: translateService.translate('global.months.may'), id: 5 },
                        { name: translateService.translate('global.months.june'), id: 6 },
                        { name: translateService.translate('global.months.july'), id: 7 },
                        { name: translateService.translate('global.months.august'), id: 8 },
                        { name: translateService.translate('global.months.september'), id: 9 },
                        { name: translateService.translate('global.months.october'), id: 10 },
                        { name: translateService.translate('global.months.november'), id: 11 },
                        { name: translateService.translate('global.months.december'), id: 12 }];
      },
      templateUrl: 'components/directives/month-select/month-select.html'
    }
  }]
);