const myController = $scope => $scope.myInput = "world!";

angular
  .module('myApp')
  .controller('myController', myController);