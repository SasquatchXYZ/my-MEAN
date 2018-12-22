angular.module('loc8rApp', []);

// Controllers ---------------------------------------------------------------------------------------------------------
// Locations-List Controller
const locationListCtrl = $scope => {
  $scope.data = {
    locations: [{
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
  }
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

angular
  .module('loc8rApp')
  .controller('locationListCtrl', locationListCtrl)
  .filter('formatDistance', formatDistance)
  .directive('ratingStars', ratingStars);