/**
 * Created by tannv.dts@gmail.com on 9/29/2014.
 */

angular.module("app.loggedIn.rlob.directive", [])
.directive('noticeRepeatFinish', function() {
    return function(scope, element, attrs) {
//        angular.element(element).css('color','blue');
        if (scope.$last){
            scope.collapseAll();
//            window.alert("im the last!");
        }
    };
})

.directive('mytable', ['$timeout',
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
            controller : "rlob_bookingListController",
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
])

/**
 * Directive show dialog
 * dialogClass: style class cua dialog
 * header: tieu de cua dialog
 * status: trang thai cua dialog
 * msg: thong tin hien thi
 * tannv.dts@gmail.com
 */
.directive('rlobDialog', function() {
    return {
        restrict: 'E',
        transclude:true,
        scope: {
            dialogClass:   '@',
            header:     '=',
            status:     '=',
            msg:        '='
        },
        templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_msg_dialog_template.html'
    };
})


/***
 * compoent hien thi sort tren table
 * fileName:
 */
.directive('rlobOrderBy', function() {
    return {
        restrict: 'E',
        transclude:true,
        required:['^ngModel'],
        scope: {
            fieldName:  '@',
            rlobModel:    '=',
            startupDirect: '@',
            currentFieldSort:    '='
        },
        templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_orderby_template.html',
        controller: function ($scope)
        {
            $scope.direct=angular.copy($scope.startupDirect);
            $scope.changeDirect=function(direct,fieldName)
            {
                $scope.currentFieldSort=angular.copy(fieldName);
                $scope.direct=direct;
                $scope.rlobModel=$scope.fieldName+" "+$scope.direct;
            }
        }
    };
})

    .directive('rlobBookingDetail', function() {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
                selectedBooking:  '=',
                bookingType:'='
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_booking_detail_template.html',
            controller: function ($scope)
            {
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
                    var address=$scope.selectedBooking.Site_addr;
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

                $scope.$watch("selectedBooking", function(newValue, oldValue){
                    if($scope.selectedBooking)
                        codeAddress();
                });
            }
        };
    })
    .directive('rlobBookingDetailCompact', function() {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
                selectedBooking:  '=',
                bookingType:'='
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_booking_detail_template-compact.html',
            controller: function ($scope)
            {

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
                    var address=$scope.selectedBooking.Site_addr;
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

                $scope.$watch("selectedBooking", function(newValue, oldValue){
                    if($scope.selectedBooking)
                        codeAddress();
                });

                $scope.panelAccordion = {
                    status1: true,
                    status2: true,
                    status3: true,
                    status4:true
                };
            }
        };
    })

    .directive('rlobUpload', function() {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
                selectedBooking:  '=',
                isAdminUpload:'=',
                filesUpdateFlag:'='
                //la so, de danh dau co file moi upload hay khong
                //set cung bien voi rlobFileDownload directive sẽ tu dong dong bo hoa giup upload vao download
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_upload_template.html',
            controller: function ($scope,$http,$cookieStore, FileUploader)
            {
                $scope.filesUpdateFlag=0;
                $scope.loginInfo = $cookieStore.get('userInfo');
                //---------------------------------------------------------------
                //HANDLE UPLOAD FILES
                var uploader = $scope.uploader = new FileUploader({
                    url: '/api/rlob/rl_booking_files/upload'
                });
                // FILTERS
                uploader.filters.push({
                    name: 'customFilter',
                    fn: function (item /*{File|FileLikeObject}*/, options) {
                        return this.queue.length < 10;
                    }
                });
                // CALLBACKS
                uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
                    console.info('onWhenAddingFileFailed', item, filter, options);
                };
                uploader.onAfterAddingFile = function (fileItem) {
                    console.info('onAfterAddingFile', fileItem);
                };
                uploader.onAfterAddingAll = function (addedFileItems) {
                    console.info('onAfterAddingAll', addedFileItems);
                };
                uploader.onBeforeUploadItem = function (item) {
                    console.info('onBeforeUploadItem', item);
                };
                uploader.onProgressItem = function (fileItem, progress) {
                    console.info('onProgressItem', fileItem, progress);
                };
                uploader.onProgressAll = function (progress) {
                    console.info('onProgressAll', progress);
                };
                uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    $scope.filesUpdateFlag=$scope.filesUpdateFlag+1;
                    console.info('onSuccessItem', fileItem, response, status, headers);
                };
                uploader.onErrorItem = function (fileItem, response, status, headers) {
                    console.info('onErrorItem', fileItem, response, status, headers);
                };
                uploader.onCancelItem = function (fileItem, response, status, headers) {
                    console.info('onCancelItem', fileItem, response, status, headers);
                };
                uploader.onCompleteItem = function (fileItem, response, status, headers) {
                    console.info('onCompleteItem', fileItem, response, status, headers);
                };
                uploader.onCompleteAll = function () {
                    console.info('onCompleteAll');
                };

                console.info('uploader', uploader);


                $scope.$watch("selectedBooking", function(newValue, oldValue){
                    if($scope.selectedBooking)
                    {
                        uploader.clearQueue();
                        uploader.formData[0]={};
                        uploader.formData[0].booking_id=$scope.selectedBooking.BOOKING_ID;
                        uploader.formData[0].company_id=$scope.loginInfo.company_id;
                        uploader.formData[0].worker_name=$scope.selectedBooking.WRK_SURNAME;
                        if(!$scope.isAdminUpload)
                            uploader.formData[0].isClientDownLoad=0;

//                        uploader.formData.push({booking_id: $scope.selectedBooking.BOOKING_ID,
//                                company_id: $scope.loginInfo.company_id,
//                                worker_name: $scope.selectedBooking.WRK_SURNAME,
//                                isClientDownLoad: 0}
//                        );
                    }

                });

            }
        };
    })

    /***
     * bookingType: kieu cua booking, redilegal hoac vaccination
     * selectedBooking: data cua booking duoc chon, bat buoc phai co
     * isAdminGetFiles: Neu la page cua admin su dung directive thi se lay toan bo file cua booking
     *                  Neu page la cua client thi chi lay nhung file result
     * addNotificationFunction: truyen vao function addNotification cua loggedIn State
     * tannv.dts@gmail.com
     */
    .directive('rlobFileDownload', function() {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
                bookingType:'=',
                selectedBooking:  '=',
                isAdminGetFiles:'=',
                addNotificationFunction:'=',
                filesUpdateFlag:'='
                //la so, de danh dau co file moi upload hay khong
                //set cung bien voi rlobFileDownload directive sẽ tu dong dong bo hoa giup upload vao download
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_download_file_template.html',
            controller: function ($scope,$http)
            {

                $scope.rlobNotificationType=rlobConstant.rlobNotificationType;
                $scope.notificationType=rlobConstant.notificationType;
                $scope.rlob_add_notification=$scope.addNotificationFunction;
                function getFilesUpload() {
                    $http({
                        method: "GET",
                        url: "/api/rlob/rl_bookings/admin/get-files-by-booking-id",
                        params: {bookingId: $scope.selectedBooking.BOOKING_ID,isAdminGetFiles:$scope.isAdminGetFiles}
                    }).success(function (data) {
                        if (data.status == 'success') {
                            $scope.files = data.data;
                        }
                    });
                }

                $scope.$watch("selectedBooking", function(newValue, oldValue) {
                    if ($scope.selectedBooking) {
                        getFilesUpload();
                    }
                });


                $scope.$watch("filesUpdateFlag", function(newValue, oldValue){
                    if ($scope.selectedBooking) {
                        getFilesUpload();
                    }
                });

                $scope.rlob_change_booking_file_role=function(assId,refId,fileId,role)
                {
                    $scope.showMsgDialog=function(styleClass,header,status,content)
                    {
                        $scope.msgHeader=header;
                        $scope.msgStatus=status;
                        $scope.msgContent=content;
                        $(styleClass).modal({show:true,backdrop:'static'});
                    };

                    $http({
                        method:"POST",
                        url:"/api/rlob/rl_booking_files/change-role-download",
                        data:{fileId:fileId,role:role}
                    })
                        .success(function(data) {
                            if(data.status=='success')
                            {
                                $scope.showMsgDialog(".rlob-file-msg-dialog",'Authority downloads','success','Changing success! Customer'+(role==1?' can ':' cannot ')+'download this file');
                                if(role==1)
                                    $scope.rlob_add_notification(assId,refId,$scope.bookingType,$scope.rlobNotificationType.result,$scope.notificationType.letter,'');
                                getFilesUpload();
                            }
                            else
                            {
                                $scope.showMsgDialog(".rlob-file-msg-dialog",'Authority downloads','fail','Changing fail!');
                            }
                        })
                        .error(function (data) {
                            $scope.showMsgDialog(".rlob-file-msg-dialog",'Authority downloads','fail','Changing fail!');
                        })
                        .finally(function() {

                        });
                }
            }
        };
    })


    /***
     * tannv.dts@gmail.com
     * Neu su dung directive cho dialog thi moi lan show dialog tang bien dem usingForDialogFlag len 1 don vi
     * Nham de directive cap nhat lai datepaginator date picker
     *
     * Nguyen tac hoat dong: trong directive co funtion $watch de theo doi su thay doi cua usingForDialogFlag,
     *                       neu co thay doi thi function duoc chay
     */
    .directive('rlobChooseAppointmentCalendarDialog', function() {
        return {
            restrict: 'E',
            transclude: true,
            required: ['^ngModel'],
            scope: {
                bookingType:'=',
                usingForDialogFlag:'=',
                selectedAppointmentCalendar:'='
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_choose_appointment_calendar_template.html',
            controller: function ($scope,$http,$stateParams) {

                //Check Booking Type

                $scope.selectedFilter={
                    locationSelected:{},
                    rltypeSelected:{},
                    clnSpecialitySelected:{},
                    doctorSelected:{},
                    var1:{}
                }

                //Khoi tao data paginator
                $scope.selectedFilter.var1=moment();
                var initPickers = function () {

                    //init date pickers
                    $('.date-picker').datepicker({
                        rtl: Metronic.isRTL(),
                        autoclose: true
                    });

                }

                initPickers();

                var datePaginatorChanged=function(date)
                {
                    $scope.selectedFilter.var1=date;
                    $scope.updateAppoinmentsList();
                }
                var datePaginator=new MyDatePaginator('#rlob-datepaginator-choice',$scope.selectedFilter.var1,datePaginatorChanged);

                //---------------------------------------------------------------------------

                //Get all location for select
                $scope.getLocationsFilter=function()
                {
                    $http({
                        method:"GET",
                        url:"/api/rlob/redimedsites/list"
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


                $scope.getRlTypesFilter=function()
                {

                    $http({
                        method:"GET",
                        url:"/api/rlob/rl_types/list",
                        params:{sourceType:$scope.bookingType}
                    })
                    .success(function(data) {
                        $scope.rltypesFilter=data;
                        //If vaccination
                        if($scope.bookingType=='Vaccination')
                        {
                            $scope.selectedFilter.rltypeSelected=data[0];
                            $scope.getSpecialitiesFilter($scope.selectedFilter.rltypeSelected.RL_TYPE_ID);
                        }

                    })
                    .error(function (data) {
                        console.log("error");
                    })
                    .finally(function() {

                    });

                }
                $scope.getRlTypesFilter();

                $scope.rlTypesFilterChange=function(rlTypeId)
                {

                    $scope.getSpecialitiesFilter(rlTypeId);
                    $scope.selectedFilter.clnSpecialitySelected={};
                    $scope.getDoctorsFilter(null);
                    $scope.selectedFilter.doctorSelected={};
                    $scope.updateAppoinmentsList();
                }

                //Get all doctor Specialtity
                $scope.getSpecialitiesFilter=function(rlTypeId)
                {
                    $http({
                        method:"GET",
                        url:"/api/rlob/cln_specialties/filter-by-type",
                        params:{RL_TYPE_ID:rlTypeId}
                    })
                        .success(function(data) {
                            if(data.status=='success')
                                $scope.specialitiesFilter=data.data;
                            //if vaccination
                            if($scope.bookingType=='Vaccination')
                            {
                                $scope.selectedFilter.clnSpecialitySelected=$scope.specialitiesFilter[0];
                                $scope.getDoctorsFilter($scope.selectedFilter.clnSpecialitySelected.Specialties_id);
                            }
                        })
                        .error(function (data) {
                            console.log("error");
                        })
                        .finally(function() {

                        });
                }
                $scope.specialitiesChange=function(specialtityId)
                {
                    $scope.getDoctorsFilter(specialtityId);
                    $scope.selectedFilter.doctorSelected={};
                    $scope.updateAppoinmentsList();
                }

                //Get all Doctors of specialtity
                $scope.getDoctorsFilter=function(specialtityId)
                {

                    $http({
                        method:"GET",
                        url:"/api/rlob/doctors/get-doctors-by-speciality",
                        params:{Specialties_id:specialtityId}
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

                //Get Appoiment Calendar
                $scope.updateAppoinmentsList=function()
                {
                    var specialityId= $scope.selectedFilter.clnSpecialitySelected && $scope.selectedFilter.clnSpecialitySelected.Specialties_id?$scope.selectedFilter.clnSpecialitySelected.Specialties_id:-1;
                    var doctorId=$scope.selectedFilter.doctorSelected  && $scope.selectedFilter.doctorSelected.doctor_id?$scope.selectedFilter.doctorSelected.doctor_id:'%';
                    var locationId=$scope.selectedFilter.locationSelected  && $scope.selectedFilter.locationSelected.id?$scope.selectedFilter.locationSelected.id:'%';
                    var fromTime=$scope.selectedFilter.var1.format("YYYY/MM/DD");

                    $http({
                        method:"GET",
                        url:"/api/rlob/appointment-calendar/get-appointment-calendar" ,
                        params:{Specialties_id:specialityId,DOCTOR_ID:doctorId,SITE_ID:locationId,FROM_TIME:fromTime}
                    })
                        .success(function(data) {

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


                //Chuc nang: khoi tao date paginator khi su dung directive nay trong modal,
                //Vi trong modal neu modal chua hien thi thi cac function tren element se khong co hieu luc
                //chinh vi the phai bat su kien sao cho khi modal hien thi thi cac function se duoc gan cho
                //element
                $scope.$watch("usingForDialogFlag", function(newValue, oldValue){
                    if($scope.usingForDialogFlag)
                    {
                        $scope.updateCalendarPaginator();
                        $scope.updateAppoinmentsList();
                    }

                });

                $scope.updateCalendarPaginator=function (){
                    $scope.selectedFilter.var1=moment();
                    var initPickers = function () {

                        //init date pickers
                        $('.date-picker').datepicker({
                            rtl: Metronic.isRTL(),
                            autoclose: true
                        });

                    }
                    initPickers();
                    var datePaginatorChanged=function(date)
                    {
                        $scope.selectedFilter.var1=date;
                        $scope.updateAppoinmentsList();
                    }
                    var datePaginator=new MyDatePaginator('#rlob-datepaginator-choice',$scope.selectedFilter.var1,datePaginatorChanged);
                }

                $scope.selectAppointmentCalendar=function(appointmentCalendar)
                {
                    appointmentCalendar.RL_TYPE_ID=$scope.selectedFilter.rltypeSelected.RL_TYPE_ID;
                    appointmentCalendar.Specialties_id=$scope.selectedFilter.clnSpecialitySelected.Specialties_id;
                    $scope.selectedAppointmentCalendar=appointmentCalendar;

                }

            }
        }
    });




