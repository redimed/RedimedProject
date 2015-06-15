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

        $scope.checkField = function (isMobile) {
            if(isMobile)
            {
                $scope.iconLoadingMobile = true;
                if($scope.worker.Mobile == '' || typeof $scope.worker.Mobile == 'undefined') {
                    $timeout(function(){
                        $scope.iconLoadingMobile = false;
                        $scope.iconSuccessMobile = false;
                        $scope.iconErrorMobile = false;
                    }, 0.1 * 1000);
                } else {
                    WorkerServices.checkMobile($scope.worker.Mobile).then(function(data){
                        $scope.iconSuccessMobile = false;
                        $scope.iconErrorMobile = false;
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
                            $timeout(function(){
                                $scope.iconLoadingMobile = false;
                                if($scope.isFailMobile){
                                    $scope.iconLoadingMobile = false;
                                    $scope.iconErrorMobile = true;
                                } else {
                                    $scope.iconSuccessMobile = true;
                                }
                            }, 2 * 1000);
                        }
                    })
                }
            }
            else
            {
                WorkerServices.checkEmail($scope.worker.Email).then(function (data) {
                    if(typeof $scope.worker.Email == 'undefined') {
                        $scope.iconLoadingMail = true;
                        $scope.iconSuccessMail = false;
                        $scope.iconErrorMail = false;
                        $timeout(function(){
                            $scope.iconLoadingMail = false;
                            $scope.iconSuccessMail = false;
                        }, 10 * 1000);
                    } else {
                        if (data.status == 'success')
                        {
                            $scope.iconLoadingMail = false;
                            if (data.data.length == 0) {
                                $scope.iconSuccessMail = true;
                                $scope.isFailEmail = false;
                            }
                            else {
                                $scope.iconErrorMail = true;
                                $scope.isFailEmail = true;
                            }
                        }
                    }
                })
            }
        }

        $scope.nextFormFirst = function(first) {
            $scope.isSubmit = true;
            if (first.$invalid || $scope.dateError) {
                $scope.popupMessage = { message:"Please check your information!" };
                $ionicPopup.show({
                    templateUrl: "modules/popup/PopUpError.html",
                    scope: $scope,
                    buttons: [
                        { text: "Ok" }
                    ]
                });
            } else {
                $state.go('app.worker.main');
            }
        }

        $scope.changeDOBworker = function() {
            var today = new Date().getFullYear();
            if($scope.worker.DOB.split("-")[0] >= today.toString() || $scope.worker.DOB == '') {
                $scope.dateError = true;
            } else {
                $scope.dateError = false;
            }
        }

        $scope.nextFormSecond = function(last) {
            $scope.isSubmit2 = true;
            if (last.$invalid){
                $scope.popupMessage = { message:"Please check your information!" };
                $ionicPopup.show({
                    templateUrl: "modules/popup/PopUpError.html",
                    scope: $scope,
                    buttons: [
                        { text: "Ok" }
                    ]
                })
            }
            else
            {
                $state.go("app.worker.second");
            }
        }

        //back injuryDesc
        $scope.backdescInjury = function() {
            localStorageService.set("checkNonemerg", $scope.injurySubmitNonemer);
            $state.go('app.injury.desInjury');
        }

        //submit worker check true false
        $scope.submitInsertWorker = function (workerForm, last) {
            $scope.isSubmit3 = true;
            if (last.$invalid) {
                $scope.popupMessage = { message:"Please check your information!" };
                $ionicPopup.show({
                    templateUrl: "modules/popup/PopUpError.html",
                    scope: $scope,
                    buttons: [
                        { text: "Ok" }
                    ]
                });
                return;
            };
            if($scope.injurySubmitNonemer)
            {
                $state.go('app.chooseAppointmentCalendar');
            }
            else
            {
                WorkerServices.insertWorker({patient: $scope.worker}).then(function (data) {
                    $scope.messageLoading = {message: "Waiting..."};
                    $ionicLoading.show({
                        templateUrl: "modules/loadingTemplate.html",
                        animation: 'fade-in',
                        scope: $scope,
                        maxWidth: 500,
                        showDelay: 0
                    });
                    console.log(data);
                    if (data.status != 'success') {
                        $ionicLoading.hide();
                        $scope.popupMessage = { message:"Please check your information!" };
                        $ionicPopup.show({
                            templateUrl: "modules/popup/PopUpError.html",
                            scope: $scope,
                            buttons: [
                                { text: "Ok" }
                            ]
                        })
                        return;
                    } else {
                        $timeout(function () {
                            reset();
                            $ionicLoading.hide();
                            $scope.popupMessage = { message: "We have added worker to company. Do you want write NFC to tag?" };
                            $ionicPopup.show({
                                templateUrl: "modules/popup/PopUpSuccess.html",
                                scope: $scope,
                                buttons: [
                                    {
                                        text: "Cancel",
                                        onTap: function() {
                                            $state.go('app.worker.add', {reload: true});
                                        }
                                    },
                                    {
                                        text: "Yes, I do",
                                        type: "button button-assertive",
                                        onTap: function(e) {
                                            $scope.nfcInfo = data;
                                            $state.go('app.worker.writeNFC');
                                        }
                                    }
                                ]
                            })
                        }, 2000);
                    }
                })
            }
        }
        init();

        if($scope.nfcInfo.length == 0){
            $scope.nfcInfo = localStorageService.get('newInfo');
        }
        $scope.NFCwrite = function(){
            localStorageService.set('mode','write');
            var mode = localStorageService.get('mode');
            writeNFC.initialize($scope.nfcInfo,mode);
        }
    })