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


    //================================= DEMO apiRTC ====================================

    var session = null;

    // handler function for media errors
    function userMediaErrorHandler(e) {
        $("#call").attr("disabled", false).val("Call");
        $("#hangup").attr("disabled", true).val("Hangup");
    }

    // handler function for handling the remote user hanging up
    function remoteHangupHandler(e) {
        console.log('remoteHangupHandler');
        console.log(e.detail.reason);

        if (e.detail.lastEstablishedCall === true) {
            $("#call").attr("disabled", false).val("Call");
            $("#hangup").attr("disabled", true).val("Hangup");
        }
    }

    // handler function for when the local user hangs up
    function hangupHandler(e) {
        console.log('hangupHandler');
        console.log(e.detail.reason);
        
        if (e.detail.lastEstablishedCall === true) {
            $("#call").attr("disabled", false).val("Call");
            $("#hangup").attr("disabled", true).val("Hangup");
        }
    }

    function incomingCallHandler(e) {
        apiRTC.addEventListener("remoteHangup", remoteHangupHandler);
        $("#call").attr("disabled", true).val("Call ongoing");
        $("#hangup").attr("disabled", false).val("Hangup");
    }

    function callAttemptHandler(e) {
        alert('Id :' + e.detail.callerId + 'is trying to reach you')
    }

    // callback when ApiRTC is ready
    function sessionReadyHandler(e) {
        console.log('sessionReadyHandler :' + apiCC.session.apiCCId);

        $("#call").attr("disabled", false).val("Call");

        apiRTC.addEventListener("incomingCall", incomingCallHandler);
        apiRTC.addEventListener("userMediaError", userMediaErrorHandler);
        apiRTC.addEventListener("callAttempt", callAttemptHandler);
        apiRTC.addEventListener("hangup", hangupHandler);

        var webRTCClient = apiCC.session.createWebRTCClient({
            localVideo : "myLocalVideo",
            minilocalVideo : "myMiniVideo",
            remoteVideo : "myRemoteVideo",
            status : "status"
        });

        $("#call").click(function () {
            $("#call").attr("disabled", true).val("Call ongoing");
            $("#hangup").attr("disabled", false).val("Hangup");
            apiRTC.addEventListener("remoteHangup", remoteHangupHandler);
            webRTCClient.call($("#number").val());
        });

        $("#hangup").click(function () {
            $("#call").attr("disabled", false).val("Call");
            $("#hangup").attr("disabled", true).val("Hangup");
            webRTCClient.hangUp();
        });
    }
    
    // initialise ApiRTC
    apiRTC.init({
        apiKey : "5a17b6b777548c2feb4e8af4b6b6591b",
        onReady : sessionReadyHandler
    });

    //================================= DEMO apiRTC ====================================



    // SUBMIT LOGIN
    $scope.login = function(){
        $scope.showClickedValidation = true;

        if($scope.loginForm.$invalid){
            toastr.error("Please Input Your Username And Password!", "Error");
        }else{
            // $scope.isLogging = true;

            // if($scope.isLogging) {
            // if($scope.modelUser.isAgree)
            // {
                SecurityService.login($scope.modelUser).then(function (response) {
                    $cookieStore.put('token', 'abcdefghklf');

                    socket.emit('checkLogin', $scope.modelUser.username);

                    socket.on('isSuccess', function () {
                        login($scope.modelUser.username);
                    })

                    socket.on('isError', function () {
                        $scope.isLogging = false;
                        var modalInstance = $modal.open({
                            templateUrl: 'modules/security/views/confirmLogin.html',
                            controller: 'ConfirmLoginController',
                            size: 'md',
                            backdrop: 'static',
                            keyboard: false
                        })

                        modalInstance.result.then(function (acceptLogin) {
                            if (acceptLogin) {
                                socket.emit('forceLogin', $scope.modelUser.username);
                            }

                        }, function (err) {
                            console.log(err);
                        });
                    })

                }, function (error) {
                    toastr.error("Wrong Username Or Password!");
                    // $scope.isLogging = false;
                });

                socket.removeAllListeners();
            // }
            // else
            // {
            //     toastr.warning("Please Agree With Terms And Conditions!");
            // }

            // }

        }
    }
    // END SUBMIT LOGIN

        function login(username){
            socket.emit('updateSocketLogin', username);
            socket.on('login_success',function(){
                UserService.detail().then(function (response) {
              
                    if (typeof response.userInfo !== 'undefined') {
                            $cookieStore.put("userInfo", response.userInfo);
                            $cookieStore.put("isRemember",$scope.modelUser.isRemember);

                            if (typeof response.companyInfo !== 'undefined')
                                $cookieStore.put("companyInfo", response.companyInfo);


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
                            {
                                gotoFunction();
                            }
                    }
                    
                });
            });
            
        }


})

    .controller("ConfirmLoginController",function($scope,$filter,$state,$modalInstance,SecurityService,UserService, toastr,socket){
        $scope.acceptLogin = false;

        $scope.cancelLogin = function(){
            $scope.acceptLogin = false;
            $modalInstance.close($scope.acceptLogin);
        };

        $scope.acceptLogin = function(){
            $scope.acceptLogin = true;
            $modalInstance.close($scope.acceptLogin);
        };

    })