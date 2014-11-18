angular.module('starter.worker.add.controller',[])

    .controller('workerAddController', function($scope, WorkerServices, $state, localStorageService, $ionicPopup, $ionicLoading, $timeout, ConfigService) {
        var userInfoLS = localStorageService.get("userInfo");
        console.log(JSON.stringify(userInfoLS.company_id));
        $scope.isSubmit = false;
        $scope.isSubmit2 = false;
        $scope.isSubmit3 = false;
        $scope.isFailMobile = false;
        $scope.isFailEmail = false;

        $scope.workerObj = {
            Title: '',
            First_name: '',
            Sur_name: '',
            Middle_name: '',
            Address1: '',
            Address2: '',
            Post_code: '',
            Country: 'Australia',
            DOB: '',
            Sex: '',
            Home_phone: '',
            Work_phone: '',
            Mobile: '',
            Suburb: '',
            Known_as: '',
            Account_type: '',
            Account_holder: '',
            Medicare_no: '',
            Email: '',
            IHINo: '',
            Private_fund_id: '',
            UPI: '',
            Exp_medicare: '',
            MemberShip_no: '',
            HCC_Pension_No: '',
            DVA_No: '',
            DVA_card_colour: '',
            Exp_pension: '',
            company_id: userInfoLS.company_id,

            //No_SMS: 1,
            //Account_Seft: '',
            //Ref: '',
            //Balance: '',
            //Pays_Gap_Only: 1,
            //Alias_First_name: '',
            //Alias_Sur_name: '',
            //Phone_ext: ''
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
            //$scope.countryIndex = ConfigService.country_option();
            //$scope.smsIndex = $scope.payGapIndex = ConfigService.get_yes_no_opt();

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

        $scope.Checkfield = function (valueMobile, valueEmail) {
            if(valueMobile != '')
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
            if(valueEmail != '')
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

        $scope.submit = function (workerForm, second) {
            $scope.isSubmit3 = true;
            if (second.$invalid) {
                var alertPopup = $ionicPopup.alert({
                    title: "Can't insert worker",
                    template: 'Please Check Your Information!'
                });
                return;
            }

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
                    var alertPopup = $ionicPopup.alert({
                        title: 'Insert Successfully',
                        template: 'We have added worker to company!'
                    });
                }, 2000);
            })
        }
        init();
    })