angular.module('app.loggedIn.patient.checkin.controller',[])
	.controller('PatientCheckinController',function($scope, ConfigService, PatientService, toastr){
        $scope.showPatientResult = false;
        $scope.showAppointmentOfId = null;
        $scope.patient_panel={};
        $scope.appointment_panel={};
        $scope.patientSearch={};

        var init = function(){
            $scope.patients = {
                show: function (searchInfo) {
                    $scope.patients.options.search = searchInfo;
                    $scope.patient_panel.reload();
                },
                select:0,
                class:function(patient){
                    return {
                        selected: (patient.ID == $scope.patients.select)
                    };
                },
                scope: $scope.patient_panel,
                options:{
                    api:'api/erm/v2/patient/search',
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
                                $scope.appointment.show(item.Patient_id);
                            }
                        }
                    ],
                    not_load:true
                }
            };

            $scope.appointment = {
                show: function (patient_id) {
                    $scope.appointment.options.search = {
                         Patient_id:patient_id
                    };
                    $scope.appointment_panel.reload();
                },
                class:function(appointment){
                    return {
                        selected: (appointment.ID == $scope.appointments.select)
                    };
                },
                scope: $scope.appointment_panel,
                options:{
                    api:'api/erm/v2/appt/appt_by_id',
                    method: 'post',
                    scope: $scope.appointment_panel,
                    search:{
                        Patient_id:$scope.showAppointmentOfId
                    },
                    columns:[
                        {field: 'CAL_ID', is_hide:true},
                        {field: 'Patient_id', is_hide:true},
                        {field: 'appointment', label: 'Appointment time', type:'custom', fn:function(item){
                            return ConfigService.getCommonDatetime(item.appointment.FROM_TIME);
                        }},
                        {field: 'appt_status', label: 'Is Checked-in?', type:'custom', fn:function(item){
                            if(item.appt_status==="Checked In" || item.appt_status === "Seen"){
                                return "Yes";
                            }
                            return "No";
                        }},
                        {type:'button', btnlabel:'Check In', 
                            btnfn:function(item){
                                PatientService.checkIn(item.CAL_ID, item.Patient_id).then(function(result){
                                    if(result.status!=="success") toastr.error("Check-in error!", "Error");
                                    else {
                                        toastr.success("Checked In!", "Success!");
                                        $scope.appointment_panel.reload();
                                    }
                                });
                            },
                            disfn: function(item){
                                if(item.appt_status==="Checked In" || item.appt_status === "Seen"){
                                    return true;
                                }
                                return false;
                            }
                        }
                    ],
                }
            };
        }

        
		init();

        $scope.searchClick = function(){
            if(($scope.patientSearch.First_name==='' || $scope.patientSearch.First_name===null || $scope.patientSearch.First_name===undefined) && ($scope.patientSearch.Last_name==='' || $scope.patientSearch.Last_name===null || $scope.patientSearch.Last_name===undefined) && ($scope.patientSearch.DOB==='' || $scope.patientSearch.DOB===null || $scope.patientSearch.DOB===undefined)){
                toastr.error('Please provide at least 1 information!','Error!');
            }
            else{
              if(!!$scope.patientSearch.DOB){
                $scope.patientSearch.DOB = ConfigService.getCommonDate($scope.patientSearch.DOB);
                }
                $scope.patients.show($scope.patientSearch);  
            }
            
        }
        $scope.resetClick = function(){
           
        }
	});