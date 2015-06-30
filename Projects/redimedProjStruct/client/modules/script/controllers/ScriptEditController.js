angular.module('app.loggedIn.script')
.controller('ScriptEditController', function($scope, $state, $modalInstance, ID, medicare){
	$scope.scriptedit = {
	  success: false,
	  ID: ID,
	  medicare:medicare
	 }
	 $scope.$watch('scriptedit.success', function(success){
		  if(success){
		   	$modalInstance.close($scope.scriptedit);
		  }
	 })
})