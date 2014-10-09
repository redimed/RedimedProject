angular.module('app.loggedIn.SysForms2.NewEditDetail.controller',[])
.controller('NewEditDetailSysForms2Controller',function($scope,$state,$stateParams,$filter,ngTableParams,SysForms2Service){

    $scope.info = {
             FORM_ID : ''
             ,FORM_DETAIL_ID : ''
             ,IS_NULLABLE : ''
             ,ORDINAL_POSITION : ''
             ,TABLE_NAME : ''
             ,COLUMN_NAME : ''
             ,DATA_TYPE : ''
             ,CHARACTER_MAXIMUM_LENGTH : ''
             ,COLUMN_KEY : ''
             ,DISPLAY_NAME : ''
             ,ISDISPLAY_ON_LIST : ''
             ,ISDISPLAY_ON_FORM : ''
             ,ISNEW : ''
             ,ISUPDATE : ''
             ,ISREQUIRE : ''
             ,ISLIST_LINK : ''
             ,INPUT_TYPE : ''
             ,LOV_SQL : ''
             ,ATTRIBUTE_PROPERTIES : ''
        
    };

    var id = $stateParams.id;
    var headerId = $stateParams.headerId;




    $scope.backToList = function(){
        $state.go('loggedIn.EditSysForms2',{id:headerId});
    }

    if(typeof id != 'undefined') {
       SysForms2Service.getDataByIdD(id).then(function(data){
           $scope.info = data[0];
       })
    }

    $scope.save = function(){

        console.log($scope.info);

        if(typeof id === 'undefined'){
            SysForms2Service.insertFunctionD($scope.info).then(function(data){
                console.log(data);
            });
        }else{
            SysForms2Service.saveFunctionD($scope.info,id).then(function(data){
                console.log(data);
            });
        }

       
    }
})