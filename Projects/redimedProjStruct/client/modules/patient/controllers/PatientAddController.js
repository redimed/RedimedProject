angular.module("app.loggedIn.patient.add.controller", [
])

.controller("PatientAddController", function ($scope, $state, toastr, ConfigService, PatientService, items) {
    var parent_scope = items.scope;


    $scope.patientObj = {
        Title: '',
        First_name: '',
        Sur_name: '',
        Middle_name: '',
        Known_as: '',
        Address1: '',
        Address2: '',
        Post_code: '',
        Country: 'Australia',
        DOB: '',
        Sex: '',
        Home_phone: '',
        Work_phone: '',
        Mobile: '',
        No_SMS: 1,
        Account_type: '',
        Account_holder: '',
        Account_Seft: '',
        Medicare_no: '',
        Ref: '',
        Exp_medicare: '',
        Private_fund_id: '',
        MemberShip_no: '',
        UPI: '',
        HCC_Pension_No: '',
        Exp_pension: '',
        DVA_No: '',
        Balance: '',
        Pays_Gap_Only: 1,
        Email: '',
        Suburb: '',
        Alias_First_name: '',
        Alias_Sur_name: '',
        Phone_ext: '',
		Type: ''
    }


    $scope.initForm = function (resetCall) {
        if (resetCall)
            resetCall();
        
        $scope.titleIndex = ConfigService.get_title_name();
        $scope.countryIndex = ConfigService.get_country_list();
        $scope.sexIndex = ConfigService.get_sex_list();
        $scope.smsIndex = $scope.payGapIndex = ConfigService.get_yes_no_opt();

        PatientService.listAccType().then(function (data) {
            if (data.status != 'success') {
                alert('error');
                return;
            }
            $scope.accTypeIndex = data.list;
        });

        PatientService.listPrvFund().then(function (data) {
            if (data.status != 'success') {
                alert('error');
                return;
            }
            $scope.fundIndex = data.list;
        });
    }

    var reset = function () {
        $scope.patient = angular.copy($scope.patientObj);
        $scope.isSubmit = false;
    }

    $scope.reset = reset;
    var init = function () {
        $scope.formMode = 'Add';
        reset();
        $scope.initForm(reset);
    }


    $scope.submit = function (patientForm) {
        $scope.isSubmit = true;
        if (patientForm.$invalid) {
            toastr.error("Please Check Your Information!", "Error");
            return;
        }

        PatientService.insertPatient({patient: $scope.patient}).then(function (data) {
            if (data.status != 'success') {
                toastr.error("Cannot Insert!", "Error");
                return;
            }
            reset();
            toastr.success('Insert Successfully !!!', "Success");
        })

    }
    init();
})