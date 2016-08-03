app.filter('DateRangeFilter', function() {
  return function(items, from, to) {
    var results = [];
    var i = 0;
    var currentDate;

    if(from && to) {
      for(i = 0; i < items.length; i++) {
        currentDate = items[i].date;
        if(currentDate >= from && currentDate <= to) {
          results.push(items[i]);
        }
      }
    } else if(from) {
      for(i = 0; i < items.length; i++) {
        currentDate = items[i].date;
        if(currentDate >= from) {
          results.push(items[i]);
        }
      }
    } else if(to) {
      for(i = 0; i < items.length; i++) {
        currentDate = items[i].date;
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