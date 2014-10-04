angular.module('app.loggedIn.PmProperties.NewEdit.controller',[])
.controller('NewEditPmPropertiesController',function($scope,$state,$stateParams,PmPropertiesService){
    $scope.backToList = function(){
        $state.go('loggedIn.PmProperties');
    }

    $scope.info = {
             property_id : ''
             ,Address : ''
             ,Suburb : ''
             ,Zipcode : ''
             ,Country : ''
             ,State : ''
             ,purchase_date : ''
             ,Price : ''
             ,note : ''
             ,Cancellation_reason : ''
             ,isCancellation : ''
             ,isInsurance : ''
             ,Avatar_Pic_path : ''
             ,Created_by : ''
             ,Creation_date : ''
             ,Last_updated_by : ''
             ,Last_update_date : ''
        
    };

    var id = $stateParams.id;

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