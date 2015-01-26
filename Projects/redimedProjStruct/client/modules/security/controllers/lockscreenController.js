/**
 * Created by meditech on 08/10/2014.
 */
angular.module("app.lockscreen.controller",[
])

.controller("lockscreenController", function($scope,$rootScope, $state, $cookieStore, SecurityService, UserService,toastr,$window,socket,$location){
        var userInfo;
        var from = $cookieStore.get('fromState');

        var params = {};

        if(from.fromParams != null || typeof from.fromParams !== 'undefined')
        {
            angular.forEach(from.fromParams, function(value , key) {
                params[key] = value;
            })
        }

        console.log(params);

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
            socket.emit('logout',$cookieStore.get("userInfo").user_name,$cookieStore.get("userInfo").id,$cookieStore.get("userInfo").UserType.user_type);

            $cookieStore.remove("userInfo");
            $cookieStore.remove("companyInfo");
            $cookieStore.remove("doctorInfo");
            $state.go("security.login",null,{location: "replace", reload: true});

            socket.removeAllListeners();
        }

        $scope.returnHome = function(lockForm){
            $scope.showClickedValidation = true;
            if(lockForm.$invalid){
                toastr.error("Please Check Your Password!", "Error");
            }else
            {

                SecurityService.login($scope.modelUser).then(function(response){
                    console.log(response);
                    if(response != null && response.status == 'success')
                    {
                        if(params != null || typeof params !== 'undefined')
                        {
                            $state.go(from.fromState.name,params,{location: "replace", reload: true});
                        }
                        else
                        {
                            $state.go(from.fromState.name,params,{location: "replace", reload: true});
                        }

                    }
                    else
                    {
                        toastr.error("Wrong Username Or Password!", "Error");
                    }

                }), function(error){
                    toastr.error("Wrong Username Or Password!", "Error");
                };
            }
        }


})
