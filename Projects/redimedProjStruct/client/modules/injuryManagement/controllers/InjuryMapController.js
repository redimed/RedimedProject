/**
 * Created by Luan Nguyen on 1/11/2015.
 */
angular.module("app.loggedIn.im.map.controller",[])
    .controller("InjuryMapController",function($scope,$filter,$state,InjuryManagementService,toastr,socket){
        $scope.injuryMarker = [];
        $scope.driverMarker = [];
        $scope.driverListTemp = [];
        $scope.injuryList = [];
        $scope.injuryListTemp = [];

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.map = {
            driverId: null
        }

        $scope.search = {
            patient: "",
            driver: "",
            isNew: true,
            isWaiting: true,
            isDone: true
        }

        $scope.searchInjury = function(s){
            //InjuryManagementService.searchInjury(s).then(function(rs){
            //    for(var i=0;i<rs.data.length;i++){
            //        rs.data[i].background = colors[Math.floor(Math.random() * colors.length)];
            //
            //        rs.data[i].fullName = (rs.data[i].Title != null || rs.data[i].Title != '' ? rs.data[i].Title+'.':'')+
            //        (rs.data[i].First_name != null || rs.data[i].First_name != '' ? rs.data[i].First_name+' ':'')+
            //        (rs.data[i].Sur_name != null || rs.data[i].Sur_name != '' ? rs.data[i].Sur_name+' ':'')+
            //        (rs.data[i].Middle_name != null || rs.data[i].Middle_name != '' ? rs.data[i].Middle_name+' ':'')
            //    }
            //
            //    $scope.injuryList = rs.data;
            //})
            $scope.injuryListTemp = [];
            for(var i=0; i<$scope.injuryListTemp.length;i++){
                if($scope.injuryListTemp[i].driverUser == s.driver){
                    console.log("aaaaaaaaaaaaaaaa");
                    $scope.injuryList.push($scope.injuryListTemp[i]);
                }
            }

            //console.log($scope.injuryList);

        }

        var colors = ['#FF5E3A','#FF9500','#FFDB4C','#87FC70','#52EDC7','#1AD6FD','#C644FC','#898C90'];

        InjuryManagementService.getInjuryList().then(function(rs){
            if(rs.status == 'success'){
                for(var i=0;i<rs.data.length;i++){
                    rs.data[i].background = colors[Math.floor(Math.random() * colors.length)];

                    rs.data[i].fullName = (rs.data[i].Title != null || rs.data[i].Title != '' ? rs.data[i].Title+'.':'')+
                                            (rs.data[i].First_name != null || rs.data[i].First_name != '' ? rs.data[i].First_name+' ':'')+
                                            (rs.data[i].Sur_name != null || rs.data[i].Sur_name != '' ? rs.data[i].Sur_name+' ':'')+
                                            (rs.data[i].Middle_name != null || rs.data[i].Middle_name != '' ? rs.data[i].Middle_name+' ':'')
                }
                $scope.injuryListTemp = rs.data;

                $scope.injuryList = $scope.injuryListTemp;

                for(var i=0; i<rs.data.length; i++){
                    if(rs.data[i].STATUS != null && rs.data[i].STATUS != 'Done')
                    {
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
            }
        })

        InjuryManagementService.getOnlineUsers().then(function(data){
            $scope.onlineList = data;
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

            console.log($scope.driverMarker);

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
            InjuryManagementService.allocateDriver($scope.map.driverId,injury.patientId,injury.id).then(function(rs){
                if(rs.status == 'success'){
                    toastr.success("Submit Successfully!","Success");
                }
                else
                {
                    toastr.error("Submit Failed!","Error");
                }
            })
        }

        $scope.makeCall = function(im){

        }
    })

