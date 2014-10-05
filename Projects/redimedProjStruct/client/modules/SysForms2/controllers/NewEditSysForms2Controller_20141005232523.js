angular.module('app.loggedIn.SysForms2.NewEdit.controller',[])
.controller('NewEditSysForms2Controller',function($scope,$state,$stateParams,SysForms2Service){
    $scope.backToList = function(){
        $state.go('loggedIn.SysForms2');
    }

    $scope.info = {
             FORM_ID : ''
             ,MASTER_TABLE_NAME : ''
             ,MASTER_SEQ : ''
             ,DETAIL_TABLE_NAME : ''
             ,DETAIL_SEQ : ''
             ,FORM_DESCRIPTION : ''
             ,FORM_TYPE : ''
             ,LIST_FORM_TYPE : ''
             ,NEW_EDIT_FORM_TYPE : ''
             ,FORM_PROPERTIES : ''
        
    };

    var id = $stateParams.id;

    if(typeof id != 'undefined') {
       SysForms2Service.getDataById(id).then(function(data){
           $scope.info = data[0];
       })
    }

    $scope.save = function(){

        console.log($scope.info);

        if(typeof id === 'undefined'){
            SysForms2Service.insertFunction($scope.info).then(function(data){
                console.log(data);
            });
        }else{
            SysForms2Service.saveFunction($scope.info,id).then(function(data){
                console.log(data);
            });
        }

       
    }
})