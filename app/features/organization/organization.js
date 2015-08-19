app.controller('OrganizationController', 
  ['$scope', '$q', 'notificationService',

  function($scope, $q, notificationService) {
    $scope.businessName = '';
    $scope.tin = '';
    $scope.address = '';
    $scope.exerciseYear = '';
    $scope.startMonth = 0;

    $scope.saveOrganization = function() {
      var organizationData = { '_id': 1,
                               'businessName': $scope.businessName,
                               'tin': $scope.tin,
                               'address': $scope.address,
                               'exerciseYear': $scope.exerciseYear,
                               'startMonth': $('#org-start-month').val() };
      organizationDB.insert(organizationData, function(err, newItem) {
        if(err.key === 1) {
          organizationDB.update({ _id: 1 }, { $set: organizationData }, { multi: false }, function (err, numReplaced) {
            invalidateList();
            saveSuccess();
          });
        }
        invalidateList();
        saveSuccess();
      });
    }

    saveSuccess = function() {
      notificationService.show('global.notifications.saved-successfully', 'success', 'top right', '', false);
    }

    fetchData = function(args) {
      var defer = $q.defer();
      organizationDB.find(args, function(err, results) {
        defer.resolve(results);
      });
      return defer.promise;
    }

    invalidateList = function() {
      fetchData({}).then(function(results) {
        $scope.businessName = results[0].businessName;
        $scope.tin = results[0].tin;
        $scope.address = results[0].address;
        $scope.exerciseYear = results[0].exerciseYear;
        $scope.startMonth = results[0].startMonth;
      });
    }

    invalidateList();
  }]
);