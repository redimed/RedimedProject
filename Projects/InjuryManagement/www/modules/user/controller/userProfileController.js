angular.module('starter.user.controller',[])
    .controller('userProfileController',function($scope, UserService, $http, localStorageService, OnlineBookingService, $state, $ionicPopup) {
        var userInfo = null;
        var companyInfo = null;

        $scope.isCompany = false;


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
        }

        UserService.getUserInfo(userInfo.id).then(function(data){
            $scope.detail.img = data.img;
        })



        UserService.getCompany().then(function(data){
            $scope.companyList = data;
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


        $scope.updateUserProfile  = function(userForm){

            UserService.updateProfile($scope.detail).then(function(data){
                if(data.status === 'success')
                {
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

        }
        $scope.changePass = function(){
            $scope.submittedChangePass = true;
            if(typeof $scope.info.newPass !== 'undefined' || typeof $scope.info.passConfirm !== 'undefined') {
                OnlineBookingService.changeUserPassword($scope.info).then(function(data){
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
    })