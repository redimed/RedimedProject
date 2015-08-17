angular.module("app.security.login.controller",[
])
    .controller("SecurityLoginController", function ($http,$scope, $state,$modal, $cookieStore,localStorageService ,SecurityService, toastr, UserService, ConfigService, DoctorService,socket) {
        $scope.showClickedValidation = false;

        $scope.isLogging = false;

    $scope.modelUser = {
        username : null,
        password : null,
        // isAgree: false,
        isRemember: false
    }

    socket.removeAllListeners();

    // SUBMIT LOGIN
    $scope.login = function(){
        $scope.showClickedValidation = true;

        if($scope.loginForm.$invalid){
            toastr.error("Please Input Your Username And Password!", "Error");
        }else{
            SecurityService.login($scope.modelUser).then(function (response) {
                if(response.status.toLowerCase() == 'success')
                {
                    if (typeof response.userInfo !== 'undefined') {
                        socket.emit('updateSocketLogin', response.userInfo.id);
                        $cookieStore.put("userInfo", response.userInfo);
                        $cookieStore.put("isRemember",$scope.modelUser.isRemember);

                        if (typeof response.companyInfo !== 'undefined')
                            $cookieStore.put("companyInfo", response.companyInfo);

                        $cookieStore.put("token",response.token);

                        //tannv.dts create
                        var gotoFunction=function()
                        {
                            if (response.userInfo['function_id'] != null) {
                                UserService.getFunction(response.userInfo['function_id']).then(function (data) {
                                    if(typeof data.definition !== 'undefined')
                                    {
                                        var rs = data.definition.split('(');
                                        if (rs[0] != null) {
                                            if (rs[1] != null) {
                                                var r = rs[1].split(')');
                                                var params = eval("(" + r[0] + ")");


                                                $state.go(rs[0], params, {location: "replace", reload: true});
                                            }
                                            else {
                                                $state.go(rs[0], {location: "replace", reload: true});
                                            }
                                        }
                                    }
                                    else
                                    {
                                         $state.go('loggedIn.home',null,{location: "replace", reload: true});
                                    }
                                })
                            }
                            else {
                                $state.go('loggedIn.home',null,{location: "replace", reload: true});
                            }
                        }

                        //modify by: tannv.dts@gmail.com
                        if (response.userInfo.UserType.user_type == 'Doctor') {
                            DoctorService.getByUserId(response.userInfo.id)
                            .then(function (data) {
                                if (data) {
                                    $cookieStore.put('doctorInfo', {
                                        doctor_id: data.doctor_id,
                                        NAME: data.NAME,
                                        Provider_no: data.Provider_no,
                                        CLINICAL_DEPT_ID: data.CLINICAL_DEPT_ID
                                    });
                                }
                                gotoFunction();

                            },function(err){
                                gotoFunction();
                            });
                        }
                        else
                            gotoFunction();
                    }
                }
                else
                {
                    toastr.error(response.message);
                    if(response.check)
                        socket.emit('forceLogin', $scope.modelUser.username);
                }
            });
        }
    }
})

