app.controller('AboutController', 
  ['$scope', 

  function($scope) {
    $scope.components = [{ name: 'node.js', kind: 'JS' },
                         { name: 'Angular.js', kind: 'JS' },
                         { name: 'nw.js', kind: 'JS' },
                         { name: 'jQuery', kind: 'JS' },
                         { name: 'SASS', kind: 'node' },
                         { name: 'CSS3', kind: 'CSS' },
                         { name: 'HTML5', kind: 'HTML' },
                         { name: 'Bower', kind: 'node' },
                         { name: 'Grunt', kind: 'node' },
                         { name: 'Git', kind: 'other'}];
    $('.loading').fadeOut(200);
  }]
);