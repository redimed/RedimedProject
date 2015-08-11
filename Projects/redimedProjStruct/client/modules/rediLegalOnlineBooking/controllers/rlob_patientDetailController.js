/**
 * Created by meditech on 9/15/2014.
 */

angular.module('app.loggedIn.rlob.patientDetail.controller',[])
    .controller("rlob_patientDetailController", function($scope,$state,$http,$cookieStore,bookingService,appointmentCalendarService,FileUploader,Mailto,$location,$window,rlobService,PatientModel,ClaimModel) {
        /**
         * Danh cho tai su dung thong tin patient
         * client se chon bookinginfo hien co sau do dung no de book 1 lich moi
         * tannv.dts@gmail.com
         */
        $scope.selectedAppointmentCalendar=appointmentCalendarService.getSelectedAppointmentCalendar();
        
        if ($scope.selectedAppointmentCalendar.CAL_ID===undefined || $scope.selectedAppointmentCalendar.CAL_ID===null || $scope.selectedAppointmentCalendar.CAL_ID==='') {
            $state.go("loggedIn.home");
            return;
        };
        var bookingInfoReuse=bookingService.getBookingInfoResuse();
        $scope.isCopyBooking=0;
        if(bookingInfoReuse)
        {
            $scope.isCopyBooking=1;
            $scope.newBooking={
                CLAIM_NO:bookingInfoReuse.CLAIM_NO,
                WRK_SURNAME:bookingInfoReuse.WRK_SURNAME,
                WRK_OTHERNAMES:bookingInfoReuse.WRK_OTHERNAMES,
                WRK_EMAIL:bookingInfoReuse.WRK_EMAIL,
                WRK_CONTACT_NO:bookingInfoReuse.WRK_CONTACT_NO,
                DESC_INJURY:bookingInfoReuse.DESC_INJURY,
                COMPANY_ID:bookingInfoReuse.COMPANY_ID
            }
            $scope.WRK_DOB_TEMP=new Date(bookingInfoReuse.WRK_DOB);
            $scope.WRK_DATE_OF_INJURY_TEMP=new Date(bookingInfoReuse.WRK_DATE_OF_INJURY);
            bookingService.setBookingInfoReuse(null);
        }
        else
        {
            $scope.newBooking={};
        }

        $scope.selectedAppointmentCalendar=appointmentCalendarService.getSelectedAppointmentCalendar();

        // 
        var patientData = angular.copy(PatientModel);
        var claimData = angular.copy(ClaimModel);

        /**
         * Danh cho admin booking gium client
         * Admin se chon user sau do dung thong tin user de booking
         * tannv.dts@gmail.com
         */
        $scope.loginInfo=$cookieStore.get('userInfo');
        var bookingBehalfInfo=angular.copy(bookingService.getBookingBehalfInfo());
        if(bookingBehalfInfo!=null)
        {
            $scope.newBooking.ASS_ID=bookingBehalfInfo.ASS_ID;
            $scope.newBooking.ASS_SURNAME=bookingBehalfInfo.ASS_SURNAME;
            $scope.newBooking.ASS_OTHERNAMES=bookingBehalfInfo.ASS_OTHERNAMES;
            $scope.newBooking.ASS_CONTACT_NO=bookingBehalfInfo.ASS_CONTACT_NO;
            $scope.newBooking.ASS_EMAIL=bookingBehalfInfo.ASS_EMAIL;
            $scope.newBooking.COMPANY_ID=bookingBehalfInfo.COMPANY_ID;
            bookingService.setBookingBehalfInfo(null);
        }
        else
        {
            $scope.newBooking.ASS_ID=$scope.loginInfo.id;
            $scope.newBooking.ASS_SURNAME=$scope.loginInfo.Booking_Person;
            $scope.newBooking.ASS_OTHERNAMES=$scope.loginInfo.Booking_Person;
            $scope.newBooking.ASS_CONTACT_NO=$scope.loginInfo.Contact_number;
            $scope.newBooking.ASS_EMAIL=$scope.loginInfo.Contact_email;
        } 
        //Lay thong tin company info
        //Neu booking la copyBooking thi lay thong tin company id cua booking cu
        //Neu booking la booking moi thi lay thong tin tu userlogin
        //tannv.dts@gmail.com
        $scope.companyId=null;
        if($scope.newBooking.COMPANY_ID!==null && $scope.newBooking.COMPANY_ID!==undefined)
        {
            $scope.companyId=$scope.newBooking.COMPANY_ID;
        }
        else
        {
            $scope.companyId=$scope.loginInfo.company_id
        }
        $http({
            method:"POST",
            url:"/api/company/info",
            data:{comId:$scope.companyId}
        })
        .success(function(data) {
            
            $scope.companyInfo=data;
        })
        .error(function (data) {
            $scope.companyInfo={
                id:null,
                Company_name:'[Name of Company]'
            }
        })
        .finally(function() {

        });

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
        // $scope.newBooking={};
        // $scope.today = function() {
        //     $scope.WRK_DOB_TEMP = new Date();
        // };
        // //    $scope.today();
        // $scope.WRK_DOB_TEMP = '2012-12-12';

        // $scope.clear = function () {
        //     $scope.WRK_DOB_TEMP = null;
        // };

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
            $scope.openedDateOfInjury = false;

            $scope.opened = true;
        };

        $scope.openDateOfInjury = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = false;

            $scope.openedDateOfInjury = true;
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
        $scope.booking_detail={};
        //==============================================================================================
        var locationId=$scope.selectedAppointmentCalendar.SITE_ID;
        $http({
            method:"POST",
            url:"/api/redimedsite/info",
            data:{id:locationId}
        })
        .success(function(data) {
            selectedInfo.locationSelected=data;
            $scope.booking_detail.address=selectedInfo.locationSelected.Site_addr;
            codeAddress();
        })
        .error(function (data) {
            alert("Cannot get location info.");
        })
        .finally(function() {

        });

        //==============================================================================================
        var doctorid=$scope.selectedAppointmentCalendar.DOCTOR_ID;
        $http({
            method:"GET",
            url:"/api/rlob/doctors/get-doctors-by-id",
            params:{doctorId:doctorid}
        })
            .success(function(data) {
                if(data.status=='success')
                {
                    selectedInfo.doctorSelected=data.data;
                    $scope.booking_detail.doctor_name=selectedInfo.doctorSelected.NAME;
                }

            })
            .error(function (data) {
                alert("Cannot get doctor info.");
            })
            .finally(function() {

            });

        //==============================================================================================
        var cal_id=$scope.selectedAppointmentCalendar.CAL_ID;
        $http({
            method:"GET",
            url:"/api/rlob/appointment-calendar/get-by-id",
            params:{calId:cal_id}
        })
            .success(function(data) {
                if(data.status=='success')
                {
                    selectedInfo.selectedAppointment=data.data;
                    $scope.from_time = moment(new Date(selectedInfo.selectedAppointment.FROM_TIME));
                    $scope.booking_detail.date=$scope.from_time.format("DD/MM/YYYY");
                    $scope.booking_detail.time=$scope.from_time.format("HH:mm");
                }
            })
            .error(function (data) {
                alert("Cannot get appointment info.");
            })
            .finally(function() {

            });
        //==============================================================================================
        var rlTypeId=$scope.selectedAppointmentCalendar.RL_TYPE_ID;
        $http({
            method:"GET",
            url:"/api/rlob/rl_types/get-rltype-by-id",
            params:{rlTypeId:rlTypeId}
        })
            .success(function(data) {
                if(data.status=='success')
                {
                    selectedInfo.rltypeSelected=data.data;
                    $scope.booking_detail.type=selectedInfo.rltypeSelected.Rl_TYPE_NAME;
                }

            })
            .error(function (data) {
                alert("Cannot get rlType info.");
            })
            .finally(function() {

            });
        //==============================================================================================
        var specialityId=$scope.selectedAppointmentCalendar.Specialties_id;
        $http({
            method:"GET",
            url:"/api/rlob/cln_specialties/get-speciality-by-id",
            params:{specialityId:specialityId}
        })
            .success(function(data) {
                if(data.status=='success')
                    selectedInfo.clnSpecialitySelected=data.data;
            })
            .error(function (data) {
                alert("Cannot get specialty of doctor.");
            })
            .finally(function() {

            });
        //==============================================================================================

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







        $scope.newBooking.BOOKING_ID=20000;
        $http({
            method:"GET",
            url:"/api/rlob/rl_bookings/get-new-key"
        })
            .success(function(data) {
                $scope.newBooking.BOOKING_ID=data.key;
            })
            .error(function (data) {
                alert("Cannot create booking key.");
            })
            .finally(function() {

            });


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

        /***
         *Gui email neu booking thanh cong
         *bookingId: id cua booking moi
         * tannv.dts@gmail.com
         */
        $scope.sendConfirmEmail=function()
        {
            var mapUrl=null;
            var siteAddress=selectedInfo.locationSelected.Site_addr;
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
                $http({
                method:"POST",
                url:"/api/rlob/rl_bookings/admin/send-comfirm-email",
                data:{bookingId:$scope.newBooking.BOOKING_ID,siteAddress:siteAddress,mapUrl:mapUrl,isCopyBooking:$scope.isCopyBooking}
                })
                .success(function(data) {
                    if(data.status=='success')
                    {
                        //alert("thanh cong roi");
                        console.log("Send email confirm success!");
                    }
                    else
                    {
                        //alert("that bai roi");
                        console.log("Send email confirm fail!");
                    }

                })
                .error(function (data) {

                })
                .finally(function() {

                });
            }


            
        }

        $scope.isSaving=false;
        $scope.save=function()
        {   
            // if($scope.loginInfo.company_id==undefined || $scope.loginInfo.company_id==null || $scope.loginInfo.company_id=='')// tan comment
            if(!$scope.companyInfo.id)// tannv.dts change
            {
                rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Create booking fail because the company is unknown!");
                return;
            }else if(selectedInfo.rltypeSelected.RL_TYPE_ID==undefined || selectedInfo.rltypeSelected.RL_TYPE_ID==null || selectedInfo.rltypeSelected.RL_TYPE_ID==''){
                rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Create booking fail because the type of injury is unknown!");
                return;
            }else if(selectedInfo.clnSpecialitySelected.Specialties_id==undefined || selectedInfo.clnSpecialitySelected.Specialties_id==null || selectedInfo.clnSpecialitySelected.Specialties_id==''){
                rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Create booking fail because the doctor's specialties is unknown!");
                return;
            }else if (selectedInfo.doctorSelected.doctor_id==undefined || selectedInfo.doctorSelected.doctor_id==null || selectedInfo.doctorSelected.doctor_id=='') {
                rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Create booking fail because the doctor's name is unknown!");
                return;
            }else if (selectedInfo.locationSelected.id==undefined || selectedInfo.locationSelected.id==null || selectedInfo.locationSelected.id=='') {
                rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Create booking fail because the site is unknown!");
                return;
            }else if (cal_id==undefined || cal_id==null || cal_id=='') {
                rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Create booking fail because the appointment calendar is not selected!");
                return;
            };

            $scope.$broadcast('show-errors-check-validity');

            if($scope.bookingForm.$invalid)
            {
                $scope.hadForcused=true;
                $('.errorSummary').show();
                $scope.scrollTo($('.errorSummary'),-200);
                return;
            }

            $scope.mailBodyData={
                requestBy:$scope.loginInfo.FIRST_NAME?$scope.loginInfo.FIRST_NAME:'',
                company: $scope.companyInfo.Company_name?$scope.companyInfo.Company_name:'',
                time:$scope.from_time.format("HH:mm"),
                date:$scope.from_time.format("DD/MM/YYYY"),
                typeOfAppointment:$scope.bookingTypeObj.display,
                doctor:selectedInfo.doctorSelected.NAME?selectedInfo.doctorSelected.NAME:'',
                address:selectedInfo.locationSelected.Site_addr?selectedInfo.locationSelected.Site_addr:'',
                isContactPatient:$scope.newBooking.ISCONTACTPATIENT?$scope.newBooking.ISCONTACTPATIENT:'',
                notes:$scope.newBooking.NOTES?$scope.newBooking.NOTES:'',
                claimNumber:$scope.newBooking.CLAIM_NO?$scope.newBooking.CLAIM_NO:'',
                wrkName:$scope.newBooking.WRK_SURNAME?$scope.newBooking.WRK_SURNAME:'',
                wrkDOB:moment($scope.WRK_DOB_TEMP).format("DD/MM/YYYY"),
                wrkContactNo:$scope.newBooking.WRK_CONTACT_NO?$scope.newBooking.WRK_CONTACT_NO:'',
                injuryDesc:$scope.newBooking.DESC_INJURY?$scope.newBooking.DESC_INJURY:''
            }

            $scope.emailContent=
                "The below appointment has been requested by "+$scope.mailBodyData.requestBy+" from "+$scope.mailBodyData.company+".\n\n"+
                "Appointment Details:\n\n"+
                "Date: "+$scope.mailBodyData.date+"\n"+
                "Time: "+$scope.mailBodyData.time+"\n"+
                "Type of appointment: "+selectedInfo.rltypeSelected.Rl_TYPE_NAME+"\n"+
                "Doctor: "+$scope.mailBodyData.doctor+"\n"+
                "Address: "+$scope.mailBodyData.address+"\n"+
                "Notes: "+$scope.mailBodyData.notes+" \n\n"+
                "Patient information:\n\n"+
                "Claim number: "+$scope.mailBodyData.claimNumber+"\n"+
                "Name: "+$scope.mailBodyData.wrkName+"\n"+
                "Date of Birth: "+$scope.mailBodyData.wrkDOB+"\n"+
                "Contact number: "+$scope.mailBodyData.wrkContactNo+" \n"+
                "Injury description: "+$scope.mailBodyData.injuryDesc+"\n";

            var recepient = "medicolegal@redimed.com.au";
            var options = {
//                cc: "tannv.dts@gmail.com",
//                bcc: "nguyenvantan27binhduong@gmail.com",
                subject: ("Medico-Legal Paperwork "+$scope.mailBodyData.wrkName),
                body: $scope.emailContent
            };

            $scope.mailtoLink = Mailto.url(recepient, options);
            //---------------------------------------------------------------------------
            $scope.newBooking.BOOKING_DATE=moment().format("YYYY-MM-DD HH:mm");
            $scope.newBooking.APPOINTMENT_DATE=$scope.from_time.format("YYYY-MM-DD HH:mm");
            $scope.newBooking.COMPANY_ID=$scope.companyInfo.id;
            $scope.newBooking.RL_TYPE_ID=selectedInfo.rltypeSelected.RL_TYPE_ID;
            $scope.newBooking.SPECIALITY_ID=selectedInfo.clnSpecialitySelected.Specialties_id;
            $scope.newBooking.DOCTOR_ID=selectedInfo.doctorSelected.doctor_id;
            $scope.newBooking.SITE_ID=selectedInfo.locationSelected.id;
            $scope.newBooking.CAL_ID=cal_id;
            $scope.newBooking.refered_date_string=$scope.from_time.format("ddd DD/MM/YYYY HH-mm")+" "+selectedInfo.locationSelected.Site_name;
            $scope.newBooking.STATUS="Confirmed";
            $scope.newBooking.BOOKING_TYPE=$scope.bookingType;
            // console.log($scope.WRK_DATE_OF_INJURY_TEMP);
            // console.log($scope.WRK_DOB_TEMP);
            if($scope.WRK_DOB_TEMP!=undefined && $scope.WRK_DOB_TEMP!=null)
            {
                $scope.newBooking.WRK_DOB=moment($scope.WRK_DOB_TEMP).format("YYYY-MM-DD") ;
            }
            if($scope.WRK_DATE_OF_INJURY_TEMP!=undefined && $scope.WRK_DATE_OF_INJURY_TEMP!=null)
            {
                $scope.newBooking.WRK_DATE_OF_INJURY=moment($scope.WRK_DATE_OF_INJURY_TEMP).format("YYYY-MM-DD");
            }

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

            rlobService.core.saveBookingInfo($scope.newBooking)
            .then(function(data){

                if (data.status == 'success') {
                    $scope.scrollTo($('.bookingSuccess'),-200);
                    bookingService.setBookingInfo($scope.newBooking);
                    $scope.isSaving=true;
                    $scope.bookingSuccess=true;
                    $scope.showDialogAddSuccess();
                    $scope.getAppointmentCalendarUpcoming();
                    //Gui email confirm  cho khach hang
                    $scope.sendConfirmEmail();
                    for(var i=0;i<data.data.length;i++)
                    {
                        JSON.stringify(data.data[i]);
                    }
                }
                else
                {
                    var error=JSON.stringify(data.error);
                    $scope.showMsgDialog('.patient-detail-msg-dialog','Fail','fail','Create booking fail. '+error);
                }
            },function(err){
                $scope.showMsgDialog('.patient-detail-msg-dialog','Fail','fail','Create booking fail. Server error!');
            })

        }

        $scope.filesUpdateFlag=0;
        $scope.$watch("filesUpdateFlag", function(newValue, oldValue){
            if($scope.filesUpdateFlag && $scope.filesUpdateFlag>0)
            {
                //$("#lob-client-upload-dialog").modal('hide');
                rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.success,"Upload documents success!");
            }
        });
});


