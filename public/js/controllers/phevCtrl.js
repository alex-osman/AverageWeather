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
      $scope.temps = [];
      $http.get('/api/avg/' + $scope.airport + '/' + $scope.start + '/' + $scope.end)
      .success(function(data) {
        console.log(data);
        $scope.loading = "";
        $scope.temps = data;
      })
      .error(function(err) {
        $scope.loading = "Something went wrong"
      })
    }

    $scope.max = function() {
      $scope.city = ""
      $scope.loading = "Loading...";
      $http.get('/api/city/' + $scope.airport)
      .success(function(city) {
        console.log(city)
        $scope.city = city;
      })
      $scope.temps = [];
      $http.get('/api/max/' + $scope.airport + '/' + $scope.start + '/' + $scope.end)
      .success(function(data) {
        console.log(data);
        $scope.loading = "";
        $scope.temps = data;
      })
      .error(function(err) {
        $scope.loading = "Something went wrong"
      })
    }

    $scope.min = function() {
      $scope.city = ""
      $scope.loading = "Loading...";
      $http.get('/api/city/' + $scope.airport)
      .success(function(city) {
        console.log(city)
        $scope.city = city;
      })
      $scope.temps = [];
      $http.get('/api/min/' + $scope.airport + '/' + $scope.start + '/' + $scope.end)
      .success(function(data) {
        console.log(data);
        $scope.loading = "";
        $scope.temps = data;
      })
      .error(function(err) {
        $scope.loading = "Something went wrong"
      })
    }

    $scope.dew = function() {
      $scope.city = ""
      $scope.loading = "Loading...";
      $http.get('/api/city/' + $scope.airport)
      .success(function(city) {
        console.log(city)
        $scope.city = city;
      })
      $scope.temps = [];
      $http.get('/api/dew/' + $scope.airport + '/' + $scope.start + '/' + $scope.end)
      .success(function(data) {
        console.log(data);
        $scope.loading = "";
        $scope.temps = data;
      })
      .error(function(err) {
        $scope.loading = "Something went wrong"
      })
    }

    $scope.precipitation = function() {
      $scope.city = ""
      $scope.loading = "Loading...";
      $http.get('/api/city/' + $scope.airport)
      .success(function(city) {
        console.log(city)
        $scope.city = city;
      })
      $scope.temps = [];
      $http.get('/api/precipitation/' + $scope.airport + '/' + $scope.start + '/' + $scope.end)
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
