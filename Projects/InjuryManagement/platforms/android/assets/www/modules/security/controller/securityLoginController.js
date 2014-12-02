angular.module('starter.security.login.controller',[])
.controller('securityLoginController',function($scope, $state,UserService, SecurityService,localStorageService){
        // SUBMIT LOGIN
        $scope.login = function(){

                SecurityService.login($scope.modelUser).then(function(response){
                    UserService.detail().then(function(response){
                        if(typeof response.userInfo !== 'undefined')
                            localStorageService.set("userInfo", response.userInfo);
                        if(typeof response.companyInfo !== 'undefined')
                            localStorageService.set("companyInfo", response.companyInfo);

                        if(response.userInfo['function_mobile'] != null){
                            UserService.getFunction(response.userInfo['function_mobile']).then(function(data){
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
                            $state.go('app.injury.info');
                        }
                    });
                }, function(error){
                    alert('Error','error');
                });
            }
    });