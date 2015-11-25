angular.module('starter.consultationDetail.controller', []).controller('consultationDetailController', function($scope, $state, localStorageService, InjuryServices, $ionicModal, $timeout, $ionicLoading, HOST_CONFIG, ConsultationServices) {
    $scope.drawing = [];
    //start get detail consulation by Patient ID and Calendar ID
    InjuryServices.consultation(null,$state.params.patient_id,$state.params.cal_id).then(function(consu) {
        if (consu.status == "success") {
            $scope.consultation = consu.data;
            angular.forEach($scope.consultation.drawingArr, function(value, key) {
                var path = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/api/consultation/drawing/image/" + value.id;// get image by Image ID
                $scope.drawing.push({
                    image: path
                });
            });
        } else {
            console.log("No consultation!!");
        }
    });

    // Start Modal image
    $ionicModal.fromTemplateUrl('modules/consutationHistory/views/modalImage.html', function(modal) {
        $scope.ConsultationModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up',
        hardwareBackButtonClose: false
    });
    $scope.image = {
        path: ""
    };
    $scope.selectImg = function(selected) {
        $scope.image.path = selected;
        $scope.ConsultationModal.show();
    }
    $scope.hideModal = function() {
        $scope.ConsultationModal.hide();
    };
    //Close Modal Image
})