angular.module('starter.booking.rlobChooseAppointmentCalendar.controller',[

])
.controller('rlobChooseAppointmentCalendarController',function($scope,$stateParams,localStorageService,OnlineBookingService,$state){
        $scope.loginInfo = localStorageService.get('userInfo');

        $scope.patientID = $stateParams.patient_id;
        console.log($scope.patientID);

        $scope.selectedFilter={
            locationSelected:{},
            rltypeSelected:{},
            clnSpecialitySelected:{},
            doctorSelected:{},
            date:''
        };


        $scope.getLocationsFilter=function()
        {
            OnlineBookingService.getLocationsFilter().then(function(data){
                $scope.locationsFilter=data;
            },function(data){
                console.log(data);
            })
        }
        $scope.getLocationsFilter();
        $scope.getSpecialitiesFilter=function()
        {
            OnlineBookingService.getRlSpecialtiesFilter().then(function(data){
                if(data.status=='success')
                    $scope.specialitiesFilter=data.data;
            },function(err){
                console.log('error');
            })
        }
        $scope.getSpecialitiesFilter();

        $scope.getDoctorsFilter=function()
        {
            OnlineBookingService.getDoctorsFilter().then(function(data){
                if(data.status=='success')
                    $scope.doctorsFilter=data.data;
            },function(err){
                console.log('error');
            })
        };
        $scope.getDoctorsFilter();
        //Show LIst
        $scope.updateAppoinmentsList=function()
        {
            var specialityId=$scope.selectedFilter.clnSpecialitySelected && $scope.selectedFilter.clnSpecialitySelected.Specialties_id?$scope.selectedFilter.clnSpecialitySelected.Specialties_id:'%';
            var doctorId=$scope.selectedFilter.doctorSelected  && $scope.selectedFilter.doctorSelected.doctor_id?$scope.selectedFilter.doctorSelected.doctor_id:'%';
            var locationId=$scope.selectedFilter.locationSelected  && $scope.selectedFilter.locationSelected.id?$scope.selectedFilter.locationSelected.id:'%';
            var fromTime=$scope.selectedFilter.date;

            console.log('spe:'+specialityId+'-----doctor:'+ doctorId+"-------location:"+locationId+'------fromTime:'+fromTime);
            OnlineBookingService.getApointmentCalendar(specialityId,doctorId,locationId,fromTime).then(function(data){
                var temp={LOCATION_ITEMS:[]};
                for(var i=0;i<data.length;i++)
                {
                    if(!temp[data[i].SITE_ID])
                    {
                        temp[data[i].SITE_ID]={DOCTOR_ITEMS:[]};
                        temp.LOCATION_ITEMS.push({
                            SITE_ID: data[i].SITE_ID,
                            SITE_NAME:data[i].Site_name
                        });

                    }
//                                if(!temp[data[i].SITE_ID][data[i].DOCTOR_ID])
//                                {
//                                    temp[data[i].SITE_ID][data[i].DOCTOR_ID]={SPEC_ITEMS:[]};
//                                    temp[data[i].SITE_ID].DOCTOR_ITEMS.push({
//                                        DOCTOR_ID:data[i].DOCTOR_ID,
//                                        DOCTOR_NAME:data[i].NAME
//                                    });
//                                }
                    if(!temp[data[i].SITE_ID][data[i].DOCTOR_ID])
                    {
                        temp[data[i].SITE_ID][data[i].DOCTOR_ID]={TYPE_ITEMS:[]};
                        temp[data[i].SITE_ID].DOCTOR_ITEMS.push({
                            DOCTOR_ID:data[i].DOCTOR_ID,
                            DOCTOR_NAME:data[i].NAME
                        });
                    }
                    if(!temp[data[i].SITE_ID][data[i].DOCTOR_ID][data[i].RL_TYPE_ID])
                    {
                        temp[data[i].SITE_ID][data[i].DOCTOR_ID][data[i].RL_TYPE_ID]={SPEC_ITEMS:[]};
                        temp[data[i].SITE_ID][data[i].DOCTOR_ID].TYPE_ITEMS.push({
                            RL_TYPE_ID:data[i].RL_TYPE_ID,
                            Rl_TYPE_NAME:data[i].Rl_TYPE_NAME
                        });
                    }
                    if(!temp[data[i].SITE_ID][data[i].DOCTOR_ID][data[i].RL_TYPE_ID][data[i].Specialties_id])
                    {
                        temp[data[i].SITE_ID][data[i].DOCTOR_ID][data[i].RL_TYPE_ID][data[i].Specialties_id]={APPOINTMENT_ITEMS:[]};
                        temp[data[i].SITE_ID][data[i].DOCTOR_ID][data[i].RL_TYPE_ID].SPEC_ITEMS.push({
                            Specialties_id:data[i].Specialties_id,
                            Specialties_name:data[i].Specialties_name
                        });
                    }
                    if(!temp[data[i].SITE_ID][data[i].DOCTOR_ID][data[i].RL_TYPE_ID][data[i].Specialties_id][data[i].CAL_ID])
                    {
                        temp[data[i].SITE_ID][data[i].DOCTOR_ID][data[i].RL_TYPE_ID][data[i].Specialties_id][data[i].CAL_ID]={};
                        temp[data[i].SITE_ID][data[i].DOCTOR_ID][data[i].RL_TYPE_ID][data[i].Specialties_id].APPOINTMENT_ITEMS.push({
                            CAL_ID:data[i].CAL_ID,
                            APPOINTMENT_TIME:data[i].appointment_time,
                            FROM_TIME:data[i].FROM_TIME,
                            DOCTOR_ID:data[i].DOCTOR_ID,
                            SITE_ID:data[i].SITE_ID
                        });
                    }
                }
                var arr=[];
                for (var i=0;i<temp.LOCATION_ITEMS.length;i++)
                {
                    var location_item=temp.LOCATION_ITEMS[i];
                    location_item.DOCTOR_ITEMS=[];
                    for(var j=0;j<temp[location_item.SITE_ID].DOCTOR_ITEMS.length;j++)
                    {
                        var doctor_item=temp[location_item.SITE_ID].DOCTOR_ITEMS[j];
                        doctor_item.TYPE_ITEMS=[];
                        location_item.DOCTOR_ITEMS.push(doctor_item);
                        for(var q=0;q<temp[location_item.SITE_ID][doctor_item.DOCTOR_ID].TYPE_ITEMS.length;q++)
                        {
                            var type_item=temp[location_item.SITE_ID][doctor_item.DOCTOR_ID].TYPE_ITEMS[q];
                            type_item.SPEC_ITEMS=[];
                            doctor_item.TYPE_ITEMS.push(type_item);
                            for(var k=0;k<temp[location_item.SITE_ID][doctor_item.DOCTOR_ID][type_item.RL_TYPE_ID].SPEC_ITEMS.length;k++)
                            {
                                var spec_item=temp[location_item.SITE_ID][doctor_item.DOCTOR_ID][type_item.RL_TYPE_ID].SPEC_ITEMS[k];
                                spec_item.APPOINTMENT_ITEMS=[];
                                type_item.SPEC_ITEMS.push(spec_item);

                                for(var l=0;l<temp[location_item.SITE_ID][doctor_item.DOCTOR_ID][type_item.RL_TYPE_ID][spec_item.Specialties_id].APPOINTMENT_ITEMS.length;l++)
                                {
                                    var appointment_item=temp[location_item.SITE_ID][doctor_item.DOCTOR_ID][type_item.RL_TYPE_ID][spec_item.Specialties_id].APPOINTMENT_ITEMS[l];
                                    spec_item.APPOINTMENT_ITEMS.push(appointment_item);
                                }
                            }
                        }
                    }
                    arr.push(location_item);
                }
                console.log(arr);
                $scope.appointmentsFilter=arr;

            },function(data){
                console.log("error");
            })
        };
        $scope.selectAppointmentCalendar=function(appointmentCalendar,DID,LID)
        {

            console.log('aa---'+JSON.stringify(appointmentCalendar));
            var info = {
                CAL_ID: appointmentCalendar.CAL_ID,
                APPOINTMENT_TIME: appointmentCalendar.APPOINTMENT_TIME,
                FROM_TIME: appointmentCalendar.FROM_TIME,
                DOCTOR_ID: appointmentCalendar.DOCTOR_ID,
                SITE_ID: appointmentCalendar.SITE_ID,
                DOCTOR_NAME: DID,
                LOCATION_NAME: LID
            };
            OnlineBookingService.getInfoLocation(appointmentCalendar.SITE_ID).then(function(data){
                info.Address = data.Site_addr;

                localStorageService.set("selectedBooking", info);
            });
            $state.go('app.detailBooking',{patientID: $scope.patientID});
        };






        ////Google map
        //var geocoder;
        //var map;
        //geocoder = new google.maps.Geocoder();
        //var latlng = new google.maps.LatLng(-34.397, 150.644);
        //var mapOptions = {
        //    zoom: 16,
        //    center: latlng
        //}
        //map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        //function codeAddress() {
        //    var address=$scope.selectedBooking.Site_addr;
        //    geocoder.geocode( { 'address': address}, function(results, status) {
        //        if (status == google.maps.GeocoderStatus.OK) {
        //            map.setCenter(results[0].geometry.location);
        //            var marker = new google.maps.Marker({
        //                map: map,
        //                position: results[0].geometry.location
        //            });
        //        } else {
        //            alert('Geocode was not successful for the following reason: ' + status);
        //        }
        //    });
        //}

        //$scope.$watch("selectedBooking", function(newValue, oldValue){
        //    if($scope.selectedBooking)
        //        codeAddress();
        //});




})
