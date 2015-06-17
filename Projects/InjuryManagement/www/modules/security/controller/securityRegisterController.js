angular.module('starter.security.register.controller',[])

    .controller('securityRegisterController', function($scope, $state, InjuryServices, SecurityService, ConfigService, $ionicPopup){

        $scope.titleIndex = ConfigService.title_option();
        $scope.sexIndex = ConfigService.sex_option();
        $scope.userInfo = {};
        $scope.patientInfo = {};

        $scope.submitRegister = function() {
            console.log($scope.userInfo);
            $scope.userInfo.dob = new Date($scope.userInfo.dob);
            var fullname = [];
            fullname.push($scope.patientInfo.firstName, $scope.patientInfo.surName, $scope.patientInfo.middleName);
            $scope.userInfo.Booking_Person = fullname.join(' ');
            SecurityService.signup($scope.userInfo, $scope.patientInfo).then(function (res){
                //if(res.status.toLowerCase() == 'success') {
                //    $scope.popupMessage = { message:"Register success!" };
                //    $ionicPopup.show({
                //        templateUrl: "modules/popup/PopUpSuccess.html",
                //        scope: $scope,
                //        buttons: [
                //            {
                //                text: "Ok",
                //                onTap: function() {
                //                    $state.go('security.login', null, {reload: true});
                //                }
                //            }
                //        ]
                //    });
                //} else {
                //    $scope.popupMessage = { message:"Register failed! Please try again" };
                //    $ionicPopup.show({
                //        templateUrl: "modules/popup/PopUpError.html",
                //        scope: $scope,
                //        buttons: [
                //            {
                //                text: "Ok",
                //                type: "button button-assertive"
                //            }
                //        ]
                //    });
                //}
            })
        }

        $scope.validEmail = function() {
            InjuryServices.checkEmail($scope.userInfo.email).then(function (data) {
                if(typeof $scope.userInfo.email == 'undefined') {
                    //$scope.iconLoadingMail = true;
                    //$scope.iconSuccessMail = false;
                    //$scope.iconErrorMail = false;
                    //$timeout(function(){
                    //    $scope.iconLoadingMail = false;
                    //    $scope.iconSuccessMail = false;
                    //}, 10 * 1000);
                } else {
                    console.log('success data ');
                    if (data.status == 'success')
                    {
                        //    $scope.iconLoadingMail = false;
                        //    if (data.data.length == 0) {
                        //        $scope.iconSuccessMail = true;
                        //        $scope.isFailEmail = false;
                        //    }
                        //    else {
                        //        $scope.iconErrorMail = true;
                        //        $scope.isFailEmail = true;
                        //    }
                    }
                }
            })
        }
        $scope.checkdate= function(type){
        if(type == "date"){
            if($scope.userInfo.date > 31){
                $scope.userInfo.date = "";
            }
        }
        if(type=='month'){
            if($scope.userInfo.month > 12){
                $scope.userInfo.month = "";
            }
        }
        if(type=='year'){
            if($scope.userInfo.year > 2000){
                $scope.userInfo.year = "";
            }
        }
        
        }
    })
.directive('autoTabTo', [function () {
  return {
      restrict: "A",
      link: function (scope, el, attrs) {
          el.bind('keyup', function(e) {
            if (this.value.length === this.maxLength) {
              var element = document.getElementById(attrs.autoTabTo);
              if (element)
                element.focus();
            }
          });
      }
  }
}]);