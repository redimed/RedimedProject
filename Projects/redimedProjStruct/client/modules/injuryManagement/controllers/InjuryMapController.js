/**
 * Created by Luan Nguyen on 1/11/2015.
 */
angular.module("app.loggedIn.im.map.controller",[])
    .controller("InjuryMapController",function($scope,$filter,$state,InjuryManagementService,toastr,socket){
        $scope.injuryMarker = [];
        $scope.driverMarker = [];

        InjuryManagementService.getInjuryList().then(function(rs){
            if(rs.status == 'success'){
                for(var i=0; i<rs.data.length; i++){
                    var patient = rs.data[i];
                    if(patient.cal_id == null){
                        var positionArr = [];
                        var icon;
                        if(patient.latitude != null)
                            positionArr.push(patient.latitude);
                        if(patient.longitude != null)
                            positionArr.push(patient.longitude);

                        if(patient.STATUS == 'Waiting')
                            icon = 'modules/injuryManagement/icons/icon-orange.png';
                        else if(patient.STATUS == 'New')
                            icon = 'modules/injuryManagement/icons/icon-blue.png';

                        $scope.patientData = {id:patient.injury_id,
                            position:positionArr,
                            pickupAddr:patient.pickup_address,
                            fullName: (patient.Title != null || patient.Title != '' ? patient.Title+'.':'')+
                            (patient.First_name != null || patient.First_name != '' ? patient.First_name+' ':'')+
                            (patient.Sur_name != null || patient.Sur_name != '' ? patient.Sur_name+' ':'')+
                            (patient.Middle_name != null || patient.Middle_name != '' ? patient.Middle_name+' ':''),
                            gender: patient.Sex,
                            injuryDesc: patient.injury_description,
                            status:patient.STATUS,
                            icon: icon
                        };

                        $scope.injuryMarker.push($scope.patientData);
                    }
                }
            }


        })

        socket.on('driverLocation',function(data){

            if(data[0].userType == 'Driver')
            {
                var addNewMarker = true;
                var positionArr = [];
                var icon = 'modules/injuryManagement/icons/ambulance.png';

                positionArr.push(data[0].latitude);
                positionArr.push(data[0].longitude);

                $scope.driverData = {
                    driverId: data[0].id,
                    position: positionArr,
                    username: data[0].userName,
                    type: data[0].userType,
                    icon: icon
                };

                $scope.$apply(function(){
                    if($scope.driverMarker.length > 0)
                    {
                        for(var i=0; i<$scope.driverMarker.length;i++){
                            if($scope.driverMarker[i].driverId == $scope.driverData.driverId)
                            {
                                addNewMarker = false;
                                $scope.driverMarker.splice(i,1);
                                $scope.driverMarker.push($scope.driverData);
                            }
                        }
                    }

                    if(addNewMarker == true)
                    {
                        $scope.driverMarker.push($scope.driverData);
                    }

                });
            }

        })

        socket.on('driverLogout',function(userId){
            $scope.$apply(function(){
                for(var i=0; i<$scope.driverMarker.length;i++){
                    if($scope.driverMarker[i].driverId == userId)
                    {
                        $scope.driverMarker.splice(i,1);
                    }
                }
            })
        })

        $scope.showDetails = function(id){
            $state.go('loggedIn.im.detail',{id:id});
        }
    })
