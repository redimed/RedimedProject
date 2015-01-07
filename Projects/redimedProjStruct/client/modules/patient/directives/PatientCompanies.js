angular.module("app.loggedIn.patient.companies.directive", [])

.directive("patientCompanies", function(PatientService, OutsideReferralModel, toastr){
	return {
		restrict: "EA",
		scope: {
			data: "@",
		},
		template: '<my-data-table options="data_options" rowclass="set_row_class" rowclick="row_click">',
		controller: function($scope){
			var data = $scope.$eval($scope.data);

			if(!data || !data.Patient_id) return;

			var active_item = null;
			$scope.set_row_class = function(item) {
				if(item.active == 'active') active_item = item;
				return (item.active == 'active') ? 'success' : '';
			}

			$scope.row_click = function(item) {
				if(item.id == active_item.id) {
					return;
				}

				var yes = confirm('Set this company active for patient ??? ');

				if(!yes) {
					return;
				}

				PatientService.update({Patient_id: data.Patient_id, company_id: item.id}).then(function(response){
		            if(response.status == 'success') {
		            	item.active = 'active';
		            	active_item.active = 'inactive';
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
                    {field: 'active', label: 'Active', is_hide: true, not_submit: true},               
                ],
                search: {
                    Patient_id: data.Patient_id,
                },
            };


		}
	}
})