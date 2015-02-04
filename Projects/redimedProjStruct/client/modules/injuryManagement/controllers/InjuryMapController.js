/**
 * Created by Luan Nguyen on 1/11/2015.
 */
angular.module("app.loggedIn.im.map.controller",[])
    .controller("InjuryMapController",function($scope,$filter,$state,InjuryManagementService,UserService,toastr,socket){
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

            $scope.injuryList = $filter('filter')($scope.injuryListTemp, {
                driverUser: s.driver,
                FullName: s.patient
            });

        }

        getOnlineDriver();

        var colors = ['#FF5E3A','#FF9500','#FFDB4C','#87FC70','#52EDC7','#1AD6FD','#C644FC','#898C90'];

        InjuryManagementService.getInjuryList().then(function(rs){
            if(rs.status == 'success'){
                for(var j=0;j<rs.data.length;j++){
                    rs.data[j].background = colors[Math.floor(Math.random() * colors.length)];
                    if(rs.data[j].driverUser == null || typeof rs.data[j].driverUser === 'undefined')
                        rs.data[j].driverUser = '';
                }
                $scope.injuryListTemp = rs.data;

                $scope.injuryList = $scope.injuryListTemp;

                for(var i=0; i<rs.data.length; i++){
                    if(rs.data[i].STATUS == 'New' || rs.data[i].STATUS == 'Waiting')
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
                            FullName: patient.FullName,
                            gender: patient.Sex,
                            injuryDesc: patient.injury_description,
                            status:patient.STATUS,
                            icon: icon,
                            driverUser: patient.driverUser ,
                            driverName: patient.driverName
                        };

                        $scope.injuryMarker.push($scope.patientData);
                    }

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
            InjuryManagementService.allocateDriver($scope.map.driverId,injury.patientId,injury.id).then(function(rs){
                if(rs.status == 'success'){
                    toastr.success("Send Notification Successfully!","Success");

                    $scope.map.driverId = null;
                    //refreshMap();
                    //refreshList();
                }
                else
                {
                    toastr.error("Send Notification Failed!","Error");
                }
            })
        }

        $scope.refreshMap = function(){
            refreshMap();
            refreshList();
            getOnlineDriver();
        }

        setInterval(refreshMap,60 * 1000);
        setInterval(refreshList,60 * 1000);
        setInterval(getOnlineDriver,60 * 1000);

        function refreshMap(){
            $scope.injuryMarker = [];
            InjuryManagementService.getInjuryList().then(function(rs){
                if(rs.status == 'success'){
                    for(var i=0; i<rs.data.length; i++){
                        if(rs.data[i].STATUS == 'New' || rs.data[i].STATUS == 'Waiting')
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
                                FullName: patient.FullName,
                                gender: patient.Sex,
                                injuryDesc: patient.injury_description,
                                status:patient.STATUS,
                                icon: icon,
                                driverUser: patient.driverUser ,
                                driverName: patient.driverName
                            };

                            $scope.injuryMarker.push($scope.patientData);
                        }

                    }
                }
            })
        };

        function refreshList(){
            $scope.injuryList = [];
            $scope.injuryListTemp = [];
            InjuryManagementService.getInjuryList().then(function(rs) {
                if (rs.status == 'success') {
                    for(var j=0;j<rs.data.length;j++){
                        rs.data[j].background = colors[Math.floor(Math.random() * colors.length)];
                        if(rs.data[j].driverUser == null || typeof rs.data[j].driverUser === 'undefined')
                            rs.data[j].driverUser = '';
                    }
                    $scope.injuryListTemp = rs.data;

                    $scope.injuryList = $scope.injuryListTemp;
                }
            })
        }

        function getOnlineDriver(){
            InjuryManagementService.listDriver().then(function(rs){
                $scope.driverListTemp = [];
                if(rs.data){
                    $scope.driverListTemp = rs.data;
                }
            })
        }
    })

