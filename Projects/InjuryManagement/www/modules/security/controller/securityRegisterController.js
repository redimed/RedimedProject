angular.module('starter.security.register.controller',[])

    .controller('securityRegisterController', function($scope, $state, InjuryServices, SecurityService, ConfigService, $ionicPopup,WorkerServices, $filter){

        $scope.titleIndex = ConfigService.title_option();
        console.log($scope.titleIndex)
        $scope.sexIndex = ConfigService.sex_option();
        $scope.userInfo = {};
        $scope.patientInfo = {};
          WorkerServices.listAccType().then(function (data) {
                if (data.status != 'success') {
                    alert('error');
                    return;
                }
                $scope.accTypeIndex = data.list;
            });

            WorkerServices.listPrvFund().then(function (data) {
                if (data.status != 'success') {
                    alert('error');
                    return;
                }
                $scope.fundIndex = data.list;
            });

        $scope.submitRegister = function() {
            console.log($scope.userInfo);
            $scope.userInfo.DOB = $filter('date')( Date.parse($scope.patientInfo.month +'/'+  $scope.patientInfo.date +'/'+ $scope.patientInfo.year), 'dd/MM/yyyy');
            $scope.patientInfo.DOB = $filter('date')( Date.parse($scope.patientInfo.month +'/'+  $scope.patientInfo.date +'/'+ $scope.patientInfo.year), 'dd/MM/yyyy');
            var fullname = [];
            fullname.push($scope.patientInfo.First_name, $scope.patientInfo.Sur_name, $scope.patientInfo.Middle_name);
            $scope.userInfo.Booking_Person = fullname.join(' ');
            $scope.userInfo.Contact_number = $scope.patientInfo.Mobile;
            $scope.userInfo.Contact_email = $scope.patientInfo.Email;
            SecurityService.signup($scope.userInfo, $scope.patientInfo).then(function (res){
                if(res.status.toLowerCase() == 'success') {
                   $scope.popupMessage = { message:"Register success!" };
                   $ionicPopup.show({
                       templateUrl: "modules/popup/PopUpSuccess.html",
                       scope: $scope,
                       buttons: [
                           {
                               text: "Ok",
                               onTap: function() {
                                   $state.go('security.login', null, {reload: true});
                               }
                           }
                       ]
                   });
                } else {
                   $scope.popupMessage = { message:"Register failed! Please try again" };
                   $ionicPopup.show({
                       templateUrl: "modules/popup/PopUpError.html",
                       scope: $scope,
                       buttons: [
                           {
                               text: "Ok"
                           }
                       ]
                   });
                }
            })
        };

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