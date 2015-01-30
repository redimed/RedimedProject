angular.module('app.loggedIn.patient.listall.controller',[])
	.controller('PatientListAllController', function($scope){
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
				api:'api/erm/v2/patient/search',
				method: 'post',
				scope: $scope.patient_panel,
				columns:[
                    {field: 'Patient_id', is_hide: true},
                    {field: 'First_name', label: 'First name'},
                    {field: 'Sur_name', label: 'Last name'}, 
                    {field: 'Address1', label: 'Address'},
                    {field: 'Post_code', label: 'Post Code'}, 

                ],
                use_filters: true,
                filters:{
                	First_name: {type: 'text'},
                	Sur_name: {type: 'text'},
                	Address1: {type: 'text'},
                	Post_code: {type: 'text'}
                },
                use_actions: true,
                actions: [
                	{
                        class: 'fa fa-info', title: 'Edit',
                        callback: function(item){
                            console.log('this is selected item',item)
                                $scope.patientEditForm.open(item.Patient_id);
                        }
                    },
                ]
			}
		}


		$scope.patientAddForm = {
			params: {
	            permission:{
	                edit:false,
	                add:true
	            }
            },
            is_show: false,
            open: function () {
            	$scope.patientAddForm.params.isAtAllPatient=true;
                this.is_show = true;
            },
            close: function () {
                this.is_show = false;
            },
            success: function (response) {
                if (response.status == 'success')
                    $scope.patient_panel.reload();
            }
        }

        $scope.patientEditForm = {
			params: {
	            permission:{
	                edit:true,
	                add:false
	            },
            },
            is_show: false,
            open: function (patient_id) {
            	$scope.patientEditForm.params.id=patient_id;
            	console.log($scope.patientEditForm.params);
                this.is_show = true;
            },
            close: function () {
                this.is_show = false;
            },
            success: function (response) {
                if (response.status == 'success')
                    $scope.patient_panel.reload();
            }
        }

	});

	