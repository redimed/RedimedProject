angular.module('app.loggedIn.script.add.controller', [])
.controller('ScriptAddController', function($scope, $state,$modalInstance){
	$scope.scriptadd = {
	  success: false,
	 }
	 $scope.$watch('scriptadd.success', function(success){
		  if(success){
		   $modalInstance.close($scope.scriptadd);
		  }
	 })
})