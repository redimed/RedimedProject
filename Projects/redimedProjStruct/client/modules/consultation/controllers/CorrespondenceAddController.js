angular.module('app.loggedIn.corres.add.controller', [])
.controller('CorrespondenceAddController', function($scope, $state, $modalInstance ){
	$scope.addcor = {
		success: false
	}

	$scope.$watch('addcor.success', function(success){
		if(success){
			$modalInstance.close('success');
		}
	})
})