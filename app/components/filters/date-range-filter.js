app.filter('DateRangeFilter', function() {
  return function(items, from, to) {
    var results = [];
    if(from && to) {
      for(var i = 0; i < items.length; i++) {
        var currentDate = items[i].date;
        if(currentDate >= from && currentDate <= to) {
          results.push(items[i]);
        }
      }
    } else if(from) {
      for(var i = 0; i < items.length; i++) {
        var currentDate = items[i].date;
        if(currentDate >= from) {
          results.push(items[i]);
        }
      }
    } else if(to) {
      for(var i = 0; i < items.length; i++) {
        var currentDate = items[i].date;
        if(currentDate <= to) {
          results.push(items[i]);
        }
      }
    } else {
      results = items;
    }
    return results;
  }
});