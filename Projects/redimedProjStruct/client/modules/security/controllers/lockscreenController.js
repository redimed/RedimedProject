/**
 * Created by meditech on 08/10/2014.
 */
angular.module("app.lockscreen.controller",[
])

.controller("lockscreenController", function($scope, $state, $cookieStore, SecurityService, UserService,toastr,$window){
        var userInfo;


        if($cookieStore.get('userInfo') == null || typeof $cookieStore.get('userInfo') == 'undefined')
            $state.go('security.login');
        else
        {
            userInfo = $cookieStore.get('userInfo');
        }

        $scope.modelUser = {
            username: userInfo.user_name,
            password: null
        }

        UserService.getUserInfo(userInfo.id).then(function(data){
            $scope.img = data.img;
        })

        $scope.name = userInfo.Booking_Person;
        $scope.email = userInfo.Contact_email;

        $scope.notUser = function(){
            $cookieStore.remove("userInfo");
            $cookieStore.remove("companyInfo");
            //$state.go("security.login",null,{reload:true});
            $window.location.href="/";
        }

        $scope.returnHome = function(lockForm){
            $scope.showClickedValidation = true;
            if(lockForm.$invalid){
                toastr.error("Please Check Your Password!", "Error");
            }else
            {
                console.log($scope.modelUser);
                SecurityService.login($scope.modelUser).then(function(response){
                    //$state.go('loggedIn.home');
                    $window.location.href="/";
                }), function(error){
                    toastr.error("Wrong Username Or Password!", "Error");
                };
            }
        }

})
