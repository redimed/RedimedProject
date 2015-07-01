
angular.module('app.loggedIn.rlob')
.controller("rlob_rltypeController", function ($scope,rlobService,toastr) {
    $scope.bookingType = rlobConstant.bookingType;
    $scope.setListRltype = function(){
        rlobService.getlistRlType().then(function(data){
            if (data.status == 'success') {
                $scope.listRlType = data.data;
            };
        })
    }
    $scope.setListRltype();
    $scope.showPopupAddNewType = function(){
        $scope.name = null;
        $scope.sourceName = null;
        $("#rlob-type-insert-popup").modal({show:true,backdrop:'static'});
    }
    $scope.insertRlType = function(name,sourceName){
        // alert(name);
        // alert(sourceName);
        rlobService.insertRlTypes(name,sourceName).then(function(data){
            if (data.status == 'success') {
                $scope.setListRltype();
                $("#rlob-type-insert-popup").modal('hide');
                toastr.success("Insert Success!","Success");
            };
            if (data.status == 'fail') {
                $("#rlob-type-insert-popup").modal('hide');
                toastr.error("Insert Failed!","Error");
            };
        })
    }
    $scope.showPopupEditType = function(type){
        $scope.name = type.Rl_TYPE_NAME;
        $scope.sourceName = type.SOURCE_TYPE;
        $scope.enable = type.ISENABLE;
        $scope.idType = type.RL_TYPE_ID;
        $("#rlob-type-edit-popup").modal({show:true,backdrop:'static'});
    }
    $scope.updateRltype = function(idType,name,sourceName,enable){
        // alert(idType);
        // alert(name);
        // alert(sourceName);
        // alert(enable);
        rlobService.updateRlTypes(idType,name,sourceName,enable).then(function(data){
            if (data.status == 'success') {
                $scope.setListRltype();
                $("#rlob-type-edit-popup").modal('hide');
                toastr.success("Update Success!","Success");
            };
            if (data.status == 'fail') {
                $("#rlob-type-edit-popup").modal('hide');
                toastr.error("Update Failed!","Error");
            };
        })
    }
});


