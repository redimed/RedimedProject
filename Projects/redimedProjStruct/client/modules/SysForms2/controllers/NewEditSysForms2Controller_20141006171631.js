angular.module('app.loggedIn.SysForms2.NewEdit.controller',[])
.controller('NewEditSysForms2Controller',function($scope,$state,$stateParams,$filter,ngTableParams,SysForms2Service){

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

    $scope.data=[];
       
    SysForms2Service.getDataByMasterIdD(id).then(function(response){
        $scope.data=response;
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 50           // count per page
        }, {
            total: response.length, // length of data
            getData: function($defer, params) {
                var filteredData = params.filter() ?
                    $filter('filter')($scope.data, params.filter()) :
                    $scope.data;

                var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.data;

                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });

    $scope.editDetailForm = function(f){
        alert('I am here: ' + f.FORM_DETAIL_ID + '  id = ' + id);
        $state.go('loggedIn.EditDetailSysForms2',{id: f.FORM_DETAIL_ID,headerId:id});
    }

    $scope.backToList = function(){
        $state.go('loggedIn.SysForms2');
    }

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