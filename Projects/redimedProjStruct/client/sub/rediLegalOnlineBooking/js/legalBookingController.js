/**
 * Created by meditech on 8/29/2014.
 */

app.controller("legalBookingController", function($window,$scope,$http,locationService,rlTypesService,clnSpecialitiesService,doctorsService,appointmentCalendarService,bookingService) {
    $scope.selectedInfo=bookingService.getSelectedInfo();
    $scope.selectedInfo.var1 = '18-8-2014';
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
        $scope.updateAppoinmentsList();
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

    $scope.specialityChange=function(){
        $scope.doctorsOfSpeciality=doctorsService.getDoctorForSpeciality($scope.selectedInfo.clnSpecialitySelected.Specialties_id);
        $scope.selectedInfo.doctorSelected={};
        $scope.updateAppoinmentsList();
    }

    $scope.appointments=appointmentCalendarService.allSync();
    $scope.updateAppoinmentsList=function()
    {
        $scope.appointments.splice(0,$scope.appointments.length);
        var fromtime=$scope.selectedInfo.var1.getFullYear()+"-"+($scope.selectedInfo.var1.getMonth()+1)+"-"+$scope.selectedInfo.var1.getDate();
        $http({
            method:"GET",
            url:"/api/rlob/appointment-calendar/get-appointment-calendar" ,
            params:{DOCTOR_ID:$scope.selectedInfo.doctorSelected.doctor_id,SITE_ID:$scope.selectedInfo.locationSelected.id,FROM_TIME:fromtime}
        })
            .success(function(data) {
                for(var i=0;i<data.length;i++)
                {
                    $scope.appointments.push(data[i]);
                }

            })
            .error(function (data) {
                console.log("error");
            })
            .finally(function() {

            });
    }

});

app.controller("lob_patientDetailController",function($scope,$routeParams,$http,appointmentCalendarService,doctorsService,locationService,bookingService){

    $scope.isSaving=false;
    $scope.newBooking={};
    var selectedInfo=bookingService.getSelectedInfo();

    //Google map
    var geocoder;
    var map;
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var mapOptions = {
        zoom: 8,
        center: latlng
    }
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    function codeAddress() {
        var address=selectedInfo.locationSelected.Site_addr;
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    //==============================================================================================

    var cal_id=$routeParams.id;
    selectedInfo.selectedAppointment=appointmentCalendarService.getAppointmentById(cal_id);
    var from_date = new Date(selectedInfo.selectedAppointment.FROM_TIME);
    $scope.booking_detail={};
    $scope.booking_detail.date=getDateString(from_date);
    $scope.booking_detail.time=getTimeString(from_date);
    $scope.booking_detail.doctor_name=selectedInfo.doctorSelected.NAME;
    $scope.booking_detail.address=selectedInfo.locationSelected.Site_addr;
    $scope.booking_detail.type=selectedInfo.rltypeSelected.Rl_TYPE_NAME;
    codeAddress();
    $scope.newBooking.BOOKING_ID=20000;
    $http({
        method:"GET",
        url:"/api/rlob/rl_bookings/get-new-key"
    })
    .success(function(data) {
        $scope.newBooking.BOOKING_ID=data.key;
    })
    .error(function (data) {
        alert("insert fail");
    })
    .finally(function() {

    });
    $scope.newBooking.ASS_SURNAME="Tan Nguyen";
    $scope.newBooking.ASS_OTHERNAMES="Lupy";
    $scope.newBooking.ASS_CONTACT_NO="6996 Binh Duong";
    $scope.newBooking.ASS_EMAIL="tannv.dts@gmail.com";
    $scope.save=function()
    {
        $scope.isSaving=true;
        $scope.newBooking.BOOKING_DATE=getDateTimeSQLString(from_date);
        $scope.newBooking.COMPANY_ID=1;
        $scope.newBooking.RL_TYPE_ID=selectedInfo.rltypeSelected.RL_TYPE_ID;
        $scope.newBooking.SPECIALITY_ID=selectedInfo.clnSpecialitySelected.Specialties_id;
        $scope.newBooking.DOCTOR_ID=selectedInfo.doctorSelected.doctor_id;
        $scope.newBooking.SITE_ID=selectedInfo.locationSelected.id;
        $scope.newBooking.CAL_ID=cal_id;
        $scope.newBooking.refered_date_string=getDayString(from_date)+" "+getDateString(from_date)+" "
                                                +getTimeString(from_date)+" "+selectedInfo.locationSelected.Site_name;
        $scope.newBooking.STATUS="Entered";
        $http({
            method:"POST",
            url:"/api/rlob/rl_bookings/add",
            data:$scope.newBooking
        })
        .success(function(data) {
            if(data.status=='success')
            {
                alert("Add success!");
            }
            else
            {
                alert("Add fail!");
            }
        })
        .error(function (data) {
            alert("insert fail");
        })
        .finally(function() {

        });


    }

});


app.controller("lob_bookingListController",function($scope,ngTableParams,$http) {
    $scope.data=[];
    $http({
        method:"GET",
        url:"/api/rlob/rl_bookings/list"
    })
    .success(function(data) {
        $scope.data=data;
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10           // count per page
        }, {
            total: data.length, // length of data
            getData: function($defer, params) {
                $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    })
    .error(function (data) {
        alert("insert fail");
    })
    .finally(function() {

    });



});


app.directive('datetimez', function() {
    return {
        restrict: 'A',
        require : 'ngModel',
        link: function(scope, element, attrs, legalBookingController) {
            element.datetimepicker({
                format: "dd-MM-yyyy",
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

