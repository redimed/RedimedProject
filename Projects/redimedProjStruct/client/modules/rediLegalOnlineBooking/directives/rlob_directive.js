/**
 * Created by tannv.dts@gmail.com on 9/29/2014.
 */

angular.module("app.loggedIn.rlob.directive", ['app.calendar.mobile.controller'])
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
                  //get date now
                $scope.dateValue = new Date();
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
                                    url=url.replace("http://", "https://");
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
            controller: function ($scope,$http,$cookieStore, FileUploader,rlobService)
            {
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
                    if($scope.filesUpdateFlag!=undefined)
                    {
                        $scope.filesUpdateFlag=$scope.filesUpdateFlag+1;
                    }
                    else
                    {
                        $scope.filesUpdateFlag=1;
                    }
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
                filesUpdateFlag:'=',
                numberOfDocs:'=',
                dialogStyleClass:'@'
                //la so, de danh dau co file moi upload hay khong
                //set cung bien voi rlobFileDownload directive sẽ tu dong dong bo hoa giup upload vao download
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_download_file_template.html',
            controller: function ($scope,$http,rlobService)
            {
                if($scope.numberOfDocs===undefined)
                {
                    $scope.numberOfDocs=0;
                }
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
                            $scope.numberOfDocs=data.data.length;
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


                $scope.showDialogSetResult=function()
                {
                    $scope.filesClone=angular.copy($scope.files);
                    $("."+$scope.dialogStyleClass).modal({show:true,backdrop:'static'});
                }

                /**
                 * Ham set mot chuoi cac file la result sau do gui mail thong bao den khach hang
                 * tannv.dts@gmail.com
                 */
                $scope.setListResultFiles=function()
                {
                    var listResult=[];
                    for(var i=0;i<$scope.filesClone.length;i++)
                    {
                        var item=$scope.filesClone[i];
                        if(item.isClientDownLoad==1)
                        {
                            listResult.push(item);
                        }
                    }

                    if(listResult.length>0)
                    {
                        // rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.success,"send file result success");
                        rlobService.rlobBookingFile.setListResultFiles(listResult)
                        .then(function(data){
                            if(data.status=='success')
                            {
                                rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.success,"send file result success");
                                $scope.rlob_add_notification(listResult[0].ASS_ID,listResult[0].BOOKING_ID,$scope.bookingType,$scope.letterType.result,$scope.notificationType.letter,'');
                                getFilesUpload();
                            }
                            else
                            {
                                rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Set list result files fail.");
                            }
                        },function(err){
                            rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Set list result files fail.");
                        })
                        .then(function(){
                            $("."+$scope.dialogStyleClass).modal('hide');
                        })
                    }
                    else
                    {
                        rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"No files chosen.");
                    }
                },

                $scope.unselectAllFileResult=function()
                {
                    rlobService.rlobBookingFile.unselectAllFileResult($scope.selectedBooking.BOOKING_ID)
                    .then(function(data){
                        if(data.status=='success')
                        {
                            rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.success,"Unselect all result files success.");
                            getFilesUpload();
                        }
                        else
                        {
                            rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Unselect all result files fail.");
                        }
                    },function(err){
                        rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Unselect all result files fail.");
                    })
                    .then(function(){
                        $("."+$scope.dialogStyleClass).modal('hide');
                    })
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
            controller: function ($scope,$http,$stateParams,Mailto,$cookieStore,$window,rlobService,$timeout,bookingService) {
                //Lay thong tin user login
                $scope.loginInfo = $cookieStore.get('userInfo');


                /***
                 * updateMailtoLink: update email template, customer will send to redilegal to booking appointment                 
                 */
                $scope.updateMailtoLink=function()
                {
          
                    console.log($cookieStore.get('companyInfo'));
                    var Company_name='[Name of Company]'
                    if($cookieStore.get('companyInfo'))
                    {
                        $scope.companyInfo=$cookieStore.get('companyInfo');
                        Company_name=$scope.companyInfo.Company_name;
                    }
                    
                    $scope.mailTemplate={
                        REDiLEGAL:{
                            label:'Please contact us to make an appointment',
                            recepient : "medicolegal@redimed.com.au",
                            options:{
                                subject:Company_name+' - Request Booking',
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
                                subject:Company_name+' - Request Booking',
                                body:
                                    "Please booking for me..."
                            }

                        }
                    };

                    if($scope.bookingType=='REDiLEGAL')
                    {
                        //create email template link (run outlook..  when click)
                        $scope.mailtoLink = Mailto.url($scope.mailTemplate.REDiLEGAL.recepient, $scope.mailTemplate.REDiLEGAL.options);
                    
                    }
                    else if($scope.bookingType=='Vaccination')
                    {
                        //create email template link (run outlook..  when click)
                        $scope.mailtoLink = Mailto.url($scope.mailTemplate.Vaccination.recepient, $scope.mailTemplate.Vaccination.options);
                    
                    }

                    $scope.sendEmail=function()
                    {
                        $window.location.href = $scope.mailtoLink;
                    }
                }
                $scope.updateMailtoLink();
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
                    // $scope.selectedFilter.var1=moment().add(60,'day');
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

                $scope.specialitiesChange=function()
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
                
                
                $scope.getListDateAppoinment = function(rlTypeId,specialtyName,doctorId,locationId,var1){
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
                    rlobService.getListDateAppoinmentCalendar(rlTypeId,specialtyName,doctorId,locationId,$scope.startItemDate,$scope.endItemDate,$scope.bookingType).then(function(data){
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
                    rlobService.getListDateAppoinmentCalendar(rlTypeId,specialtyName,doctorId,locationId,startDate,endDate,$scope.bookingType).then(function(data){
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

                /**
                 * updateAppoinmentsList:   get appoiwntments list which have been filterd by: location, rlType, Specialty,
                 *                          doctor and date
                 * 
                 */
                $scope.updateAppoinmentsList=function()
                {
                    
                    var rlTypeId=$scope.selectedFilter.rltypeSelected && $scope.selectedFilter.rltypeSelected.RL_TYPE_ID?$scope.selectedFilter.rltypeSelected.RL_TYPE_ID:'%';
                    var specialtyName= $scope.selectedFilter.clnSpecialitySelected && $scope.selectedFilter.clnSpecialitySelected.Specialties_name?$scope.selectedFilter.clnSpecialitySelected.Specialties_name:'%';
                    var doctorId=$scope.selectedFilter.doctorSelected  && $scope.selectedFilter.doctorSelected.doctor_id?$scope.selectedFilter.doctorSelected.doctor_id:'%';
                    var locationId=$scope.selectedFilter.locationSelected  && $scope.selectedFilter.locationSelected.id?$scope.selectedFilter.locationSelected.id:'%';
                    var fromTime=$scope.selectedFilter.var1.format("YYYY/MM/DD");
                    
                    $scope.getListDateAppoinment(rlTypeId,specialtyName,doctorId,locationId,$scope.selectedFilter.var1);

                    //api taken appointments list in filter
                    $http({
                        method:"GET",
                        url:"/api/rlob/appointment-calendar/get-appointment-calendar" ,
                        params:{RL_TYPE_ID:rlTypeId,Specialties_name:specialtyName,DOCTOR_ID:doctorId,SITE_ID:locationId,FROM_TIME:fromTime,sourceType:$scope.bookingType}
                    })
                    .success(function(data) {

                        var temp={TYPE_ITEMS:[]};

                        for(var i=0;i<data.length;i++)
                        {
                            //preprocessing: group appointments list by rlType
                            if(!temp[data[i].RL_TYPE_ID])
                            {
                                temp[data[i].RL_TYPE_ID]={DOCTOR_ITEMS:[]};
                                temp.TYPE_ITEMS.push({
                                    RL_TYPE_ID:data[i].RL_TYPE_ID,
                                    Rl_TYPE_NAME:data[i].Rl_TYPE_NAME
                                });
                            }

                            //preprocessing: group appointments list by doctor
                            if(!temp[data[i].RL_TYPE_ID][data[i].DOCTOR_ID])
                            {
                                temp[data[i].RL_TYPE_ID][data[i].DOCTOR_ID]={LOCATION_ITEMS:[]};
                                temp[data[i].RL_TYPE_ID].DOCTOR_ITEMS.push({
                                    DOCTOR_ID:data[i].DOCTOR_ID,
                                    DOCTOR_NAME:data[i].NAME
                                });
                            }

                            //preprocessing: group appointments list by location
                            if(!temp[data[i].RL_TYPE_ID][data[i].DOCTOR_ID][data[i].SITE_ID])
                            {
                                temp[data[i].RL_TYPE_ID][data[i].DOCTOR_ID][data[i].SITE_ID]={APPOINTMENT_ITEMS:[]};
                                temp[data[i].RL_TYPE_ID][data[i].DOCTOR_ID].LOCATION_ITEMS.push({
                                    SITE_ID: data[i].SITE_ID,
                                    SITE_NAME:data[i].Site_name
                                });
                            }

                            //preprocessing: group appointments list by calendarId
                            if(!temp[data[i].RL_TYPE_ID][data[i].DOCTOR_ID][data[i].SITE_ID][data[i].CAL_ID])
                            {
                                temp[data[i].RL_TYPE_ID][data[i].DOCTOR_ID][data[i].SITE_ID][data[i].CAL_ID]={SPEC_ITEMS:[]};
                                temp[data[i].RL_TYPE_ID][data[i].DOCTOR_ID][data[i].SITE_ID].APPOINTMENT_ITEMS.push({
                                    CAL_ID:data[i].CAL_ID,
                                    APPOINTMENT_TIME:data[i].appointment_time,
                                    FROM_TIME:data[i].FROM_TIME,
                                    TO_TIME:data[i].TO_TIME,
                                    DOCTOR_ID:data[i].DOCTOR_ID,
                                    SITE_ID:data[i].SITE_ID
                                });
                            }

                            //preprocessing: group appointments calendar by doctor specialty
                            if(!temp[data[i].RL_TYPE_ID][data[i].DOCTOR_ID][data[i].SITE_ID][data[i].CAL_ID][data[i].Specialties_id])
                            {
                                temp[data[i].RL_TYPE_ID][data[i].DOCTOR_ID][data[i].SITE_ID][data[i].CAL_ID][data[i].Specialties_id]={};
                                temp[data[i].RL_TYPE_ID][data[i].DOCTOR_ID][data[i].SITE_ID][data[i].CAL_ID].SPEC_ITEMS.push({
                                    Specialties_id:data[i].Specialties_id,
                                    Specialties_name:data[i].Specialties_name
                                });
                            }

                        }
                        var arr=[];
                        //get rlType list
                        for (var i=0;i<temp.TYPE_ITEMS.length;i++)
                        {
                            var type_item=temp.TYPE_ITEMS[i];
                            type_item.DOCTOR_ITEMS=[];
                            //get doctor list for rlType Item
                            for(var j=0;j<temp[type_item.RL_TYPE_ID].DOCTOR_ITEMS.length;j++)
                            {
                                var doctor_item=temp[type_item.RL_TYPE_ID].DOCTOR_ITEMS[j];
                                doctor_item.SPECS={};
                                doctor_item.SPECS_STR="";
                                doctor_item.LOCATION_ITEMS=[];
                                type_item.DOCTOR_ITEMS.push(doctor_item);
                                //get location list for doctor item
                                for(var q=0;q<temp[type_item.RL_TYPE_ID][doctor_item.DOCTOR_ID].LOCATION_ITEMS.length;q++)
                                {
                                    var location_item=temp[type_item.RL_TYPE_ID][doctor_item.DOCTOR_ID].LOCATION_ITEMS[q];
                                    location_item.APPOINTMENT_ITEMS=[];
                                    doctor_item.LOCATION_ITEMS.push(location_item);
                                    //get appointment list for location item
                                    for(var k=0;k<temp[type_item.RL_TYPE_ID][doctor_item.DOCTOR_ID][location_item.SITE_ID].APPOINTMENT_ITEMS.length;k++)
                                    {
                                        var appointment_item=temp[type_item.RL_TYPE_ID][doctor_item.DOCTOR_ID][location_item.SITE_ID].APPOINTMENT_ITEMS[k];
                                        appointment_item.SPEC_ITEMS=[];
                                        location_item.APPOINTMENT_ITEMS.push(appointment_item);
                                        //get specialty list for appointment item
                                        for(var l=0;l<temp[type_item.RL_TYPE_ID][doctor_item.DOCTOR_ID][location_item.SITE_ID][appointment_item.CAL_ID].SPEC_ITEMS.length;l++)
                                        {
                                            var spec_item=temp[type_item.RL_TYPE_ID][doctor_item.DOCTOR_ID][location_item.SITE_ID][appointment_item.CAL_ID].SPEC_ITEMS[l];
                                            if(!doctor_item.SPECS[spec_item.Specialties_name])
                                            {
                                                doctor_item.SPECS[spec_item.Specialties_name]=spec_item.Specialties_name;
                                                doctor_item.SPECS_STR=doctor_item.SPECS_STR+spec_item.Specialties_name+'; ';
                                            }                                          
                                            appointment_item.SPEC_ITEMS.push(spec_item);
                                        }
                                    }
                                }
                            }                            
                            arr.push(type_item);
                        }
                        //export appointment group view
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
                    
//                  appointmentCalendar.RL_TYPE_ID=$scope.selectedFilter.rltypeSelected.RL_TYPE_ID;
                    appointmentCalendar.RL_TYPE_ID=RL_TYPE_ID;
                    //appointmentCalendar.Specialties_id=$scope.selectedFilter.clnSpecialitySelected.Specialties_id;
                    appointmentCalendar.Specialties_id=Specialties_id;
                    $scope.selectedAppointmentCalendar=appointmentCalendar;

                }

            }
        }
    })
/**
 * phan quoc chien
 * phanquocchien.c1109g@gmail.com
 * choose caledar mobile
 */
    .directive('rlobChooseAppointmentMobileCalendar', function() {
        return {
            restrict: 'E',
            transclude: true,
            required: ['^ngModel'],
            scope: {
                bookingType:'=',
                selectedAppointmentCalendar:'='
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_choose_appointment_calendar_mobile_template.html',
            controller: "rlobCalendarMobileMasterController"
        }
    })
        
    .directive('rlobChooseAppointmentMobileCalendarPatient', function() {
        return {
            restrict: 'E',
            // transclude: true,
            required: ['^ngModel'],
            scope: {
                bookingType:'=',
                selectedAppointmentCalendar:'=',
                patientInfoCalendar:'='
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_choose_appointment_calendar_mobile_patient_template.html',
            controller: "rlobCalendarMobileMasterController"
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
                actionCenter:'=',//[groupname]runWhenChanged();
                groupName:'@'
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_admin_local_notification_template.html',
            controller: function ($scope,rlobService,$cookieStore,$window,Mailto,$q)
            {
                $scope.listBookingNotification=[];
                $scope.bookingType=rlobConstant.bookingType.REDiLEGAL.name;
                $scope.localNotificationType={
                    type1:{
                        header:'Need To Change Status',
                        alias:'passBookingNotChangeStatus'
                    },
                    type2:{
                        header:'Waiting On Paperwork',
                        alias:'upcommingBookingHaveNotDucment'
                    },
                    type3:{
                        header:'Outstanding',
                        alias:'passBookingHaveNotResult'
                    }

                }

                $scope.documentStatusDisplay=rlobConstant.documentStatusDisplay;

                /***
                 * Danh sach cac booking da qua chua doi status
                 * tannv.dts@gmail.com
                 */
                $scope.listPassBookingNotChangeStatus=[];
                $scope.getPassBookingNotChangeStatus=function(doctorId)
                {
                    rlobService.getPassBookingNotChangeStatus($scope.bookingType,doctorId)
                        .then(function(data){
                            if(data.status=='success')
                            {
                                $scope.listPassBookingNotChangeStatus=data.data;
                            }
                        },
                        function(error)
                        {

                        });
                }
                $scope.updatePassBookingNotChangeStatus=function(doctorId)
                {
                    rlobService.getPassBookingNotChangeStatus($scope.bookingType,doctorId)
                        .then(function(data){
                            if(data.status=='success')
                            {
                                $scope.listPassBookingNotChangeStatus=data.data;
                                $scope.listBookingNotification=$scope.listPassBookingNotChangeStatus;
                            }
                        },
                        function(error)
                        {

                        });
                }


                /***
                 * Danh sach cac booking sap toi va client chua upload document
                 * tannv.dts@gmail.com
                 */
                $scope.listUpcommingBookingWaitingPaperwork=[];
                $scope.getListUpcommingBookingWaitingPaperwork=function(doctorId)
                {
                    rlobService.getListUpcommingBookingWaitingPaperwork($scope.bookingType,doctorId)
                    .then(function(data){
                        console.log(data);
                        if(data.status=='success')
                        {

                            $scope.listUpcommingBookingWaitingPaperwork=data.data;
                        }
                    },
                    function(error)
                    {

                    });
                }
                $scope.updateListUpcommingBookingWaitingPaperwork=function(doctorId)
                {
                    rlobService.getListUpcommingBookingWaitingPaperwork($scope.bookingType,doctorId)
                    .then(function(data){
                        console.log(data);
                        if(data.status=='success')
                        {
                            $scope.listUpcommingBookingWaitingPaperwork=data.data;
                            $scope.listBookingNotification=$scope.listUpcommingBookingWaitingPaperwork;
                        }
                    },
                    function(error)
                    {

                    });
                }

                /***
                 * Danh sach cac booking da complete nhung chua co result
                 * tannv.dts@gmail.com
                 */
                $scope.listBookingOutstandingNotification=[];
                $scope.getListBookingOutstandingNotification=function(doctorId)
                {
                    rlobService.getListBookingOutstandingNotification($scope.bookingType,doctorId)
                    .then(function(data){
                        if(data.status=='success')
                        {
                            $scope.listBookingOutstandingNotification=data.data;
                        }
                    },
                    function(error)
                    {

                    });
                }
                $scope.updateListBookingOutstandingNotification=function(doctorId)
                {
                    rlobService.getListBookingOutstandingNotification($scope.bookingType,doctorId)
                    .then(function(data){
                        if(data.status=='success')
                        {
                            $scope.listBookingOutstandingNotification=data.data;
                            $scope.listBookingNotification=$scope.listBookingOutstandingNotification;
                        }
                    },
                    function(error)
                    {

                    });
                }

                /**
                 * Xu ly show list booking notificaion (local of admin)
                 * tannv.dts@gmail.com
                 */
                $scope.currentNotificationType=null;
                $scope.showListBookingNotification=function(notificationType)
                {
                    $scope.currentNotificationType=notificationType;
                    switch(notificationType)
                    {
                        case $scope.localNotificationType.type1.alias:
                            $scope.listBookingNotification=$scope.listPassBookingNotChangeStatus;
                            $scope.listBookingNotificationHeader=$scope.localNotificationType.type1.header;
                            break;
                        case $scope.localNotificationType.type2.alias:
                            $scope.listBookingNotification=$scope.listUpcommingBookingWaitingPaperwork;
                            $scope.listBookingNotificationHeader=$scope.localNotificationType.type2.header;
                            break;
                        case $scope.localNotificationType.type3.alias:
                            $scope.listBookingNotification=$scope.listBookingOutstandingNotification;
                            $scope.listBookingNotificationHeader=$scope.localNotificationType.type3.header;
                            break;
                    }
                    $("#list_booking_admin_local_notification").modal({show:true,backdrop:'static'});
                }
                $scope.documentStatusChangedFlag=0;
                $scope.$watch("documentStatusChangedFlag",function(newValue,oldValue){
                    if($scope.documentStatusChangedFlag)
                    {
                        $scope.updateListUpcommingBookingWaitingPaperwork();
                    }
                });

                /**
                 * Khi tat danh sach xem cac booking local notification thi chay lai tree booking
                 * muc dich de dong nhat data
                 * tannv.dts@gmail.com
                 */
                $('#list_booking_admin_local_notification').on('hidden.bs.modal', function (e) {
                    //$scope.filterBooking();
                    $scope.actionCenter[$scope.groupName].runWhenChanged();
                });

                /***
                 * Cap nhat cac local admin notification
                 * tannv.dts@gmail.com
                 */
                $scope.updateAdminLocalNotification=function()
                {
                    var doctorId=$scope.doctorInfo?$scope.doctorInfo.doctor_id:null;
                    $scope.getPassBookingNotChangeStatus(doctorId);
                    $scope.getListUpcommingBookingWaitingPaperwork(doctorId);
                    $scope.getListBookingOutstandingNotification(doctorId);
                }

                //Khoi tao gia tri ban dau
                //tannv.dts@gmail.com
                $scope.userInfo=$cookieStore.get('userInfo');
                $scope.doctorInfo=null;
                $scope.getDoctorInfoByUserId=function()
                {
                    var deferred=$q.defer();
                    rlobService.getDoctorInfoByUserId($scope.userInfo.id)
                    .then(function(data){
                        if(data.status=='success')
                        {
                            $scope.doctorInfo=data.data;
                        }
                    },function(err){
                        console.log("Khong the lay thong tin doctor");
                    })
                    .then(function(){
                        deferred.resolve();
                    });
                    return deferred.promise;
                }

                if($scope.userInfo.user_type==rlobConstant.userType.doctor)
                {
                    $scope.getDoctorInfoByUserId()
                        .then($scope.updateAdminLocalNotification)
                }
                else
                {
                    $scope.updateAdminLocalNotification();
                }

                //$scope.updateAdminLocalNotification();
                /**
                 * Thêm function cap nhat admin local notification vao schedule
                 * tannv.dts@gmail.com
                 */
                $scope.actionCenter.scheduleList.rlobUpdateAdminLocalNotification=$scope.updateAdminLocalNotification;

                //Ket thuc admin local notification
                //---------------------------------------------------------------------------------------
                //---------------------------------------------------------------------------------------
                //---------------------------------------------------------------------------------------
                //---------------------------------------------------------------------------------------
                //---------------------------------------------------------------------------------------
                
                $scope.setSlimCroll=function(selector)
                {
                    $(selector).slimscroll({});
                };

                $scope.$watch('listBookingNotification',function(oldValue,newValue){
                    //$scope.setSlimCroll('.rlob-admin-local-notification-list');
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

                //Mo newleter
                //phanquocchien
                $scope.newsletter = function(){
                    $scope.emailContent=
                        "{Title} Redimed Medico-Legal Newsletter\n\n"+
                        "{Title} News\n"+
                        "Section for us to easily update\n"+
                        "{Title} Appointment Availability\n"+
                        "Section for us to easily update\n"+
                        "Contact Medico-Legal Department at Redimed on (08) 9230 0900 or log to the online booking system link\n";
                    rlobService.listMailUserOnlineBooking().then(function(data){
                        if (data.status == 'success') {
                            var recepient = data.data;
                            var options = {
                                subject: ("Medico-Legal Newsletter"),
                                body: $scope.emailContent,
                                bcc:recepient
                            };
                            console.log(recepient);
                            $scope.mailtoLink = Mailto.url('', options);
                            $window.location.href = $scope.mailtoLink;
                        };
                    })
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
                $scope.bookingStatus=rlobConstant.bookingStatus;
                $scope.bookingStatusDisplay=rlobConstant.bookingStatusDisplay;
                //$scope.bookingStatusChangedFlag =0;
                $scope.rlob_change_status=function(assId,bookingId,bookingType,status)
                {
                    if ($scope.selectedBooking.STATUS == $scope.bookingStatus.cancel) {
                        rlobService.selectAppointment($scope.selectedBooking.CAL_ID).then(function(data){
                            if (data.data.NOTES === null) 
                            {
                                rlobService.undoCancelBooking($scope.selectedBooking.CAL_ID,$scope.selectedBooking.PATIENT_ID).then(function(data){
                                    if (data.status == 'success') {
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
                                                rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.success,"Change booking status success.");
                                            }
                                            else
                                            {
                                                rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Change booking status fail.");
                                            }
                                        });
                                    }
                                    else
                                    {
                                        rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Change booking status fail.");
                                    };
                                });
                            }
                            else
                            {
                                rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Change booking status fail.");
                            };
                        });
                    }
                    else
                    {

                        if (status == $scope.bookingStatus.cancel) 
                        {
                            rlobService.cancelBooking($scope.selectedBooking.CAL_ID,$scope.selectedBooking.PATIENT_ID).then(function(data){
                                if (data.status == 'success') {
                                    rlobService.changeBookingStatus(bookingId,status).then(function(data){
                                        if(data.status=='success')
                                        {
                                            $scope.selectedBooking.STATUS=status;
                                            if(!$scope.bookingStatusChangedFlag)
                                                $scope.bookingStatusChangedFlag=0;
                                            $scope.bookingStatusChangedFlag = $scope.bookingStatusChangedFlag +1;
                                            var refId=bookingId;
                                            rlobService.add_notification(assId,refId,bookingType,rlobConstant.bellType.changeStatus,rlobConstant.notificationType.bell,status);
                                            rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.success,"Change booking status success.");
                                        }
                                        else
                                        {
                                            rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Change booking status fail.");
                                        };
                                    });
                                }else{
                                    rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Change booking status fail.");
                                };
                            });
                        }
                        else
                        {
                             rlobService.changeBookingStatus(bookingId,status).then(function(data){
                                if(data.status=='success')
                                {
                                    $scope.selectedBooking.STATUS=status;
                                    if(!$scope.bookingStatusChangedFlag)
                                        $scope.bookingStatusChangedFlag=0;
                                    $scope.bookingStatusChangedFlag = $scope.bookingStatusChangedFlag +1;
                                    var refId=bookingId;
                                    rlobService.add_notification(assId,refId,bookingType,rlobConstant.bellType.changeStatus,rlobConstant.notificationType.bell,status);
                                    rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.success,"Change booking status success.");
                                }else{
                                    rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Change booking status fail.");
                                }
                            });
                        };
                    };


                    // rlobService.changeBookingStatus(bookingId,status)
                    // .then(function(data){
                    //     if(data.status=='success')
                    //     {
                    //         $scope.selectedBooking.STATUS=status;
                    //         if(!$scope.bookingStatusChangedFlag)
                    //             $scope.bookingStatusChangedFlag=0;
                    //         $scope.bookingStatusChangedFlag = $scope.bookingStatusChangedFlag +1;
                    //         var refId=bookingId;
                    //         rlobService.add_notification(assId,refId,bookingType,rlobConstant.bellType.changeStatus,rlobConstant.notificationType.bell,status);
                    //     }
                    //     else
                    //     {

                    //     }
                    // });

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
                
                $scope.showDialogChoose=function(){
                    if($scope.fromDate && $scope.toDate)
                    {
                        $scope.FROM_DATE_TEMP=moment($scope.fromDate,'YYYY/MM/DD').toDate();
                        $scope.TO_DATE_TEMP=moment($scope.toDate,'YYYY/MM/DD').toDate();
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

                $scope.FROM_DATE_TEMP=null;
                $scope.TO_DATE_TEMP=null;

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
                    $scope.FROM_DATE_TEMP=null;
                    $scope.TO_DATE_TEMP=null;
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
                $scope.documentStatusDisplay=rlobConstant.documentStatusDisplay;
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

    .directive('rlobSendClientMessage', function(rlobService) {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
                actionCenter:'=',
                selectedBooking:'='
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_send_client_message.html',
            controller: function ($scope,rlobService)
            {
                $scope.showDialogSendBookingMessage=function()
                {
                    $scope.bookingMessage={};
                    $scope.bookingMessage.assId=$scope.selectedBooking.ASS_ID;
                    $scope.bookingMessage.bookingId=$scope.selectedBooking.BOOKING_ID;
                    $('#rlob-send-client-message').modal({show:true,backdrop:'static'});
                }


                $scope.sendBookingMessage=function()
                {
                    rlobService.add_notification($scope.bookingMessage.assId,$scope.bookingMessage.bookingId,rlobConstant.bookingType.REDiLEGAL.name,rlobConstant.bellType.message,rlobConstant.notificationType.bell,$scope.bookingMessage.message);
                    $("#rlob-send-client-message").modal('hide');
                }

                rlobService.getListBookingMessages().then(function(data){
                    if (data.status == 'success') {
                        $scope.ListBookingMessages = data.data;
                    };
                });
                $scope.check = function(data){
                    $scope.bookingMessage.message = data;
                };

                $scope.actionCenter.sendClientMessage=function(){
                    // alert("vao roi ne");
                    $scope.showDialogSendBookingMessage();
                }

            }
        };
    })

    /**
     * Chuyen booking calendar
     * tannv.dts@gmail.com
     * @param  {String} rlobService) {                                                                                                       return {              restrict: 'E',                                           transclude:true,            required:['^ngModel'],            scope: {                actionCenter:' [description]
     * @param  {[type]} templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_change_booking_calendar.html' [description]
     * @param  {[type]} controller:  function                                                                      ($scope,rlobService)                    {                             $scope.bookingType [description]
     * @return {[type]}              [description]
     */
    .directive('rlobChangeBookingCalendar', function(rlobService) {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
                actionCenter:'=',//changeBookingCalendar.runWhenSuccess();changeBookingCalendar.showDialog();
                groupName:'@',//Ten cua group action
                selectedBooking:'=',
                currentUpdatingItem:"=",
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_change_booking_calendar.html',
            controller: function ($scope,rlobService)
            {
                //set booking type la redilegal
                $scope.bookingType=rlobConstant.bookingType.REDiLEGAL.name;

                //Khoi tao cac gia tri cua currentUpdatingItem
                $scope.currentUpdatingItem.bookingId=null;
                $scope.currentUpdatingItem.calId=null;
                $scope.currentUpdatingItem.appointmentDateTime=null;
                $scope.currentUpdatingItem.newAppoimentDateTime=null;
                $scope.currentUpdatingItem.bookingIdChangeSuccess=null;
                $scope.currentUpdatingItem.assId=null;
                $scope.currentUpdatingItem.newCalId=null;
                //-------------------------------------------------------

                //Dung de cap nhat lai bang chon appointment calendar
                $('#rlob_change_booking_calendar_dialog').on('shown.bs.modal', function (e) {
                    if(!$scope.usingForDialogFlag)
                        $scope.usingForDialogFlag=0;
                    $scope.usingForDialogFlag=$scope.usingForDialogFlag+1;
                });

                //Show dialog choose appointment calendar
                $scope.actionCenter[$scope.groupName].showDialog=function()
                {
                    $("#rlob_change_booking_calendar_dialog").modal({
                        show:true,
                        backdrop:'static'
                    });
                    $scope.currentUpdatingItem.bookingId=$scope.selectedBooking.BOOKING_ID;
                    $scope.currentUpdatingItem.calId=$scope.selectedBooking.CAL_ID;
                    $scope.currentUpdatingItem.appointmentDateTime=$scope.selectedBooking.APPOINTMENT_DATE;
                    $scope.currentUpdatingItem.assId=$scope.selectedBooking.ASS_ID;
                }

                //Kiem tra khi chon appointment calendar
                $scope.$watch('selectedAppointmentCalendar',function(oldValue,newValue){
                    if($scope.selectedAppointmentCalendar)
                    {
                        var handlePeriodInfo={
                            doctorId:$scope.selectedAppointmentCalendar.DOCTOR_ID,
                            siteId:$scope.selectedAppointmentCalendar.SITE_ID,
                            selectedAppFromTime:$scope.selectedAppointmentCalendar.FROM_TIME,
                            rlTypeId:$scope.selectedAppointmentCalendar.RL_TYPE_ID,
                            oldCalId:$scope.currentUpdatingItem.calId
                        };

                        rlobService.core.checkPeriodTimeToBooking(handlePeriodInfo)
                        .then(function(data){
                            if(data.status=='success'){
                                $scope.changeAppointmentCalendar(
                                $scope.selectedAppointmentCalendar.CAL_ID,
                                $scope.selectedAppointmentCalendar.FROM_TIME,
                                $scope.selectedAppointmentCalendar.DOCTOR_ID,
                                $scope.selectedAppointmentCalendar.SITE_ID,
                                $scope.selectedAppointmentCalendar.RL_TYPE_ID,
                                $scope.selectedAppointmentCalendar.Specialties_id);
                            }
                            else
                            {
                                rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Not enough time.");
                            }
                        },function(err){
                            rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Check fail.");
                        });
                    }

                });
                
                //Xu ly thay doi lich
                $scope.changeAppointmentCalendar=function(newCalId,newAppointmentDateTime,doctorId,siteId,rlTypeId,specialityId)
                {
                    var actionInfo=
                    {
                        oldCalId:$scope.selectedBooking.CAL_ID,
                        newCalId:newCalId,
                        patientId:$scope.selectedBooking.PATIENT_ID,
                        doctorId:doctorId,
                        siteId:siteId,
                        appointmentDate:newAppointmentDateTime,
                        rlTypeId:rlTypeId,
                        specialtyId:specialityId,
                        bookingId:$scope.currentUpdatingItem.bookingId
                    }
                    rlobService.core.changeBookingCalendar(actionInfo)
                    .then(function(data){
                        if(data.status=='success')
                        {
                            $("#rlob_change_booking_calendar_dialog").modal('hide');
                            rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.success,"Change appointment calendar success.");
                            $scope.currentUpdatingItem.newAppoimentDateTime=newAppointmentDateTime;
                            $scope.currentUpdatingItem.bookingIdChangeSuccess=$scope.currentUpdatingItem.bookingId;
                            $scope.currentUpdatingItem.newCalId=newCalId;
                            //---------------------------------------------------
                            var mapUrl=null;
                            var siteAddress=$scope.selectedBooking.Site_addr;
                            var bookingId=$scope.selectedBooking.BOOKING_ID;
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
                                        handle();
                                    }
                                    else
                                    {
                                        handle();
                                    }
                                }
                            });

                            var handle=function()
                            {
                                //alert(mapUrl)
                                rlobService.core.rescheduleConfirmEmail(bookingId,siteAddress,mapUrl);
                            }
                            //------------------------------------------------------
                            $scope.actionCenter[$scope.groupName].runWhenSuccess();
                        }
                        else
                        {
                            rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Change fail.");
                        }
                    },function(err){
                        rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Change fail.");
                    });
                }
            }
        };
    })

    /*.directive('rlobAdminLocalNotification', function(rlobService) {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
                actionCenter:'=',//changeBookingCalendar.runWhenSuccess();changeBookingCalendar.showDialog();
                groupName:'@',//Ten cua group action
                selectedBooking:'=',
                currentUpdatingItem:"=",
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_change_booking_calendar.html',
            controller: function ($scope,rlobService)
            {
                
            }
        };
    })*/

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
