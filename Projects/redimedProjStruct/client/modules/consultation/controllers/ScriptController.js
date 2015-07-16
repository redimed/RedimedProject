angular.module("app.loggedIn.patient.consult.scriptController",[])
	.controller("ScriptController",function(AlertModel,arrayscript,$timeout,OutreferralModel,AppointmentModel,ConfigService,$cookieStore,$scope,$filter,$state,$modal,toastr,$modalInstance,ConsultationService,$stateParams, actual_doctor_id,script){
		// if (actual_doctor_id === undefined) {
		// 	actual_doctor_id ={
		// 		NAME :null
		// 	};
		// };
		// $scope.user_name = $cookieStore.get("userInfo").user_name;
		var user_id = $cookieStore.get('userInfo').id;
		$scope.postData = {
			CAL_ID:$stateParams.cal_id,
			DOCTOR_ID:null,
			user_name:null,
			Provider_no:null
		};
		console.log($scope.current_patient);
		$scope.scriptInfo = {
					FROM_TIME:null,
					cal_id:null,
			        medication_name:null,
			        start_date:null,
			        dose:null,
			        end_date:null,
			        unit:null,
			        qty:null,
			        route:null,
			        doctor_id:null,
			        NAME:null,
			        Provider_no :null,
			        frequency:null,
			        condition_Indication:null
		};
		var getUsername = function(){
				OutreferralModel.DotorFromUserId(user_id)
				.then(function(response){
					$scope.scriptInfo.doctor_id = response.data[0].doctor_id;
					$scope.scriptInfo.NAME = response.data[0].NAME;
					$scope.scriptInfo.Provider_no = response.data[0].Provider_no;
				}, function(error){})
		}
		getUsername();
		var getCalid = function(cal_id){
			if (cal_id === 0) {
				var postData = {
					cal_id : $stateParams.cal_id
				}
			}else{
				var postData = {
					cal_id : $scope.scriptInfo.cal_id
				}
			}
			AlertModel.deleteMedication(postData)
			.then(function(response){
				$scope.scriptInfo.FROM_TIME = response.data[0].FROM_TIME;
				$scope.scriptInfo.cal_id = response.data[0].cal_id;
				console.log( response.data[0].FROM_TIME);
			})
		 }
		
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

		if(script != null){
			$scope.scriptInfo = angular.copy(script);
			$scope.scriptInfo.end_date = ConfigService.convertToDate($scope.scriptInfo.end_date);
			$scope.scriptInfo.start_date = ConfigService.convertToDate($scope.scriptInfo.start_date);
			getCalid(1);
		}else{
			getCalid(0);
		}
		
		$scope.changeValue = function(){
			var frequency =0;
			if($scope.scriptInfo.frequency !== null && $scope.scriptInfo.dose !== null && $scope.scriptInfo.start_date !== null && $scope.scriptInfo.end_date !== null){
				if ($scope.scriptInfo.frequency == 'OD') {
					 frequency = 1;
				}else if($scope.scriptInfo.frequency == 'BD'){
					frequency = 2;
				}else if($scope.scriptInfo.frequency == 'OD'){
					frequency = 3;
				}else{
					frequency = 4;
				}
				var start_date = ConfigService.convertToDB($scope.scriptInfo.start_date);
					start_date = moment(start_date).format('YYYY-MM-DD');
				var end_date = ConfigService.convertToDB($scope.scriptInfo.end_date);
					end_date = moment(end_date).format('YYYY-MM-DD');
					var a = moment(end_date);
					var b = moment(start_date);
				var diffInDays = a.diff(b, 'days'); // 1 day
				
				var day = diffInDays +1;
				var dose = $scope.scriptInfo.dose;
				$scope.scriptInfo.qty = day*frequency*dose;
			}
		}
		$scope.cancelClick = function(){
			$modalInstance.close({'type':'cancel'});
		}
		
		$scope.okClick = function(){
			console.log($scope.scriptInfo);
			var count = 0;
			if (script !== null) {
				for (var i = 0; i < arrayscript.length; i++) {
				if ($scope.scriptInfo.medication_name === arrayscript[i].medication_name && $scope.scriptInfo.medication_name !== script.medication_name) {
						count ++;
					};
				};
			}else{
				for (var i = 0; i < arrayscript.length; i++) {
				if ($scope.scriptInfo.medication_name === arrayscript[i].medication_name) {
						count ++;
					};
				};
			};
			
			if (count === 0) {
				$scope.isSubmit = true;
				if (!$scope.medicationForm.$invalid) {
					$scope.scriptInfo.start_date = ConfigService.convertToDB($scope.scriptInfo.start_date);
					$scope.scriptInfo.end_date = ConfigService.convertToDB( $scope.scriptInfo.end_date);
					$modalInstance.close({'type':'ok','value':$scope.scriptInfo});
				};
			}else{
				toastr.error("Medication Name  Exits !");
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