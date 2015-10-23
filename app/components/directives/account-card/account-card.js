app.directive('axAccountCard', 
  ['translateService', 

  function(translateService) {
    return {
      restrict: 'E',
      scope: {
        item: '=',
        treeView: '=',
        onEditAccountClicked: '&',
        onDeleteAccountClicked: '&',
        onAddChildClicked: '&',
        onCollapseClicked: '&',
        onExpandClicked: '&'
      },
      templateUrl: 'components/directives/account-card/account-card.html'
    }
  }]
);