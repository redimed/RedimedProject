angular.module("app.loggedIn.patient.appointment.controller", [])

.controller("PatientAppointmentController", function($scope,DoctorService,sysServiceService,TimetableModel, $state, toastr, $stateParams, PatientService, ConfigService, ReceptionistService, OutreferralModel,AlertModel,$cookieStore,rlobService){
    

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
    
    //phanquocchien add new appoint
    var user_id = $cookieStore.get('userInfo').id;
    PatientService.getDoctorInfoByUserId(user_id).then(function(data){
        if (data.status == "success") {
            // console.log('doctor CLINICAL_DEPT_ID',data.data.CLINICAL_DEPT_ID);
            // console.log('doctor info',data.data);
            $scope.doctorId = data.data.doctor_id,
            $scope.clinicalDeptId = data.data.CLINICAL_DEPT_ID;
            sysServiceService.byClinicalDepartment($scope.clinicalDeptId).then(function(response){
                $scope.options.clinical_depts = response.data;
                // console.log(response.data);
            })

        };
    })
    // console.log($scope.options);
    

    $scope.submitCalendar = function(){
        // tan add
        $scope.isSubmit = true;
        if(!$scope.appointForm.$invalid){
            // console.log($scope.from_time);
            // console.log($scope.to_time);
            var from_time_part=moment($scope.from_time,"HHmm").format("HH:mm");
            var to_time_part=moment($scope.to_time,"HHmm").format("HH:mm");

            if (moment($scope.from_time,"HHmm").format("HH:mm") === 'Invalid date') {
                toastr.error('From time format error');
                return
            }else{
                if (moment($scope.to_time,"HHmm").format("HH:mm") === 'Invalid date') {
                    toastr.error('To time format error');
                    return
                };
            };
            var from_time = moment(new Date()).format('YYYY-MM-DD')+" "+ from_time_part +":00";
            var to_time = moment(new Date()).format('YYYY-MM-DD')+ " "+ to_time_part+":00";

            var postData = {
                FROM_TIME: from_time,
                TO_TIME: to_time,
                SITE_ID: $scope.site_id,
                DOCTOR_ID: $scope.doctorId,
                CLINICAL_DEPT_ID: $scope.clinicalDeptId,
                SERVICE_ID: $scope.service_Id
            }
            // console.log('postData',postData);
            DoctorService.addCalendar(postData).then(function(response){
                toastr.success('Add successfully !!!');
                $scope.cal_id = response.data;
                // console.log($scope.cal_id);
                rlobService.addApptPatient($scope.patient_id,response.data).then(function(data){
                    // console.log(data);
                    if (data.status == 'success') {
                        angular.element('#popupNewAppoint').modal('hide');
                        angular.element('#popupNewAppoint').on('hidden.bs.modal', function (e) {
                            initObject();
                            $scope.changeAppt({CAL_ID:$scope.cal_id});
                        });
                        // console.log('add patient',data);
                    };
                })
            },function(err){

            })
        };
    }
    $scope.newAppoint = function(){
        angular.element('#popupNewAppoint').modal('show');
    }
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
    var initObject = function () {
        $scope.appt_params = {
            id: $scope.cal_id,
            permission: {
                edit: true
            }
        };

        PatientService.getAppointments(patient_id)
        .then(function(response){
            $scope.list_appt = response.data.appointments;
            var current_appt = null;
            angular.forEach($scope.list_appt, function(item) {
                // console.log('item',item);
                if(item.CAL_ID == $scope.cal_id) {
                    current_appt = item;
                }
            });
        }, function(error) {
        });

    }

    initObject();

})