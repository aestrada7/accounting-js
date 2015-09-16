app.controller('CatalogsController', 
  ['$scope', '$q', 'notificationService', 'translateService', 'accountModalService', 'confirmService',

  function($scope, $q, notificationService, translateService, accountModalService, confirmService) {
    $scope.catalogs = {
      selectedTab: 'general'
    };

    $scope.tabSelect = function(tabName) {
      $scope.catalogs.selectedTab = tabName;
    }

    $scope.onAddAccountClicked = function() {
      accountModalService.show();
    }

    $scope.onEditAccountClicked = function(item) {
      accountModalService.show(item);
    }

    $scope.onDeleteAccountClicked = function(item) {
      var confirmOptions = {
        label: 'delete?',
        icon: '',
        kind: 'delete',
        cancelLabel: 'cancel!',
        confirmLabel: 'confirm!!'
      }

      confirmService.show(confirmOptions).then(function(result) {
        console.log("delete");
      }, function(result) {
        console.log("no oopsie");
      });
    }

    fetchData = function(args) {
      var defer = $q.defer();
      accountsDB.find(args, function(err, results) {
        defer.resolve(results);
      });
      return defer.promise;
    }

    invalidateList = function() {
      fetchData({}).then(function(results) {
        angular.forEach(results, function(value, key) {
          results[key].name = translateService.translate(results[key].name);
        });
        $scope.items = results;
      });
    }

    invalidateList();
  }]
);