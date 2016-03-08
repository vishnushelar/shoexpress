angular.module('mttapp.filters', [])
  .filter('commonfilter', CommonFilter);

function CommonFilter() {
  return function (input, count) {
    var out = [];
    if (typeof input === "object") {
      for (var i = 0, j = input.length; i < j; i += count) {
        out.push(input.slice(i, i + count));
      }
    }
    return out;
  }
}
