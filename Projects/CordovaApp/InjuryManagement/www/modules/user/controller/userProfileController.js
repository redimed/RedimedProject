angular.module('starter.user.controller',[])
    .controller('userProfileController',function($scope, UserService, $http,
                                                 localStorageService, OnlineBookingService, $state,
                                                 $ionicPopup, $cordovaCamera, InjuryServices,
                                                 $cordovaFile, HOST_CONFIG, $cordovaFileTransfer) {

        var userInfo = null;
        var companyInfo = null;

        var serverUpload = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/api/users/uploadAvatar";
        $scope.isCompany = false;
        $scope.avatarUpload;
        var selectOptionUpload = 0;

        if(localStorageService.get('userInfo') != undefined){
            userInfo = localStorageService.get('userInfo');
        }
        if(localStorageService.get('companyInfo') != undefined){
            companyInfo = localStorageService.get('companyInfo');
        }

        if(userInfo.UserType.user_type == 'Company')
        {
            $scope.detail = {
                id: userInfo.id,
                img: null,
                company_id: companyInfo.id,
                Booking_Person: userInfo.Booking_Person,
                Contact_number: userInfo.Contact_number,
                Contact_email: userInfo.Contact_email,
                result_email: userInfo.result_email,
                invoiceemail: userInfo.invoiceemail
            }
        }
        else
        {
            $scope.detail = {
                id: userInfo.id,
                img: null,
                Booking_Person: userInfo.Booking_Person,
                Contact_number: userInfo.Contact_number,
                Contact_email: userInfo.Contact_email

            }
            InjuryServices.getPatientByUser($scope.userInfo.id).then(function(results){
                    if(results.status == "success"){
                        $scope.patientID = results.data.Patient_id;
                       

                    }
                })

        }

        UserService.getUserInfo(userInfo.id).then(function(data){
            if(data.status=="success"){
                 $scope.detail.img = data.img;
            }
           
        })

        UserService.getCompany().then(function(data){
            if(data.status=="success"){
                 $scope.companyList = data;
            }
           
        })


        if(userInfo.UserType.user_type == 'Company')
        {
            $scope.isCompany = true;
            $scope.info = {
                id:userInfo.id,
                name:userInfo.Booking_Person,
                username:userInfo.user_name,
                phone:userInfo.Contact_number,
                email:userInfo.Contact_email,
                userType: userInfo.UserType.user_type,
                companyName: companyInfo.Company_name,
                companyIndustry: companyInfo.Industry,
                companyAddr: companyInfo.Addr,
                companyState: companyInfo.State
            }
        }
        else
        {
            $scope.isCompany = false;
            $scope.info = {
                name:userInfo.Booking_Person,
                username:userInfo.user_name,
                phone:userInfo.Contact_number,
                email:userInfo.Contact_email,
                userType: userInfo.UserType.user_type
            }
        }

        if(userInfo.UserType.user_type == "Patient") {
            var sourceUserImg = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/api/users/image/" + userInfo.id
            $scope.avatarUpload = sourceUserImg;
        }

        $scope.updateUserProfile = function(){
            var paramsUpload = {
                userID: userInfo.id
            };
            uploadFile(serverUpload, $scope.avatarUpload, paramsUpload);
            UserService.updateProfile($scope.detail).then(function(data){
                if(data.status.toLowerCase() === 'success')
                {
                     $scope.getAvatar();
                    $scope.popupMessage = { message: "Your profile is saved!" };
                    $ionicPopup.show({
                        templateUrl: "modules/popup/PopUpSuccess.html",
                        scope: $scope,
                        buttons: [
                            { text: "Ok" }
                        ]
                    });
                }
                else
                {
                    $scope.popupMessage = { message: "Sorry. Please check your information!" };
                    $ionicPopup.show({
                        templateUrl: "modules/popup/PopUpError.html",
                        scope: $scope,
                        buttons: [
                            { text: "Ok" }
                        ]
                    });
                }
            })
        };

        $scope.changePass = function(){
            $scope.submittedChangePass = true;
                $scope.info.id = $scope.userInfo.id;
            if(typeof $scope.info.newPass !== 'undefined' || typeof $scope.info.passConfirm !== 'undefined') {
                UserService.changeUserPassword($scope.info).then(function(data){
                    if(data.status === 'success')
                    {
                        $scope.popupMessage = { message: "Your changed password successful." };
                        $ionicPopup.show({
                            templateUrl: "modules/popup/PopUpSuccess.html",
                            scope: $scope,
                            buttons: [
                                {
                                    text: "Ok",
                                    onTap: function() {
                                        $state.go("app.profile", {reload: true});

                                    }
                                }
                            ]
                        });
                    }
                    else if(data.status === 'error') {
                        $scope.popupMessage = { message: "Your old password was entered incorrectly. Please enter it again." };
                        $ionicPopup.show({
                            templateUrl: "modules/popup/PopUpError.html",
                            scope: $scope,
                            buttons: [
                                {
                                    text: "Ok",
                                    onTap: function() {
                                        delete $scope.info['oldPass'];
                                        delete $scope.info['newPass'];
                                        delete $scope.info['passConfirm'];
                                        $scope.submittedChangePass = false;
                                    }
                                }
                            ]
                        });
                    }
                })
            }
        }

        $scope.selectOption = function() {
            $scope.popupMessage = { message: "Using camera or take photo?" };
            $ionicPopup.show({
                templateUrl: "modules/popup/PopUpConfirm.html",
                scope: $scope,
                buttons: [
                    {
                        text: "Camera",
                        onTap: function() {
                            selectOptionUpload = 1;
                            takePhotoUpload(selectOptionUpload);
                        }
                    },
                    {
                        text: "Photo Library",
                        onTap: function() {
                            selectOptionUpload = 2;
                            takePhotoUpload(selectOptionUpload);
                        }
                    }
                ]
            });
        }

        function takePhotoUpload(params) {
            if(params==1) {
                var options = {
                    quality : 50,
                    destinationType : Camera.DestinationType.FILE_URI,
                    popoverOptions: CameraPopoverOptions,
                    sourceType: navigator.camera.PictureSourceType.CAMERA,
                };
                $cordovaCamera.getPicture(options).then(function(imageData) {
                    $scope.avatarUpload = imageData;
                });
            } else if(params==2) {
                var options = {
                    quality : 50,
                    destinationType : Camera.DestinationType.FILE_URI,
                    popoverOptions: CameraPopoverOptions,
                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                };
                $cordovaCamera.getPicture(options).then(function(imageData) {
                    $scope.avatarUpload = imageData;
                });
            }
        };

        function uploadFile(server, img, params) {
            var win = function (r) {
                console.log("Upload Success " + JSON.stringify(r));
            }

            var fail = function (error) {
                console.log("Upload Failed " + JSON.stringify(error));
            }

            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = img.substr(img.lastIndexOf('/') + 1);
            options.params = params;

            var ft = new FileTransfer();
            ft.upload(img, encodeURI(server), win, fail, options,true);
        }
    })