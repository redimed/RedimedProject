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

                        
                            $state.go('app.browse');
                        
                    });
                }, function(error){
                    alert('Error','error');
                });
            }

    })