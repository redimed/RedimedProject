/**
 * Created by meditech on 9/15/2014.
 */

angular.module('app.loggedIn.rlob.patientDetail.controller',[])
    .controller("rlob_patientDetailController", function($scope,$stateParams,$http,$cookieStore,appointmentCalendarService,doctorsService,locationService,bookingService,FileUploader,Mailto,$location,$window) {
        $scope.loginInfo=$cookieStore.get('userInfo');
        /**
         * bootstrap date picker
         * tannv.dts@gmail.com
         * su dung bootstrap-datepicker
         */
        /*
         var initPickers = function () {

         //init date pickers
         $('.date-picker').datepicker({
         rtl: Metronic.isRTL(),
         autoclose: true
         }).on('changeDate',function(evn){

         });

         }
         initPickers();
         */

        /**
         * angular bootstrap datepicker handle
         */
        $scope.newBooking={};
        $scope.today = function() {
            $scope.WRK_DOB_TEMP = new Date();
        };
        //    $scope.today();
        $scope.WRK_DOB_TEMP = new Date('1980-1-1');

        $scope.clear = function () {
            $scope.WRK_DOB_TEMP = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();


        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        //    $scope.initDate = new Date('1980-1-1');
        $scope.formats = ['d/M/yyyy','dd/MM/yyyy','dd/MMMM/yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        //--------------------------------------------------------------------------------------

        $scope.bookingSuccess=false;
        $scope.isSaving=false;

        var selectedInfo=bookingService.getSelectedInfo();

        var locationId=$stateParams.siteid;
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
        var doctorid=$stateParams.doctorid;
        selectedInfo.doctorSelected=doctorsService.getDoctorById(doctorid);
        //==============================================================================================
        var cal_id=$stateParams.id;

        selectedInfo.selectedAppointment=appointmentCalendarService.getAppointmentById(cal_id);


        var from_date = moment(new Date(selectedInfo.selectedAppointment.FROM_TIME));
        $scope.booking_detail={};
        $scope.booking_detail.date=from_date.format("DD/MM/YYYY");
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
        $scope.newBooking.ASS_ID=$scope.loginInfo.id;
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


        /***
         * scroll den 1 id xac dinh
         * @param el
         * @param offeset
         * tannv.dts@gmail.com
         */
        $scope.scrollTo= function(el, offeset)
        {
            var pos = (el && el.size() > 0) ? el.offset().top : 0;

            if (el) {
                if ($('body').hasClass('page-header-fixed')) {
                    pos = pos - $('.page-header').height();
                }
                pos = pos + (offeset ? offeset : -1 * el.height());
            }

            $('html,body').animate({
                scrollTop: pos
            }, 'slow');
        };

        /**
         * Show Message dialog using rlobDialog
         * @param styleClass : ten class
         * @param header :tieu de dialog
         * @param status : trang thai dialog (success, error...)
         * @param content : noi dung dialog
         * tannv.dts@gmail.com
         */
        $scope.showMsgDialog=function(styleClass,header,status,content)
        {
            $scope.msgHeader=header;
            $scope.msgStatus=status;
            $scope.msgContent=content;
            $(styleClass).modal({show:true,backdrop:'static'});
        };


        $scope.isSaving=false;

        $scope.save=function()
        {

            if($scope.bookingForm.$invalid)
            {
                $scope.hadForcused=true;
                $('.errorSummary').show();
                $scope.scrollTo($('.errorSummary'),-200);
                return;
            }

            $scope.isSaving=true;
            //Set mailto
            var recepient = "tannv.dts@gmail.com";
            var options = {
                cc: "tannv.dts@gmail.com",
                bcc: "nguyenvantan27binhduong@gmail.com",
                subject: "Online booking",
                body: "Hi Master,\nThis is an email pre-populated from angular-mailto."
            };

            $scope.mailtoLink = Mailto.url(recepient, options);
            //---------------------------------------------------------------------------
            $scope.newBooking.BOOKING_DATE=moment().format("YYYY-MM-DD HH:mm");
            $scope.newBooking.APPOINTMENT_DATE=from_date.format("YYYY-MM-DD HH:mm");
            $scope.newBooking.COMPANY_ID=1;
            $scope.newBooking.RL_TYPE_ID=selectedInfo.rltypeSelected.RL_TYPE_ID;
            $scope.newBooking.SPECIALITY_ID=selectedInfo.clnSpecialitySelected.Specialties_id;
            $scope.newBooking.DOCTOR_ID=selectedInfo.doctorSelected.doctor_id;
            $scope.newBooking.SITE_ID=selectedInfo.locationSelected.id;
            $scope.newBooking.CAL_ID=cal_id;
            $scope.newBooking.refered_date_string=from_date.format("ddd DD/MM/YYYY HH-mm")+" "+selectedInfo.locationSelected.Site_name;
            $scope.newBooking.STATUS="Confirmed";
            if($scope.WRK_DOB_TEMP==undefined)
            {
                alert("Worker's birthay fail!");
                return;
            }

            $scope.newBooking.WRK_DOB=moment($scope.WRK_DOB_TEMP).format("YYYY-MM-DD");
            $scope.showDialogAddSuccess=function()
            {
                $("#lob-client-add-booking-success").modal({show:true,backdrop:'static'});
            }

            $scope.uploadDocument=function ()
            {
                $("#lob-client-add-booking-success").modal('hide');
                $("#lob-client-send-document-dialog").modal('hide');
                $("#lob-client-upload-dialog").modal({show:true,backdrop:'static'});
                //window.scrollTo(0, $('#uploadBookmark')[0].offsetTop - 100);
            }

            $scope.sendEmail=function()
            {
                $window.location.href = $scope.mailtoLink;
                $("#lob-client-add-booking-success").modal('hide');
                $("#lob-client-send-document-dialog").modal('hide');
            }

            $scope.showDialogSendDocument=function()
            {
                $("#lob-client-send-document-dialog").modal({show:true,backdrop:'static'});
            }


            $http({
                method:"POST",
                url:"/api/rlob/rl_bookings/add",
                data:$scope.newBooking
            })
            .success(function(data) {
                if(data.status=='success')
                {
                    $scope.isSaving=true;
                    $scope.bookingSuccess=true;
                    $scope.scrollTo($('.bookingSuccess'),-200);
                    bookingService.setBookingInfo($scope.newBooking);
                    uploader.formData.push({booking_id:$scope.newBooking.BOOKING_ID,company_id:$scope.loginInfo.company_id,worker_name:$scope.newBooking.WRK_SURNAME,isClientDownLoad:0});
                    $scope.showDialogAddSuccess();
                    /***
                     * Update appointment calendar upcoming cua structure
                     * tannv.dts@gmail.com
                     */
                    $scope.getAppointmentCalendarUpcoming();
                }
                else
                {
                    $scope.showMsgDialog('.patient-detail-msg-dialog','Fail','fail','Create booking fail!');
                }
            })
            .error(function (data) {
                $scope.showMsgDialog('.patient-detail-msg-dialog','Fail','fail','Create booking fail!');
            })
            .finally(function() {

            });
        }
});


