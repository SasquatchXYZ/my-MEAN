angular.module('loc8rApp', []);

// Controllers ---------------------------------------------------------------------------------------------------------
// Locations-List Controller
const locationListCtrl = ($scope, loc8rData, geolocation) => {
  $scope.message = 'Checking your location...';

  $scope.getData = position => {
    const lat = position.coords.latitude,
      lng = position.coords.longitude;
    $scope.message = 'Searching For Nearby Places...';
    loc8rData.locationByCoords(lat, lng)
      .then(results => {
        console.log(results);
        $scope.message = results.data.length > 0 ? '' : 'No Locations Found.';
        $scope.data = {locations: results.data}
      }, e => {
        $scope.message = 'Sorry, Something\'s Gone Wrong...';
        console.log(e)
      })
  };

  $scope.showError = error => {
    $scope.$apply(() => {
      $scope.message = error.message
    })
  };

  $scope.noGeo = () => {
    $scope.$apply(() => {
      $scope.message = 'Geolocation not supported by this browser.'
    })
  };

  geolocation.getPosition($scope.getData, $scope.showError, $scope.noGeo)
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
  const locationByCoords = (lat, lng) => {
    return $http.get(`/api/locations?lng=${lng}&lat=${lat}&maxDistance=20`)
  };
  return {
    locationByCoords: locationByCoords
  }
};

// Service for Geolocation of the User.
const geolocation = function () {
  const getPosition = function (cbSuccess, cbError, cbNoGeo) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(cbSuccess, cbError)
    } else {
      cbNoGeo();
    }
  };
  return {
    getPosition : getPosition
  }
};

angular
  .module('loc8rApp')
  .controller('locationListCtrl', locationListCtrl)
  .filter('formatDistance', formatDistance)
  .directive('ratingStars', ratingStars)
  .service('loc8rData', loc8rData)
  .service('geolocation', geolocation);