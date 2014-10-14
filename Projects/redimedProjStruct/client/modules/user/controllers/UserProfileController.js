/**
 * Created by meditech on 07/10/2014.
 */
angular.module('app.loggedIn.user.profile.controller',[])
    .controller('UserProfileController',function($scope,$modal,$filter,FileUploader,UserService,$http,toastr,$cookieStore){
        var userInfo = null;
        var companyInfo = null;

        $scope.isCompany = false;


        if($cookieStore.get('userInfo') != undefined){
            userInfo = $cookieStore.get('userInfo');
        }
        if($cookieStore.get('companyInfo') != undefined){
            companyInfo = $cookieStore.get('companyInfo');
        }

		 if(userInfo.user_type == 'Company')
          {
			$scope.detail = {
				id: userInfo.id,
				img: null,
				company_id: companyInfo[0].id,
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


           if(userInfo.user_type == 'Company')
           {
               $scope.isCompany = true;
               $scope.info = {
                   name:userInfo.Booking_Person,
                   username:userInfo.user_name,
                   phone:userInfo.Contact_number,
                   email:userInfo.Contact_email,
                   userType: userInfo.user_type,
                   companyName: companyInfo[0].Company_name,
                   companyIndustry: companyInfo[0].Industry,
                   companyAddr: companyInfo[0].Addr,
                   companyState: companyInfo[0].State
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
                   userType: userInfo.user_type
               }
           }


        $scope.updateUserProfile  = function(userForm){
            UserService.updateProfile($scope.detail).then(function(data){
                if(data.status === 'success')
                {
                    toastr.success("Edit Successfully!","Success");

                }
                else
                {
                    toastr.error("Edit Failed!","Error");
                }
            })

        }

        $scope.changeUserPassword = function(){
            var modalInstance = $modal.open({
                templateUrl: 'modules/user/views/changePassModal.html',
                controller: 'UserChangePassController',
                size: 'md',
                resolve:{
                    userId: function(){
                        return userInfo.id;
                    }

                }
            });
        }



    })

.controller('UserChangePassController',function($scope,$filter,$state,$modalInstance,OnlineBookingService, userId, toastr){
        $scope.info = {
            oldPass:null,
            newPass:null,
            id:userId
        }

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

        $scope.okClick = function(){
            OnlineBookingService.changeUserPassword($scope.info).then(function(data){
                if(data.status === 'success')
                {
                    toastr.success("Change Password Successfully","Success");
                    $modalInstance.dismiss('cancel');
                }
                else if(data.status === 'error')
                    toastr.error("Change Password Failed", "Error");
            })
        }
    })