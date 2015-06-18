angular.module('app.loggedIn.patient.checkin.controller',[])
	.controller('PatientCheckinController',function(socket,$scope, ConfigService, PatientService, toastr,$state){
        $scope.showPatientResult = false;
        $scope.showAppointmentOfId = null;
        $scope.patient_panel={};
        $scope.appointment_panel={};
        $scope.patientSearch={};


            $scope.patients = {
                show: function (searchInfo) {
                    $scope.patients.options.search = searchInfo;
                    $scope.patient_panel.reload();
                },
                reset: function(){
                    $scope.patients.options.search = {
                        First_name:null,
                        Sur_name: null,
                        DOB:null
                    };
                    $scope.patient_panel.reload();

                },
                class:function(patient){
                    
                },
                scope: $scope.patient_panel,
                options:{
                    api:'api/erm/v2/patient/checkin_search',
                    method: 'post',
                    scope: $scope.patient_panel,
                    columns:[
                        {field: 'Patient_id', label: 'ID'},
                        {field: 'First_name', label: 'First name'},
                        {field: 'Sur_name', label: 'Last name'}, 
                        {field: 'DOB', label: 'Date Of Birth', type:'custom', fn:function(item){
                            return ConfigService.getCommonDateDefault(item.DOB);
                        }},
                        {type:'button', btnlabel:'Appointment', 
                            btnfn:function(item){
                                $scope.appointments.show(item.Patient_id);
                                if ($scope.patientInfoCalendar) {
                                    $scope.patientInfoCalendar.Patient_id = item.Patient_id;
                                    console.log($scope.patientInfoCalendar);
                                    $scope.bottomNewBooking = true;
                                };
                            }
                        }
                    ],
                    not_load:true
                }
            };

            $scope.appointments = {
                show: function (patient_id) {
                    $scope.appointments.options.search = {
                         Patient_id:patient_id
                    };
                    $scope.appointment_panel.reload();
                },
                reset: function(){
                    $scope.appointments.options.search = {
                        Patient_id:null
                    };
                    $scope.appointment_panel.reload();
                },
                class:function(appointment){
                    return {
                        
                    };
                },
                scope: $scope.appointment_panel,
                options:{
                    api:'api/erm/v2/appt/appt_by_id',
                    method: 'post',
                    scope: $scope.appointment_panel,
                    columns:[
                        {field: 'CAL_ID', is_hide:true},
                        {field: 'Patient_id', is_hide:true},
                        {field: 'appointment', label: 'Appointment time', type:'custom', fn:function(item){
                            return ConfigService.getCommonDatetime(item.appointment.FROM_TIME);
                        }},
                        {field: 'appt_status', label: 'Appointment Status', type:'custom', fn:function(item){
                            return ptnConst.apptStatusDisplay[item.appt_status];
                        }},
                        {type:'button', btnlabel:'Check In', 
                            btnfn:function(item){
                                PatientService.checkIn(item.CAL_ID, item.Patient_id).then(function(result){
                                    if(result.status!=="success") toastr.error("Check-in error!", "Error");
                                    else {
                                        socket.emit('notifyReceptionist');
                                        toastr.success("Checked In!", "Success!");
                                        $scope.appointment_panel.reload();
                                    }
                                });
                            },
                            disfn: function(item){
                                if(item.appt_status!=ptnConst.apptStatus.booking.value){
                                    return true;
                                }
                                return false;
                            }
                        }
                    ],
                    not_load:true
                }
            };

        $scope.searchClick = function(){
            $scope.isSubmit = true;
            if (!$scope.sysservicesForm.$invalid) {
                if(!$scope.patientSearch.First_name&&!$scope.patientSearch.Sur_name&&!$scope.patientSearch.DOB){
                    toastr.error('Please provide at least 1 information!','Error!');
                }
                else{
                    var searchData = {
                        First_name: $scope.patientSearch.First_name,
                        Sur_name: $scope.patientSearch.Sur_name,
                        DOB: $scope.patientSearch.DOB
                    };
                    if(searchData.First_name==='') searchData.First_name=undefined;
                    if(searchData.Sur_name==='') searchData.Sur_name=undefined;
                    if(searchData.DOB==='') searchData.DOB=undefined;
                    if(!!searchData.DOB){
                        searchData.DOB = ConfigService.getCommonDate(searchData.DOB);
                    }
                    $scope.patients.show(searchData);  
                }
            };
        }
        
        $scope.resetClick = function(){
            $scope.isSubmit = true;
            if (!$scope.sysservicesForm.$invalid) {
                $scope.appointments.reset();
                $scope.patients.reset();
                $scope.patientSearch={};
            }
        }
        $scope.goToNewBooking = function(){
            if ($scope.patientInfoCalendar) {
                console.log($scope.patientInfoCalendar.Patient_id);
                $state.go('webpatient.booking');
            }else{
                toastr.error("No information available on the patient", "Error");
            };
        }
	});