/**
 * Created by meditech on 9/15/2014.
 */

angular.module('app.loggedIn.rlob.patientDetail.controller',[])
    .controller("rlob_patientDetailController", function($scope,$state,$http,$cookieStore,bookingService,appointmentCalendarService,FileUploader,Mailto,$location,$window,rlobService,PatientModel,ClaimModel) {
        $scope.selectedAppointmentCalendar=appointmentCalendarService.getSelectedAppointmentCalendar();
        /***
         * An ngan can thay doi url khi change state
         * tannv.dts@gmail.com
         */
//        $scope.$on('$stateChangeStart', function(event, newUrl, oldUrl) {
//            event.preventDefault();
//        });
//        
//        
        var patientData = angular.copy(PatientModel);
        var claimData = angular.copy(ClaimModel);

        $scope.loginInfo=$cookieStore.get('userInfo');

        $http({
            method:"POST",
            url:"/api/company/info",
            data:{comId:$scope.loginInfo.company_id}
        })
        .success(function(data) {
            $scope.companyInfo=data;
        })
        .error(function (data) {
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
            alert("insert fail");
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
                alert("insert fail");
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
                alert("insert fail");
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
                alert("insert fail");
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
                alert("insert fail");
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
                data:{bookingId:$scope.newBooking.BOOKING_ID,siteAddress:siteAddress,mapUrl:mapUrl}
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

            if($scope.bookingForm.$invalid)
            {
                $scope.hadForcused=true;
                $('.errorSummary').show();
                $scope.scrollTo($('.errorSummary'),-200);
                return;
            }

//            $scope.isSaving=true;
            //Set mailto

            $scope.mailBodyData={
                requestBy:$scope.loginInfo.user_name?$scope.loginInfo.user_name:'',
                company: $scope.companyInfo.Company_name?$scope.companyInfo.Company_name:'',
                time:$scope.from_time.format("HH:mm"),
                date:$scope.from_time.format("DD/MM/YYYY"),
                typeOfAppointment:'REDiLEGAL',
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
                "+ Date: "+$scope.mailBodyData.date+"\n"+
                "+ Time: "+$scope.mailBodyData.time+"\n"+
                "+ Type of appointment: "+$scope.mailBodyData.typeOfAppointment+"\n"+
                "+ Doctor: "+$scope.mailBodyData.doctor+"\n"+
                "+ Address: "+$scope.mailBodyData.address+"\n"+
                "+ Redilegal to contact the patient and arrange a time: "+(($scope.mailBodyData.isContactPatient=='1')?'yes':'no')+"\n"+
                "+ Notes: "+$scope.mailBodyData.notes+" \n\n"+
                "Patient information:\n\n"+
                "+ Claim number: "+$scope.mailBodyData.claimNumber+"\n"+
                "+ Name: "+$scope.mailBodyData.wrkName+"\n"+
                "+ Date of Birth: "+$scope.mailBodyData.wrkDOB+"\n"+
                "+ Contact number: "+$scope.mailBodyData.wrkContactNo+" \n"+
                "+ Injury description: "+$scope.mailBodyData.injuryDesc+"\n";

            var recepient = "redilegal@redimed.com.au";
            var options = {
//                cc: "tannv.dts@gmail.com",
//                bcc: "nguyenvantan27binhduong@gmail.com",
                subject: "Summary of Booking",
                body: $scope.emailContent
            };

            $scope.mailtoLink = Mailto.url(recepient, options);
            //---------------------------------------------------------------------------
            $scope.newBooking.BOOKING_DATE=moment().format("YYYY-MM-DD HH:mm");
            $scope.newBooking.APPOINTMENT_DATE=$scope.from_time.format("YYYY-MM-DD HH:mm");
            $scope.newBooking.COMPANY_ID=$scope.loginInfo.company_id;
            $scope.newBooking.RL_TYPE_ID=selectedInfo.rltypeSelected.RL_TYPE_ID;
            $scope.newBooking.SPECIALITY_ID=selectedInfo.clnSpecialitySelected.Specialties_id;
            $scope.newBooking.DOCTOR_ID=selectedInfo.doctorSelected.doctor_id;
            $scope.newBooking.SITE_ID=selectedInfo.locationSelected.id;
            $scope.newBooking.CAL_ID=cal_id;
            $scope.newBooking.refered_date_string=$scope.from_time.format("ddd DD/MM/YYYY HH-mm")+" "+selectedInfo.locationSelected.Site_name;
            $scope.newBooking.STATUS="Confirmed";
            $scope.newBooking.BOOKING_TYPE=$scope.bookingType;
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
            //phan quoc chien
            //phanquocchien.c1109g@gmail.com
            //add new patient
            $scope.addPatient = function(idBooking){
                patientData.Sur_name = $scope.newBooking.WRK_SURNAME;
                patientData.First_name = $scope.newBooking.WRK_OTHERNAMES;
                patientData.DOB = $scope.newBooking.WRK_DOB;
                patientData.Email = $scope.newBooking.WRK_EMAIL;
                patientData.Mobile = $scope.newBooking.WRK_CONTACT_NO;
                //phan quoc chien
                //phanquocchien.c1109g@gmail.com
                //add new cln_patients
                rlobService.addPatient(patientData).then(function(data){
                    if (data.status == 'success') {
                        claimData.Patient_id = data.data.Patient_id;
                        claimData.Claim_no = $scope.newBooking.CLAIM_NO;
                        claimData.Injury_name = 'No Description';
                        //phan quoc chien
                        //phanquocchien.c1109g@gmail.com
                        //add new cln_claims
                        rlobService.addClaim(claimData);
                        var idPatient = data.data.Patient_id;
                        var calID = $scope.newBooking.CAL_ID;
                        //phan quoc chien
                        //phanquocchien.c1109g@gmail.com
                        //update patient id
                        rlobService.updatePatientIdBooking(idBooking,idPatient);
                        //phan quoc chien
                        //phanquocchien.c1109g@gmail.com
                        //check Patient_id và CAL_ID trong bảng cln_appt_patients
                        rlobService.checkApptPatient(idPatient,calID).then(function(data){
                            if (!(data.status == 'success' && data.data.length > 0)){
                                //phan quoc chien
                                //phanquocchien.c1109g@gmail.com
                                //insert bảng cln_appt_patients
                                rlobService.addApptPatient(idPatient,calID).then(function(data){
                                    if (data.status == 'success') {
                                        //phan quoc chien
                                        //phanquocchien.c1109g@gmail.com
                                        //check PATIENTS trong bảng cln_appointment_calendar
                                        rlobService.selectAppointment(calID).then(function(data){
                                            if (data.status == 'success') {
                                                if (data.data.PATIENTS == null) {
                                                    var arr = [];
                                                    arr.push({"Patient_id":idPatient,"Patient_name":$scope.newBooking.WRK_OTHERNAMES+" "+$scope.newBooking.WRK_SURNAME});
                                                    var PATIENTS = JSON.stringify(arr);
                                                }else{
                                                    var arr = JSON.parse(data.data.PATIENTS);
                                                    arr.push({"Patient_id":idPatient,"Patient_name":$scope.newBooking.WRK_OTHERNAMES+" "+$scope.newBooking.WRK_SURNAME});
                                                    var PATIENTS = JSON.stringify(arr);
                                                };
                                                //phan quoc chien
                                                //phanquocchien.c1109g@gmail.com
                                                //update PATIENTS trong bảng cln_appointment_calendar
                                                rlobService.updateAppointment(calID,PATIENTS).then(function(data){
                                                    if (data.status == 'success') {
                                                        $scope.isSaving=true;
                                                        $scope.bookingSuccess=true;
                                                        $scope.showDialogAddSuccess();
                                                    };
                                                });
                                            };
                                        });
                                    };
                                });
                            };
                        });
                    };
                });
            }
            $http({
                method:"POST",
                url:"/api/rlob/rl_bookings/add",
                data:$scope.newBooking
            })
            .success(function(data) {
                if(data.status=='success')
                {
                    console.log(data.data);
                    $scope.scrollTo($('.bookingSuccess'),-200);
                    bookingService.setBookingInfo($scope.newBooking);
                    //uploader.formData.push({booking_id:$scope.newBooking.BOOKING_ID,company_id:$scope.loginInfo.company_id,worker_name:$scope.newBooking.WRK_SURNAME,isClientDownLoad:0});
                    /***
                     * Update appointment calendar upcoming cua structure
                     * tannv.dts@gmail.com
                     */
                    //phan quoc chien
                    //phanquocchien.c1109g@gmail.com
                    //new patient -> new cln_claims -> new cln_appt_patients -> update cln_appointment_calendar
                    $scope.addPatient(data.data);
                    $scope.getAppointmentCalendarUpcoming();
                    //Gui email confirm  cho khach hang
                    $scope.sendConfirmEmail();
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


