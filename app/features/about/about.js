app.controller('AboutController', 
  ['$scope', 

  function($scope) {
    $scope.components = [{ name: 'node.js', kind: 'js' },
                         { name: 'Angular.js', kind: 'js' },
                         { name: 'nw.js', kind: 'js' },
                         { name: 'jQuery', kind: 'js' },
                         { name: 'SASS', kind: 'node' },
                         { name: 'CSS3', kind: 'CSS' },
                         { name: 'HTML5', kind: 'HTML' },
                         { name: 'Foundation 4', kind: 'js' },
                         { name: 'Bower', kind: 'node' },
                         { name: 'Grunt', kind: 'node' },
                         { name: 'Git', kind: 'other' },
                         { name: 'ESLint', kind: 'js'},
                         { name: 'SASS Lint', kind: 'CSS'},
                         { name: 'Jasmine', kind: 'js' }];
    $('.loading').fadeOut(FADE_OUT_MILLISECONDS);

    $scope.version = require('nw.gui').App.manifest.version;

    $('a[target=_blank]').on('click', function() {
      require('nw.gui').Shell.openExteral(this.href);
      return false;
    });
  }]
);