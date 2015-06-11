angular.module('app.loggedIn.script.edit.controller', [])
.controller('ScriptEditController', function($scope, $state, $modalInstance, ID){
	$scope.scriptedit = {
	  success: false,
	  ID: ID
	 }
	 $scope.$watch('scriptedit.success', function(success){
		  if(success){
		   	$modalInstance.close($scope.scriptedit);
		  }
	 })
})