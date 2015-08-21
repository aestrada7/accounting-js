app.controller('OrganizationController', 
  ['$scope', '$q', 'notificationService',

  function($scope, $q, notificationService) {
    $scope.organization = {
      businessName: '',
      tin: '',
      address: '',
      exerciseYear: '',
      startMonth: 0
    };

    $scope.saveOrganization = function() {
      var organizationData = { '_id': 1,
                               'businessName': $scope.organization.businessName,
                               'tin': $scope.organization.tin,
                               'address': $scope.organization.address,
                               'exerciseYear': $scope.organization.exerciseYear,
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
        if(results[0]) {
          $scope.organization.businessName = results[0].businessName;
          $scope.organization.tin = results[0].tin;
          $scope.organization.address = results[0].address;
          $scope.organization.exerciseYear = parseInt(results[0].exerciseYear);
          $scope.organization.startMonth = results[0].startMonth;
        }
      });
    }

    invalidateList();
  }]
);