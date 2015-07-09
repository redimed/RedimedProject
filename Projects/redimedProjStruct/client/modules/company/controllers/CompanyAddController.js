angular.module('app.loggedIn.company.controllers.add', [])

.controller('CompanyAddController', function($scope, $state,$modalInstance){
	$scope.actionCenter={
		closeModal:function(){
			$modalInstance.close('success');
		}
	}
})