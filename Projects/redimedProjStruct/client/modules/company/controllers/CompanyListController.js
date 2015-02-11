angular.module("app.loggedIn.company.list.controller", [])
.controller("CompanyListController", function ($scope, $state, localStorageService) {

    var item_type_options = [
        {code: 'Service', label: 'Service'},
        {code: 'Goods', label: 'Goods'},
    ];

    $scope.company_panel = {};

    $scope.data_options = {
        api: 'api/erm/v2/companies/search',
        method: 'post',
        scope: $scope.company_panel,
        columns: [
            {db_field: 'companies.id', field: 'id', is_hide: true},
            {field: 'Insurer', is_hide: true},
            {field: 'Company_name', label: 'Company Name'},
            {field: 'Industry'},
            {field: 'Addr', label: 'Address'},
            {db_field: 'companies.country' ,field: 'country', label:'Country'},
            {db_field: 'insurers.insurer_name', field: 'insurer_name', label: 'Insurer'}
        ],
        show_index: true,
        use_filters: true,
        filters: {
            Company_name: {type: 'text'},
            Industry: {type: 'text'},
            Addr: {type: 'text'},
            State: {type: 'text'},
            Country: {type: 'text'},
        },
        use_actions: true, 
        actions: [              
            {
                class: 'fa fa-pencil', title: 'Edit',
                callback: function(item){
                    $scope.companyInfo = item;
                    $scope.editForm.open();
                }
            },
            {
                class: 'fa fa-money', title: 'Insurer',
                callback: function(item){
                    $scope.insurers_option.search.id = item.id; // company id 
                    $scope.insurers.open();
                    $scope.insurers.panel.reload();
                    // console.log(item)
                }
            },
        ],
    };

    $scope.insurers  = {
        is_show: false,
        open: function(){
            this.is_show = true;
        }, 
        close: function(){
            this.is_show = false;
        }, 
        panel: {}
    }

               
    $scope.insurers_option = {
        not_load: true,
        use_filters: true,
        api: 'api/erm/v2/companies/insurers',
        search: { id: 0 },
        method: 'post',
        columns: [
            {field: 'id', is_hide: true},
            {field: 'insurer_name', label: 'Insurer Name'},
            {field: 'address', label: 'Address'},
            {field: 'suburb', label: 'Suburb'},
        ],
        scope: $scope.insurers.panel
    };

    /*
    *   ADD FORM
    */
    $scope.addForm = {
        is_show: false,
        open: function(){
            this.is_show = true;
        }, 
        close: function(){
            this.is_show = false;
        }, 
        success: function(){
            $scope.company_panel.reload();
        }
    }

    $scope.editForm = {
        is_show: false,
        open: function(){
            this.is_show = true;
        }, 
        close: function(){
            this.is_show = false;
        }, 
        success: function(){
            $scope.company_panel.reload();
        }
    }

})