app.provider('translateService', function() {
  this.$get = ['localizeService', function(localizeService) {
    var translate = function(key) {
      return serializeKey(lang['lang'][localizeService.locale], key);
    }

    var serializeKey = function(obj, key) {
      var arr = key.split(".");
      for(var i = 0; i < arr.length; i++) {
        obj = obj[arr[i]];
      }
      return obj || key;
    }

    return {
      translate: translate
    };
  }]
});