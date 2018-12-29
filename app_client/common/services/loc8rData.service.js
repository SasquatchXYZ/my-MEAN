angular
  .module('loc8rApp')
  .service('loc8rData', loc8rData);

const loc8rData = function ($http) {
  const locationByCoords = (lat, lng) => {
    return $http.get(`/api/locations?lng=${lng}&lat=${lat}&maxDistance=20`)
  };
  return {
    locationByCoords: locationByCoords
  }
};