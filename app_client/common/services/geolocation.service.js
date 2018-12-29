angular
  .module('loc9rApp')
  .service('geolocation', geolocation);

const geolocation = function () {
  const getPosition = function (cbSuccess, cbError, cbNoGeo) {
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