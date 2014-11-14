angular.module('starter.worker.add.controller',[])

    .controller('workerAddController', function($scope, WorkerServices, $state, localStorageService, $ionicPopup, $ionicLoading, $timeout) {
        var userInfoLS = localStorageService.get("userInfo");
        console.log(JSON.stringify(userInfoLS.company_id));
        $scope.isSubmit = false;
        $scope.isSubmit2 = false;

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
            //chua lay duoc company id

            //not set data form
            Known_as: '',
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
            Alias_First_name: '',
            Alias_Sur_name: '',
            Phone_ext: ''
        }

        var reset = function() {
            $scope.worker = angular.copy($scope.workerObj);
            $scope.isSubmit = false;
            $scope.isSubmit2 = false;
        }

        $scope.reset = reset;

        var init = function () {
            reset();
        }

        $scope.nextFormInfo = function(infor) {
            $scope.isSubmit = true;
            if (infor.$invalid){
                var alertPopup = $ionicPopup.alert({
                    title: "Can't next form",
                    template: 'Please Check Your Information!'
                });
            }
            else
            {
                $state.go("app.worker.contact");
            }
        }

        $scope.submit = function (workerForm, contact) {
            $scope.isSubmit2 = true;
            if (contact.$invalid) {
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