angular.module('loc8rApp', []);

// Controllers ---------------------------------------------------------------------------------------------------------
// Locations-List Controller
const locationListCtrl = ($scope, loc8rData) => {
  $scope.data = {locations: loc8rData}
};

// Filters -------------------------------------------------------------------------------------------------------------
// Format Distance Filter
const _isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);

const formatDistance = () => {
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
};

// Directives ----------------------------------------------------------------------------------------------------------
// Directive for rendering Rating
const ratingStars = () => {
  return {
    scope: {
      thisRating: '=rating'
    },
    templateUrl: '/angular/rating-stars.html'
  }
};

// Services ------------------------------------------------------------------------------------------------------------
const loc8rData = function () {
  return [{
    name: 'Burger Queen',
    address: '125 High Street, Reading, RG6 1PS',
    rating: 3,
    facilities: ['Hot drinks', 'Food', 'Premium Wifi'],
    distance: '0.296456',
    _id: '5370a35f2536f6785f8dfb6a'
  }, {
    name: 'Costy',
    address: '125 High Street, Reading, RG6 1PS',
    rating: 5,
    facilities: ['Hot drinks', 'Food', 'Alcoholic Drinks'],
    distance: '0.7865456',
    _id: '5370a35f2536f6785f8dfb6a'
  }]
};

angular
  .module('loc8rApp')
  .controller('locationListCtrl', locationListCtrl)
  .filter('formatDistance', formatDistance)
  .directive('ratingStars', ratingStars)
  .service('loc8rData', loc8rData);