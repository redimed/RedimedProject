angular.module('starter.worker.add.controller',[])

    .controller('workerAddController', function($scope, WorkerServices, $state, localStorageService, $ionicPopup) {
        var userInfo = localStorageService.get("userInfo");
        $scope.isSubmit = false;
        $scope.worker = {
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
            companyID: userInfo.company_id,

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

        $scope.nextFormInfo = function(infor) {
            $scope.isSubmit = true;
            if (infor.$invalid){
                var alertPopup = $ionicPopup.alert({
                    title: "Can't next form",
                    template: 'Please Check Your Information!'
                });
            }
            else{
                $state.go("app.worker.contact");
            }
        }

        $scope.submit = function (workerForm) {
            $scope.isSubmit = true;
            if (workerForm.$invalid) {
                console.log("not insert")
                var alertPopup = $ionicPopup.alert({
                    title: "Can't insert worker",
                    template: 'Please Check Your Information!'
                });
                return;
            }

            WorkerServices.insertWorker({patient: $scope.worker}).then(function (data) {
                if (data.status != 'success') {
                    console.log("cannot insert")
                    var alertPopup = $ionicPopup.alert({
                        title: 'Cannot Insert',
                        template: 'Please Check Your Information!'
                    });
                    return;
                }
                var alertPopup = $ionicPopup.alert({
                    title: 'Insert Successfully',
                    template: 'Worker added to your company!'
                });
            })
        }
    })