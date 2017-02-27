angular
  .module("ClimateChange")
  .controller("phevCtrl", ["$scope", "$http", function($scope, $http) {
    $scope.start = 2007
    $scope.end = 2016

    $scope.generate = function() {
      $scope.city = ""
      $scope.loading = "Loading...";
      $http.get('/api/city/' + $scope.airport)
      .success(function(city) {
        console.log(city)
        $scope.city = city;
      })
      $http.get('/api/' + $scope.airport + '/' + $scope.start + '/' + $scope.end)
      .success(function(data) {
        console.log(data);
        $scope.loading = "";
        $scope.temps = data;
      })
      .error(function(err) {
        $scope.loading = "Something went wrong"
      })
    }
  }])
