angular.module('app.loggedIn.script')
.controller('ScriptAddController', function($scope, $state,$modalInstance,medicare){
	$scope.scriptadd = {
	  success: false,
	  medicare:medicare
	}
	$scope.$watch('scriptadd.success', function(success){
		  if(success){
		   $modalInstance.close($scope.scriptadd);
		  }
	})
})