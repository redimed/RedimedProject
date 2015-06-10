angular.module('starter.security.forgot.controller',[])

.controller('securityForgotController',function($scope, $state, SecurityService,$ionicLoading,$ionicPopup){
			
		$scope.forgot= {};
        $scope.forgotpass = function(){
        		  $ionicLoading.show({
                                template: "<div class='icon ion-ios7-reloading'></div>"+
                                "<br />"+
                                "<span>Waiting...</span>",
                                animation: 'fade-in',
                                showBackdrop: true,
                                maxWidth: 200,
                                showDelay: 0
                            });
            SecurityService.forgotpass($scope.forgot.username).then(function(result){
               	if(result.status="success"){
               			 $ionicLoading.hide();
               		 var alertPopup = $ionicPopup.alert({
                             title: 'Alert',
                             template: 'Forgot Success'
                           });
                           alertPopup.then(function(res) { 
                               	$scope.forgot={};
                                 $state.go('security.login')
                                 
                           });
               		
               	}
            })
        }
    })