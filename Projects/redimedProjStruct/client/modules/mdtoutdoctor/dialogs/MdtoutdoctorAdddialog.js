angular.module('app.loggedIn.mdtoutdoctor.add.dialog', [])
.controller('MdtoutdoctorAdddialog', function($scope,$modalInstance){
	$scope.OutsideDoctor = {
		success: false,
		data:null
	}
	$scope.$watch('OutsideDoctor.success', function(success){
		if(success){
			$scope.$watch('OutsideDoctor.data', function(success){
					$modalInstance.close($scope.OutsideDoctor.data);
			})
		}	
	})
})