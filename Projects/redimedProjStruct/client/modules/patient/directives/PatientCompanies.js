angular.module("app.loggedIn.patient.companies.directive", [])

.directive("patientCompanies", function(PatientService, OutsideReferralModel){
	return {
		restrict: "EA",
		scope: {
			data: "@",
		},
		template: '<my-data-table options="data_options" rowclass="set_row_class" rowclick="">',
		controller: function($scope){
			var data = $scope.$eval($scope.data);

			console.log(data);
			if(!data || !data.Patient_id) return;

			console.log(data);

			$scope.set_row_class = function(item) {
				return (item.active == 'active') ? 'success' : '';
			}

			$scope.row_click = function(item) {
				PatientService.update({Patient_id: data.Patient_id, company_id: item.id}).then(function(response){
		            if(response.status == 'success') {
		                toastr.success('Save Successfully!!!', "Success");
		            }
		            console.log(response);
		        });
			}

			$scope.data_options = {
                api: 'api/erm/v2/patients/companies',
                method: 'post',
                columns: [
                    {field: 'companies.id', is_hide: true},
                    {field: 'Company_name', label: 'Company Name'},
                    {field: 'Industry'},
                    {field: 'Addr', label: 'Address'},
                    {field: 'Country', db_field: 'companies.Country'},
                    {field: 'active', label: 'Active', not_submit: true},               
                ],
                search: {
                    Patient_id: data.Patient_id,
                },
            };


		}
	}
})