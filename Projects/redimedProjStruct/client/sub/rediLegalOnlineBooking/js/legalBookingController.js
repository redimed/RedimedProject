/**
 * Created by meditech on 8/29/2014.
 */

app.controller("legalBookingController", function($window,$scope,$http,locationService,rlTypesService,clnSpecialitiesService,doctorsService,appointmentCalendarService,bookingService,loginService,$cookieStore) {
//    UIDatepaginator.init();
//    Metronic.init();

    //Test Get User Info
    loginService.setUserInfo($cookieStore.get('userInfo'));

//    $http({
//        method:"POST",
//        url:"/api/rlob/my_test/get-user-info",
//        data:{user_name:'phuongnm'}
//    })
//    .success(function(data) {
//        loginService.setUserInfo(data);
//    })
//    .error(function (data) {
//        console.log("error");
//    })
//    .finally(function() {
//    });


    var initPickers = function () {

        //init date pickers
        $('.date-picker').datepicker({
            rtl: Metronic.isRTL(),
            autoclose: true
        }).on('changeDate',function(evn){
            alert("change ne");
        });

        }
    initPickers();

    $scope.selectedInfo=bookingService.getSelectedInfo();
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

        var doctorId=$scope.selectedInfo.doctorSelected!=null?$scope.selectedInfo.doctorSelected.doctor_id:-1;
        var locationId=$scope.selectedInfo.locationSelected!=null?$scope.selectedInfo.locationSelected.id:'%';
        var fromTime=$scope.selectedInfo.var1.format("YYYY/MM/DD");
        $scope.appointments.splice(0,$scope.appointments.length);
        $http({
            method:"GET",
            url:"/api/rlob/appointment-calendar/get-appointment-calendar" ,
            params:{DOCTOR_ID:doctorId,SITE_ID:locationId,FROM_TIME:fromTime}
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
//        if(!(   $scope.selectedInfo.doctorSelected==null||
//                $scope.selectedInfo.var1==null||
//                $scope.selectedInfo.locationSelected==null
//            ))
//        {
//
//        }
    }

});

app.controller("lob_patientDetailController",function($scope,$routeParams,$http,appointmentCalendarService,doctorsService,locationService,bookingService,loginService,FileUploader){

    $scope.loginInfo=loginService.getUserInfo();
    var initPickers = function () {

        //init date pickers
        $('.date-picker').datepicker({
            rtl: Metronic.isRTL(),
            autoclose: true
        }).on('changeDate',function(evn){

        });

    }
    initPickers();
    $scope.myHide = true;
    $scope.isSaving=false;
    $scope.newBooking={};
    var selectedInfo=bookingService.getSelectedInfo();

    var locationId=$routeParams.siteid;
    selectedInfo.locationSelected=locationService.getLocationById(locationId);
    //Google map
    var geocoder;
    var map;
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var mapOptions = {
        zoom: 16,
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


    var from_date = moment(new Date(selectedInfo.selectedAppointment.FROM_TIME));
    $scope.booking_detail={};
    $scope.booking_detail.date=from_date.format("DD-MM-YYYY");
    $scope.booking_detail.time=from_date.format("HH:mm");

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
//    $scope.newBooking.ASS_SURNAME="Tan Nguyen";
//    $scope.newBooking.ASS_OTHERNAMES="Lupy";
//    $scope.newBooking.ASS_CONTACT_NO="6996 Binh Duong";
//    $scope.newBooking.ASS_EMAIL="tannv.dts@gmail.com";
    $scope.newBooking.ASS_SURNAME=$scope.loginInfo.Booking_Person;
    $scope.newBooking.ASS_OTHERNAMES=$scope.loginInfo.Booking_Person;
    $scope.newBooking.ASS_CONTACT_NO=$scope.loginInfo.Contact_number;
    $scope.newBooking.ASS_EMAIL=$scope.loginInfo.Contact_email;



    //Upload File



    var uploader = $scope.uploader = new FileUploader({
        url: '/api/rlob/rl_booking_files/upload'
    });

    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });


    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    console.info('uploader', uploader);


    $scope.save=function()
    {
        $scope.isSaving=true;
        $scope.newBooking.BOOKING_DATE=moment().format("YYYY-MM-DD HH:mm");
        $scope.newBooking.APPOINTMENT_DATE=from_date.format("YYYY-MM-DD HH:mm");
        $scope.newBooking.COMPANY_ID=1;
        $scope.newBooking.RL_TYPE_ID=selectedInfo.rltypeSelected.RL_TYPE_ID;
        $scope.newBooking.SPECIALITY_ID=selectedInfo.clnSpecialitySelected.Specialties_id;
        $scope.newBooking.DOCTOR_ID=selectedInfo.doctorSelected.doctor_id;
        $scope.newBooking.SITE_ID=selectedInfo.locationSelected.id;
        $scope.newBooking.CAL_ID=cal_id;
        $scope.newBooking.refered_date_string=from_date.format("ddd DD-MM-YYYY HH-mm")+" "+selectedInfo.locationSelected.Site_name;
        $scope.newBooking.STATUS="Entered";
        $scope.myHide = false;
        $http({
            method:"POST",
            url:"/api/rlob/rl_bookings/add",
            data:$scope.newBooking
        })
            .success(function(data) {
                if(data.status=='success')
                {
                    alert("Add success!");
                    bookingService.setBookingInfo($scope.newBooking);
                    uploader.formData.push({booking_id:$scope.newBooking.BOOKING_ID,company_id:$scope.loginInfo.company_id,worker_name:$scope.newBooking.WRK_SURNAME});

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

app.controller("lob_bookingListController",function($scope, $http) {
    $scope.parseDate=function(date)
    {
        var d=new Date(date);
        return d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
    }
    $.ajax({
        url: '/api/rlob/rl_bookings/list',
        success: function(data) {
            $scope.data = data;
        },
        async: false
    });

})

app.controller("testController",function($scope) {
    var initPickers = function () {

        //init date pickers
        $('.date-picker').datepicker({
            rtl: Metronic.isRTL(),
            autoclose: true
        });

    }
    initPickers();
    alert("ok");
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

app.directive('mytable', ['$timeout',
    function($timeout) {
        return {
            restrict: 'E',
            template: '<table width="100%" class="table table-hover table-striped" id="sample_editable_1">' +
                '<thead><tr style="border-color: white"><th></th><th></th><th></th><th></th>' +
                '<th></th></tr><tr style="background-color: #585858; color: white"><th>ClaimNo</th><th>Surname</th><th>Type</th><th>' +
                'Booking Date</th><th>Appointment Date</th></tr></thead>' +
                '<tr ng-repeat="booking in data"><td>{{booking.CLAIM_NO}}</td><td>{{booking.WRK_SURNAME}}</td><td>{{booking.Rl_TYPE_NAME}}</td>' +
                '<td>{{parseDate(booking.BOOKING_DATE)}}</td>' +
                '<td>{{parseDate(booking.APPOINTMENT_DATE)}}</td>' +
                '</tr></table>',
            controller : "lob_bookingListController",
            link: function(scope, element, attrs, ctr) {
                $timeout(function() {
                    TableEditable.init();
                    var initPickers = function () {

                        //init date pickers
                        $('.date-picker').datepicker({
                            rtl: Metronic.isRTL(),
                            autoclose: true,
                            format: 'dd/mm/yyyy'
                        });

                    }
                    initPickers();
                }, 0)
            }
        }

    }
]);

app.controller("rob_uploadController",function($scope,$http,FileUploader,bookingService,loginService) {
    //Get rl_booking_file id
    $scope.bookingInfo=bookingService.getBookingInfo();
    $scope.loginInfo=loginService.getUserInfo();

    var uploader = $scope.uploader = new FileUploader({
        url: '/api/rlob/rl_booking_files/upload'
    });

    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    uploader.formData.push({booking_id:$scope.bookingInfo.BOOKING_ID,company_id:$scope.loginInfo.company_id,worker_name:$scope.bookingInfo.WRK_SURNAME});
//    worker_name:$scope.bookingInfo.WRK_SURNAME,
//    $scope.file_id=-1;
//    $http({
//        method:"GET",
//        url:"/api/rlob/rl_booking_files/get-new-key"
//    })
//    .success(function(data) {
//        $scope.file_id=data.key;
//            alert($scope.bookingInfo.BOOKING_ID);
//
//    })
//    .error(function (data) {
//        alert("insert fail");
//    })
//    .finally(function() {
//    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    console.info('uploader', uploader);
});
