angular.module('starter.ListWorker.controller', [])
.controller('ListWorkerController', function($scope, UserService, $http, localStorageService, OnlineBookingService, $state, $ionicPopup,$ionicLoading,$timeout) {
    $scope.currentPage = 1;
    $scope.currentRecord = 0;
    $scope.listWorker = [];
    $scope.i = 0;
    $scope.numberPatient = 0;

    $scope.countPatient = function() {
        UserService.countPatientsInCompany($scope.userInfo.company_id).then(function(result){
            if (result.status == 'success') {
                $scope.numberPatient = parseInt(result.data.numberPatient);
            };
        })
    }

    $scope.loadPatient = function(currentRecord){
        $scope.countPatient();
        if ($scope.userInfo.company_id !== null) {
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
            UserService.getPatientInCompany($scope.userInfo.company_id, currentRecord).then(function(result) {
            if (result.status == 'success') {
              	$ionicLoading.hide();
                angular.forEach(result.data, function(value,key){
                    $scope.listWorker.push(value);
                    $scope.i++;
                });
                console.log($scope.listWorker);
            }else{
                $scope.popupMessage = { message:"Can't get Worker list!!" };
                $ionicPopup.show({
                    templateUrl: "modules/popup/PopUpError.html",
                    scope: $scope,
                    buttons: [
                        { text: "Ok" }
                        ]
                    });
                }
            })
        }
    }

    $scope.loadMore = function(){
        $scope.currentPage++;
        $scope.pageSize = $scope.currentPage * 10;
        $scope.noMoreItemsAvailable = false;
        if ($scope.i !== 0 && $scope.i === $scope.numberPatient) {
            $scope.noMoreItemsAvailable = true;
            console.log($scope.i, "---", $scope.numberPatient);
        }
        $scope.loadPatient($scope.currentRecord);
        $scope.currentRecord = $scope.currentRecord + 10;
        $timeout(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }, 1000);
    }
})