angular.module("app.loggedIn.patient")
	.controller('PatientListAllController', function(CompanyModel,$scope, $state){
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
                }
			}
		}

        $scope.actionCenter={
            runWhenFinish:function(){
                $scope.patientAddForm.close();
                $scope.patient_panel.reload();
            }
        }

		$scope.patientAddForm = {
			params: {
	            permission:{
	                edit:false,
	                create:true
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
                    alert('okokok');
                    $scope.patient_panel.reload();
            }
        }
        $scope.rowClick = function(item){
            var postData = {
                datetime : moment().format('YYYY-MM-DD hh:mm:ss'),
                patient_id :item.Patient_id
            }
            CompanyModel.getFromTime(postData)
            .then(function(response){
                if (response.data == -1 ) {
                   $state.go("loggedIn.patient.appointment", {patient_id: item.Patient_id, cal_id: -1}); 
                }else{
                    $state.go("loggedIn.patient.appointment", {patient_id: item.Patient_id, cal_id: response.data.CAL_ID});
                }
                
            }, function(error){
            })
            
        }
        $scope.patientEditForm = {
			params: {
	            permission:{
	                edit:true,
	                create:false
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

	