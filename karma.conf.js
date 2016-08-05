module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    frameworks: ['jasmine', 'browserify'],
    files: ['app/vendor/jquery/jquery.js',
            'app/vendor/modernizr/modernizr.js',
            'app/vendor/foundation/js/foundation.js',
            'app/vendor/angular/angular.js',
            'app/vendor/angular-ui-router/angular-ui-router.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'app/consts.js',
            'app/lang.js',
            'app/app.js',
            'app/components/filters/*.js',
            'app/components/services/**/*.js',
            'app/components/directives/**/*.js',
            'app/features/**/*.js',
            'test/**/*.js'],
    exclude: [
    ],
    preprocessors: {
      'app/app.js': ['browserify']
    },
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS', 'Chrome'],
    singleRun: true,
    concurrency: Infinity
  })
}
