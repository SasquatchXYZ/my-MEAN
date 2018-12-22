angular.module('loc8rApp', []);

// Controllers ---------------------------------------------------------------------------------------------------------
// Locations-List Controller
const locationListCtrl = ($scope, loc8rData, geolocation) => {
  $scope.message = 'Searching For Nearby Places...';
  loc8rData
    .then(results => {
      $scope.message = results.data.length > 0 ? '' : 'No Locations Found.';
      $scope.data = {locations: results.data}
    }, e => {
      $scope.message = 'Sorry, Something\'s Gone Wrong...';
      console.log(e)
    })
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
// Service to Fetch the Database Information
const loc8rData = function ($http) {
  return $http.get('/api/locations?lng=-84.238690&lat=33.879700&maxDistance=20');
  /*return [{
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
  }]*/
};

// Service for Geolocation of the User.
const geolocation = function () {
  const getPosition = (cbSuccess, cbError, cbNoGeo) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(cbSuccess, cbError)
    } else {
      cbNoGeo();
    }
  };
  return {
    getPosition: getPosition
  }
};

angular
  .module('loc8rApp')
  .controller('locationListCtrl', locationListCtrl)
  .filter('formatDistance', formatDistance)
  .directive('ratingStars', ratingStars)
  .service('loc8rData', loc8rData)
  .service('geolocation', geolocation);