
angular.module('app.loggedIn.rlob.adminBookingList.controller',[])
        .controller("rlob_admin_bookingListController", function($scope, $http,$state,$window,$q,$stateParams,FileUploader,$cookieStore,$interval,rlobService,Mailto,bookingService) {
        //Internal Variable
        //Bien haveNodeFile quy dinh cac file co xuat hien trong tree hay khong

        $scope.haveNodeFile=false;
        $scope.isAdminUpload=true;
        $scope.isAdminGetFiles=true;
        $scope.accordionStatus={status1:true};
        $scope.documentStatus=rlobConstant.documentStatus;
        $scope.documentStatusDisplay=rlobConstant.documentStatusDisplay;
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
//        $scope.notificationType={
//            bell:   'bell',
//            letter: 'letter'
//        }
        $scope.notificationType=rlobConstant.notificationType;
//        $scope.bellType={
//            'changeStatus':"Change Booking Status",
//            'result': 'Result',
//            'message': 'Message',
//            'changeCalendar':'Change Appointment Calendar'
//        }

        $scope.bellType=rlobConstant.bellType;

        //--------------------------------------------------
        // var initPickers = function () {

        //     //init date pickers
        //     $('.date-picker').rlobdatepicker({
        //         rtl: Metronic.isRTL(),
        //         autoclose: true
        //     }).on('changeDate',function(evn){

        //     });

        // }
        // initPickers();
        //--------------------------------------------------


        $scope.loginInfo=$cookieStore.get('userInfo');
        $scope.doctorInfo=null;
        $scope.getDoctorInfoByUserId=function()
        {
            var deferred=$q.defer();
            $http({
                method:"GET",
                url:"/api/rlob/doctors/get-doctors-info-by-userid",
                params:{userId:$scope.loginInfo.id}
            })
            .success(function(data) {
                if(data.status=='success')
                {
                    $scope.doctorInfo=data.data;
                }
            })
            .error(function (data) {
                console.log("error");
            })
            .finally(function() {
                deferred.resolve();
            });
            return deferred.promise;
        }

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
                    if(item.DOCUMENT_STATUS == $scope.rlobDocumentStatus.notConfirmed.value){
                        styleClass = 'rlob_document_status_not_confirmed'
                    }
                    else{
                        if(item.DOCUMENT_STATUS == $scope.rlobDocumentStatus.checked.value){
                            styleClass = 'rlob_document_status_checked'
                        }
                        else{
                            if(item.DOCUMENT_STATUS == $scope.rlobDocumentStatus.noDocuments.value){
                                styleClass = 'rlob_document_status_no_document'
                            }
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
            fromDateKey:moment().format("DD/MM/YYYY"),
            toDateKey:moment().add(30,'d').format("DD/MM/YYYY"),
            doctorKey:'',
            workerKey:'',
            documentStatusKey:{}
        };

        $scope.filterBooking=function()
        {
            var fromDate=moment($scope.lobAdminSearch.fromDateKey,'DD/MM/YYYY');
            var toDate=moment($scope.lobAdminSearch.toDateKey,'DD/MM/YYYY');
            //var doctorKey=$scope.lobAdminSearch.doctorKey!=null && $scope.lobAdminSearch.doctorKey!=undefined?$scope.lobAdminSearch.doctorKey:'';
            //var workerKey=$scope.lobAdminSearch.workerKey!=null && $scope.lobAdminSearch.workerKey!=undefined?$scope.lobAdminSearch.workerKey:'';
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
        /*
        //---------------------------------------------------------------
        //HANDLE UPLOAD FILES
        //Upload File
        var uploader = $scope.uploader = new FileUploader({
            url: '/api/rlob/rl_booking_files/upload'
        });
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            var fileInfo=response.fileInfo;
            var refId=angular.copy(fileInfo.BOOKING_ID);

            fileInfo.DISPLAY=fileInfo.FILE_NAME;
            fileInfo.style_class='lob_admin_booking_file_node';
            fileInfo.PARENT_ID=angular.copy(fileInfo.BOOKING_ID);
            fileInfo.BOOKING_ID=null;
            fileInfo.ASS_ID=$scope.currentNode.ASS_ID;
            if($scope.haveNodeFile)
                $scope.currentNode.nodes.push(fileInfo);
            console.info('onSuccessItem', fileItem, response, status, headers);
            //Put notification
            if(fileInfo.isClientDownLoad==1)
            {
                $scope.rlob_add_notification(fileInfo.ASS_ID,refId,$scope.sourceName,$scope.bellType.result,$scope.notificationType.letter,'');
            }
        };
        console.info('uploader', uploader);
        */
        /*
        $scope.show_lob_upload_file_dialog=function(bookingId,scope)
        {
            uploader.clearQueue();
            $http({
                method:"POST",
                url:"/api/rlob/rl_bookings/get-booking-by-id",
                data:{bookingId:bookingId}
            })
                .success(function(data) {
                    if(data.status=='success')
                    {

                        $scope.selectedBooking=data.data;
                        uploader.formData[0]={};
                        uploader.formData[0].booking_id=$scope.selectedBooking.BOOKING_ID;
                        uploader.formData[0].company_id=$scope.loginInfo.company_id;
                        uploader.formData[0].worker_name=$scope.selectedBooking.WRK_SURNAME;
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
        */

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
         * Gui loi nhan tu client
         */

        $scope.bookingMessage={};
        $scope.showDialogSendBookingMessage=function(assId,bookingId)
        {
            $scope.bookingMessage.assId=assId;
            $scope.bookingMessage.bookingId=bookingId;
            $('#lob-send-booking-message').modal({show:true,backdrop:'static'});
        }


        $scope.sendBookingMessage=function()
        {
            $scope.rlob_add_notification($scope.bookingMessage.assId,$scope.bookingMessage.bookingId,$scope.sourceName,$scope.bellType.message,$scope.notificationType.bell,$scope.bookingMessage.message);
            $("#lob-send-booking-message").modal('hide');
        }


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
                        if(data.data.DOCUMENT_STATUS == $scope.rlobDocumentStatus.notConfirmed.value){
                            data.data.style_class = 'rlob_document_status_not_confirmed'
                        }
                        else{
                            if(data.data.DOCUMENT_STATUS == $scope.rlobDocumentStatus.checked.value){
                                data.data.style_class = 'rlob_document_status_checked'
                            }
                            else{
                                if(data.data.DOCUMENT_STATUS == $scope.rlobDocumentStatus.noDocuments.value){
                                    data.data.style_class = 'rlob_document_status_no_document'
                                }
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
                                console.log(data.data.PATIENTS);
                                if (data.data.PATIENTS === null) {
                                    var patientName = $scope.selectedBooking.WRK_OTHERNAMES+" "+$scope.selectedBooking.WRK_SURNAME;
                                    rlobService.changeBooking(calID,patientID,patientName).then(function(data){
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
        /***
         * Change Appointment Calendar
         * tannv.dts@gmail.com
         */


        $scope.$watch('selectedAppointmentCalendar',function(oldValue,newValue){

            if($scope.selectedAppointmentCalendar)
            {
                rlobService.core.checkPeriodTimeToBooking(
                    $scope.selectedAppointmentCalendar.DOCTOR_ID,
                    $scope.selectedAppointmentCalendar.SITE_ID,
                    $scope.selectedAppointmentCalendar.FROM_TIME,
                    $scope.selectedAppointmentCalendar.RL_TYPE_ID
                )
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
                        $scope.showMsgDialog('.lob-msg-dialog','Medico-Legal','fail','Not enough time!');
                    }
                },function(err){
                    $scope.showMsgDialog('.lob-msg-dialog','Medico-Legal','fail','Error!');
                });

                
            }

        });


        $scope.selectedFilter={
            locationSelected:{},
            rltypeSelected:{},
            clnSpecialitySelected:{},
            doctorSelected:{},
            var1:{}
        }

        $scope.currentUpdatingItem={
            bookingId:null,
            calId:null,
            appointmentDateTime:null,
            newAppoimentDateTime:null,
            bookingIdChangeSuccess:null,
            assId:null
        };


        /***
         * tannv.dts@gmail.com
         * Su dung khi muon su dung rlob-choose-appointment-calendar-dialog
         * Dung de khoi tao date paginator
         */
        $('#lob-change-appointment-calendar-dialog').on('shown.bs.modal', function (e) {
            if(!$scope.usingForDialogFlag)
                $scope.usingForDialogFlag=0;
            $scope.usingForDialogFlag=$scope.usingForDialogFlag+1;
        });


        $scope.showDialogChangeAppointmentCalendar=function(bookingId,calId,appointmentDateTime,assId)
        {
            //alert(JSON.stringify([bookingId,calId,appointmentDateTime,assId]));
            $("#lob-change-appointment-calendar-dialog").modal({
                show:true,
                backdrop:'static'
            });
            $scope.currentUpdatingItem.bookingId=bookingId;
            $scope.currentUpdatingItem.calId=calId;
            $scope.currentUpdatingItem.appointmentDateTime=appointmentDateTime;
            $scope.currentUpdatingItem.assId=assId;
            //

        }

        $scope.changeAppointmentCalendar=function(newCalId,newAppointmentDateTime,doctorId,siteId,rlTypeId,specialityId)
        {
            var patientName = $scope.selectedBooking.WRK_OTHERNAMES+" "+$scope.selectedBooking.WRK_SURNAME;
            console.log("cu : "+$scope.selectedBooking.CAL_ID);
            console.log("moi : "+newCalId);
            console.log("id : "+$scope.selectedBooking.PATIENT_ID);
            console.log("name : "+patientName);
            rlobService.cancelBooking($scope.selectedBooking.CAL_ID,$scope.selectedBooking.PATIENT_ID).then(function(data){
                if (data.status == 'success') {
                    rlobService.changeBooking(newCalId,$scope.selectedBooking.PATIENT_ID,patientName).then(function(data){
                        if (data.status == 'success') {
                            $http({
                                method:"POST",
                                url:"/api/rlob/rl_bookings/admin/change-appointment-calendar",
                                data:{bookingId:$scope.currentUpdatingItem.bookingId,
                                    newCalId:newCalId,
                                    doctorId:doctorId,
                                    siteId:siteId,
                                    appointmentDate:moment(newAppointmentDateTime).format("YYYY/MM/DD HH:mm"),
                                    rlTypeId:rlTypeId,
                                    specialityId:specialityId
                                }
                            })
                            .success(function(data) {
                                if(data.status=='success')
                                {
                                    $("#lob-change-appointment-calendar-dialog").modal('hide');
                                    $scope.showMsgDialog(".lob-msg-dialog",'Change appointment calendar','success','Change appointment calendar success!');
                                    if(newAppointmentDateTime>=$scope.currentUpdatingItem.appointmentDateTime)
                                    {
                                        $scope.lobAdminSearch.fromDateKey=moment($scope.currentUpdatingItem.appointmentDateTime).format('DD/MM/YYYY');
                                        $scope.lobAdminSearch.toDateKey=moment(newAppointmentDateTime).format("DD/MM/YYYY");
                                    }
                                    else
                                    {
                                        $scope.lobAdminSearch.fromDateKey=moment(newAppointmentDateTime).format("DD/MM/YYYY");
                                        $scope.lobAdminSearch.toDateKey=moment($scope.currentUpdatingItem.appointmentDateTime).format('DD/MM/YYYY');
                                    }

                                    $http({
                                        method:"GET",
                                        url:"/api/rlob/appointment-calendar/check-same-doctor",
                                        params:{calId1:$scope.currentUpdatingItem.calId,calId2:newCalId}
                                    })
                                    .success(function(data) {
                                        if(data.status=='success')
                                        {
                                            if(data.data>1)
                                            {
                                                $scope.lobAdminSearch.doctorKey=null;
                                            }
                                            //$scope.rlob_add_notification=function(assId,refId,sourceName,rlobType,type,content)
                                            $scope.rlob_add_notification($scope.currentUpdatingItem.assId,$scope.currentUpdatingItem.bookingId,$scope.sourceName,$scope.bellType.changeCalendar,$scope.notificationType.bell,'');
                                        }
                                    })
                                    .error(function (data) {
                                        console.log("error");
                                    })
                                    .finally(function() {
                                        $scope.currentUpdatingItem.newAppoimentDateTime=newAppointmentDateTime;
                                        $scope.newAppointmentPositionFlag=true;
                                        $scope.currentUpdatingItem.bookingIdChangeSuccess=$scope.currentUpdatingItem.bookingId;
                                        $scope.filterBooking();
                                    });
                                }
                            })
                            .error(function (data) {
                                console.log("error");
                            })
                            .finally(function() {

                            });
                        };
                    });
                }
                else{
                    $("#lob-change-appointment-calendar-dialog").modal('hide');
                    $scope.showMsgDialog(".lob-msg-dialog",'Change appointment calendar','fail','Change appointment calendar fail!');
                };
            });
            
        }

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
                        if(data.data.DOCUMENT_STATUS == $scope.rlobDocumentStatus.notConfirmed.value){
                            data.data.style_class = 'rlob_document_status_not_confirmed'
                        }
                        else{
                            if(data.data.DOCUMENT_STATUS == $scope.rlobDocumentStatus.checked.value){
                                data.data.style_class = 'rlob_document_status_checked'
                            }
                            else{
                                if(data.data.DOCUMENT_STATUS == $scope.rlobDocumentStatus.noDocuments.value){
                                    data.data.style_class = 'rlob_document_status_no_document'
                                }
                            }
                        }
                        $scope.showDetailPanel=true;
                        $scope.selectedBooking=data.data;
                    }
                });
            }

        }


        /***
         * Local notification for admin
         * tannv.dts@gmail.com
         */
        //----------------------------------------------------------------------------------




        $scope.listBookingNotification=[];

        $scope.localNotificationType={
            type1:{
                header:'Change Appointment Status',
                alias:'passBookingNotChangeStatus'
            },
            type2:{
                header:'Waiting on Paperwork',
                alias:'upcommingBookingHaveNotDucment'
            },
            type3:{
                header:'Outstanding reports',
                alias:'passBookingHaveNotResult'
            }

        }

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

        /***
         * Danh sach cac booking sap toi va client chua upload document
         * tannv.dts@gmail.com
         */
        $scope.listUpcommingBookingHaveNotClientDocument=[];
        $scope.getUpcommingBookingHaveNotClientDocument=function(doctorId)
        {
            rlobService.getUpcommingBookingHaveNotClientDocument($scope.bookingType,doctorId)
                .then(function(data){
                    if(data.status=='success')
                    {
                        $scope.listUpcommingBookingHaveNotClientDocument=data.data;
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
        $scope.listPassBookingHaveNotResult=[];
        $scope.getListPassBookingHaveNotResult=function(doctorId)
        {
            rlobService.getPassBookingHaveNotResult($scope.bookingType,doctorId)
                .then(function(data){
                    if(data.status=='success')
                    {
                        $scope.listPassBookingHaveNotResult=data.data;
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
        $scope.showListBookingNotification=function(notificationType)
        {
            switch(notificationType)
            {
                case $scope.localNotificationType.type1.alias:
                    $scope.listBookingNotification=$scope.listPassBookingNotChangeStatus;
                    $scope.listBookingNotificationHeader=$scope.localNotificationType.type1.header;
                    break;
                case $scope.localNotificationType.type2.alias:
                    $scope.listBookingNotification=$scope.listUpcommingBookingHaveNotClientDocument;
                    $scope.listBookingNotificationHeader=$scope.localNotificationType.type2.header;
                    break;
                case $scope.localNotificationType.type3.alias:
                    $scope.listBookingNotification=$scope.listPassBookingHaveNotResult;
                    $scope.listBookingNotificationHeader=$scope.localNotificationType.type3.header;
                    break;
            }
            $("#list-booking-notification-popup").modal({show:true,backdrop:'static'});

//            $scope.filterBooking

        }

        /**
         * Khi tat danh sach xem cac booking local notification thi chay lai tree booking
         * muc dich de dong nhat data
         * tannv.dts@gmail.com
         */
        $('#list-booking-notification-popup').on('hidden.bs.modal', function (e) {
            $scope.filterBooking();
        });

        /***
         * Cap nhat cac local admin notification
         * tannv.dts@gmail.com
         */
        $scope.updateAdminLocalNotification=function()
        {
            var doctorId=$scope.doctorInfo?$scope.doctorInfo.doctor_id:'';
            $scope.getPassBookingNotChangeStatus(doctorId);
            $scope.getUpcommingBookingHaveNotClientDocument(doctorId);
            $scope.getListPassBookingHaveNotResult(doctorId);
        }

        if($scope.loginInfo.UserType.user_type==rlobConstant.userType.doctor)
        {
            $scope.getDoctorInfoByUserId()
                .then($scope.filterBooking)
                .then($scope.updateAdminLocalNotification)
        }
        else
        {
            $scope.filterBooking();
            $scope.updateAdminLocalNotification();
        }

        //$scope.updateAdminLocalNotification();
        /**
         * Thêm function cap nhat admin local notification vao schedule
         * tannv.dts@gmail.com
         */
        $scope.scheduleList.rlobUpdateAdminLocalNotification=$scope.updateAdminLocalNotification;

//        $scope.$watch('listPassBookingNotChangeStatus', function(oldValue,newValue){
//            if($scope.listPassBookingNotChangeStatus.length>0)
//            {
//                var msg=$scope.listPassBookingNotChangeStatus.length +' pass booking not change status';
//                $scope.showNotificationPopup('.rlob_admin_local_notification_popup',msg,$scope.notificationColor.danger);
//            }
//
//        })
//        $scope.$watch('listUpcommingBookingHaveNotClientDocument', function(oldValue,newValue){
//            if($scope.listUpcommingBookingHaveNotClientDocument.length>0)
//            {
//                var msg=$scope.listUpcommingBookingHaveNotClientDocument.length +' upcomming bookings have not document';
//                $scope.showNotificationPopup('.rlob_admin_local_notification_popup',msg,$scope.notificationColor.danger);
//            }
//
//        })
//        $scope.$watch('listPassBookingHaveNotResult', function(oldValue,newValue){
//            if($scope.listPassBookingHaveNotResult.length>0)
//            {
//                var msg=$scope.listPassBookingHaveNotResult.length +' pass booking have not result';
//                $scope.showNotificationPopup('.rlob_admin_local_notification_popup',msg,$scope.notificationColor.danger);
//            }
//        })


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
        $scope.rlobDocumentStatus=rlobConstant.documentStatus;

        //chien change documents status
        // phanquocchien.c1109g@gmail.com
        $scope.rlob_document_change_status=function(bookingId,status)
        {
            rlobService.changeDocumentStatus(bookingId,status)
                .then(function(data){
                    if(data.status=='success')
                    {
                        var styleClass = '';
                        if(status == $scope.rlobDocumentStatus.notConfirmed.value){
                            styleClass = 'rlob_document_status_not_confirmed'
                        }
                        else{
                            if(status == $scope.rlobDocumentStatus.checked.value){
                                styleClass = 'rlob_document_status_checked'
                            }
                            else{
                                if(status == $scope.rlobDocumentStatus.noDocuments.value){
                                    styleClass = 'rlob_document_status_no_document'
                                }
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
        rlobService.getListBookingMessages().then(function(data){
            $scope.ListBookingMessages = data;
        });
        
        $scope.check = function(aa){
            $scope.bookingMessage.message = aa;
        };
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
        $scope.openOutlook = function(){
            $scope.emailContent=
                "{Title} Redimed Medico-Legal Newsletter\n\n"+
                "{Title} News\n"+
                "Section for us to easily update\n"+
                "{Title} Appointment Availability\n"+
                "Section for us to easily update\n"+
                "Contact Medico-Legal Department at Redimed on (08) 9230 0900 or log to the online booking system link\n";
            rlobService.listMailUserOnlineBooking().then(function(data){
                if (data.status == 'success') {
                    var recepient = '"'+data.data+'"';
                    var options = {
                        subject: ("Medico-Legal Newsletter"),
                        body: $scope.emailContent
                    };
                    console.log(recepient);
                    $scope.mailtoLink = Mailto.url(recepient, options);
                    $window.location.href = $scope.mailtoLink;
                };
            })
        }

        $scope.rechedule=function()
        {
            var bookingBehalfInfo={
                ASS_SURNAME:$scope.selectedBooking.ASS_SURNAME,
                ASS_OTHERNAMES:$scope.selectedBooking.ASS_OTHERNAMES,
                ASS_CONTACT_NO:$scope.selectedBooking.ASS_CONTACT_NO,
                ASS_EMAIL:$scope.selectedBooking.ASS_EMAIL,
                ASS_ID:$scope.selectedBooking.ASS_ID
            }
            bookingService.setBookingBehalfInfo(bookingBehalfInfo);
            bookingService.setBookingInfoReuse($scope.selectedBooking);
            $state.go("loggedIn.rlob.rlob_booking");
        }
    });
