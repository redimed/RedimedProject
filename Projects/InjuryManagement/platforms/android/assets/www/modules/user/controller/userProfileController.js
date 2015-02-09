angular.module('starter.user.controller',[])
.controller('userProfileController',function($scope, UserService, $http, localStorageService, OnlineBookingService, $state){
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
                   alert("Edit Successfully!","Success");
                }
                else
                {
                   alert("Edit Failed!","Error");
                }
            })

        }
        $scope.changePass = function(){
                console.log($scope.info);
            OnlineBookingService.changeUserPassword($scope.info).then(function(data){
                if(data.status === 'success')
                {
                   alert("Change Password Successfully","Success");
                    $state.go("app.profile");
                }
                else if(data.status === 'error')
                    alert("Change Password Failed", "Error");
            })
        }

    })