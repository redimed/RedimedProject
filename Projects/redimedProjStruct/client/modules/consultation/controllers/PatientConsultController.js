angular.module("app.loggedIn.consult.patient.controller",[])
	.controller("PatientConsultController",function($filter,$cookieStore,$scope,$state,$modal,toastr,socket,$stateParams,ConsultationService,PatientService){
		var patient_id = $stateParams.patient_id;
		var cal_id = $stateParams.cal_id;

		$scope.currDate = $filter('date')(new Date(),'dd/MM/yyyy hh:mm a');

		$scope.patientInfo = {};
		$scope.problemArr = [];

		$scope.isMeasure = false;
		$scope.isScript = false;

		$scope.consultInfo = {
			patient_id: patient_id,
			cal_id: cal_id,
			problem_id: null,
			history: null,
			examination: null,
			treatment: null,
			diagnosis: null,
			measurements: [],
			scripts: []
		}

		PatientService.get(patient_id).then(function(rs){
			if(rs.status.toLowerCase() == 'success' && rs.data)
			{
				var fName = [];
				fName.push(rs.data.First_name);
				fName.push(rs.data.Sur_name);
				fName.push(rs.data.Middle_name);

				$scope.patientInfo = rs.data;
				$scope.patientInfo.FullName = 
					(rs.data.Title != null || rs.data.Title != '') ? (rs.data.Title +" . " + fName.join(' ')) : fName.join(' ');
			}
		})

		ConsultationService.getPatientProblem(patient_id).then(function(rs){
			if(rs.status.toLowerCase() == 'success' && rs.data)
			{
				console.log(rs.data);
				$scope.problemList = rs.data;
			}
		})

		$scope.viewProblem = function(id){
			$scope.problemArr = [];
			if(id != null)
			{
				var index = _.findIndex($scope.problemList, { 'problem_id': id});
				$scope.problemArr.push($scope.problemList[index]);
			}
			else
				$scope.problemArr = [];
		};

		$scope.measureAction = function(type,index){
			if(type == 'new')
			{
				var modalInstance = $modal.open({
					templateUrl:'modules/consultation/views/modal/measureModal.html',
					windowClass: "consult-modal-window",
					controller: "MeasurementController",
					resolve:{
						measure:function(){
							return null;
						}
					}
				})

				modalInstance.result.then(function(data){
					if(data.type == 'ok')
						$scope.consultInfo.measurements.push(data.value);
				})
			}

			if(type == 'edit')
			{
				var modalInstance = $modal.open({
					templateUrl:'modules/consultation/views/modal/measureModal.html',
					windowClass: "consult-modal-window",
					controller: "MeasurementController",
					resolve:{
						measure: function(){
							return $scope.consultInfo.measurements[index];
						}
					}
				})

				modalInstance.result.then(function(data){
					if(data.type == 'ok')
						$scope.consultInfo.measurements[index] = data.value;;
				})
			}

			if(type == 'delete')
			{
				swal({
	                title: "Confirm Delete",
	                text: "Are You Sure Want To Delete This Measure?",
	                type: "warning",
	                showCancelButton: true,
	                confirmButtonColor: "#DD6B55",
	                confirmButtonText: "Yes",
	                closeOnConfirm: true
	            }, function() {
	                $scope.consultInfo.measurements.splice(index,1);
	            })
			}
		};

		$scope.scriptAction = function(type,index){
			if(type == 'new')
			{
				var modalInstance = $modal.open({
					templateUrl:'modules/consultation/views/modal/scriptModal.html',
					size: 'lg',
					controller:'ScriptController',
					resolve: {
						script: function(){
							return null;
						}
					}
				})

				modalInstance.result.then(function(data){
					if(data.type == 'ok')
						$scope.consultInfo.scripts.push(data.value);
				})
			}

			if(type == 'edit')
			{

				var modalInstance = $modal.open({
					templateUrl:'modules/consultation/views/modal/scriptModal.html',
					size: 'lg',
					controller:'ScriptController',
					resolve: {
						script: function(){
							return $scope.consultInfo.scripts[index];
						}
					}
				})

				modalInstance.result.then(function(data){
					if(data.type == 'ok')
						$scope.consultInfo.scripts[index] = data.value;
				})
			}

			if(type == 'delete')
			{
				swal({
	                title: "Confirm Delete",
	                text: "Are You Sure Want To Delete This Script?",
	                type: "warning",
	                showCancelButton: true,
	                confirmButtonColor: "#DD6B55",
	                confirmButtonText: "Yes",
	                closeOnConfirm: true
	            }, function() {
	                $scope.consultInfo.scripts.splice(index,1);
	            })
			}
		};

		$scope.backClick = function(){
			 var from = $cookieStore.get('fromState');
			 var params = {};
			 if(from.fromParams != null || typeof from.fromParams !== 'undefined')
	        {
	            angular.forEach(from.fromParams, function(value , key) {
	                params[key] = value;
	            })
	        }
	        $state.go(from.fromState.name,params);
		};

		$scope.submitClick = function(){
			for(var i=0 ; i< $scope.consultInfo.measurements.length ; i++)
			{
				$scope.consultInfo.measurements[i].patient_id = patient_id;
				$scope.consultInfo.measurements[i].cal_id = cal_id;
			}

			ConsultationService.submitConsult($scope.consultInfo).then(function(res){
				if(res.status == 'success')
					toastr.success("Submit Consultation Success!");
				else
					toastr.success("Submit Consultation Failed!");
			})
		};

	})

