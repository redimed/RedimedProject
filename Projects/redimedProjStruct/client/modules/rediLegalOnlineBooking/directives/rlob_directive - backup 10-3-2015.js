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
                        $('.date-picker').rlobdatepicker({
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
                /*
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

                 */

                $scope.panelAccordion = {
                    status1: true,
                    status2: true,
                    status3: true,
                    status4:true
                };
            }
        };
    })

    .directive('rlobBookingDetailPrint', function() {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
                selectedBooking:  '=',
                bookingType:'='
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_booking_detail_template_print.html',
            controller: function ($scope)
            {
                // phanquocchien.c1109g@gmail.com
                // google map print
                function codeAddress() {
                    var address1=$scope.selectedBooking.Site_addr;
                    GMaps.geocode({
                        address: address1,
                        callback: function (results, status) {
                            if (status == 'OK') {
                                latlng1 = results[0].geometry.location;
                                   // var map = new GMaps({
                                   //      div: '#chienMap',
                                   //      lat: latlng1.lat(),
                                   //      lng: latlng1.lng()
                                   //  });
                                   // map.addMarker({
                                   //    lat: latlng1.lat(),
                                   //    lng: latlng1.lng(),
                                   //    title: 'Lima',
                                   //    infoWindow: {
                                   //                    content: '<p>'+address1+'</p>'
                                   //                  }
                                   //  });
                                   var url = GMaps.staticMapURL({
                                      lat: latlng1.lat(),
                                      lng: latlng1.lng(),
                                      markers: [
                                        {lat: latlng1.lat(), lng: latlng1.lng()}
                                      ]
                                    });
                                    $("#imgMapPrint").attr('src', url);
                            }
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

                    if($scope.filesUpdateFlag!=undefined || $scope.filesUpdateFlag==null)
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

                $scope.$watch("selectedBooking.WRK_SURNAME", function(newValue, oldValue){
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
                filesUpdateFlag:'='
                //la so, de danh dau co file moi upload hay khong
                //set cung bien voi rlobFileDownload directive sẽ tu dong dong bo hoa giup upload vao download
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_download_file_template.html',
            controller: function ($scope,$http,rlobService)
            {

                $scope.letterType=rlobConstant.letterType;
                $scope.notificationType=rlobConstant.notificationType;
                $scope.rlob_add_notification=rlobService.add_notification;
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
                    //alert($scope.selectedBooking.Site_addr);
                    var mapUrl=null;
                    var siteAddress=null;
                    if($scope.selectedBooking && $scope.selectedBooking.Site_addr)
                    {
                        siteAddress=$scope.selectedBooking.Site_addr;
                        GMaps.geocode({
                            address: siteAddress,
                            callback: function (results, status) {
                                
                                if (status == 'OK') 
                                {
                                    latlng1 = results[0].geometry.location;
                                    mapUrl = GMaps.staticMapURL({
                                      lat: latlng1.lat(),
                                      lng: latlng1.lng(),
                                      markers: [
                                        {lat: latlng1.lat(), lng: latlng1.lng()}
                                      ]
                                    });
                                    handle(mapUrl);
                                }
                                else
                                {
                                    handle(mapUrl);
                                }
                            }
                        });
                    }
                    else
                    {
                        handle(mapUrl);
                    }

                    function handle(mapUrl)
                    {
                        $scope.showMsgDialog=function(styleClass,header,status,content)
                        {
                            $scope.msgHeader=header;
                            $scope.msgStatus=status;
                            $scope.msgContent=content;
                            $(styleClass).modal({show:true,backdrop:'static'});
                        };

                        $scope.showNotificationPopup=rlobService.showNotificationPopup;

                        $http({
                            method:"POST",
                            url:"/api/rlob/rl_booking_files/change-role-download",
                            data:{fileId:fileId,role:role,siteAddress:siteAddress,mapUrl:mapUrl}
                        })
                        .success(function(data) {
                            if(data.status=='success')
                            {
                                //$scope.showNotificationPopup(".rlob_download_file_notify_popup",'Changing success! Customer'+(role==1?' can ':' cannot ')+'download this file',rlobConstant.notifyJsColor.success);
                                if(role==1)
                                    $scope.rlob_add_notification(assId,refId,$scope.bookingType,$scope.letterType.result,$scope.notificationType.letter,'');
                                getFilesUpload();
                            }
                            else
                            {
                                //$scope.showNotificationPopup(".rlob_download_file_notify_popup",'Changing fail!',rlobConstant.notifyJsColor.danger);
                            }
                        })
                        .error(function (data) {
                            //$scope.showNotificationPopup(".rlob_download_file_notify_popup",'Changing fail!',rlobConstant.notifyJsColor.danger);
                        })
                        .finally(function() {

                        });
                    }
                    
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
            controller: function ($scope,$http,$stateParams,Mailto,$cookieStore,$window,rlobService,$timeout) {
                $scope.loginInfo = $cookieStore.get('userInfo');


                //Config Send mail template
                /***
                 * Config email template
                 * tannv.dts@gmail.com
                 */

                if($cookieStore.get('companyInfo'))
                {
                    $scope.companyInfo=$cookieStore.get('companyInfo');
                    $scope.mailTemplate={
                        REDiLEGAL:{
                            label:'Please contact us to make an appointment',
                            recepient : "medicolegal@redimed.com.au",
                            options:{
                                subject:($scope.companyInfo?$scope.companyInfo.Company_name:'')+' - Request Booking',
                                body:
                                    " I would like to make a booking for       \n"+
                                    " Claim Number:                            \n"+
                                    " Injured Workers's Name:                  \n"+
                                    " Contact Number:                          \n"+
                                    " Address:                                 \n"+
                                    " Date of Birth:                           \n"+
                                    " Date of Injury:                          \n"+
                                    " Description of Injury:                   \n"+
                                    " Location of Appointment:                 \n"+
                                    " Timeframe for Appointment:               \n\n"+
                                    " Please note that this booking is not confirmed in our system until approved by REDIMED."
                            }

                        },
                        Vaccination:{
                            label:'Please contact us to make an appointment',
                            recepient : '',
                            options:{
                                subject:($scope.companyInfo?$scope.companyInfo.Company_name:'')+' - Request Booking',
                                body:
                                    "Please booking for me..."
                            }

                        }
                    };

                    if($scope.bookingType=='REDiLEGAL')
                        $scope.mailtoLink = Mailto.url($scope.mailTemplate.REDiLEGAL.recepient, $scope.mailTemplate.REDiLEGAL.options);
                    else if($scope.bookingType=='Vaccination')
                        $scope.mailtoLink = Mailto.url($scope.mailTemplate.Vaccination.recepient, $scope.mailTemplate.Vaccination.options);

                    $scope.sendEmail=function()
                    {
                        $window.location.href = $scope.mailtoLink;
                    }
                }
                //-------------------------------------------------------------

                $scope.selectedFilter={
                    locationSelected:{},
                    rltypeSelected:{},
                    clnSpecialitySelected:{},
                    doctorSelected:{},
                    var1:{}
                }

                //Khoi tao data paginator
                if($scope.bookingType=='REDiLEGAL')
                {
                    $scope.selectedFilter.var1=moment().add(14,'day');
                }
                else
                {
                    $scope.selectedFilter.var1=moment();
                }


                var initPickers = function () {

                    //init date pickers
                    $('.date-picker').rlobdatepicker({
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
                $("#rlob-datepaginator-choice").on('changeMonth',function(){
                     $timeout(function() {
                        $scope.updateAppoinmentsList();
                    }, 200);
                })
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
                            $scope.getSpecialitiesFilter();
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

                    //$scope.getSpecialitiesFilter(rlTypeId);
                    //$scope.selectedFilter.clnSpecialitySelected={};
                    //$scope.getDoctorsFilter(null);
                    //$scope.selectedFilter.doctorSelected={};
                    $scope.updateAppoinmentsList();
                }

                //Get all doctor Specialtity
                $scope.getSpecialitiesFilter=function()
                {
                    $http({
                        method:"GET",
                        url:"/api/rlob/cln_specialties/list",
                        params:{sourceType:$scope.bookingType}
                    })
                        .success(function(data) {
                            if(data.status=='success')
                                $scope.specialitiesFilter=data.data;
                            //if vaccination
                            if($scope.bookingType=='Vaccination')
                            {
                                $scope.selectedFilter.clnSpecialitySelected=$scope.specialitiesFilter[0];
                                //$scope.getDoctorsFilter($scope.selectedFilter.clnSpecialitySelected.Specialties_id);
                                $scope.getDoctorsFilter();
                            }
                        })
                        .error(function (data) {
                            console.log("error");
                        })
                        .finally(function() {

                        });
                }
                $scope.getSpecialitiesFilter();

                $scope.specialitiesChange=function(specialtityId)
                {
                    //$scope.getDoctorsFilter(specialtityId);
                    //$scope.selectedFilter.doctorSelected={};
                    $scope.updateAppoinmentsList();
                }
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
                
                
                $scope.getListDateAppoinment = function(rlTypeId,specialityId,doctorId,locationId,var1){
                    //phanquocchien.c1109g@gmail.com
                    //set color rlobdatepicker
                    // 
                    var listItemDate = angular.element('.rlobdatepicker-days').find('table tbody tr td').not('.new').not('.old');
                    // console.log(listItemDate);
                    var getMonth = angular.element('.rlobdatepicker-days').find('table thead tr .rlobdatepicker-switch');
                    // console.log(angular.element(xxx).text());
                    for (var i = 0; i < listItemDate.length; i++) {
                        $scope.startItemDate = moment(angular.element(listItemDate[0]).text()+" "+angular.element(getMonth).text()).format("YYYY/MM/DD");
                        $scope.endItemDate = moment(angular.element(listItemDate[listItemDate.length -1]).text()+" "+angular.element(getMonth).text()).format("YYYY/MM/DD");
                    };
                    // console.log($scope.startItemDate);
                    // console.log($scope.endItemDate);
                    // console.log(itemDate);
                    rlobService.getListDateAppoinmentCalendar(rlTypeId,specialityId,doctorId,locationId,$scope.startItemDate,$scope.endItemDate,$scope.bookingType).then(function(data){
                        if(data.status=='success')
                        {
                            // console.log(data.data);
                            var itemDate = {};
                            // 
                            for(var i=0;i<data.data.length;i++)
                            {
                                itemDate[moment(data.data[i].APPOINTMENT_DATE).format("D")]=
                                    moment(data.data[i].APPOINTMENT_DATE).format("D");
                            }
                            // console.log(itemDate);
                            for(var i=0;i<listItemDate.length;i++)
                            {
                                if (angular.element(listItemDate[i]).hasClass('setColorDatePicker')) {
                                    angular.element(listItemDate[i]).removeClass('setColorDatePicker');
                                };
                                
                                if(itemDate[angular.element(listItemDate[i]).text()])
                                {
                                    if(!angular.element(listItemDate[i]).hasClass('today') && !angular.element(listItemDate[i]).hasClass('active')){
                                        angular.element(listItemDate[i]).addClass('setColorDatePicker');
                                    }                                                               
                                }
                            
                            }
                        }
                        else
                        {
                            alert('error get list date');
                        }
                    }) 
                    //
                    //phanquocchien.c1109g@gmail.com
                    //Get List date Appoiment Calendar 15 date < var1 < 15 date 
                    //
                    var startDate = angular.copy(var1).subtract('days' ,30).format("YYYY/MM/DD");
                    var endDate = angular.copy(var1).add('days',30).format("YYYY/MM/DD");   
                    rlobService.getListDateAppoinmentCalendar(rlTypeId,specialityId,doctorId,locationId,startDate,endDate,$scope.bookingType).then(function(data){
                        if(data.status=='success')
                        {
                            // console.log(data.data);
                            var listItem = angular.element('#rlob-datepaginator-choice').find('ul li a');
                            var listDate={};
                            // console.log(listItemDATE);
                            for(var i=0;i<data.data.length;i++)
                            {
                                listDate[moment(data.data[i].APPOINTMENT_DATE).format("DD-MM-YYYY")]=
                                    moment(data.data[i].APPOINTMENT_DATE).format("DD-MM-YYYY");
                            }
                            // exlog.alert(listDate);
                            for(var i=0;i<listItem.length;i++)
                            {
                                if (angular.element(listItem[i]).hasClass('setColorDatePicker')) {
                                    angular.element(listItem[i]).removeClass('setColorDatePicker');
                                };
                                if (listItem[i].getAttribute("data-moment") != null) {
                                    if(listDate[listItem[i].getAttribute("data-moment")])
                                    {
                                        if(!angular.element(listItem[i]).hasClass('dp-item dp-selected')){
                                            angular.element(listItem[i]).addClass('setColorDatePicker');
                                        } 
                                        $(".dp-selected").unbind();
                                        $(".dp-selected").click($scope.updateAppoinmentsList);                                                                
                                    }
                                }
                            }
                        }
                        else
                        {
                            // alert('error get list date');
                        }
                    })    
                }
                //Get Appoiment Calendar
                $scope.updateAppoinmentsList=function()
                {
                    // alert(">>>>>>>>");
                    var rlTypeId=$scope.selectedFilter.rltypeSelected && $scope.selectedFilter.rltypeSelected.RL_TYPE_ID?$scope.selectedFilter.rltypeSelected.RL_TYPE_ID:'%';
                    var specialityId= $scope.selectedFilter.clnSpecialitySelected && $scope.selectedFilter.clnSpecialitySelected.Specialties_id?$scope.selectedFilter.clnSpecialitySelected.Specialties_id:'%';
                    var doctorId=$scope.selectedFilter.doctorSelected  && $scope.selectedFilter.doctorSelected.doctor_id?$scope.selectedFilter.doctorSelected.doctor_id:'%';
                    var locationId=$scope.selectedFilter.locationSelected  && $scope.selectedFilter.locationSelected.id?$scope.selectedFilter.locationSelected.id:'%';
                    var fromTime=$scope.selectedFilter.var1.format("YYYY/MM/DD");
                    
                    $scope.getListDateAppoinment(rlTypeId,specialityId,doctorId,locationId,$scope.selectedFilter.var1);

                    $http({
                        method:"GET",
                        url:"/api/rlob/appointment-calendar/get-appointment-calendar" ,
                        params:{RL_TYPE_ID:rlTypeId,Specialties_id:specialityId,DOCTOR_ID:doctorId,SITE_ID:locationId,FROM_TIME:fromTime,sourceType:$scope.bookingType}
                    })
                        .success(function(data) {

                            var temp={TYPE_ITEMS:[]};

                            for(var i=0;i<data.length;i++)
                            {

                                if(!temp[data[i].RL_TYPE_ID])
                                {
                                    temp[data[i].RL_TYPE_ID]={SPEC_ITEMS:[]};
                                    temp.TYPE_ITEMS.push({
                                        RL_TYPE_ID:data[i].RL_TYPE_ID,
                                        Rl_TYPE_NAME:data[i].Rl_TYPE_NAME
                                    });
                                }


                                if(!temp[data[i].RL_TYPE_ID][data[i].Specialties_id])
                                {
                                    temp[data[i].RL_TYPE_ID][data[i].Specialties_id]={DOCTOR_ITEMS:[]};
                                    temp[data[i].RL_TYPE_ID].SPEC_ITEMS.push({
                                        Specialties_id:data[i].Specialties_id,
                                        Specialties_name:data[i].Specialties_name
                                    });
                                }



                                if(!temp[data[i].RL_TYPE_ID][data[i].Specialties_id][data[i].DOCTOR_ID])
                                {
                                    temp[data[i].RL_TYPE_ID][data[i].Specialties_id][data[i].DOCTOR_ID]={LOCATION_ITEMS:[]};
                                    temp[data[i].RL_TYPE_ID][data[i].Specialties_id].DOCTOR_ITEMS.push({
                                        DOCTOR_ID:data[i].DOCTOR_ID,
                                        DOCTOR_NAME:data[i].NAME
                                    });
                                }

                                if(!temp[data[i].RL_TYPE_ID][data[i].Specialties_id][data[i].DOCTOR_ID][data[i].SITE_ID])
                                {
                                    temp[data[i].RL_TYPE_ID][data[i].Specialties_id][data[i].DOCTOR_ID][data[i].SITE_ID]={APPOINTMENT_ITEMS:[]};
                                    temp[data[i].RL_TYPE_ID][data[i].Specialties_id][data[i].DOCTOR_ID].LOCATION_ITEMS.push({
                                        SITE_ID: data[i].SITE_ID,
                                        SITE_NAME:data[i].Site_name
                                    });

                                }


                                if(!temp[data[i].RL_TYPE_ID][data[i].Specialties_id][data[i].DOCTOR_ID][data[i].SITE_ID][data[i].CAL_ID])
                                {
                                    temp[data[i].RL_TYPE_ID][data[i].Specialties_id][data[i].DOCTOR_ID][data[i].SITE_ID][data[i].CAL_ID]={};
                                    temp[data[i].RL_TYPE_ID][data[i].Specialties_id][data[i].DOCTOR_ID][data[i].SITE_ID].APPOINTMENT_ITEMS.push({
                                        CAL_ID:data[i].CAL_ID,
                                        APPOINTMENT_TIME:data[i].appointment_time,
                                        FROM_TIME:data[i].FROM_TIME,
                                        DOCTOR_ID:data[i].DOCTOR_ID,
                                        SITE_ID:data[i].SITE_ID
                                    });
                                }

                            }
                            var arr=[];
                            for (var i=0;i<temp.TYPE_ITEMS.length;i++)
                            {
                                var type_item=temp.TYPE_ITEMS[i];
                                type_item.SPEC_ITEMS=[];
                                for(var j=0;j<temp[type_item.RL_TYPE_ID].SPEC_ITEMS.length;j++)
                                {
                                    var spec_item=temp[type_item.RL_TYPE_ID].SPEC_ITEMS[j];
                                    spec_item.DOCTOR_ITEMS=[];
                                    type_item.SPEC_ITEMS.push(spec_item);

                                    for(var q=0;q<temp[type_item.RL_TYPE_ID][spec_item.Specialties_id].DOCTOR_ITEMS.length;q++)
                                    {
                                        var doctor_item=temp[type_item.RL_TYPE_ID][spec_item.Specialties_id].DOCTOR_ITEMS[q];
                                        doctor_item.LOCATION_ITEMS=[];
                                        spec_item.DOCTOR_ITEMS.push(doctor_item);

                                        for(var k=0;k<temp[type_item.RL_TYPE_ID][spec_item.Specialties_id][doctor_item.DOCTOR_ID].LOCATION_ITEMS.length;k++)
                                        {
                                            var location_item=temp[type_item.RL_TYPE_ID][spec_item.Specialties_id][doctor_item.DOCTOR_ID].LOCATION_ITEMS[k];
                                            location_item.APPOINTMENT_ITEMS=[];
                                            doctor_item.LOCATION_ITEMS.push(location_item);

                                            for(var l=0;l<temp[type_item.RL_TYPE_ID][spec_item.Specialties_id][doctor_item.DOCTOR_ID][location_item.SITE_ID].APPOINTMENT_ITEMS.length;l++)
                                            {
                                                var appointment_item=temp[type_item.RL_TYPE_ID][spec_item.Specialties_id][doctor_item.DOCTOR_ID][location_item.SITE_ID].APPOINTMENT_ITEMS[l];
                                                location_item.APPOINTMENT_ITEMS.push(appointment_item);
                                            }
                                        }
                                    }
                                }    
                                arr.push(type_item);
                            }
                            $scope.appointmentsFilter=arr
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
                        $('.date-picker').rlobdatepicker({
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
                $scope.updateAppoinmentsList();
                $scope.selectAppointmentCalendar=function(appointmentCalendar,RL_TYPE_ID,Specialties_id)
                {
//                    appointmentCalendar.RL_TYPE_ID=$scope.selectedFilter.rltypeSelected.RL_TYPE_ID;
                    appointmentCalendar.RL_TYPE_ID=RL_TYPE_ID;
                    //appointmentCalendar.Specialties_id=$scope.selectedFilter.clnSpecialitySelected.Specialties_id;
                    appointmentCalendar.Specialties_id=Specialties_id;
                    $scope.selectedAppointmentCalendar=appointmentCalendar;

                }

            }
        }
    })
    
    /***
 * booking repost
 * phanquocchien.c1109g@mail.com
 */
.directive('rlobBookingReport',function(){
        return {
            restrict: 'E',
            transclude:true,
            scope: {
                list: '=',
                listStatus:'='
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_booking_report_template.html'
        };
    })

    .directive('rlobAdminLocalNotification', function(rlobService) {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
                listBookingNotification:  '=',
                bookingType:'='
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_admin_local_notification_template.html',
            controller: function ($scope)
            {
                $scope.setSlimCroll=function(selector)
                {
                    $(selector).slimscroll({});
                };

                $scope.$watch('listBookingNotification',function(oldValue,newValue){
                    $scope.setSlimCroll('.rlob-admin-local-notification-list');
                    if($scope.selectedBooking)
                        $scope.selectedBooking=undefined;
                });

                $scope.setSelectedBooking=function(bookingId)
                {
                    rlobService.getBookingById(bookingId)
                        .then(function(data){
                            if(data.status=='success')
                            {
                                $scope.selectedBooking=data.data;
                            }
                        },function(error){

                        });
                }

                $scope.isAdminGetFiles=true;
                $scope.isAdminUpload=true;
                $scope.accordionStatus={
                    status1:true
                }
            }
        };
    })

    .directive('rlobChangeBookingStatus', function(rlobService) {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
                selectedBooking:'=',
                bookingStatusChangedFlag:'='
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_booking_change_status_template.html',
            controller: function ($scope)
            {
                //$scope.bookingStatusChangedFlag =0;
                $scope.rlob_change_status=function(assId,bookingId,bookingType,status)
                {
                    rlobService.changeBookingStatus(bookingId,status)
                        .then(function(data){
                            if(data.status=='success')
                            {
                                $scope.selectedBooking.STATUS=status;
                                if(!$scope.bookingStatusChangedFlag)
                                    $scope.bookingStatusChangedFlag=0;
                                $scope.bookingStatusChangedFlag = $scope.bookingStatusChangedFlag +1;
                                var refId=bookingId;
                                rlobService.add_notification(assId,refId,bookingType,rlobConstant.bellType.changeStatus,rlobConstant.notificationType.bell,status);
                            }
                            else
                            {

                            }
                        });

                };

            }
        };
    })

    .directive('rlobChoosePeriod', function(rlobService) {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
                fromDate:'=',//Return string: YYYY/MM/DD
                toDate:'='//Return string: YYYY/MM/DD
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_choose_period.html',
            controller: function ($scope)
            {
                /**
                 * angular bootstrap datepicker handle
                 */
                // Disable weekend selection

                $scope.disabled = function(date, mode) {
                    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
                };
                $scope.toggleMin = function() {
                    $scope.minDate = $scope.minDate ? null : new Date();
                };
                $scope.toggleMin();

                $scope.open1  = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.opened1 = true;
                };
                $scope.open2 = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.opened2 = true;
                };

                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };

                //    $scope.initDate = new Date('1980-1-1');
                $scope.formats = ['d/M/yyyy','dd/MM/yyyy','dd/MMMM/yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                $scope.format = $scope.formats[0];

                //--------------------------------------------------------------------------------------

                $scope.showDialogChoose=function(){
                    if($scope.fromDate && $scope.toDate)
                    {
                        $scope.FROM_DATE_TEMP=moment($scope.fromDate,'YYYY/MM/DD').format("DD/MM/YYYY");
                        $scope.TO_DATE_TEMP=moment($scope.toDate,'YYYY/MM/DD').format("DD/MM/YYYY");
                    }
                    $("#choose-period-dialog").modal({show:true,backdrop:'static'});
                }

                $scope.$watch('[FROM_DATE_TEMP,TO_DATE_TEMP]',function(newValue,oldValue){
                    if($scope.FROM_DATE_TEMP && $scope.TO_DATE_TEMP)
                    {
                        if($scope.FROM_DATE_TEMP>$scope.TO_DATE_TEMP)
                        {
                            $scope.localError=true;
                            $scope.hadForcused=true;
                        }
                        else
                        {
                            $scope.localError=false;
                        }
                    }
                },true);

                $scope.FROM_DATE_TEMP='';
                $scope.TO_DATE_TEMP='';

                $scope.localError=false;
                $scope.periodDisplay='ALL';
                $scope.getPeriod=function()
                {
                    $scope.hadForcused=true;
                    if($scope.choosePeriodForm.$invalid)
                    {
                        return;
                    }

                    if($scope.FROM_DATE_TEMP!=null && $scope.TO_DATE_TEMP!=null)
                    {
                        if($scope.FROM_DATE_TEMP>$scope.TO_DATE_TEMP)
                        {
                            $scope.localError=true;
                            return;
                        }
                        else
                        {
                            $scope.localError=false;
                            $scope.fromDate=moment($scope.FROM_DATE_TEMP).format("YYYY/MM/DD");
                            $scope.toDate=moment($scope.TO_DATE_TEMP).format("YYYY/MM/DD");
                            $scope.periodDisplay=moment($scope.FROM_DATE_TEMP).format("DD/MM/YY")+"-"+moment($scope.TO_DATE_TEMP).format("DD/MM/YY");
                            $("#choose-period-dialog").modal('hide');
                        }
                    }
                }
                $scope.resetDate=function()
                {
                    $scope.FROM_DATE_TEMP='';
                    $scope.TO_DATE_TEMP='';
                    $scope.fromDate='';
                    $scope.toDate='';
                    $scope.localError=false;
                    $scope.hadForcused=false;
                    $scope.periodDisplay='ALL';
                }
                $scope.reset=function()
                {
                    $scope.resetDate();
                    $("#choose-period-dialog").modal('hide');
                }
            }
        };
    })
    //chien change document status
    //phanquocchien.c1109g@gmail.com
    .directive('rlobChangeDocumentStatus', function(rlobService) {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
                selectedDocument:'=',
                documentStatusChangedFlag:'='
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_document_change_status_template.html',
            controller: function ($scope)
            {
                //$scope.documentStatusChangedFlag=0;
                $scope.documentStatus=rlobConstant.documentStatus;
                $scope.rlob_document_change_status=function(bookingId,status)
                {
                    rlobService.changeDocumentStatus(bookingId,status)
                        .then(function(data){
                            if(data.status=='success')
                            {
                                $scope.selectedDocument.DOCUMENT_STATUS=status;
                                if(!$scope.documentStatusChangedFlag)
                                    $scope.documentStatusChangedFlag=0;
                                $scope.documentStatusChangedFlag=$scope.documentStatusChangedFlag+1;
                                //var refId=bookingId;
                                //rlobService.add_notification(assId,refId,bookingType,rlobConstant.bellType.changeStatus,rlobConstant.notificationType.bell,status);
                            }
                            else
                            {

                            }
                        });

                };

            }
        };
    })

    .directive('rlobInlineMessage', function(rlobService) {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
                message:'@',
                type:'='
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_fade_in_out_template.html',
            controller: function ($scope)
            {
                angular.element(".rlob_fade_in_out").fadeIn(2000);

            }
        };
    })

    .directive('showErrors', function ($timeout, showErrorsConfig) {
      var getShowSuccess, linkFn;
      getShowSuccess = function (options) {
        var showSuccess;
        showSuccess = showErrorsConfig.showSuccess;
        if (options && options.showSuccess != null) {
          showSuccess = options.showSuccess;
        }
        return showSuccess;
      };
      linkFn = function (scope, el, attrs, formCtrl) {
        var blurred, inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses;
        blurred = false;
        options = scope.$eval(attrs.showErrors);
        showSuccess = getShowSuccess(options);
        inputEl = el[0].querySelector('[name]');
        inputNgEl = angular.element(inputEl);
        inputName = inputNgEl.attr('name');
        if (!inputName) {
          throw 'show-errors element has no child input elements with a \'name\' attribute';
        }
        inputNgEl.bind('blur', function () {
          blurred = true;
          return toggleClasses(formCtrl[inputName].$invalid);
        });
        scope.$watch(function () {
          return formCtrl[inputName] && formCtrl[inputName].$invalid;
        }, function (invalid) {
          if (!blurred) {
            return;
          }
          return toggleClasses(invalid);
        });
        scope.$on('show-errors-check-validity', function () {
          return toggleClasses(formCtrl[inputName].$invalid);
        });
        scope.$on('show-errors-reset', function () {
          return $timeout(function () {
            el.removeClass('has-error');
            el.removeClass('has-success');
            return blurred = false;
          }, 0, false);
        });
        return toggleClasses = function (invalid) {
          el.toggleClass('has-error', invalid);
          if (showSuccess) {
            return el.toggleClass('has-success', !invalid);
          }
        };
      };
      return {
        restrict: 'A',
        require: '^form',
        compile: function (elem, attrs) {
          if (!elem.hasClass('form-group')) {
            throw 'show-errors element does not have the \'form-group\' class';
          }
          return linkFn;
        }
      };
    })
    .provider('showErrorsConfig', function () {
        var _showSuccess;
        _showSuccess = false;
        this.showSuccess = function (showSuccess) {
          return _showSuccess = showSuccess;
        };
        this.$get = function () {
          return { showSuccess: _showSuccess };
        };
    })
