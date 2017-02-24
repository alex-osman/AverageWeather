angular
	.module("ClimateChange", ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/home', {
				templateUrl: '/html/home.html'
			})
			.when('/phev145', {
				templateUrl: '/html/phev145.html'
			})
			.otherwise({ redirectTo: '/home'});
	}])
	.controller("mainCtrl", ['$scope', '$http', function($scope, $http) {
		console.log("Yo")
		$scope.hello = "Hello World"
	}]);
