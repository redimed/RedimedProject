angular.module('app.loggedIn.patient.checkin.controller',[])
	.controller('PatientCheckinController',function($scope, ConfigService, PatientService, toastr){
		$scope.patient_panel={};

		var selectedID = null;

		$scope.patients = {
			select:0,
			class:function(patient){
                return {
                    selected: (patient.ID == $scope.patients.select)
                };
            },
			scope: $scope.patient_panel,
			options:{
				api:'api/erm/v2/appt/today_appt',
				method: 'post',
				scope: $scope.patient_panel,
				columns:[
                    {field: 'CAL_ID', is_hide:true},
                    {field: 'Patient_id', is_hide:true},
                    {field: 'First_name', label: 'First name', type:'custom', fn:function(item){
                        return item.patient.First_name;
                    }},
                    {field: 'Sur_name', label: 'Sur name', type:'custom', fn:function(item){
                        return item.patient.Sur_name;
                    }},
                    {field: 'DOB', label: 'Date of birth', type:'custom', fn:function(item){
                        return ConfigService.getCommonDateDefault(item.patient.DOB);
                    }},
                    {field: 'appointment', label: 'Appointment time', type:'custom', fn:function(item){
                        return ConfigService.convertToTimeStringApp(item.appointment.FROM_TIME);
                    }},
                    {field: 'appt_status', label: 'Is Checked-in?', type:'custom', fn:function(item){
                        if(item.appt_status==="Checked In" || item.appt_status === "Seen"){
                            return "Yes";
                        }
                        return "No";
                    }},
                    {type:'button', btnlabel:'Check In', btnfn:function(item){
                        PatientService.checkIn(item.CAL_ID, item.Patient_id).then(function(result){
                            if(result.status!=="success") toastr.error("Check-in error!", "Error");
                            else {
                                toastr.success("Checked In!", "Success!");
                                $scope.patient_panel.reload();
                            }
                        });
                    }}


                    // {field: 'Sur_name', label: 'Last name'}, 
                    // {field: 'DOB', label: 'Date of birth', type:"custom", fn:function(item){
                    // 	if(!item.DOB) return ''; 
                    // 	return ConfigService.getCommonDateDefault(item.DOB);
                    // }}, 

                ],
                use_filters: true,
                filters:{
                	First_name: {type: 'text'},
                	Sur_name: {type: 'text'},
                	DOB: {type: 'text'}
                },
                use_actions: false,
                // actions: [
                // 	{
                //         class: 'fa fa-info', title: 'Edit',
                //         callback: function(item){
                //             console.log('this is selected item',item)
                //                 $scope.patientEditForm.open(item.Patient_id);
                //         }
                //     },
                // ]
			}
		}
	});