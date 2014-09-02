/**
 * Created by meditech on 8/26/2014.
 */
app.controller("loginController",function($scope,$http,$location){
	$scope.login = function(){
		var user = $scope.user;
		var pass = $scope.pass;
	
		$http({
        method:"POST",
        url:"/users/login",
        data:{user:$scope.user,
				pass:$scope.pass}
		})
		.success(function(data) {
			
			if(data['status'] === 'success')
			{
				$location.url('/');
			}
			else
			{
				$location.url('/login');
			}
		})
		.error(function (data) {
			console.log(data);
			$location.url('/login');
		})
		.finally(function() {
			
		});
	};
	
	$scope.register = function(){
		$http({
        method:"POST",
        url:"/users/register",
        data:{user:$scope.user}
		})
		.success(function(data) {
			
			if(data['status'] === 'success')
			{
				alert("Register successfully!");
			}
			else
			{
				alert("Register failed!");
			}
		})
		.error(function (data) {
			alert("Register failed!!!");
		})
		.finally(function() {
			
		});
	};
});