angular.module("app.loggedIn.consult.patient.controller",[])
	.controller("PatientConsultController",function($scope,$state,$modal,toastr,socket,$stateParams,PatientService){
		var patient_id = $stateParams.patient_id;
		var cal_id = $stateParams.cal_id;

		$scope.patientInfo = {};

		$scope.consultInfo = {
			history: null,
			examination: null,
			treatment: null,
			diagnosis: null,
			measurements: []
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

		$scope.newMeasure = function(){
			var modalInstance = $modal.open({
				templateUrl:'modules/consultation/views/modal/measureModal.html',
				size:'lg',
				controller: "MeasurementController"
			})
		}

	})