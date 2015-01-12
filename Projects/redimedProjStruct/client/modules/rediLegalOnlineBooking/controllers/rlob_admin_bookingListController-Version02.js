/**
 * Created by tannv.dts@gmail.com on 9/17/2014.
 */

angular.module('app.loggedIn.rlob.adminBookingList.controller',[])
        .controller("rlob_admin_bookingListController", function($scope, $http,$window,$q,$stateParams,rlTypesService,doctorsService,locationService,FileUploader,$cookieStore,$interval) {
        //Internal Variable
        //Bien haveNodeFile quy dinh cac file co xuat hien trong tree hay khong
        $scope.haveNodeFile=false;
        $scope.isAdminUpload=true;
        $scope.isAdminGetFiles=true;
        $scope.accordionStatus={status1:true};
        //tannv.dts@gmail.com
        $scope.bookingType='REDiLEGAL';
        if($stateParams.bookingType && $stateParams.bookingType=='Vaccination') {
            $scope.bookingType = $stateParams.bookingType;
        }
        //alert($scope.bookingType);
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
//        $scope.rlobNotificationType={
//            'changeStatus':"Change Booking Status",
//            'result': 'Result',
//            'message': 'Message',
//            'changeCalendar':'Change Appointment Calendar'
//        }
        $scope.rlobNotificationType=rlobConstant.rlobNotificationType;
        var initPickers = function () {

            //init date pickers
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                autoclose: true
            }).on('changeDate',function(evn){

            });

        }
        initPickers();
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

        //Lay toan bo thong tin rlType
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
        //----------------------------------------------
        //Lay toan bo thong tin cac doctor
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
        //----------------------------------------------
        //Lay toan bo location
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
        //----------------------------------------------


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
                    dateMaker[item.APPOINTMENT_DATE][item.DOCTOR_ID].BOOKING_ITEMS.push({
                        APPOINTMENT_TIME:item.APPOINTMENT_TIME,
                        APPOINTMENT_DATETIME:item.APPOINTMENT_DATETIME,
                        CAL_ID:item.CAL_ID,
                        ASS_ID:item.ASS_ID,
                        BOOKING_ID: item.BOOKING_ID,
                        Company_name:item.Company_name,
                        WRK_SURNAME:item.WRK_SURNAME,
                        STATUS:item.STATUS,
                        DISPLAY:"["+item.APPOINTMENT_TIME+" - "+item.Site_name+"] - ["+item.WRK_SURNAME+" - "+item.Company_name+"]",
                        DISPLAY1:"- Site: "+item.Site_name,
                        DISPLAY2:  "- Patient: "+item.WRK_SURNAME,
                        DISPLAY3:  "- Company: "+item.Company_name,
                        style_class:'lob_admin_booking_node'
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
                var node= {APPOINTMENT_DATETIME:date_item.APPOINTMENT_DATETIME,APPOINTMENT_DATE:date_item.APPOINTMENT_DATE,DISPLAY:date_item.DISPLAY,nodes:[],style_class:'lob_admin_date_node'};
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
                rlobHelper.setSlimCroll(".treeScroll");
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
            doctorKey:null,
            workerKey:null
        };
        $scope.filterBooking=function()
        {
            var fromDate=moment($scope.lobAdminSearch.fromDateKey,'DD/MM/YYYY');
            var toDate=moment($scope.lobAdminSearch.toDateKey,'DD/MM/YYYY');
            var doctorKey=$scope.lobAdminSearch.doctorKey!=null && $scope.lobAdminSearch.doctorKey!=undefined?$scope.lobAdminSearch.doctorKey:'';
            var workerKey=$scope.lobAdminSearch.workerKey!=null && $scope.lobAdminSearch.workerKey!=undefined?$scope.lobAdminSearch.workerKey:'';

            $http({
                method:"GET",
                url:"/api/rlob/rl_bookings/admin/filter-booking",
                params:{
                    fromDateKey:fromDate.format("YYYY-MM-DD"),
                    toDateKey:toDate.format("YYYY-MM-DD"),
                    doctorKey:doctorKey,
                    workerKey:workerKey,
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

        if($scope.loginInfo.UserType.user_type=='Doctor')
        {
            $scope.getDoctorInfoByUserId()
            .then($scope.filterBooking);
        }
        else
        {
            $scope.filterBooking();
        }


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

        $scope.getDoctorAddress=function(id)
        {
            return doctorsService.getDoctorById(id).Address;
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
                $scope.rlob_add_notification(fileInfo.ASS_ID,refId,$scope.sourceName,$scope.rlobNotificationType.result,$scope.notificationType.letter,'');
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
            $scope.add_notification($scope.bookingMessage.assId,$scope.bookingMessage.bookingId,$scope.sourceName,$scope.rlobNotificationType.message,$scope.notificationType.bell,$scope.bookingMessage.message);
            $("#lob-send-booking-message").modal('hide');
        }


        /**
         * Chuyen doi status cua Booking
         * @param status
         */
        $scope.lob_change_status=function(assId,bookingId,status,scope)
        {
            $http({
                method:"POST",
                url:"/api/rlob/rl_bookings/lob-change-status",
                data:{bookingId:bookingId,status:status}
            })
            .success(function(data) {
                if(data.status=='success')
                {
                    scope.$modelValue.STATUS=status;
                    $scope.selectedBooking.STATUS=status;
                    var refId=bookingId;
                    $scope.rlob_add_notification(assId,refId,$scope.sourceName,$scope.rlobNotificationType.changeStatus,$scope.notificationType.bell,status);
                    $scope.showMsgDialog(".lob-msg-dialog",'Change Booking Status','success','Changing status to ['+status+'] success!');
                }
                else
                {
                    $scope.showMsgDialog(".lob-msg-dialog",'Change Booking Status','fail','Changing status to ['+status+'] fail!');
                }
            })
            .error(function (data) {
                $scope.showMsgDialog(".lob-msg-dialog",'Change Booking Status','fail','Changing status to ['+status+'] fail!');
            })
            .finally(function() {

            });
        }


        /**
         * Tuy chon client co the download file hay khong
         * @param fileId
         * @param role
         */

        $scope.lob_change_booking_file_role=function(assId,fileId,role,scope)
        {
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
                        $scope.rlob_add_notification(assId,refId,$scope.sourceName,$scope.rlobNotificationType.result,$scope.notificationType.letter,'');
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

        $scope.selectedFilter={
            locationSelected:{},
            rltypeSelected:{},
            clnSpecialitySelected:{},
            doctorSelected:{},
            var1:{}
        }



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

        //Get all rl_types

        $scope.getRlTypesFilter=function()
        {
            $http({
                method:"GET",
                url:"/api/rlob/rl_types/list"
            })
            .success(function(data) {
                $scope.rltypesFilter=data;
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
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+fromTime);
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


        $('#lob-change-appointment-calendar-dialog').on('shown.bs.modal', function (e) {
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
            var datePaginator=new MyDatePaginator('#mydatepaginatorfilter',$scope.selectedFilter.var1,datePaginatorChanged);
        })

        $scope.currentUpdatingItem={
            bookingId:null,
            calId:null,
            appointmentDateTime:null,
            newAppoimentDateTime:null,
            bookingIdChangeSuccess:null,
            assId:null
        };

        $scope.showDialogChangeAppointmentCalendar=function(bookingId,calId,appointmentDateTime,assId)
        {
            $("#lob-change-appointment-calendar-dialog").modal({
                show:true,
                backdrop:'static'
            });
            $scope.currentUpdatingItem.bookingId=bookingId;
            $scope.currentUpdatingItem.calId=calId;
            $scope.currentUpdatingItem.appointmentDateTime=appointmentDateTime;
            $scope.currentUpdatingItem.assId=assId;
            $scope.updateAppoinmentsList();
        }

        $scope.changeAppointmentCalendar=function(newCalId,newAppointmentDateTime,doctorId,siteId)
        {
            $http({
                method:"POST",
                url:"/api/rlob/rl_bookings/admin/change-appointment-calendar",
                data:{bookingId:$scope.currentUpdatingItem.bookingId,
                    newCalId:newCalId,
                    doctorId:doctorId,
                    siteId:siteId,
                    appointmentDate:moment(newAppointmentDateTime).format("YYYY/MM/DD HH:mm"),
                    rlTypeId:$scope.selectedFilter.rltypeSelected.RL_TYPE_ID,
                    specialityId:$scope.selectedFilter.clnSpecialitySelected.Specialties_id
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
                            $scope.rlob_add_notification($scope.currentUpdatingItem.assId,$scope.currentUpdatingItem.bookingId,$scope.sourceName,$scope.rlobNotificationType.changeCalendar,$scope.notificationType.bell,'');
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


});





