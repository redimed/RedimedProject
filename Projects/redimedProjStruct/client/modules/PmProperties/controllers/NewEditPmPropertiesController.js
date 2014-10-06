angular.module('app.loggedIn.PmProperties.NewEdit.controller',[])
.controller('NewEditPmPropertiesController',function($scope,$state,$stateParams,$filter,ngTableParams,PmPropertiesService){

    $scope.info = {
             Suburb : ''
             ,Zipcode : ''
             ,State : ''
             ,Country : ''
             ,Price : ''
             ,purchase_date : ''
             ,note : ''
             ,Cancellation_reason : ''
             ,isCancellation : ''
             ,isInsurance : ''
             ,Avatar_Pic_path : ''
             ,Created_by : ''
             ,Creation_date : ''
             ,Last_update_date : ''
             ,Last_updated_by : ''
             ,property_id : ''
             ,Address : ''
        
    };

    var id = $stateParams.id;

    $scope.backToList = function(){
        $state.go('loggedIn.PmProperties');
    }

    if(typeof id != 'undefined') {
       PmPropertiesService.getDataById(id).then(function(data){
           $scope.info = data[0];
           $scope.info.isCancellation = data[0].isCancellation == 1 ? '1':'0';
           $scope.info.isInsurance = data[0].isInsurance == 1 ? '1':'0';
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