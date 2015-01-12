/**
 * Created by Luan Nguyen on 1/11/2015.
 */
angular.module("app.loggedIn.im.map.controller",[])
    .controller("InjuryMapController",function($scope,$state,InjuryManagementService,toastr){
        $scope.injuryMarker = [];

        InjuryManagementService.getInjuryList().then(function(rs){
            if(rs.status == 'success'){
                for(var i=0; i<rs.data.length; i++){
                    if(rs.data[i].cal_id == null){
                        var positionArr = [];
                        if(rs.data[i].latitude != null)
                            positionArr.push(rs.data[i].latitude);
                        if(rs.data[i].longitude != null)
                            positionArr.push(rs.data[i].longitude);
                        $scope.injuryMarker.push({id:rs.data[i].injury_id,position:positionArr,address:rs.data[i].pickup_address});
                    }
                }

                console.log($scope.injuryMarker);
            }
        })
    })
