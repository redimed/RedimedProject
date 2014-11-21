angular.module("app.loggedIn.patient.referrals.controller", [
])
        .controller("PatientReferralsController", function ($scope, $state, DoctorService) {
            var item_type_options = [
                {code: 'Service', label: 'Service'},
                {code: 'Goods', label: 'Goods'},
            ]
            $scope.data_options = {
//                show_index: true,   
                columns: [
                    {field: 'id', is_hide: true},
                    {field: 'Company_name', label: 'Company Name'},
                    {field: 'Industry'},
                ],
                use_filters: false,
                filters: {
                    ITEM_CODE: {type: 'number'},
                    ITEM_NAME: {type: 'text'},
                    ITEM_TYPE: {type: 'dropdown', values: item_type_options},
                },
                api: 'api/erm/v2/companies/search'
            };
        });