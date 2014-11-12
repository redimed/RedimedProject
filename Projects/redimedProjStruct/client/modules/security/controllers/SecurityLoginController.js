angular.module("app.security.login.controller",[
])
        .controller("SecurityLoginController", function ($scope, $state, $cookieStore, SecurityService, toastr, UserService, ConfigService, DoctorService) {
            $scope.showClickedValidation = false;



    // SUBMIT LOGIN
    $scope.login = function(){
        $scope.showClickedValidation = true;

        if($scope.loginForm.$invalid){
            toastr.error("Please Input Your Username And Password!", "Error");
        }else{
            SecurityService.login($scope.modelUser).then(function(response){
                UserService.detail().then(function(response){
                    if(typeof response.userInfo !== 'undefined'){
                        $cookieStore.put("userInfo", response.userInfo);
						
						if(typeof response.companyInfo !== 'undefined')
							$cookieStore.put("companyInfo", response.companyInfo);
						
						/**
						 * khank
						 * ADD COOKIE INFO 4 DOCTOR
						 */
						 if (response.userInfo.user_type == 'Doctor') {
							DoctorService.getByUserId(response.userInfo.id).then(function (data) {
						        if(data){
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
                    

                    if(response.userInfo['function_id'] != null){
                        UserService.getFunction(response.userInfo['function_id']).then(function(data){
                            var rs = data.definition.split('(');
                            if(rs[0] != null)
                            {
                                if(rs[1] != null)
                                {
                                    var r = rs[1].split(')');
                                    var params = eval("("+r[0]+")");


                                    $state.go(rs[0],params,{reload:true});
                                }
                                else
                                {
                                    $state.go(rs[0],{reload:true});
                                }
                            }
                        })
                    }
                    else
                    {
                        $state.go('loggedIn.home');
                    }
                });
            }, function(error){
                toastr.error("Wrong Username Or Password!", "Error");
            });
        }
    }
    // END SUBMIT LOGIN
})