angular.module("app.loggedIn.patient.consult")
	.controller("MeasurementController",function($scope,$filter,$state,$modal,toastr,$modalInstance,$stateParams, measure){
		$scope.today = $filter('date')(new Date(),'dd/MM/yyyy');

		$scope.measurementInfo = {
			measure_date: new Date(),
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
			head_circ: 0,
			cholesterol: 0,
			psa: 0,
			triglycerides: 0,
			creatitine: 0,
			hdl: 0,
			acr: 0,
			ldl: 0,
			gfr: 0,
			bsl: 0,
			hbA1c: 0,
			isMdrd: null,
			isCockroft_gault: null,
			microalbuminuria: 0,
			potassium: 0,
			fev1: 0,
			fvc: 0,
			gas_transfer: 0,
			right_pressure: 0,
			left_pressure: 0,
			right_uncorrected: 0,
			left_uncorrected: 0,
			right_corrected: 0,
			left_corrected: 0
		};

		if(measure != null)
			$scope.measurementInfo = angular.copy(measure);

		$scope.cancelClick = function(){
			$modalInstance.close({'type':'cancel'});
		}

		$scope.okClick = function(){
			if($scope.measurementInfo.isMdrd == 0)
				$scope.measurementInfo.isCockroft_gault = 1;
			else if($scope.measurementInfo.isMdrd == 1)
				$scope.measurementInfo.isCockroft_gault = 0;

			$modalInstance.close({'type':'ok','value':$scope.measurementInfo});
		}

		$scope.calculateBMI = function(height,weight){
			var w = null;
			var h = null;
			var bmi = 0;

			if(weight != null && typeof weight != 'undefined' && weight != '' && !isNaN(parseFloat(weight)))
				w = parseFloat(weight);
			else
				w = null;

			if(height != null && typeof height != 'undefined' && height != '' && !isNaN(parseFloat(height)))
				h = (parseFloat(height) * 0.01);
			else
				h = null;

			if(w != null && h != null)
			{
				bmi = (w/(h*h));
				$scope.measurementInfo.bmi = $filter('number')(bmi, 2);
			}
			else
				$scope.measurementInfo.bmi = 0;
		}


	})
