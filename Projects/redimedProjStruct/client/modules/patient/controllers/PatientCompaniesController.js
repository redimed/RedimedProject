angular.module("app.loggedIn.patient.companies.controller", [])

        .controller("PatientCompaniesController", function ($scope, $state, $stateParams, toastr, PatientService) {
            //init
            $scope.current_patient = {};

            var patient_id = $stateParams.patient_id;
            $scope.patient = {Patient_id: patient_id};

            $scope.updateCompany = function (company) {
                PatientService.update({Patient_id: $scope.patient.Patient_id, company_id: company.id}).then(function (data) {
                    if (data.status == 'success') {
                        toastr.success('Save Successfully!!!', "Success");
                        $scope.reloadpage();
                    }
                    console.log(data);
                });

            }
         
            $scope.company_search_options = {
                api: 'api/erm/v2/companies/search',
                method: 'post',
                columns: [
                    {field: 'id', is_hide: true},
                    {field: 'Company_name', label: 'Company Name'},
                    {field: 'Industry'},
                ],
                use_filters: true,
                filters: {
                    Company_name: {type: 'text'},
                    Industry: {type: 'text'},
                },
            };

            $scope.chooseCompany = function (item) {
                console.log(item);
                $scope.updateCompany(item);
            };

            $scope.show_company_form = false;
            $scope.show_company_search = false;

            $scope.openCompanySearch = function () {
                $scope.show_company_search = true;
            };
            $scope.closeCompanySearch = function () {
                $scope.show_company_search = false;
            };

            $scope.openCompanyForm = function () {
                $scope.show_company_form = true;
            };
            $scope.closeCompanyForm = function () {
                $scope.show_company_form = false;
            };

        });