
angular.module('app.loggedIn.rlob')
        .controller("rlob_admin_bookingListController", function($scope, $http,$state,$window,$q,$stateParams,FileUploader,$cookieStore,$interval,rlobService,Mailto,bookingService) {
        //Internal Variable
        //Bien haveNodeFile quy dinh cac file co xuat hien trong tree hay khong

        $scope.haveNodeFile=false;
        $scope.isAdminUpload=true;
        $scope.isAdminGetFiles=true;
        $scope.accordionStatus={status1:true};
        $scope.documentStatus=rlobConstant.documentStatusFilter;
        $scope.documentStatusDisplay=rlobConstant.documentStatusDisplay;

        /**
         * Khoi tao action center
         * tannv.dts@gmail.com
         */
        $scope.actionCenter={};
        $scope.actionCenter.changeBookingCalendar={};
        $scope.actionCenter.scheduleList=$scope.scheduleList;
        //danh cho admin local notification
        $scope.actionCenter.adminLocalNotification={};
        //-----------------------------------------------------------

        $scope.newAppointmentPositionFlag=false;

        //-----------------------------------------------------------
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

        $scope.status=false;
        $scope.sourceName=$scope.bookingType;
        $scope.notificationType=rlobConstant.notificationType;

        $scope.bellType=rlobConstant.bellType;

        /**
         * Chuyen danh sach booking thanh JSON array
         *
         */
        $scope.mydata = [];
        $scope.parseBookingList=function(data)
        {
            $scope.mydata = [];
            var dateMaker = {};
            dateMaker.DATE_ITEMS = [];

            for (var i = 0; i < data.length; i++) {

                var item = data[i];
                if (!dateMaker[item.APPOINTMENT_DATE]) {
                    dateMaker[item.APPOINTMENT_DATE] = {DOCTOR_ITEMS: []};
                    dateMaker.DATE_ITEMS.push({
                        APPOINTMENT_DATETIME:item.APPOINTMENT_DATETIME,
                        APPOINTMENT_DATE: item.APPOINTMENT_DATE,
                        DISPLAY:"["+item.APPOINTMENT_DATE+"]",
                        style_class:'lob_admin_date_node'
                    });
                }

                if (!dateMaker[item.APPOINTMENT_DATE][item.DOCTOR_ID]) {
                    dateMaker[item.APPOINTMENT_DATE][item.DOCTOR_ID] = {BOOKING_ITEMS: []};
                    dateMaker[item.APPOINTMENT_DATE].DOCTOR_ITEMS.push({
                        DOCTOR_ID: item.DOCTOR_ID,
                        NAME: item.NAME,
                        DISPLAY:"["+item.NAME+"]",
                        style_class:'lob_admin_doctor_node'
                    });
                }

                if (!dateMaker[item.APPOINTMENT_DATE][item.DOCTOR_ID][item.BOOKING_ID]) {
                    dateMaker[item.APPOINTMENT_DATE][item.DOCTOR_ID][item.BOOKING_ID] = {BOOKING_FILE_ITEMS: []};
                    //chien set style class node
                    //phanquocchien.c1109g@gmail.com
                    var styleClass = '';
                    if(item.DOCUMENT_STATUS == $scope.documentStatus.checked.value){
                        styleClass = 'rlob_document_status_checked'
                    }
                    else{
                        if(item.DOCUMENT_STATUS == $scope.documentStatus.noDocuments.value){
                            styleClass = 'rlob_document_status_no_document'
                        }
                    }
                    dateMaker[item.APPOINTMENT_DATE][item.DOCTOR_ID].BOOKING_ITEMS.push({
                        APPOINTMENT_TIME:item.APPOINTMENT_TIME,
                        APPOINTMENT_DATETIME:item.APPOINTMENT_DATETIME,
                        CAL_ID:item.CAL_ID,
                        ASS_ID:item.ASS_ID,
                        BOOKING_ID: item.BOOKING_ID,
                        Company_name:item.Company_name,
                        WRK_SURNAME:item.WRK_SURNAME,
                        STATUS:item.STATUS,
                        DISPLAY:"["+item.APPOINTMENT_TIME+" - "+item.Site_name+"] - ["+item.WRK_OTHERNAMES+" "+item.WRK_SURNAME+"] - [" +item.ASS_OTHERNAMES+" - "+item.Company_name+"]",
                        DISPLAY1:"- Site: "+item.Site_name,
                        DISPLAY2:  "- Patient: "+item.WRK_SURNAME,
                        DISPLAY3:  "- Company: "+item.Company_name,
                        DOCUMENT_STATUS:item.DOCUMENT_STATUS,
                        //chien set style class node
                        //phanquocchien.c1109g@gmail.com
                        style_class:styleClass
                    });
                }

                if($scope.haveNodeFile)
                {
                    if (item.FILE_ID!=null &&!dateMaker[item.APPOINTMENT_DATE][item.DOCTOR_ID][item.BOOKING_ID][item.FILE_ID]) {
                        dateMaker[item.APPOINTMENT_DATE][item.DOCTOR_ID][item.BOOKING_ID][item.FILE_ID] = {};
                        dateMaker[item.APPOINTMENT_DATE][item.DOCTOR_ID][item.BOOKING_ID].BOOKING_FILE_ITEMS.push({
                            PARENT_ID:item.BOOKING_ID,
                            ASS_ID:item.ASS_ID,
                            FILE_ID: item.FILE_ID,
                            FILE_NAME:item.FILE_NAME,
                            FILE_PATH:item.FILE_PATH,
                            isClientDownLoad:item.isClientDownLoad,
                            DISPLAY: item.FILE_NAME,
                            style_class:'lob_admin_booking_file_node'
                        });
                    }
                }

            }

            for (var i = 0; i < dateMaker.DATE_ITEMS.length; i++)
            {
                var date_item=dateMaker.DATE_ITEMS[i];
                //mydata.push(dateMaker.DATE_ITEMS[i]);
                var node= {APPOINTMENT_DATETIME:date_item.APPOINTMENT_DATETIME,APPOINTMENT_DATE:date_item.APPOINTMENT_DATE,DISPLAY:date_item.DISPLAY,nodes:[],style_class:'lob_admin_date_node',IS_DATE_ITEM:'1'};
                node.nodes=dateMaker[date_item.APPOINTMENT_DATE].DOCTOR_ITEMS;
                for(var j=0;j<dateMaker[date_item.APPOINTMENT_DATE].DOCTOR_ITEMS.length;j++)
                {
                    var doctor_item=dateMaker[date_item.APPOINTMENT_DATE].DOCTOR_ITEMS[j];
                    node.nodes[j].nodes=[];
                    node.nodes[j].nodes=dateMaker[date_item.APPOINTMENT_DATE][doctor_item.DOCTOR_ID].BOOKING_ITEMS;

                    if($scope.haveNodeFile)
                    {
                        for(var k=0;k<dateMaker[date_item.APPOINTMENT_DATE][doctor_item.DOCTOR_ID].BOOKING_ITEMS.length;k++)
                        {
                            var booking_item=dateMaker[date_item.APPOINTMENT_DATE][doctor_item.DOCTOR_ID].BOOKING_ITEMS[k];
                            node.nodes[j].nodes[k].nodes=[];
                            node.nodes[j].nodes[k].nodes=
                                dateMaker[date_item.APPOINTMENT_DATE][doctor_item.DOCTOR_ID][booking_item.BOOKING_ID].BOOKING_FILE_ITEMS;
                        }
                    }
                }
                $scope.mydata.push(node);
                // rlobHelper.setSlimCroll(".treeScroll");
            }

            if($scope.newAppointmentPositionFlag)
            {
                $scope.goToNewAppoinmentPosition();
            }
        };

        /**
         * Tao filter noi dung
         * tannv.dts@gmail.com
         */
        $scope.lobAdminSearch={
            fromDateKey: moment().toDate(),
            toDateKey: moment().add(30,'d').toDate(),
            doctorKey:'',
            workerKey:'',
            documentStatusKey:{}
        };

        $scope.filterBooking=function()
        {
            var fromDate=moment($scope.lobAdminSearch.fromDateKey);
            var toDate=moment($scope.lobAdminSearch.toDateKey);
            var doctorKey=$scope.lobAdminSearch.doctorKey;
            var workerKey=$scope.lobAdminSearch.workerKey;
            var documentStatusKey=$scope.lobAdminSearch.documentStatusKey.value;
            $http({
                method:"GET",
                url:"/api/rlob/rl_bookings/admin/filter-booking",
                params:{
                    fromDateKey:fromDate.format("YYYY-MM-DD"),
                    toDateKey:toDate.format("YYYY-MM-DD"),
                    doctorKey:doctorKey,
                    workerKey:workerKey,
                    documentStatusKey:documentStatusKey,
                    doctorId:$scope.doctorInfo?$scope.doctorInfo.doctor_id:null,
                    bookingType:$scope.bookingType
                }
            })
                .success(function(data) {
                    if(data.length<=0)
                        $scope.showDetailPanel=false;
                    $scope.parseBookingList(data);
                })
                .error(function (data) {
                    console.log("error");
                })
                .finally(function() {

                });
        };

        //--------------------------------------------------



        $scope.remove = function(scope) {
            scope.remove();
        };

        $scope.toggle = function(scope) {
            scope.toggle();
        };


        $scope.moveLastToTheBegginig = function () {
            var a = $scope.data.pop();
            $scope.data.splice(0,0, a);
        };

        $scope.newSubItem = function(scope) {
            var nodeData = scope.$modelValue;
            nodeData.nodes.push({
                FILE_ID: item.FILE_ID,
                FILE_NAME:item.FILE_NAME,
                FILE_PATH:item.FILE_PATH,
                isClientDownLoad:item.isClientDownLoad,
                DISPLAY:item.FILE_NAME,
                style_class:'lob_admin_booking_file_node'
            });
        };

        $scope.collapseAll = function() {
            $scope.$broadcast('collapseAll');
        };

        $scope.expandAll = function() {
            $scope.$broadcast('expandAll');
        };




        $scope.message  = 'Right click triggered';

        $scope.panels = [
            { name: 'Panel 1' },
            { name: 'Panel 2' },
            { name: 'Panel 3' }
        ];

        $scope.addPanel = function() {
            $scope.panels.push({ name: 'Panel ' + ($scope.panels.length + 1) });
        };

        $scope.onRightClick = function(msg) {
            console.log(msg);
        };

        $scope.recreatePanels = function() {
            $scope.panels = angular.copy($scope.panels);
            console.log($scope.panels);
        }

        $scope.getTimeString=function(datetime)
        {
            var d=moment(new Date(datetime));
            return d.format("HH-mm");
        }

        $scope.getShortDateString=function(datetime)
        {
            var d=moment(new Date(datetime));
            return d.format("DD/MM/YYYY");
        }



        $scope.showBookingDetailDialog=function(bookingId)
        {
            $http({
                method:"POST",
                url:"/api/rlob/rl_bookings/get-booking-by-id",
                data:{bookingId:bookingId}
            })
            .success(function(data) {
                if(data.status=='success')
                {
                    $scope.selectedBooking=data.data;
                    $("#view-detail-booking-dialog").modal({show:true,backdrop:'static'});
                    //codeAddress();
                }
                else
                {
                    alert("data not exist!");
                }
            })
            .error(function (data) {
                console.log("error");
            })
            .finally(function() {
            });
        }

        $scope.lob_download_file=function(fileId)
        {
            $window.location.href = "/api/download/lob/document/"+fileId;
        }

        $scope.show_lob_upload_file_dialog=function(bookingId,scope)
        {
            $http({
                method:"POST",
                url:"/api/rlob/rl_bookings/get-booking-by-id",
                data:{bookingId:bookingId}
            })
                .success(function(data) {
                    if(data.status=='success')
                    {
                        $scope.selectedBooking=data.data;
                        $("#lob-upload-file-dialog").modal({show:true,backdrop:'static'});
                        $scope.currentNode=scope.$modelValue;
                    }
                    else
                    {
                        alert("data not exist!");
                    }
                })
                .error(function (data) {
                    console.log("error");
                })
                .finally(function() {
                });
        }


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
         * Luu notification (tham chieu den function add_notification cua state loggedIn)
         * @param userId: id cua nguoi dang nhap
         * @param refId: id cua booking
         * @param sourceName: booking type
         * @param msg: noi dung thong bao
         * tannv.dts@gmail.com
         */
        $scope.rlob_add_notification=$scope.add_notification;


        /**
         * Chuyen doi status cua Booking
         * @param status
         */
        $scope.bookingStatus=rlobConstant.bookingStatus;
        $scope.lob_change_status=function(assId,bookingId,status,scope,calID,patientID)
        {
            // alert(status);
            // alert($scope.bookingStatus.cancel);
            rlobService.getBookingById(bookingId)
                .then(function(data){
                    if(data.status=='success')
                    {
                        // chien set style class
                        //phanquocchien.c1109g@gmail.com
                        if(data.data.DOCUMENT_STATUS == $scope.documentStatus.checked.value){
                            data.data.style_class = 'rlob_document_status_checked'
                        }
                        else{
                            if(data.data.DOCUMENT_STATUS == $scope.documentStatus.noDocuments.value){
                                data.data.style_class = 'rlob_document_status_no_document'
                            }
                        }
                        $scope.selectedBooking=data.data;
                        return {status:'success'};
                    }
                    else
                    {
                        return {status:'fail'};
                    }
                })
                .then(function(data){
                    if(data.status=='success')
                    {
                        console.log($scope.selectedBooking);
                        if ($scope.selectedBooking.STATUS == $scope.bookingStatus.cancel) {
                            rlobService.selectAppointment($scope.selectedBooking.CAL_ID).then(function(data){
                                if (data.data.NOTES === null) 
                                {
                                    var patientName = $scope.selectedBooking.WRK_OTHERNAMES+" "+$scope.selectedBooking.WRK_SURNAME;
                                    rlobService.undoCancelBooking(calID,patientID).then(function(data){
                                        if (data.status == 'success') {
                                            rlobService.changeBookingStatus(bookingId,status)
                                            .then(function(data){
                                                if(data.status=='success'){
                                                    scope.$modelValue.STATUS=status;
                                                    $scope.selectedBooking.STATUS=status;
                                                    var refId=bookingId;
                                                    $scope.rlob_add_notification(assId,refId,$scope.sourceName,$scope.bellType.changeStatus,$scope.notificationType.bell,status);
                                                    //chien fadeOut booking status
                                                    //phanquocchien.c1109g@gmail.com
                                                    angular.element('#bookingstatus').fadeOut();
                                                    $scope.showMsgDialog(".lob-msg-dialog",'Change Booking Status','success','Changing status to ['+status+'] success!');
                                                }else{
                                                    //chien fadeOut booking status
                                                    //phanquocchien.c1109g@gmail.com
                                                    angular.element('#bookingstatus').fadeOut();
                                                    $scope.showMsgDialog(".lob-msg-dialog",'Change Booking Status','fail','Changing status to ['+status+'] fail!');
                                                }
                                            });
                                        }else{
                                            //chien fadeOut booking status
                                            //phanquocchien.c1109g@gmail.com
                                            angular.element('#bookingstatus').fadeOut();
                                            $scope.showMsgDialog(".lob-msg-dialog",'Change Booking Status','fail','Changing status to ['+status+'] fail!');
                                        };
                                    });
                                }else{
                                    angular.element('#bookingstatus').fadeOut();
                                    $scope.showMsgDialog(".lob-msg-dialog",'Change Booking Status','fail','Changing status to ['+status+'] fail!');
                                };
                            });
                        }else{
                            if (status == $scope.bookingStatus.cancel) {
                                rlobService.cancelBooking(calID,patientID).then(function(data){
                                    if (data.status == 'success') {
                                        rlobService.changeBookingStatus(bookingId,status).then(function(data){
                                            if(data.status=='success')
                                            {
                                                scope.$modelValue.STATUS=status;
                                                $scope.selectedBooking.STATUS=status;
                                                var refId=bookingId;
                                                $scope.rlob_add_notification(assId,refId,$scope.sourceName,$scope.bellType.changeStatus,$scope.notificationType.bell,status);
                                                //chien fadeOut booking status
                                                //phanquocchien.c1109g@gmail.com
                                                angular.element('#bookingstatus').fadeOut();
                                                $scope.showMsgDialog(".lob-msg-dialog",'Change Booking Status','success','Changing status to ['+status+'] success!');
                                            }else{
                                                //chien fadeOut booking status
                                                //phanquocchien.c1109g@gmail.com
                                                angular.element('#bookingstatus').fadeOut();
                                                $scope.showMsgDialog(".lob-msg-dialog",'Change Booking Status','fail','Changing status to ['+status+'] fail!');
                                            };
                                        });
                                    }else{
                                        //chien fadeOut booking status
                                        //phanquocchien.c1109g@gmail.com
                                        angular.element('#bookingstatus').fadeOut();
                                        $scope.showMsgDialog(".lob-msg-dialog",'Change Booking Status','fail','Changing status to ['+status+'] fail!');
                                    };
                                });
                            }else{
                                 rlobService.changeBookingStatus(bookingId,status).then(function(data){
                                    if(data.status=='success')
                                    {
                                        scope.$modelValue.STATUS=status;
                                        $scope.selectedBooking.STATUS=status;
                                        var refId=bookingId;
                                        $scope.rlob_add_notification(assId,refId,$scope.sourceName,$scope.bellType.changeStatus,$scope.notificationType.bell,status);
                                        //chien fadeOut booking status
                                        //phanquocchien.c1109g@gmail.com
                                        angular.element('#bookingstatus').fadeOut();
                                        $scope.showMsgDialog(".lob-msg-dialog",'Change Booking Status','success','Changing status to ['+status+'] success!');
                                    }else{
                                        //chien fadeOut booking status
                                        //phanquocchien.c1109g@gmail.com
                                        angular.element('#bookingstatus').fadeOut();
                                        $scope.showMsgDialog(".lob-msg-dialog",'Change Booking Status','fail','Changing status to ['+status+'] fail!');
                                    }
                                });
                            };
                        };
                    };
                  
                })

        };


        /**
         * Tuy chon client co the download file hay khong
         * @param fileId
         * @param role
         */

        $scope.lob_change_booking_file_role=function(assId,fileId,role,scope)
        {
            //exlog.alert($scope.selectedBooking)   ;
            $http({
                method:"POST",
                url:"/api/rlob/rl_booking_files/change-role-download",
                data:{fileId:fileId,role:role}
            })
            .success(function(data) {
                if(data.status=='success')
                {
                    scope.$modelValue.isClientDownLoad=role;
                    $scope.showMsgDialog(".lob-msg-dialog",'Authority downloads','success','Changing success! Customer'+(role==1?' can ':' cannot ')+'download this file');
                    var refId=scope.$modelValue.PARENT_ID;
                    if(role==1)
                        $scope.rlob_add_notification(assId,refId,$scope.sourceName,$scope.bellType.result,$scope.notificationType.letter,'');
                }
                else
                {
                    $scope.showMsgDialog(".lob-msg-dialog",'Authority downloads','fail','Changing fail!');
                }
            })
            .error(function (data) {
                $scope.showMsgDialog(".lob-msg-dialog",'Authority downloads','fail','Changing fail!');
            })
            .finally(function() {

            });
        }


        //------------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------------
        /***
         * Change Appointment Calendar
         * tannv.dts@gmail.com
         */
        

        $scope.currentUpdatingItem={
            bookingId:null,
            calId:null,
            appointmentDateTime:null,
            newAppoimentDateTime:null,
            bookingIdChangeSuccess:null,
            assId:null,
            newCalId:null
        };

        $scope.actionCenter.changeBookingCalendar.runWhenSuccess=function()
        {
            if($scope.currentUpdatingItem.newAppoimentDateTime>=$scope.currentUpdatingItem.appointmentDateTime)
            {
                $scope.lobAdminSearch.fromDateKey=moment(new Date($scope.currentUpdatingItem.appointmentDateTime));
                $scope.lobAdminSearch.toDateKey=moment(new Date($scope.currentUpdatingItem.newAppoimentDateTime));
            }
            else
            {
                $scope.lobAdminSearch.fromDateKey=moment(new Date($scope.currentUpdatingItem.newAppoimentDateTime));
                $scope.lobAdminSearch.toDateKey=moment(new Date($scope.currentUpdatingItem.appointmentDateTime));
            }

            $http({
                method:"GET",
                url:"/api/rlob/appointment-calendar/check-same-doctor",
                params:{calId1:$scope.currentUpdatingItem.calId,calId2:$scope.currentUpdatingItem.newCalId}
            })
            .success(function(data) {
                if(data.status=='success')
                {
                    if(data.data>1)
                    {
                        $scope.lobAdminSearch.doctorKey=null;
                    }
                    //$scope.rlob_add_notification = function(assId,refId,sourceName,rlobType,type,content)
                    $scope.rlob_add_notification($scope.currentUpdatingItem.assId,$scope.currentUpdatingItem.bookingId,$scope.sourceName,$scope.bellType.changeCalendar,$scope.notificationType.bell,'');
                }
            })
            .error(function (data) {
                console.log("error");
            })
            .finally(function() {
                $scope.newAppointmentPositionFlag=true;
                $scope.filterBooking();
            });
        }

        /**
         * Lang nghe selectedAppointmentCalendar tu directive rlob_choose_appointment_calendara
         * tannv.dts@gmail.com
         */
        // $scope.$watch('selectedAppointmentCalendar',function(oldValue,newValue){

        //     if($scope.selectedAppointmentCalendar)
        //     {
        //         var handlePeriodInfo={
        //             doctorId:$scope.selectedAppointmentCalendar.DOCTOR_ID,
        //             siteId:$scope.selectedAppointmentCalendar.SITE_ID,
        //             selectedAppFromTime:$scope.selectedAppointmentCalendar.FROM_TIME,
        //             rlTypeId:$scope.selectedAppointmentCalendar.RL_TYPE_ID,
        //             oldCalId:$scope.currentUpdatingItem.calId
        //         };

        //         rlobService.core.checkPeriodTimeToBooking(handlePeriodInfo)
        //         .then(function(data){
        //             if(data.status=='success'){
        //                 $scope.changeAppointmentCalendar(
        //                 $scope.selectedAppointmentCalendar.CAL_ID,
        //                 $scope.selectedAppointmentCalendar.FROM_TIME,
        //                 $scope.selectedAppointmentCalendar.DOCTOR_ID,
        //                 $scope.selectedAppointmentCalendar.SITE_ID,
        //                 $scope.selectedAppointmentCalendar.RL_TYPE_ID,
        //                 $scope.selectedAppointmentCalendar.Specialties_id);
        //             }
        //             else
        //             {
        //                 $scope.showMsgDialog('.lob-msg-dialog','Medico-Legal','fail','Not enough time!');
        //             }
        //         },function(err){
        //             $scope.showMsgDialog('.lob-msg-dialog','Medico-Legal','fail','Error!');
        //         });

                
        //     }

        // });


        // /***
        //  * tannv.dts@gmail.com
        //  * Su dung khi muon su dung rlob-choose-appointment-calendar-dialog
        //  */
        // $('#lob-change-appointment-calendar-dialog').on('shown.bs.modal', function (e) {
        //     if(!$scope.usingForDialogFlag)
        //         $scope.usingForDialogFlag=0;
        //     $scope.usingForDialogFlag=$scope.usingForDialogFlag+1;
        // });

        // /**
        //  * Show dialog chon appointment calendar
        //  * tannv.dts@gmail.com
        //  */
        // $scope.showDialogChangeAppointmentCalendar=function(bookingId,calId,appointmentDateTime,assId)
        // {
        //     //alert(JSON.stringify([bookingId,calId,appointmentDateTime,assId]));
        //     $("#lob-change-appointment-calendar-dialog").modal({
        //         show:true,
        //         backdrop:'static'
        //     });
        //     $scope.currentUpdatingItem.bookingId=bookingId;
        //     $scope.currentUpdatingItem.calId=calId;
        //     $scope.currentUpdatingItem.appointmentDateTime=appointmentDateTime;
        //     $scope.currentUpdatingItem.assId=assId;
        // }

        // /**
        //  * Thay doi lich hen cua mot boooking
        //  * tannv.dts@gmail.com
        //  */
        // $scope.changeAppointmentCalendar=function(newCalId,newAppointmentDateTime,doctorId,siteId,rlTypeId,specialityId)
        // {
        //     var actionInfo=
        //     {
        //         oldCalId:$scope.selectedBooking.CAL_ID,
        //         newCalId:newCalId,
        //         patientId:$scope.selectedBooking.PATIENT_ID,
        //         doctorId:doctorId,
        //         siteId:siteId,
        //         appointmentDate:newAppointmentDateTime,
        //         rlTypeId:rlTypeId,
        //         specialtyId:specialityId,
        //         bookingId:$scope.currentUpdatingItem.bookingId
        //     }
        //     rlobService.core.changeBookingCalendar(actionInfo)
        //     .then(function(data){
        //         if(data.status=='success')
        //         {
        //             $("#lob-change-appointment-calendar-dialog").modal('hide');
        //             $scope.showMsgDialog(".lob-msg-dialog",'Change appointment calendar','success','Change appointment calendar success!');
        //             if(newAppointmentDateTime>=$scope.currentUpdatingItem.appointmentDateTime)
        //             {
        //                 $scope.lobAdminSearch.fromDateKey=moment(new Date($scope.currentUpdatingItem.appointmentDateTime));
        //                 $scope.lobAdminSearch.toDateKey=moment(new Date(newAppointmentDateTime));
        //             }
        //             else
        //             {
        //                 $scope.lobAdminSearch.fromDateKey=moment(new Date(newAppointmentDateTime));
        //                 $scope.lobAdminSearch.toDateKey=moment(new Date($scope.currentUpdatingItem.appointmentDateTime));
        //             }

        //             $http({
        //                 method:"GET",
        //                 url:"/api/rlob/appointment-calendar/check-same-doctor",
        //                 params:{calId1:$scope.currentUpdatingItem.calId,calId2:newCalId}
        //             })
        //             .success(function(data) {
        //                 if(data.status=='success')
        //                 {
        //                     if(data.data>1)
        //                     {
        //                         $scope.lobAdminSearch.doctorKey=null;
        //                     }
        //                     //$scope.rlob_add_notification=function(assId,refId,sourceName,rlobType,type,content)
        //                     $scope.rlob_add_notification($scope.currentUpdatingItem.assId,$scope.currentUpdatingItem.bookingId,$scope.sourceName,$scope.bellType.changeCalendar,$scope.notificationType.bell,'');
        //                 }
        //             })
        //             .error(function (data) {
        //                 console.log("error");
        //             })
        //             .finally(function() {
        //                 $scope.currentUpdatingItem.newAppoimentDateTime=newAppointmentDateTime;
        //                 $scope.newAppointmentPositionFlag=true;
        //                 $scope.currentUpdatingItem.bookingIdChangeSuccess=$scope.currentUpdatingItem.bookingId;
        //                 $scope.filterBooking();
        //             });
        //         }
        //         else
        //         {
                    
        //         }
        //     },function(err){

        //     });
        // }

        //Nhay toi booking vua doi calendar
        $scope.goToNewAppoinmentPosition=function()
        {
            if($scope.currentUpdatingItem.newAppoimentDateTime>=$scope.currentUpdatingItem.appointmentDateTime)
            {
                $scope.scrollTo($("#rlob_admin_begin_page"),-200);
            }
            else
            {
                $scope.scrollTo($("#rlob_admin_end_page"),100);
            }
            $scope.newAppointmentPositionFlag=false;
        }

        $scope.newPosition="new-position";

        //-------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------

        $scope.selectedFilter={
            locationSelected:{},
            rltypeSelected:{},
            clnSpecialitySelected:{},
            doctorSelected:{},
            var1:{}
        }

        $scope.showDetailPanel=false;
        $scope.currentNodeBooking={};
        $scope.getBookingDetailWhenClick=function(bookingId,scope)
        {
            $scope.currentNodeBooking=scope;
            $scope.showDetailPanel=true;
            $http({
                method:"POST",
                url:"/api/rlob/rl_bookings/get-booking-by-id",
                data:{bookingId:bookingId}
            })
            .success(function(data) {
                if(data.status=='success')
                {
                    $scope.selectedBooking=data.data;
                    $scope.scrollTo($(".detailPanel"),-200);
                    //rlobHelper.setSlimCroll(".detailScroll");

                }
                else
                {
                    alert("data not exist!");
                }
            })
            .error(function (data) {
                console.log("error");
            })
            .finally(function() {
            });
        }

        $scope.getBookingDetailWhenCursor=function(bookingId,scope)
        {
            $scope.currentNodeBooking=scope;
            if(bookingId)
            {
                rlobService.getBookingById(bookingId).then(function(data){
                    if(data.status=='success')
                    {
                        // chien set style class
                        //phanquocchien.c1109g@gmail.com
                        
                        if(data.data.DOCUMENT_STATUS == $scope.documentStatus.checked.value){
                            data.data.style_class = 'rlob_document_status_checked'
                        }
                        else{
                            if(data.data.DOCUMENT_STATUS == $scope.documentStatus.noDocuments.value){
                                data.data.style_class = 'rlob_document_status_no_document'
                            }
                        }
                        $scope.showDetailPanel=true;
                        $scope.selectedBooking=data.data;
                    }
                });
            }

        }

        
        //chien fadeIn & fadeOut status
        //phanquocchien.c1109g@gmail.com

        $scope.bookingstatusfadeIn = function(){
            angular.element('#bookingstatus').fadeIn();
        }
        $scope.bookingstatusfadeOut = function(){
            angular.element('#bookingstatus').fadeOut();
        }
        $scope.documentstatusfadeOut = function(){
            angular.element('#documentstatus').fadeOut();
        }
        $scope.documentstatusfadeIn = function(){
            angular.element('#documentstatus').fadeIn();
        }

        //chien set rlobhelper
        //phanquocchien.c1109g@gmail.com
        // $scope.documentStatus=rlobConstant.documentStatus;

        //chien change documents status
        // phanquocchien.c1109g@gmail.com
        $scope.rlob_document_change_status=function(bookingId,status)
        {
            rlobService.changeDocumentStatus(bookingId,status)
                .then(function(data){
                    if(data.status=='success')
                    {
                        var styleClass = '';
                        
                        if(status == $scope.documentStatus.checked.value){
                            styleClass = 'rlob_document_status_checked'
                        }
                        else{
                            if(status == $scope.documentStatus.noDocuments.value){
                                styleClass = 'rlob_document_status_no_document'
                            }
                        }
                        
                        $scope.selectedBooking.DOCUMENT_STATUS=status;

                        $scope.selectedBooking.style_class=styleClass;

                        angular.element('#documentstatus').fadeOut();
                        $scope.showMsgDialog(".lob-msg-dialog",'Change Documents Status','success','Changing status to ['+status+'] success!');
                        $scope.currentNodeBooking.$modelValue.style_class=styleClass;
                               //$scope.styleClass = styleClass;
                               //var refId=bookingId;
                               //rlobService.add_notification(assId,refId,bookingType,rlobConstant.bellType.changeStatus,rlobConstant.notificationType.bell,status);
                    }
                    else
                    {
                        angular.element('#documentstatus').fadeOut();
                        $scope.showMsgDialog(".lob-msg-dialog",'Change Documents Status','fail','Changing status to ['+status+'] fail!');
                    }
                });

        };

        // chien fadeOut status
        // phanquocchien.c1109g@gmail.com
        $scope.$watch('selectedBooking.BOOKING_ID',function(newValue, oldValue){
            if ( newValue !== oldValue ) {
                // $scope.setBookingIdInPaperless();
                angular.element('#documentstatus').fadeOut();
                angular.element('#bookingstatus').fadeOut();
            }
        });

        //chien set booking id in paperless
        //phanquocchien.c1109g@gmail.com
        $scope.setBookingIdInPaperless = function(BookingID){
            if (BookingID !=null && BookingID != "") {
                rlobService.bookingInfoPaperless.id=BookingID;
                $state.go('loggedIn.rlob.paperless');
                return;
            }else{
                alert("Khong ton tai Booking ID");
            };
        };

        /**
         * Copy booking 
         * tannv.dts@gmail.com
         */
        $scope.copyBooking=function()
        {
            var bookingBehalfInfo={
                ASS_SURNAME:$scope.selectedBooking.ASS_SURNAME,
                ASS_OTHERNAMES:$scope.selectedBooking.ASS_OTHERNAMES,
                ASS_CONTACT_NO:$scope.selectedBooking.ASS_CONTACT_NO,
                ASS_EMAIL:$scope.selectedBooking.ASS_EMAIL,
                ASS_ID:$scope.selectedBooking.ASS_ID,
                COMPANY_ID:$scope.selectedBooking.COMPANY_ID
            }
            bookingService.setBookingBehalfInfo(bookingBehalfInfo);
            bookingService.setBookingInfoReuse($scope.selectedBooking);
            rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.success,"Please choose appointment calendar!");
            $state.go("loggedIn.rlob.rlob_booking");
        }

        //function chay khi admin local notification->detail booking dialog duoc tat
        //nham muc dich dong bo hoa
        //tannv.dts@gmail.com
        $scope.actionCenter.adminLocalNotification.runWhenChanged=function()
        {
            $scope.filterBooking();
        }

        

        //Khoi tao cay, khoi  tao notification
        //Cot loi cua page
        //-----------------------------------------------------------------------------
        //-----------------------------------------------------------------------------
        //-----------------------------------------------------------------------------
        //-----------------------------------------------------------------------------
        //-----------------------------------------------------------------------------
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
                .then($scope.filterBooking)
                //.then($scope.updateAdminLocalNotification)
        }
        else
        {
            $scope.filterBooking();
            //$scope.updateAdminLocalNotification();
        }

        //-----------------------------------------------------------------------------
        //-----------------------------------------------------------------------------
        //-----------------------------------------------------------------------------
        //-----------------------------------------------------------------------------
        //-----------------------------------------------------------------------------
    });
