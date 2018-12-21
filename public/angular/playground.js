angular.module('myApp', []);

const myController = $scope => $scope.myInput = "World!";

angular
  .module('myApp')
  .controller('myController', myController);