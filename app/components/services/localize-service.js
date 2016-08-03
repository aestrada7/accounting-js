app.provider('localizeService', function() {
  this.$get = function() {
    var localeValue = 'en';
    var navigatorLanguage = window.navigator.language;

    if(navigatorLanguage !== 'en' && navigatorLanguage !== 'en-us') {
      localeValue = navigatorLanguage;
    }

    return {
      locale: localeValue
    };
  }
});