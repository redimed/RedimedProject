angular.module("app.loggedIn.consult.measurement.controller",[])
	.controller("MeasurementController",function($scope,$filter,$state,$modal,toastr,$modalInstance,$stateParams, measure){
		$scope.today = $filter('date')(new Date(),'dd/MM/yyyy');

		$scope.measurementInfo = {
			date: $scope.today,
			bp1: 0,
			bp2: 0,
			rate: 0,
			height: 0,
			weight: 0,
			excessWt: 0,
			bmi: 0,
			waist: 0,
			ratio: 0,
			hips: 0,
			neck: 0,
			headCrc: 0,
			cholesterol: 0,
			psa: 0,
			tryclycerides: 0,
			cretinine: 0,
			hdl: 0,
			acr: 0,
			ldl: 0,
			gfr: 0,
			bsl: 0,
			hba1c: 0,
			isMdrd: null,
			microalbuminuria: 0,
			potassium: 0,
			fev1: 0,
			fvc: 0,
			gasTransfer: 0,
			pressureRight: 0,
			pressureLeft: 0,
			uncorrectedRight: 0,
			uncorrectedLeft: 0,
			correctedRight: 0,
			correctedLeft: 0
		};

		if(measure != null)
			$scope.measurementInfo = angular.copy(measure);

		$scope.cancelClick = function(){
			$modalInstance.close({'type':'cancel'});
		}

		$scope.okClick = function(){
			$modalInstance.close({'type':'ok','value':$scope.measurementInfo});
		}


	})
