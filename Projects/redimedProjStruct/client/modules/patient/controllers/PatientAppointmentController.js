angular.module("app.loggedIn.patient.appointment.controller", [])

.controller("PatientAppointmentController", function($scope,DoctorService,TimetableModel, $state, toastr, $stateParams, PatientService, ConfigService, ReceptionistService, OutreferralModel,AlertModel){
    

    //Detail appt modules
    var patient_id =  $scope.patient_id = $stateParams.patient_id;
    //chien frame go to controller PatientController.js
    // $scope.current_patient = {};
    // chien end
    $scope.cal_id = $stateParams.cal_id;

    //Alert
    $scope.dataAlert =[];
    var alertPostData = {
        Patient_id: $stateParams.patient_id,
        CAL_ID: $stateParams.cal_id,
        page: 1,
        limit: 10,
        offset: 0,
        max_size: 5,
        name: '',
        description: '',
        Creation_date: 'desc',
        isenable:''
    };
    AlertModel.listFollowPatient(alertPostData)
    .then(function(response){
         _.forEach(response.data, function(id){
                        $scope.dataAlert.push(id.name);
                    })
    }, function(error){})

    //CHECK OUTSIDE REFERRAL
    var outPostData = {patient_id: $scope.patient_id, CAL_ID: $scope.cal_id};
    OutreferralModel.checkPatientCalendar(outPostData)
    .then(function(response){
        if(response.data === 0){
            if(response.service.IS_REFERRAL === 1){
                $scope.warning_refferal = true;
            }
        }
    }, function(error){})
    

    $scope.changeAppt = function(item) {
        $state.go('loggedIn.patient.appointment', {patient_id: patient_id, cal_id: item.CAL_ID});
    }

    $scope.classAppt = function(item) {
        switch(item.APP_TYPE) {
            case 'ChangePersonInCharge':
                return 'badge-danger';
            case 'NotYet':
            case 'Billing':
                return 'badge-warning';
        
            case 'Done':
                return 'badge-success';
            default: 
                return 'badge-default'; 
        }
        
    }

    // Init Object
    

})