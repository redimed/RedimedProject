/**
 * Created by Luan Nguyen on 1/11/2015.
 */
angular.module("app.loggedIn.patient.injuryManagement.map.controller",[])
    .controller("InjuryMapController",function($scope,$filter,$state,InjuryManagementService,UserService,toastr,socket,$interval,$modal,$modalInstance){
        $scope.injuryMarker = [];
        $scope.driverMarker = [];

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.selectedDriver = {
            driverId: null
        };

        refreshMap();
        
        socket.on('driverLocation',function(driverArr){
            $scope.driverMarker = [];
            if(driverArr.length > 0)
            {
                var icon = 'modules/injuryManagement/icons/ambulance.png';
                for(var i=0 ; i<driverArr.length; i++)
                {
                    var driver = driverArr[i];
                    $scope.driverData = {
                        driverId: driver.id,
                        position: [driver.latitude,driver.longitude],
                        username: driver.userName,
                        icon: icon,
                        patientList: driver.patientList
                    };

                    if($scope.driverMarker.length > 0)
                    {
                        var index = _.findIndex($scope.driverMarker,{'driverId':driver.id});
                        if(index == -1)
                             $scope.driverMarker.push($scope.driverData);
                        else
                        {
                            $scope.driverMarker[index].position = $scope.driverData.position;
                            $scope.driverMarker[index].patientList = $scope.driverData.patientList;
                        }
                    }
                    else
                        $scope.driverMarker.push($scope.driverData);
                }

                for(var i=0; i<$scope.driverMarker.length; i++)
                {
                    if($scope.driverMarker[i].patientList.length > 0)
                    {
                        for(var j=0; j<$scope.driverMarker[i].patientList.length; j++)
                        {
                            $scope.driverMarker[i].patientList[j].position = [$scope.driverMarker[i].patientList[j].latitude,$scope.driverMarker[i].patientList[j].longitude];
                        }
                    }
                }
            }

        })

        socket.on('receiveNotifyReceptionist',function(){
            refreshMap();
        })


        $scope.showDetails = function(id){
            InjuryManagementService.getInjuryById(id).then(function(rs){
                if(rs.status == 'success')
                {
                    $modal.open({
                        templateUrl: 'modules/consultation/dialogs/dialog_injury_details.html',
                        size: 'md',
                        resolve: {
                            injuryInfo:function(){
                                return  rs.data;
                            }
                        },
                        controller: function($scope,$modalInstance,$stateParams,injuryInfo,InjuryManagementService){
                            $scope.info = injuryInfo;
                            $scope.loadedImage = false;
                            $scope.injuryImages = [];
                            $scope.imgArr = [];

                            $scope.info.injury_date = moment.utc($scope.info.injury_date).format('DD/MM/YYYY - hh:mm:ss');

                            if(typeof injuryInfo.injuryImg !== 'undefined' && injuryInfo.injuryImg.length > 0)
                            {
                                $scope.loadedImage = true;
                                for(var i=0; i< injuryInfo.injuryImg.length; i++)
                                {
                                    $scope.imgArr.push({url: location.origin+"/api/im/image/"+ injuryInfo.injuryImg[i].id, img: injuryInfo.injuryImg[i]});
                                }
                            }

                            $scope.cancelClick = function(){
                                $modalInstance.close();
                            }

                            $scope.viewImage = function(img){
                                var modalInstance = $modal.open({
                                    templateUrl: "modules/injuryManagement/views/imageModal.html",
                                    size: 'md',
                                    resolve: {
                                        imgObj: function(){
                                            return img;
                                        }
                                    },
                                    controller: function($scope, $state,$modalInstance, UserService,socket,toastr,imgObj){
                                        $scope.img = {
                                            image: location.origin+"/api/im/image/"+imgObj.id,
                                            description: imgObj.desc
                                        }
                                    }
                                })
                            }

                        }
                    })
                }
            })
        }

        $scope.allocateDriver = function(injury){
            InjuryManagementService.allocateDriver($scope.selectedDriver.driverId,injury.patientId,injury.id).then(function(rs){
                if(rs.status == 'error')
                    toastr.error("Send Notification Failed!","Error");
                else
                {
                    toastr.success("Send Notification Successfully!","Success");
                    $scope.selectedDriver.driverId = null;
                    refreshMap();
                }
            })
        }

        $scope.refreshMap = function(){
            refreshMap();
        }

        setInterval(refreshMap,60 * 1000);

        function refreshMap(){
            $scope.injuryMarker = [];
            InjuryManagementService.getInjuryList().then(function(rs){
                if(rs.status == 'success'){
                    for(var i=0; i<rs.data.length; i++){
                        var isCurrDate = moment(rs.data[i].injury_date).isSame(moment(), 'day');
                        if(isCurrDate)
                        {
                            if(rs.data[i].isPickUp == 1 && (rs.data[i].STATUS == 'New' || rs.data[i].STATUS == 'Picking' ))
                            {
                                var patient = rs.data[i];
                                var positionArr = [];
                                var icon;
                                if(patient.latitude != null)
                                    positionArr.push(patient.latitude);
                                if(patient.longitude != null)
                                    positionArr.push(patient.longitude);

                                if(patient.STATUS == 'Picking')
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
                }
            })
        };


    })

