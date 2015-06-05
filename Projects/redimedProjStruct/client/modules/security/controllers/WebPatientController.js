angular.module("app.webpatient.controller",[])
.controller('WebPatientController',function($scope,ConfigService){
     // USE FOR BOOKING
    $scope.modelObject = {
        Title: 'Mr',
        First_name: '',
        Sur_name: '',
        Middle_name: '',
        Known_as: '',
        Address1: '',
        Address2: '',
        Post_code: null,
        Country: 'AU',
        DOB: '',
        Sex: 'Male',
        Home_phone: null,
        Work_phone: null,
        Mobile: null,
        No_SMS: "0",
        Account_type: '',
        Account_holder: '',
        Account_Seft: null,
        Medicare_no: null,
        Ref: null,
        Exp_medicare: '',
        Private_fund_id: '',
        MemberShip_no: null,
        UPI: null,
        HCC_Pension_No: null,
        Exp_pension: '',
        DVA_No: null,
        Balance: null,
        Pays_Gap_Only: "1",
        Email: '',
        Suburb: '',
        Alias_First_name: '',
        Alias_Sur_name: '',
        Phone_ext: null
    };
    $scope.options = {};
    var loadOptionsApi = function(){
        ConfigService.countries_option().then(function(response){
            if(response.status === 'success')
                $scope.options.countries = response.data;
        })

        ConfigService.title_option().then(function(response){
            if(response.status === 'success')
                $scope.options.titles = response.data;
        })

        ConfigService.account_type_option().then(function(response){
            if(response.status === 'success')
                $scope.options.account_types = response.list;
        })

        ConfigService.private_type_option().then(function(response){
            if(response.status === 'success')
                $scope.options.private_types = response.list;
        })
    }

    loadOptionsApi();

    //PARAMS
    $scope.params = {
        permission: {
            create: true,
            edit: false
        }
    }
})