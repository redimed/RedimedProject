angular.module('app.loggedIn.PmProperties.NewEdit.controller',[])
.controller('NewEditPmPropertiesController',function($scope,$state,$stateParams,$filter,ngTableParams,PmPropertiesService){

    $scope.info = {
        
    };

    var id = $stateParams.id;

    $scope.backToList = function(){
        $state.go('loggedIn.PmProperties');
    }

    if(typeof id != 'undefined') {
       PmPropertiesService.getDataById(id).then(function(data){
           $scope.info = data[0];
       })
    }

    $scope.save = function(){

        console.log($scope.info);

        if(typeof id === 'undefined'){
            PmPropertiesService.insertFunction($scope.info).then(function(data){
                console.log(data);
            });
        }else{
            PmPropertiesService.saveFunction($scope.info,id).then(function(data){
                console.log(data);
            });
        }

       
    }
})