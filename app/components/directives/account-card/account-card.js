app.directive('axAccountCard', 
  ['translateService', 

  function(translateService) {
    return {
      restrict: 'E',
      scope: {
        item: '=',
        onEditAccountClicked: '&',
        onDeleteAccountClicked: '&',
        onAddChildClicked: '&'
      },
      templateUrl: 'components/directives/account-card/account-card.html'
    }
  }]
);