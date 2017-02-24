angular
  .module("ClimateChange")
  .controller("phevCtrl", ["$scope", "$http", function($scope, $http) {

    $scope.generate = function() {
      $http.get('/api/' + $scope.airport)
      .success(function(data) {
        console.log(data);
        $scope.temps = data;
      })
    }
  }])