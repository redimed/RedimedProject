/**
 * Created by Luan Nguyen on 1/11/2015.
 */
angular.module("app.loggedIn.im.map.controller",[])
    .controller("InjuryMapController",function($scope,$filter,$state,InjuryManagementService,toastr,socket){
        $scope.injuryMarker = [];
        $scope.driverMarker = [];
        $scope.driverListTemp = [];

        $scope.info = {
            driverId: null
        }

        InjuryManagementService.getInjuryList().then(function(rs){
            if(rs.status == 'success'){

                for(var i=0; i<rs.data.length; i++){
                    var patient = rs.data[i];
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
                        patientId: patient.Patient_id,
                        position:positionArr,
                        pickupAddr:patient.pickup_address,
                        fullName: (patient.Title != null || patient.Title != '' ? patient.Title+'.':'')+
                        (patient.First_name != null || patient.First_name != '' ? patient.First_name+' ':'')+
                        (patient.Sur_name != null || patient.Sur_name != '' ? patient.Sur_name+' ':'')+
                        (patient.Middle_name != null || patient.Middle_name != '' ? patient.Middle_name+' ':''),
                        gender: patient.Sex,
                        injuryDesc: patient.injury_description,
                        status:patient.STATUS,
                        icon: icon,
                        driverUser: patient.driverUser,
                        driverName: patient.driverName
                    };

                    $scope.injuryMarker.push($scope.patientData);
                }
            }
        })

        socket.on('driverLocation',function(data){

            var driverInfo = data.location;
            $scope.driverList = [];

            if(driverInfo.userType == 'Driver')
            {
                var addNewMarker = true;
                var positionArr = [];
                var icon = 'modules/injuryManagement/icons/ambulance.png';

                positionArr.push(driverInfo.latitude);
                positionArr.push(driverInfo.longitude);

                $scope.driverData = {
                    driverId: driverInfo.id,
                    position: positionArr,
                    username: driverInfo.userName,
                    icon: icon,
                    patientList: data.patientList
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

                    InjuryManagementService.listDriver().then(function(data){
                        var onlineDriver = [];
                        for(var i=0; i<$scope.driverMarker.length;i++){
                            onlineDriver.push($scope.driverMarker[i].driverId);
                        }

                        for(var i=0; i<data.length; i++){
                            if(onlineDriver.indexOf(data[i].id) != -1){
                                $scope.driverList.push(data[i]);
                            }
                        }

                        if(_.isEqual($scope.driverListTemp,$scope.driverList) == false){
                            $scope.driverListTemp = [];
                            $scope.driverListTemp = _.clone($scope.driverList);
                        }

                    })
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

        $scope.allocateDriver = function(injury){
            InjuryManagementService.allocateDriver($scope.info.driverId,injury.patientId,injury.id).then(function(rs){
                if(rs.status == 'success'){
                    toastr.success("Submit Successfully!","Success");
                }
                else
                {
                    toastr.error("Submit Failed!","Error");
                }
            })


        }
    })

