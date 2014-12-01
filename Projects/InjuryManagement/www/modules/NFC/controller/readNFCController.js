angular.module('starter.NFC.controller',[])
.controller('readNFCController',function($scope,WorkerServices){
        $scope.receiveData='';
        $scope.info=[];
        $scope.getData = function(data){

            $scope.receiveData=JSON.parse(data);

            if($scope.receiveData.Patient_id != null){
                WorkerServices.getInfoPatientbyID($scope.receiveData.Patient_id).then(function(data){
                    $scope.info = data;
                   // alert(JSON.stringify( $scope.info));
                })
            }
            $scope.$apply(function(){
                $scope.$watch('info',function(info){
                    $scope.testData = $scope.info;
                })

                //alert(JSON.stringify($scope.testData));
            })
        };
        app.initialize($scope.getData);




    })
