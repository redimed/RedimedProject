angular.module("app.loggedIn.patient.consult.scriptController",[])
	.controller("ScriptController",function($timeout,OutreferralModel,AppointmentModel,ConfigService,$cookieStore,$scope,$filter,$state,$modal,toastr,$modalInstance,ConsultationService,$stateParams, actual_doctor_id,script){
		// if (actual_doctor_id === undefined) {
		// 	actual_doctor_id ={
		// 		NAME :null
		// 	};
		// };
		// $scope.user_name = $cookieStore.get("userInfo").user_name;
		$scope.postData = {
			CAL_ID:$stateParams.cal_id,
			DOCTOR_ID:null,
			user_name:null,
			Provider_no:null
		};
		$scope.scriptInfo = {
			        medication_name:null,
			        start_date:null,
			        dose:null,
			        end_date:null,
			        unit:null,
			        qty:null,
			        route:null,
			        doctor_id:null,
			        user_name:null,
			        Provider_no :null,
			        frequency:null,
			        condition_Indication:null
		};
		var getUsername = function(){
			AppointmentModel.one($scope.postData).then(function(response){
				$scope.postData.DOCTOR_ID = response.data.DOCTOR_ID;
				$scope.scriptInfo.doctor_id = $scope.postData.DOCTOR_ID;
				OutreferralModel.DotorFromUserId($scope.postData.DOCTOR_ID)
					.then(function(response){
						$scope.scriptInfo.user_name = response.data[0].NAME;
						$scope.scriptInfo.Provider_no = response.data[0].Provider_no;
					}, function(error){})
			}, function(error){})
		}
		getUsername(); 
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
		
		$scope.changeValue = function(){
			if($scope.scriptInfo.frequency !== null && $scope.scriptInfo.dose !== null && $scope.scriptInfo.start_date !== null && $scope.scriptInfo.end_date !== null){
				var start_date = ConfigService.convertToDB($scope.scriptInfo.start_date);
					start_date = moment(start_date).format('YYYY-MM-DD');
				var end_date = ConfigService.convertToDB($scope.scriptInfo.end_date);
					end_date = moment(end_date).format('YYYY-MM-DD');
					var a = moment(end_date);
					var b = moment(start_date);
				var diffInDays = a.diff(b, 'days'); // 1 day
				
				var day = diffInDays +1;
				var frequency = $scope.scriptInfo.frequency;
				var dose = $scope.scriptInfo.dose;
				$scope.scriptInfo.qty = day*frequency*dose;
			}
		}
		$scope.cancelClick = function(){
			$modalInstance.close({'type':'cancel'});
		}
		
		$scope.okClick = function(){
			// var start = new Date($scope.scriptInfo.start_date); 
			// var end = new Date($scope.scriptInfo.end_date);
			// if(moment(to_date).diff(moment(from_date),'days')<0){
			// 	$scope.isSubmit = true;
			// 	if (!$scope.medicationForm.$invalid) {
			// 		$modalInstance.close({'type':'ok','value':$scope.scriptInfo});
			// 	};
			// }
			// else{
			// 	toastr.error('Start date must be before end date');
			// }
			$scope.isSubmit = true;
				if (!$scope.medicationForm.$invalid) {
					$modalInstance.close({'type':'ok','value':$scope.scriptInfo});
				};
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