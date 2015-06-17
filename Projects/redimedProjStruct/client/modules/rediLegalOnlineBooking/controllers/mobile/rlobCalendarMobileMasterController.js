angular.module("app.calendar.mobile.controller",[])
.controller('rlobCalendarMobileMasterController',function(socket,$modal,$scope,toastr,$http,$stateParams,Mailto,$cookieStore,$window,rlobService,$timeout,ConfigService,$state){
	$scope.loginInfo = $cookieStore.get('userInfo');

    //-------------------------------------------------------------

    $scope.selectedFilter={
        locationSelected:{},
        rltypeSelected:{},
        clnSpecialitySelected:{},
        doctorSelected:{},
        var1:moment(new Date()).format('DD/MM/YYYY')
    }
    console.log($scope.selectedFilter.var1);
    $("#daydatepicker").datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: "dd/mm/yy",
        onSelect: function(date) {
            $scope.selectedFilter.var1 = date;
            $scope.updateAppoinmentsList();
        }
     });
    //---------------------------------------------------------------------------

    //Get all location for select
    $scope.getLocationsFilter=function()
    {
        $http({
            method:"GET",
            url:"/api/rlob/redimedsites/list",
            params:{bookingType:$scope.bookingType}
        })
            .success(function(data) {
                $scope.locationsFilter=data;
            })
            .error(function (data) {
                console.log("error");
            })
            .finally(function() {
            });
    }
    $scope.getLocationsFilter();

    //Get all Doctors of specialtity
    $scope.getDoctorsFilter=function()
    {

        $http({
            method:"GET",
            url:"/api/rlob/doctors/get-doctors-for-source-type",
            params:{sourceType:$scope.bookingType}
        })
            .success(function(data) {
                if(data.status=='success')
                    $scope.doctorsFilter=data.data;

                //if Vaccination

                if($scope.bookingType=='Vaccination')
                {
                    $scope.selectedFilter.doctorSelected=$scope.doctorsFilter[0];
                    $scope.updateAppoinmentsList();

                }
            })
            .error(function (data) {
                console.log("error");
            })
            .finally(function() {

            });
    }
    $scope.getDoctorsFilter();

    //test
    //Get Appoiment Calendar
    $scope.updateAppoinmentsList=function()
    {
        var doctorId=$scope.selectedFilter.doctorSelected  && $scope.selectedFilter.doctorSelected.doctor_id?$scope.selectedFilter.doctorSelected.doctor_id:'%';
        var locationId=$scope.selectedFilter.locationSelected  && $scope.selectedFilter.locationSelected.id?$scope.selectedFilter.locationSelected.id:'%';
        var fromTime=$scope.selectedFilter.var1.split("/").reverse().join("-");

        $http({
            method:"GET",
            url:"/api/rlob/appointment-calendar/get-appointment-calendar-not-service" ,
            params:{DOCTOR_ID:doctorId,SITE_ID:locationId,FROM_TIME:fromTime}
        })
            .success(function(data) {

                var temp={DOCTOR_ITEMS:[]};


                for(var i=0;i<data.length;i++)
                {
                    if(!temp[data[i].DOCTOR_ID])
                    {
                        temp[data[i].DOCTOR_ID]={LOCATION_ITEMS:[]};
                        temp.DOCTOR_ITEMS.push({
                            DOCTOR_ID:data[i].DOCTOR_ID,
                            DOCTOR_NAME:data[i].NAME
                        });
                    }

                    if(!temp[data[i].DOCTOR_ID][data[i].SITE_ID])
                    {
                        temp[data[i].DOCTOR_ID][data[i].SITE_ID]={APPOINTMENT_ITEMS:[]};
                        temp[data[i].DOCTOR_ID].LOCATION_ITEMS.push({
                            SITE_ID: data[i].SITE_ID,
                            SITE_NAME:data[i].Site_name
                        });
                    }

                    if(!temp[data[i].DOCTOR_ID][data[i].SITE_ID][data[i].CAL_ID])
                    {
                        temp[data[i].DOCTOR_ID][data[i].SITE_ID][data[i].CAL_ID]={};
                        temp[data[i].DOCTOR_ID][data[i].SITE_ID].APPOINTMENT_ITEMS.push({
                            CAL_ID:data[i].CAL_ID,
                            APPOINTMENT_TIME:data[i].appointment_time,
                            FROM_TIME:data[i].FROM_TIME,
                            DOCTOR_ID:data[i].DOCTOR_ID,
                            SITE_ID:data[i].SITE_ID,
                            DOCTOR_NAME:data[i].NAME,
                            SITE_NAME:data[i].Site_name
                        });
                    }
                }
                var arr=[];

                for (var i=0;i<temp.DOCTOR_ITEMS.length;i++)
                {
                    var doctor_item=temp.DOCTOR_ITEMS[i];
                    doctor_item.LOCATION_ITEMS=[];
                    for(var j=0;j<temp[doctor_item.DOCTOR_ID].LOCATION_ITEMS.length;j++)
                    {
                        var location_item=temp[doctor_item.DOCTOR_ID].LOCATION_ITEMS[j];
                        location_item.APPOINTMENT_ITEMS=[];
                        doctor_item.LOCATION_ITEMS.push(location_item);
                        for(var k=0;k<temp[doctor_item.DOCTOR_ID][location_item.SITE_ID].APPOINTMENT_ITEMS.length;k++)
                        {
                            var appointment_item=temp[doctor_item.DOCTOR_ID][location_item.SITE_ID].APPOINTMENT_ITEMS[k];
                            location_item.APPOINTMENT_ITEMS.push(appointment_item);
                        }
                    }

                    arr.push(doctor_item);
                }

                
                $scope.appointmentsFilter=arr;
            })
            .error(function (data) {
                console.log("error");
            })
            .finally(function() {

            });
    }

    $scope.updateAppoinmentsList();
    $scope.CAL_ID = null;
    var selectCalendar = null;
    $scope.selectAppointmentCalendar=function(appointmentCalendar)
    {
        $scope.selectedAppointmentCalendar=appointmentCalendar;
        $scope.CAL_ID = appointmentCalendar.CAL_ID;
        console.log($scope.selectedAppointmentCalendar);
        $scope.updateAppoinmentsList();
        selectCalendar = $scope.selectedAppointmentCalendar;
        console.log('ne',selectCalendar);
    } 
    $scope.submitCalendar = function(){
        if ($scope.patientInfoCalendar.Patient_id) {
            if ($scope.selectedAppointmentCalendar) {
                console.log("hehe",selectCalendar);
                rlobService.addApptPatient($scope.patientInfoCalendar.Patient_id,$scope.selectedAppointmentCalendar.CAL_ID).then(function(data){
                    if (data.status == 'success') {
                        socket.emit('notifyReceptionist');
                        var modalInstance = $modal.open({
                            templateUrl: 'notifyid',
                            controller: function($scope, $modalInstance,$state){
                                console.log("zooooooo",selectCalendar);
                                $scope.selectCalendar = selectCalendar;
                            },
                            size: 'sm',
                            backdrop : 'static'
                        });
                    }
                    else{
                        toastr.error("Booking fail!", "Error");
                    };
                })
            }else{
                toastr.error("Booking not yet selected", "Error");
            };
        }else{
            toastr.error("No information available on the patient", "Error");
        };
    }
})


