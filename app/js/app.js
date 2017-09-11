var app = angular.module('tabsAndSyrups', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/home',{
		templateUrl : 'html/home.html',
		controller : 'HomeCtrl'
	}).when('/user', {
		templateUrl : 'html/user.html',
		controller : 'UserCtrl'
	}).otherwise({
		redirectTo : '/home'
	})
}]);

app.run(function($rootScope){
	$rootScope.userOne = {};
});

app.service('UserAssemble',function(){
	this.modifyResult = function(users, ids){
		var array = [], users = users, ids = ids;
		for(var i = 0; i < ids.length; i++){
			var id = ids[i], user = users[id];
			user.id = id;
			array.push(user);
		}
		return array;
	}
});

app.controller('HomeCtrl', function($rootScope, $scope, $http, $location, UserAssemble){
	$http.get('https://interview-ae670.firebaseio.com/Employees.json').then(function(data){
		console.log(data);
		$scope.finalUsers = UserAssemble.modifyResult(data.data, Object.keys(data.data));
		console.log($scope.finalUsers);
	})

	$scope.addUser = function(){
		var user = {'Áge': $scope.new.Age, "Name" : $scope.new.Name}
		console.log(Date.now());
		$http({
			
			data : user,
         	
			url : 'https://interview-ae670.firebaseio.com/Employees/9c23be18-8f31-81e3-cc20-f365282066b1.json',
			
			method : 'POST'
		}).then(function(data){
			console.log(data);
		})
	}

	$scope.userClick = function(index){
		$rootScope.userOne = $scope.finalUsers[index];
		console.log($rootScope.userOne);
		$location.path('/user');
	}
});

app.controller('UserCtrl', function($rootScope, $scope,  $http){
	$scope.deleteUser = function(){
		$http({
			url : 'https://interview-ae670.firebaseio.com/Employees/'+$rootScope.userOne.id+'.json',
			method : 'DELETE'
		}).then(function(data){
			console.log(data);
		})
	}

	$scope.updateUser = function(){
		var user = {'Áge': $scope.userOne.Age, "Name" : $scope.userOne.Name}
		$http({
			url : 'https://interview-ae670.firebaseio.com/Employees/'+$rootScope.userOne.id+'.json',
			method : 'PUT',
			rawModeData : user
		}).then(function(data){
			console.log(data);
		})
	}
})