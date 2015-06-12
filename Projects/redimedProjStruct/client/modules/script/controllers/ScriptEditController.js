angular.module('app.loggedIn.script.edit.controller', [])
.controller('ScriptEditController', function($scope, $state, $modalInstance, ID,medicaname){
	$scope.scriptedit = {
	  success: false,
	  ID: ID,
	  medicaname:medicaname
	 }
	 $scope.$watch('scriptedit.success', function(success){
		  if(success){
		   	$modalInstance.close($scope.scriptedit);
		  }
	 })
})