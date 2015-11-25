angular.module('starter.consultation.controller', [])
.controller('consultationController', function($scope, $state,localStorageService, InjuryServices,$ionicLoading,
    $timeout, $ionicLoading, HOST_CONFIG,ConsultationServices) {
        $scope.messageLoading = {
            message: "Waiting..."
        };
        $ionicLoading.show({
            templateUrl: "modules/loadingTemplate.html",
            animation: 'fade-in',
            scope: $scope,
            maxWidth: 500,
            showDelay: 0
        });
       InjuryServices.getPatientByUser($scope.userInfo.id).then(function (result) {//get patient id by userID 
              if(result.status == "success"){
                $ionicLoading.hide();
              		var Patient_id =  result.data.Patient_id;
              		ConsultationServices.consultationList(Patient_id).then(function(data){//get consulation by patientID
              			if(data.status == "success"){
              				$scope.HistoryConsultation = data.data;
              			}
              			
              		})

              }
        })
})