/**
 * Created by meditech on 8/29/2014.
 */
angular.module('app.loggedIn.rlob.booking.controller',[])
.controller("rlob_bookingController", function($window,$scope,$http,$stateParams,locationService,rlTypesService,clnSpecialitiesService,doctorsService,appointmentCalendarService,bookingService,$cookieStore) {
//    UIDatepaginator.init();
//    Metronic.init();
    //if($stateParams.bookingType)
        //alert($stateParams.bookingType);

    var initPickers = function () {

        //init date pickers
        $('.date-picker').datepicker({
            rtl: Metronic.isRTL(),
            autoclose: true
        });

    }
    initPickers();

    $scope.selectedInfo=bookingService.getSelectedInfo();
    //Xoa toan bo thong tin cu:clearSelectedInfo
    angular.copy({},$scope.selectedInfo);

    $scope.selectedInfo.var1=moment();
    /**
     *
     * @param date: momentjs Date type
     */
    var datePaginatorChanged=function(date)
    {

        $scope.selectedInfo.var1=date;
        $scope.updateAppoinmentsList();
    }

    var datePaginator=new MyDatePaginator($scope.selectedInfo.var1,datePaginatorChanged);

    $scope.locations=locationService.allSync();
    if($scope.locations.length<=0)
    {
        $http({
            method:"GET",
            url:"/api/rlob/redimedsites/list"
        })
        .success(function(data) {

            for(var i=0;i<data.length;i++)
            {
                $scope.locations.push(data[i]);
            }
        })
        .error(function (data) {
            console.log("error");
        })
        .finally(function() {

        });
    }

    $scope.getLocationName=function(locationId)
    {
        return locationService.getLocationById(locationId).Site_name;
    }


//--------------------------------------------------------------

//--------------------------------------------------------------

    $scope.rltypes=rlTypesService.allSync();
    if($scope.rltypes.length<=0)
    {
        $http({
            method:"GET",
            url:"/api/rlob/rl_types/list"
        })
        .success(function(data) {

            for(var i=0;i<data.length;i++)
            {
                $scope.rltypes.push(data[i]);
            }
        })
        .error(function (data) {
            console.log("error");
        })
        .finally(function() {

        });
    }

//--------------------------------------------------------------

    $scope.clnSpecialities=clnSpecialitiesService.allSync();
    if($scope.clnSpecialities.length<=0)
    {
        $http({
            method:"GET",
            url:"/api/rlob/cln_specialties/list"
        })
        .success(function(data) {
            for(var i=0;i<data.length;i++)
            {
                $scope.clnSpecialities.push(data[i]);
            }

        })
        .error(function (data) {
            console.log("error");
        })
        .finally(function() {

        });
    }

    $scope.typeChange=function()
    {
        $scope.specialitiesOfType=clnSpecialitiesService.getSpecialitiesForType($scope.selectedInfo.rltypeSelected.RL_TYPE_ID);
        $scope.selectedInfo.clnSpecialitySelected={};
        $scope.selectedInfo.doctorSelected={};
//        $scope.updateAppoinmentsList();
    }

    //--------------------------------------------------------------
    $scope.doctors=doctorsService.allSync();
    if($scope.doctors.length<=0)
    {
        $http({
            method:"GET",
            url:"/api/rlob/doctors/list"
        })
        .success(function(data) {
            for(var i=0;i<data.length;i++)
            {
                $scope.doctors.push(data[i]);
            }
        })
        .error(function (data) {
            console.log("error");
        })
        .finally(function() {

        });
    }



    $scope.getDoctorName=function(id)
    {
        return doctorsService.getDoctorById(id).NAME;
    }

    $scope.specialityChange=function(){

        var s_id=$scope.selectedInfo.clnSpecialitySelected!=null && $scope.selectedInfo.clnSpecialitySelected.Specialties_id!=undefined?$scope.selectedInfo.clnSpecialitySelected.Specialties_id:-1;
        $scope.doctorsOfSpeciality=doctorsService.getDoctorForSpeciality(s_id);
        $scope.selectedInfo.doctorSelected={};
        $scope.updateAppoinmentsList();

    }

//    $scope.appointments=appointmentCalendarService.allSync();
//    //Xoa toan bo thong tin cu
//    angular.copy({},$scope.appointments);
//    $scope.updateAppoinmentsList=function()
//    {
//        var specialityId=$scope.selectedInfo.clnSpecialitySelected!=null && $scope.selectedInfo.clnSpecialitySelected.Specialties_id!=undefined?$scope.selectedInfo.clnSpecialitySelected.Specialties_id:-1;
//        var doctorId=$scope.selectedInfo.doctorSelected!=null && $scope.selectedInfo.doctorSelected.doctor_id!=undefined ?$scope.selectedInfo.doctorSelected.doctor_id:'%';
//        var locationId=$scope.selectedInfo.locationSelected!=null && $scope.selectedInfo.locationSelected.id!=undefined?$scope.selectedInfo.locationSelected.id:'%';
//        var fromTime=$scope.selectedInfo.var1.format("YYYY/MM/DD");
//        $scope.appointments.splice(0,$scope.appointments.length);
//        $http({
//            method:"GET",
//            url:"/api/rlob/appointment-calendar/get-appointment-calendar" ,
//            params:{Specialties_id:specialityId,DOCTOR_ID:doctorId,SITE_ID:locationId,FROM_TIME:fromTime}
//        })
//        .success(function(data) {
//
//            for(var i=0;i<data.length;i++)
//            {
//                $scope.appointments.push(data[i]);
//            }
//
//        })
//        .error(function (data) {
//            console.log("error");
//        })
//        .finally(function() {
//
//        });
//
//    }
        $scope.appointments=appointmentCalendarService.allSync();
        //Xoa toan bo thong tin cu
        angular.copy({},$scope.appointments);
        $scope.updateAppoinmentsList=function()
        {
        var specialityId=$scope.selectedInfo.clnSpecialitySelected!=null && $scope.selectedInfo.clnSpecialitySelected.Specialties_id!=undefined?$scope.selectedInfo.clnSpecialitySelected.Specialties_id:-1;
        var doctorId=$scope.selectedInfo.doctorSelected!=null && $scope.selectedInfo.doctorSelected.doctor_id!=undefined ?$scope.selectedInfo.doctorSelected.doctor_id:'%';
        var locationId=$scope.selectedInfo.locationSelected!=null && $scope.selectedInfo.locationSelected.id!=undefined?$scope.selectedInfo.locationSelected.id:'%';
        var fromTime=$scope.selectedInfo.var1.format("YYYY/MM/DD");

            $http({
                method:"GET",
                url:"/api/rlob/appointment-calendar/get-appointment-calendar" ,
                params:{Specialties_id:specialityId,DOCTOR_ID:doctorId,SITE_ID:locationId,FROM_TIME:fromTime}
            })
                .success(function(data) {
                    for(var i=0;i<data.length;i++)
                    {
                        $scope.appointments.push(data[i]);
                    }

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

                        if(!temp[data[i].SITE_ID][data[i].DOCTOR_ID])
                        {
                            temp[data[i].SITE_ID][data[i].DOCTOR_ID]={APPOINTMENT_ITEMS:[]};
                            temp[data[i].SITE_ID].DOCTOR_ITEMS.push({
                                DOCTOR_ID:data[i].DOCTOR_ID,
                                DOCTOR_NAME:data[i].NAME
                            });
                        }
                        if(!temp[data[i].SITE_ID][data[i].DOCTOR_ID][data[i].CAL_ID])
                        {
                            temp[data[i].SITE_ID][data[i].DOCTOR_ID][data[i].CAL_ID]={};
                            temp[data[i].SITE_ID][data[i].DOCTOR_ID].APPOINTMENT_ITEMS.push({
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
                            doctor_item.APPOINTMENT_ITEMS=[];
                            location_item.DOCTOR_ITEMS.push(doctor_item);
                            for(var k=0;k<temp[location_item.SITE_ID][doctor_item.DOCTOR_ID].APPOINTMENT_ITEMS.length;k++)
                            {
                                var appointment_item=temp[location_item.SITE_ID][doctor_item.DOCTOR_ID].APPOINTMENT_ITEMS[k];
                                doctor_item.APPOINTMENT_ITEMS.push(appointment_item);
                            }
                        }
                        arr.push(location_item);
                    }
                    $scope.appointmentsFilter=arr;


                })
                .error(function (data) {
                    console.log("error");
                })
                .finally(function() {

                });
        }

})



.directive('datetimez', function() {
    return {
        restrict: 'A',
        require : 'ngModel',
        link: function(scope, element, attrs, legalBookingController) {
            element.datetimepicker({
                format: "dd/MM/yyyy",
                viewMode: "days",
                minViewMode: "dates",
                pickTime: false
            }).on('changeDate', function(e) {
                legalBookingController.$setViewValue(e.date);
                scope.$apply();
            });
        }
    };
});




