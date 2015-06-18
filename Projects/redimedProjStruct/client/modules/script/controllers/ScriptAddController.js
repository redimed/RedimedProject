angular.module('app.loggedIn.script.add.controller', [])
.controller('ScriptAddController', function($scope, $state,$modalInstance,medicare){
	$scope.scriptadd = {
	  success: false,
	  medicare:medicare
	}
	//console.log('_________',  $scope.scriptadd.medicare);
	$scope.$watch('scriptadd.success', function(success){
		  if(success){
		   $modalInstance.close($scope.scriptadd);
		  }
	})
})