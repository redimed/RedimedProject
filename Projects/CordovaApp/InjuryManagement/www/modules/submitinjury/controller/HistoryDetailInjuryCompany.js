angular.module('starter.historyDetailInjury.controller', []).controller('HistoryDetailInjury', function($cordovaFileOpener2, $scope, $state, $filter, $stateParams, InjuryServices, $ionicPopup, localStorageService, $ionicModal, ConfigService, $ionicLoading, $timeout, $rootScope, HOST_CONFIG, $ionicPopover, $cordovaFileTransfer, $http) {
    $scope.historyDetail = [];
    var injuryID = $stateParams.injuryID;
    $scope.consultation = {};
    $scope.pathIMG = [];
    $scope.drawing = [];
        //detail history injury by injury_id
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
    $scope.selectImgD = function(selected) {
        $scope.image.path = selected;
        $scope.ConsultationModal.show();
    }
    $scope.hideModal = function() {
        // $scope.hide.bars = false;
        $scope.ConsultationModal.hide();
    };
    $scope.detailInjury = function() {
        InjuryServices.getInjuryById(injuryID).then(function(result) {
            if (result.status == "success") {
                var injuryImg = result.data.injuryImg;
                $scope.historyDetail.detail = result.data;
                InjuryServices.getPatientID($scope.historyDetail.detail.patient_id).then(function(data) {
                    $scope.historyDetail.patient = data;

                })
                angular.forEach(injuryImg, function(value, key) {
                    var path = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/api/im/image/" + value.id;
                    $scope.pathIMG.push({
                        image: path,
                        id: value.id,
                        desc: value.desc
                    });
                   
                });
            }
        })
        InjuryServices.consultation(injuryID).then(function(consu) {
            if (consu.status == "success") {
                $scope.consultation = consu.data;
                 console.log('-----------------------cho luan',$scope.consultation);
                 angular.forEach( $scope.consultation.drawingArr, function(value, key) {
                    var path = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/api/consultation/drawing/image/" + value.id;
                    $scope.drawing.push({
                        image: path
                    });
                    console.log($scope.drawing);
                });
            } else {
                console.log($scope.consultation);
                console.log("No consultation!!");
            }
        })
    }
    $scope.detailInjury();
    $scope.backToHistory = function() {
        $scope.historyDetail = [];
        $state.go('app.injury.historyInjury');
    }
    $ionicModal.fromTemplateUrl('modules/submitinjury/views/modal/imageHistory.html', function(modal) {
        $scope.InjuryImgControllerModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up',
        hardwareBackButtonClose: false
    });
    $scope.image = {
        path: "",
        desc: ""
    };
    $scope.selectImg = function(selected) {
        $scope.image.path = "https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/api/im/image/" + selected.id;
        $scope.image.desc = selected.desc;
        $scope.InjuryImgControllerModal.show();
    }
    $scope.hideModal = function() {
        $scope.hide.bars = false;
        $scope.InjuryImgControllerModal.hide();
    };
   
})