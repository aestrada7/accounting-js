app.provider('localizeService', function() {
  this.$get = function() {
    return {
      locale: 'es'
    };
  }
});