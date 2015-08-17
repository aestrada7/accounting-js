app.provider('notificationService', function() {
  this.$get = ['translateService', '$compile', '$rootScope', '$timeout', '$http',

  function(translateService, $compile, $rootScope, $timeout, $http) {
    var MAX_MILLISECONDS = 4000;
    var REMOVE_MILLISECONDS = 1000;

    var show = function(key, kind, position, icon, autoDisabled) {
      var notificationTemplate = '';
      var scope = $rootScope.$new(true);

      scope.message = translateService.translate(key);
      scope.kind = kind;
      scope.position = position;
      scope.icon = icon;
      scope.dismissed = false;
      scope.autoDisabled = autoDisabled;

      if(!scope.position) {
        scope.position = 'bottom left'
      }

      if(!scope.icon) {
        switch(scope.kind) {
          case 'alert':
          case 'error':
            scope.icon = 'fi-alert';
            break;
          case 'info':
            scope.icon = 'fi-info';
            break;
          case 'success':
            scope.icon = 'fi-check';
            break;
        }
      }

      $http.get('components/services/notification-service/notification-service.html').success(function(data) {
        notificationTemplate = $compile(data)(scope);
        angular.element(document.body).append(notificationTemplate);

        $timeout(function() {
          angular.element('.notification-service').addClass('slide-in');
        }, 100);

        if(!scope.autoDisabled) {
          $timeout(function() {
            scope.dismiss();
          }, MAX_MILLISECONDS);
        }
      });

      scope.dismiss = function() {
        if(!scope.dismissed) {
          scope.dismissed = true;
          angular.element('.notification-service').removeClass('slide-in');
          $timeout(function() {
            angular.element('.notification-service').remove();
          }, REMOVE_MILLISECONDS);
        }
      }
    }

    return {
      show: show
    };
  }]

});