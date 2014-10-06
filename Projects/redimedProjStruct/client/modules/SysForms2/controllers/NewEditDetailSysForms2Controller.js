angular.module('app.loggedIn.SysForms2.NewEditDetail.controller',[])
.controller('NewEditDetailSysForms2Controller',function($scope,$state,$stateParams,$filter,ngTableParams,SysForms2Service){

    $scope.info = {
             INPUT_TYPE : ''
             ,LOV_SQL : ''
             ,ATTRIBUTE_PROPERTIES : ''
             ,FORM_ID : ''
             ,FORM_DETAIL_ID : ''
             ,TABLE_NAME : ''
             ,ORDINAL_POSITION : ''
             ,COLUMN_NAME : ''
             ,IS_NULLABLE : ''
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
        
    };

    var id = $stateParams.id;
    var headerId = $stateParams.headerId;

    $scope.backToList = function(){
        $state.go('loggedIn.EditSysForms2',{id:headerId});
    }

    if(typeof id != 'undefined') {
       SysForms2Service.getDataByIdD(id).then(function(data){
           $scope.info = data[0];
           $scope.info.ISDISPLAY_ON_LIST = data[0].ISDISPLAY_ON_LIST == 1 ? '1':'0';
           $scope.info.ISDISPLAY_ON_FORM = data[0].ISDISPLAY_ON_FORM == 1 ? '1':'0';
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