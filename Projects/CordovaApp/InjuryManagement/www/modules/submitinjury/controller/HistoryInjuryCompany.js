angular.module('starter.historyInjury.controller', [])
.controller('HistoryInjuryController', function($scope, $state, $filter, $stateParams,
                                             InjuryServices, $ionicPopup, localStorageService,
                                             $ionicModal, ConfigService,$ionicLoading, $timeout,
                                              $rootScope, HOST_CONFIG, $ionicPopover, $cordovaFileTransfer
                                             ){
        $scope.currentPage = 1;
        $scope.currentRecord = 0;
        $scope.historyCompany = [];
        $scope.numInjyryCompany = 0;
        $scope.i = 0;

        $scope.getInjuryByCompany = function(currentRecord){
            console.log("abc")
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
            InjuryServices.getInjuryByCompany($scope.userInfo.company_id, currentRecord).then(function (result){
                if(result.status == "success"){
                    $ionicLoading.hide();
                    angular.forEach(result.data, function(value,key){
                        $scope.historyCompany.push(value);
                        $scope.i++;
                    });
                }else{
                    $scope.popupMessage = { message:"Can't get History Injury!!" };
                    $ionicPopup.show({
                        templateUrl: "modules/popup/PopUpError.html",
                        scope: $scope,
                        buttons: [
                            { text: "Ok" }
                        ]
                    });
                }
            });
        }

         $scope.getInjuryByPatient = function(currentRecord){
            InjuryServices.getPatientByUser($scope.userInfo.id).then(function(results){
               if(results.status == "success"){
                  $scope.Patient_id = results.data.Patient_id;
                  InjuryServices.getInjuryByPatient($scope.Patient_id, currentRecord).then(function(result){
                     if(result.status == "success"){
                        angular.forEach(result.data, function(value,key){
                           $scope.historyCompany.push(value);
                           $scope.i++;
                        });
                     }
                  })
               }
            })
         };
        //end

        $scope.countInjury = function(){
            if ($scope.userInfo.company_id == null) {
               InjuryServices.countInjuryByPatient($scope.Patient_id).then(function(result){
                  if (result.status == 'success') {
                     $scope.numInjyryCompany = parseInt(result.data.numberInjury);
                  };
               });
            } else {
               InjuryServices.countInjuryByCompany($scope.userInfo.company_id).then(function(result){
                  if (result.status = 'success') {
                     console.log(result.data);
                     $scope.numInjyryCompany = parseInt(result.data.numberInjury);
                  };
               })
            }
        }

        $scope.loadMore = function(){
            $scope.countInjury();
            $scope.currentPage++;
            $scope.pageSize = $scope.currentPage * 10;
            $scope.noMoreItemsAvailable = false;
            if ($scope.i !== 0 && $scope.i === $scope.numInjyryCompany) {
                $scope.noMoreItemsAvailable = true;
                console.log($scope.i, "----", $scope.numInjyryCompany); 
            }
            if($scope.userInfo.company_id == null){
                $scope.getInjuryByPatient($scope.currentRecord);
            } else {
                // console.time('getInjuryByCompany');
                $scope.getInjuryByCompany($scope.currentRecord);
                // console.timeEnd('getInjuryByCompany');
            }
            $scope.currentRecord = $scope.currentRecord + 10;
            $timeout(function() {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 1000);
         }
})

  


