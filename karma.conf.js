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
            //'app/components/filters/date-range-filter.js',
            //'app/components/services/translate-service.js',
            //'app/components/services/localize-service.js',
            //'app/components/services/notification-service/notification-service.js',
            //'app/components/services/account-modal-service/account-modal-service.js',
            //'app/components/services/voucher-modal-service/voucher-modal-service.js',
            //'app/components/services/confirm-service/confirm-service.js',
            //'app/components/services/util-service.js',
            //'app/components/directives/autocomplete/autocomplete.js',
            //'app/components/directives/account-card/account-card.js',
            //'app/components/directives/key-handler/key-handler.js',
            //'app/components/directives/enter-click/enter-click.js',
            //'app/components/directives/focus/focus.js',
            //'app/components/directives/ftue/ftue.js',
            //'app/components/directives/grid/grid.js',
            //'app/components/directives/month-select/month-select.js',
            //'app/components/directives/on-change/on-change.js',
            //'app/components/directives/translate/translate.js',
            //'app/components/directives/translate-attrs/translate-attrs.js',
            //'app/components/directives/trap-focus/trap-focus.js',
            //'app/components/directives/validate/validate.js',
            //'app/features/about/about.js',
            //'app/features/catalogs/catalogs.js',
            //'app/features/vouchers/vouchers.js',
            'app/features/playground/playground.js',
            //'app/features/organization/organization.js',
            //'app/features/home/home.js',
            //'app/features/account-balance/account-balance.js',
            //'app/features/general-balance/general-balance.js',
            //'app/features/income-statement/income-statement.js',
            'test/**/*.js'],
    exclude: [
    ],
    preprocessors: {
      'app/app.js': ['browserify'],
      //'app/features/**/*.js': ['browserify'],
      //'test/**/*.js': ['browserify']
    },
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    //browsers: ['PhantomJS', 'Chrome'],
    browsers: ['PhantomJS'],
    singleRun: true,
    concurrency: Infinity
  })
}
