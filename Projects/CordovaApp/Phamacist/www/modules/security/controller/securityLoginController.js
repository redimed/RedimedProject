angular.module('starter.security.login.controller',[])
    .controller('securityLoginController',function($scope, $state, SecurityService,
                                                   localStorageService, $ionicPopup, $ionicLoading,$timeout){
     	

     	//login 
     	$scope.login = function(){
            if($scope.modelUser.username == "" || $scope.modelUser.password == "" || $scope.modelUser.username == undefined || $scope.modelUser.password == undefined){
                alert("pls check username or password")
            }else{
                SecurityService.login($scope.modelUser).then(function(result){
                    if(result.status == "fail"){
                        alert("Login Fail");
                        $scope.modelUser.password == "";
                    }else{
                        localStorageService.set("userInfo",result.data);
                        $scope.tokenID = SecurityService.tokenID;
                        // $scope.$watch("tokenID", function(newvalue){
                            // console.log(newvalue);
                            // if(typeof newvalue !== 'undefined'){
                                console.log($scope.tokenID);
                                SecurityService.insertTokenId($scope.tokenID, result.data.user_id).then(function(result){
                                    console.log(result);
                                })
                            // }
                        // })
                        $ionicLoading.show({
                            template: "<div class='icon ion-ios7-reloading'></div>"+
                            "<br />"+
                            "<span>Waiting...</span>",
                            animation: 'fade-in',
                            showBackdrop: true,
                            maxWidth: 200,
                            showDelay: 0
                        });
                        $timeout(function(){
                            $ionicLoading.hide();
                            $scope.modelUser={};
                            $state.go('app.main.home');
                        },500)
                    }
                })
            }				
     	}

     	$scope.goStateSignUp = function(){
     		$state.go('security.signup');
     	}
    });