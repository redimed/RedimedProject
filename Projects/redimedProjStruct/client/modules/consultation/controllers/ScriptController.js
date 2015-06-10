angular.module("app.loggedIn.patient.consult.scriptController",[])
	.controller("ScriptController",function($scope,$filter,$state,$modal,toastr,$modalInstance,ConsultationService,$stateParams, script){
		$scope.scriptInfo = {
			        medication_name:null,
			        start_date:null,
			        dose:null,
			        end_date:null,
			        unit:null,
			        qty:null,
			        route:null,
			        doctor_id:null,
			        frequency:null,
			        condition_Indication:null
		};
		//phan quoc chien set list 
		$scope.listUnit = ptnConst.unit;
		$scope.listRoute = ptnConst.route;
		$scope.listFrequency = ptnConst.frequency;
		//chien end
		$scope.medications = [];
		$scope.selectedMedication = null;
		$scope.checkMedication = true;

		ConsultationService.searchScript({medicine_name: ''}).then(function(rs){
			$scope.medications = rs.list;
			for(var i=0; i<$scope.medications.length; i++)
			{
				var item = $scope.medications[i];
				var unit = 'Unit: '+item.medicine_unit;

				$scope.medications[i].desc = unit;
			}
		})

		if(script != null)
			$scope.scriptInfo = angular.copy(script);

		$scope.cancelClick = function(){
			$modalInstance.close({'type':'cancel'});
		}

		$scope.okClick = function(){
			
			$modalInstance.close({'type':'ok','value':$scope.scriptInfo});
		}

		$scope.$watch('selectedMedication',function(val){
			if(typeof val !== 'undefined' && val != null)
			{
				// $scope.checkMedication = true;
				var medicine = val.originalObject;

				$scope.scriptInfo.medication = medicine.medicine_name;
				$scope.scriptInfo.qty = 1;
			}
			// else
			// {
			// 	$scope.checkMedication = false;
			// }
		})

	})

	.directive('number', function(){
	   return {
	     require: 'ngModel',
	     link: function(scope, element, attrs, modelCtrl) {
	       modelCtrl.$parsers.push(function (inputValue) {
	           if (inputValue == undefined) return '' 
	           var transformedInput = inputValue.replace(/[^0-9]/g, ''); 
	           if (transformedInput!=inputValue) {
	              modelCtrl.$setViewValue(transformedInput);
	              modelCtrl.$render();
	           }         

	           return transformedInput;         
	       });
	         
	         element.bind('keypress', function(event) {
		        if(event.keyCode === 32) {
		          event.preventDefault();
		        }
		      });
	     }
	   };
	})