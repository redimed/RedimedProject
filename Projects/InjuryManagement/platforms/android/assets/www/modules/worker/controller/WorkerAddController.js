angular.module('starter.worker.add.controller',[])

    .controller('workerAddController', function($scope, WorkerServices, $state, $stateParams, localStorageService, $ionicPopup, $ionicLoading, $timeout, ConfigService) {

        var userInfoLS = localStorageService.get("userInfo");
        $scope.nfcInfo = [];
        $scope.injurySubmitNonemer = localStorageService.get("checkNonemer");

        $scope.isSubmit = false;
        $scope.isSubmit2 = false;
        $scope.isSubmit3 = false;
        $scope.isFailMobile = false;
        $scope.isFailEmail = false;
        $scope.isMobile = null;

        $scope.workerObj = {
            company_id: userInfoLS.company_id,
            Title: '',
            First_name: '',
            Sur_name: '',
            Middle_name: '',
            Address1: '',
            Address2: '',
            State: '',
            Country: 'Australia',
            DOB: '',
            Sex: '',
            Home_phone: '',
            Work_phone: '',
            Mobile: '',
            Suburb: '',
            Known_as: '',
            Email: '',

            //Phone_ext: '',
            //No_SMS: 1,
            //Pays_Gap_Only: 1,
            //Account_Seft: '',
            //NOK_Emerg_Contact:'',
            //NOK_Phone:'',

            //MAIN
            Post_code: '',
            Account_type: '',
            Account_holder: '',
            Medicare_no: '',
            Exp_medicare: '',
            Private_fund_id: '',
            UPI: '',
            MemberShip_no: '',
            DVA_No: '',
            HCC_Pension_No: '',
            //Exp_pension: '',

            //SECOND
            Occupation:'',
            Partner_name: '',
            Partner_DOB: '',
            Partner_Occupation: '',
            Alias_First_name: '',
            Alias_Sur_name: '',
            UR_no:'',
            Custom:''

            //not set field
            //Balance: '',
            //GP_Sur_name:'',
            //GP_First_name:'',
            //Clinic:'',
            //Usual_provider:'',
            //Specialty:'',
            //Referral_source:'',
            //Marial_Status:'',
            //Diabetic:'',
            //Inactive:'',
            //Deceased:'',
            //Memo:'',
            //Culture_id:'',
            //Language_id:'',
            //Student_id:'',
            //Faculty_id:'',
            //Free_type:'',
            //Gradudate_status:'',
            //Patient_node:'',
            //Isenable:''
        }

        var reset = function() {
            $scope.worker = angular.copy($scope.workerObj);
            $scope.isSubmit = false;
            $scope.isSubmit2 = false;
        }

        $scope.reset = reset;

        var init = function () {
            reset();
            $scope.titleIndex = ConfigService.title_option();
            $scope.sexIndex = ConfigService.sex_option();

            WorkerServices.listAccType().then(function (data) {
                if (data.status != 'success') {
                    alert('error');
                    return;
                }
                $scope.accTypeIndex = data.list;
            });

            WorkerServices.listPrvFund().then(function (data) {
                if (data.status != 'success') {
                    alert('error');
                    return;
                }
                $scope.fundIndex = data.list;
            });
        }

        $scope.Checkfield = function (isMobile) {
            if(isMobile)
            {
                WorkerServices.checkMobile($scope.worker.Mobile).then(function(data){
                    if(data.status == 'success')
                    {
                        if(data.count == 0)
                        {
                            $scope.isFailMobile = false;
                        }
                        else
                        {
                            $scope.isFailMobile = true;
                        }
                    }

                })
            }
            else
            {
                WorkerServices.checkEmail($scope.worker.Email).then(function (data) {
                    if (data.status == 'success') {
                        if (data.count == 0) {
                            console.log("pass")
                            $scope.isFailEmail = false;
                        }
                        else {
                            $scope.isFailEmail = true;
                        }
                    }

                })
            }
        }

        $scope.nextFormMain = function(infor) {
            $scope.isSubmit = true;
            if (infor.$invalid){
                var alertPopup = $ionicPopup.alert({
                    title: "Can't next form",
                    template: 'Please Check Your Information!'
                });
            }
            else
            {
                $state.go("app.worker.main");
            }
        }

        $scope.nextFormSecond = function(main) {
            $scope.isSubmit2 = true;
            if (main.$invalid){
                var alertPopup = $ionicPopup.alert({
                    title: "Can't next form",
                    template: 'Please Check Your Information!'
                });
            }
            else
            {
                $state.go("app.worker.second");
            }
        }

        //back injuryDesc
        $scope.backdescInjury = function() {
            localStorageService.set("checkNonemerg", $scope.injurySubmitNonemer);
            $state.go('app.injury.desinjury');
        }

        //submit worker check true false
        $scope.submit = function (workerForm, second) {
            $scope.isSubmit3 = true;
            if (second.$invalid) {
                var alertPopup = $ionicPopup.alert({
                    title: "Can't insert worker",
                    template: 'Please Check Your Information!'
                });
                return;
            }
            if($scope.injurySubmitNonemer)
            {
                //have id worker submit booking
                $state.go('app.chooseAppointmentCalendar');
            }
            else
            {
                WorkerServices.insertWorker({patient: $scope.worker}).then(function (data) {
                    if (data.status != 'success') {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Cannot Insert',
                            template: 'Please Check Your Information!'
                        });
                        return;
                    }

                    $ionicLoading.show({
                        template: "<div class='icon ion-ios7-reloading'></div>"+
                        "<br />"+
                        "<span>Waiting...</span>",
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });

                    $timeout(function () {
                        reset();
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.confirm({
                            title: 'Insert Successfully',
                            template: 'We have added worker to company! You want write NFC to tag?'
                        });

                        alertPopup.then(function(res){
                            if(res){

                                $scope.nfcInfo = data;
                                $state.go('app.worker.writeNFC');
                            }else{
                                console.log("No Write");
                            }
                        })
                    }, 2000);
                })
            }
        }
        init();
       // alert(JSON.stringify(localStorageService.get('newInfo')));

        if($scope.nfcInfo.length == 0){
            $scope.nfcInfo = localStorageService.get('newInfo');
        }
        $scope.NFCwrite = function(){
            localStorageService.set('mode','write');
            var mode = localStorageService.get('mode');
            writeNFC.initialize($scope.nfcInfo,mode);
        }
    })