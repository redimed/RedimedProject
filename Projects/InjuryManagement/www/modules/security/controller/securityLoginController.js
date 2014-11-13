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

                        if(response.userInfo['function_id'] != null){
                            UserService.getFunction(response.userInfo['function_id']).then(function(data){
                                var rs = data.definition.split('(');
                                if(rs[0] != null)
                                {
                                    if(rs[1] != null)
                                    {
                                        var r = rs[1].split(')');
                                        var params = eval("("+r[0]+")");
                                        alert('1');
                                        $state.go(rs[0],params,{reload:true});
                                    }
                                    else
                                    {
                                        alert('2');
                                        alert(JSON.stringify(rs[0]));
                                       // $state.go(rs[0],{reload:true});
                                        $state.go('app.browse');
                                    }
                                }
                            })
                        }
                        else
                        {
                            $state.go('app.browse');
                        }
                    });
                }, function(error){
                    alert('Error');
                });
            }

    })