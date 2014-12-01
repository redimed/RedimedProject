angular.module('app.loggedIn.document.addPatient.controllers',[])
    .controller("addPatientController",function($scope,$filter,PatientService,ReceptionistService,toastr,$http,$cookieStore,$state,ConfigService) {
        $scope.params = {
            permission: {
                create: true,
                edit: false
            }
        };
        // INSERT MODULE
        // STEP
        $scope.modelObjectMap = {};
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
        }

        $scope.options = {
            titles: ConfigService.title_option(),
            sexes: ConfigService.sex_option(),
            sms: ConfigService.yes_no_option(),
            countries: ConfigService.country_option(),
            gaps: ConfigService.yes_no_option(),
            acc_types: ConfigService.acc_type_option(),
            app_types: ConfigService.app_type_option()
        }
        var init = function(){
            $scope.modelObjectMap = angular.copy($scope.modelObject);
        }

        init();

        $scope.insert_step = 1;
        $scope.isSubmit = false;

        var reset = function(){
            $scope.insert_step = 1;
            $scope.modelObjectMap = angular.copy($scope.modelObject);
        }

        $scope.insertNextStep = function(form){
            $scope.isSubmit = true;

            switch($scope.insert_step){
                case 1:
                    if(form.$invalid){
                        toastr.error("You got errors to fix", "Error");
                    }else{
                        $scope.insert_step++;
                        $scope.isSubmit = false;
                    }
                    break;
                case 2:
                    if(form.$invalid){
                        toastr.error("You got errors to fix", "Error");
                    }else{
                        $scope.insert_step++;
                        $scope.isSubmit = false;
                    }
                    break;
                case 3:
                    if(form.$invalid){
                        toastr.error("You got errors to fix", "Error");
                    }else{
                        // DATE
                        $scope.modelObjectMap.DOB = ConfigService.getCommonDateDatabase($scope.modelObjectMap.DOB);
                        $scope.modelObjectMap.Exp_medicare = ConfigService.getCommonDateDatabase($scope.modelObjectMap.Exp_medicare);
                        $scope.modelObjectMap.Exp_pension = ConfigService.getCommonDateDatabase($scope.modelObjectMap.Exp_pension);
                        // END DATE

                        PatientService.insertPatient({patient: $scope.modelObjectMap}).then(function (data) {
                            if (data.status != 'success') {
                                toastr.error("Cannot Insert!", "Error");
                                return;
                            }
                            reset();
                            /*$scope.modelObjectBookingMap.Patient_id = data.data.Patient_id;

                            ReceptionistService.booking($scope.modelObjectBookingMap).then(function(data){
                                $state.go("loggedIn.receptionist.appointment");
                            })*/
                            toastr.success('Insert Successfully !!!', "Success");
                            $state.go("loggedIn.demo");
                        })
                        $scope.isSubmit = false;
                    }
                    break;
            }
        }

        $scope.insertBackStep = function(){
            if($scope.insert_step > 1){
                $scope.insert_step--;
            }
        }
        // END STEP
        // END INSERT MODULE
    })