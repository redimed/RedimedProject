angular.module("app.security.login.controller",[
])
        .controller("SecurityLoginController", function ($scope, $state, $cookieStore, SecurityService, toastr, UserService, ConfigService, DoctorService,socket) {
            $scope.showClickedValidation = false;



    $scope.modelUser = {
        username : null,
        password : null
    }

    // SUBMIT LOGIN
    $scope.login = function(){
        $scope.showClickedValidation = true;

        if($scope.loginForm.$invalid){
            toastr.error("Please Input Your Username And Password!", "Error");
        }else{

            SecurityService.login($scope.modelUser).then(function(response){
                socket.emit('checkLogin',$scope.modelUser.username);
                socket.on('isSuccess',function() {
                    UserService.detail().then(function (response) {
                        if (typeof response.userInfo !== 'undefined') {

                            socket.emit('login_successful', response.userInfo.id, response.userInfo.user_name);

                            $cookieStore.put("userInfo", response.userInfo);

                            if (typeof response.companyInfo !== 'undefined')
                                $cookieStore.put("companyInfo", response.companyInfo);

                            /**
                             * khank
                             * ADD COOKIE INFO 4 DOCTOR
                             */
                            if (response.userInfo.UserType.user_type == 'Doctor') {
                                DoctorService.getByUserId(response.userInfo.id).then(function (data) {
                                    if (data) {
                                        $cookieStore.put('doctorInfo', {
                                            doctor_id: data.doctor_id,
                                            NAME: data.NAME,
                                            Provider_no: data.Provider_no,
                                            CLINICAL_DEPT_ID: data.CLINICAL_DEPT_ID
                                        });
                                    }
                                });
                            }
                        }


                        if (response.userInfo['function_id'] != null) {
                            UserService.getFunction(response.userInfo['function_id']).then(function (data) {
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
                            })
                        }
                        else {
                            $state.go('loggedIn.home',null,{location: "replace", reload: true});
                        }
                    });
                })

                socket.on('isError',function(msg){
                    toastr.error("Account is using by another person!","Error");
                })
            }, function(error){
                toastr.error("Wrong Username Or Password!", "Error");
            });

        }
    }
    // END SUBMIT LOGIN


})