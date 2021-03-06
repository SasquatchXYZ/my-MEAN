(function () {

  angular
    .module('loc8rApp')
    .controller('homeCtrl', homeCtrl);

  homeCtrl.$inject = ['$scope', 'loc8rData', 'geolocation'];

  function homeCtrl($scope, loc8rData, geolocation) {
    const vm = this;
    vm.pageHeader = {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    };
    vm.sidebar = {
      content: "Looking for wifi and a seat?  Loc8r helps you find places to work when out and about.  Perhaps with coffee, cake or a pint?  Let Loc8r help you find the place you're looking for."
    };
    vm.message = 'Checking your location...';

    vm.getData = function (position) {
      const lat = position.coords.latitude,
        lng = position.coords.longitude;
      vm.message = 'Searching For Nearby Places...';
      loc8rData.locationByCoords(lat, lng)
        .then(function(results) {
          // console.log(results);
          vm.message = results.data.length > 0 ? '' : 'No Locations Found.';
          vm.data = {locations: results.data}
        }, function (e) {
          vm.message = 'Sorry, Something\'s Gone Wrong...';
          console.log(e)
        })
    };

    vm.showError = function (error) {
      $scope.$apply(function () {
        vm.message = error.message
      })
    };

    vm.noGeo = function () {
      $scope.$apply(function () {
        vm.message = 'Geolocation not supported by this browser.'
      })
    };

    geolocation.getPosition(vm.getData, vm.showError, vm.noGeo)
  }

})();