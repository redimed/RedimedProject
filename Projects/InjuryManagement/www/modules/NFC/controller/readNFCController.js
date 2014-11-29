angular.module('starter.NFC.controller',[])
.controller('readNFCController',function($scope){
        $scope.receiveData='';
        $scope.testData = [];
        $scope.getData = function(data){
            $scope.receiveData=JSON.parse(data);
            $scope.$apply(function(){
                $scope.testData = $scope.receiveData;
            })
        }
        app.initialize($scope.getData);




    })
