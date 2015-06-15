angular.module('app.loggedIn.script.add.controller', [])
.controller('ScriptAddController', function($scope, $state,$modalInstance,medicaname){
	$scope.scriptadd = {
	  success: false,
	  medicaname:medicaname
	 }
	 $scope.$watch('scriptadd.success', function(success){
		  if(success){
		   $modalInstance.close($scope.scriptadd);
		  }
	 })
})