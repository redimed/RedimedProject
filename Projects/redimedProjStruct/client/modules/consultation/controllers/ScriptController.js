angular.module("app.loggedIn.patient.consult.scriptController",[])
	.controller("ScriptController",function(medica,$timeout,OutreferralModel,AppointmentModel,ConfigService,$cookieStore,$scope,$filter,$state,$modal,toastr,$modalInstance,ConsultationService,$stateParams){
		var user_id = $cookieStore.get('userInfo').id;
		$scope.medicationInfo = {
			id:null,
	        medication_name:null,
	        start_date:null,
	        dose:null,
	        end_date:null,
	        unit:null,
	        qty:null,
	        route:null,
	        doctor_id:null,
	        NAME:null,
	        frequency:null,
	        condition_Indication:null
		};
		if(medica != null){
			$scope.medicationInfo = angular.copy(medica);
			$scope.medicationInfo.start_date = moment($scope.medicationInfo.start_date).format('DD-MM-YYYY');
			$scope.medicationInfo.end_date = moment($scope.medicationInfo.end_date).format('DD-MM-YYYY');
			console.log($scope.medicationInfo);
		};
		$scope.getDoctorname = function(){
			OutreferralModel.DotorFromUserId(user_id)
			.then(function(response){
				$scope.medicationInfo.doctor_id = response.data[0].doctor_id;
				$scope.medicationInfo.NAME = response.data[0].NAME;
			}, function(error){})
		}
		$scope.getDoctorname();
		//phan quoc chien set list 
		$scope.listUnit = ptnConst.unit;
		$scope.listRoute = ptnConst.route;
		// $scope.listFrequency = ptnConst.frequency;
		//chien end
		
		$scope.changeValue = function(){
			var frequency =0;
			if($scope.medicationInfo.frequency !== null && $scope.medicationInfo.dose !== null && $scope.medicationInfo.start_date !== null && $scope.medicationInfo.end_date !== null){
				switch ($scope.medicationInfo.frequency) {
				    case 'OD':
				        frequency = 1;
				        break;
				    case 'BD':
				        frequency = 2;
				        break;
				    case 'TDS':
				    	frequency = 3;
				        break;
				    case 'QID':
				    	frequency = 4;
				        break;
				}
				var diffInDays =  moment($scope.medicationInfo.end_date, "DD-MM-YYYY").diff(moment($scope.medicationInfo.start_date, "DD-MM-YYYY"), 'days') + 1; // 1 day
				if (diffInDays <= 0) {
					$scope.medicationInfo.qty = null;
				}else{
					var dose = $scope.medicationInfo.dose;
					$scope.medicationInfo.qty = diffInDays*frequency*dose;
				};
			}
		}
		$scope.cancelClick = function(){
			$modalInstance.close({'type':'cancel'});
		}
		
		$scope.okClick = function(){
			$scope.isSubmit = true;
			if (!$scope.medicationForm.$invalid) {
				$modalInstance.close({'type':'ok','value':$scope.medicationInfo});
			};
			
		}

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