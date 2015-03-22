angular.module("app.loggedIn.consult.patient.controller",[])
	.controller("PatientConsultController",function($scope,$state,$modal,toastr,socket,$stateParams,ConsultationService,PatientService){
		var patient_id = $stateParams.patient_id;
		var cal_id = $stateParams.cal_id;

		$scope.patientInfo = {};
		$scope.problemArr = [];

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
		}

		$scope.newMeasure = function(){
			var modalInstance = $modal.open({
				templateUrl:'modules/consultation/views/modal/measureModal.html',
				windowClass: "consult-modal-window",
				controller: "MeasurementController"
			})
		}

	})