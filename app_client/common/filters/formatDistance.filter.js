(function () {

  angular
    .module('loc8rApp')
    .filter('formatDistance', formatDistance);

  const _isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);

  function formatDistance() {
    return distance => {
      let numDistance, unit;
      if (distance && _isNumeric(distance)) {
        if (distance > 1) {
          numDistance = parseFloat(distance).toFixed(1);
          unit = 'km'
        } else {
          numDistance = parseInt(distance * 1000, 10);
          unit = 'm'
        }
        return numDistance + unit
      } else {
        return '?'
      }
    }
  }

})();