/**
 * Created by tannv.dts@gmail.com on 9/17/2014.
 */

angular.module('app.loggedIn.rlob.adminBookingList.controller',[])
        .controller("rlob_admin_bookingListController", function($scope, $http,$window,$q,rlTypesService,doctorsService,locationService,FileUploader,$cookieStore,$interval) {
        $scope.status=false;
        $scope.sourceName="REDiLEGAL";
        $scope.notificationType={
            'changeStatus':"Change Booking Status",
            'result': 'has resulted'
        }
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
                        ASS_ID:item.ASS_ID,
                        BOOKING_ID: item.BOOKING_ID,
                        Company_name:item.Company_name,
                        WRK_SURNAME:item.WRK_SURNAME,
                        STATUS:item.STATUS,
                        DISPLAY:"["+item.APPOINTMENT_TIME+"] - ["+item.WRK_SURNAME+"] - ["+item.Company_name+"]",
                        style_class:'lob_admin_booking_node'
                    });
                }

                if (item.FILE_ID!=null &&!dateMaker[item.APPOINTMENT_DATE][item.DOCTOR_ID][item.BOOKING_ID][item.FILE_ID]) {
                    dateMaker[item.APPOINTMENT_DATE][item.DOCTOR_ID][item.BOOKING_ID][item.FILE_ID] = {};
                    dateMaker[item.APPOINTMENT_DATE][item.DOCTOR_ID][item.BOOKING_ID].BOOKING_FILE_ITEMS.push({
                        PARENT_ID:item.BOOKING_ID,
                        FILE_ID: item.FILE_ID,
                        FILE_NAME:item.FILE_NAME,
                        FILE_PATH:item.FILE_PATH,
                        isClientDownLoad:item.isClientDownLoad,
                        DISPLAY: item.FILE_NAME,
                        style_class:'lob_admin_booking_file_node'
                    });
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

                    for(var k=0;k<dateMaker[date_item.APPOINTMENT_DATE][doctor_item.DOCTOR_ID].BOOKING_ITEMS.length;k++)
                    {
                        var booking_item=dateMaker[date_item.APPOINTMENT_DATE][doctor_item.DOCTOR_ID].BOOKING_ITEMS[k];
                        node.nodes[j].nodes[k].nodes=[];
                        node.nodes[j].nodes[k].nodes=
                            dateMaker[date_item.APPOINTMENT_DATE][doctor_item.DOCTOR_ID][booking_item.BOOKING_ID].BOOKING_FILE_ITEMS;
                    }
                }
                $scope.mydata.push(node);
            }
        };

        //-------------------------------------------------------------

        /**
         * Lay toan bo danh sach booking
         * tannv.dts@gmail.com
         */
        /*
         $http({
         method:"GET",
         url:"/api/rlob/rl_bookings/list-booking-admin"
         })
         .success(function(data) {
         $scope.parseBookingList(data);
         })
         .error(function (data) {
         alert("insert fail");
         })
         .finally(function() {

         });
         */
        //-------------------------------------------------------------

        /**
         * Tao filter noi dung
         * tannv.dts@gmail.com
         */
        $scope.lobAdminSearch={fromDateKey:moment().format("DD-MM-YYYY"),toDateKey:moment().add(30,'d').format("DD-MM-YYYY")};
        $scope.filterBooking=function()
        {
            var fromDate=moment($scope.lobAdminSearch.fromDateKey,'DD-MM-YYYY');
            var toDate=moment($scope.lobAdminSearch.toDateKey,'DD-MM-YYYY');
            var doctorKey=$scope.lobAdminSearch.doctorKey!=null && $scope.lobAdminSearch.doctorKey!=undefined?$scope.lobAdminSearch.doctorKey:'';
            var workerKey=$scope.lobAdminSearch.workerKey!=null && $scope.lobAdminSearch.workerKey!=undefined?$scope.lobAdminSearch.workerKey:'';
            $http({
                method:"GET",
                url:"/api/rlob/rl_bookings/admin/filter-booking",
                params:{
                    fromDateKey:fromDate.format("YYYY-MM-DD"),
                    toDateKey:toDate.format("YYYY-MM-DD"),
                    doctorKey:doctorKey,
                    workerKey:workerKey
                }
            })
                .success(function(data) {
                    $scope.parseBookingList(data);
                })
                .error(function (data) {
                    console.log("error");
                })
                .finally(function() {

                });
        };

        $scope.filterBooking();

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


        //    $scope.data = [{
        //        "id": 1,
        //        "title": "node1",
        //        "nodes": [
        //            {
        //                "id": 11,
        //                "title": "node1.1",
        //                "nodes": [
        //                    {
        //                        "id": 111,
        //                        "title": "node1.1.1",
        //                        "nodes": []
        //                    }
        //                ]
        //            },
        //            {
        //                "id": 12,
        //                "title": "node1.2",
        //                "nodes": []
        //            }
        //        ]
        //    }, {
        //        "id": 2,
        //        "title": "node2",
        //        "nodes": [
        //            {
        //                "id": 21,
        //                "title": "node2.1",
        //                "nodes": []
        //            },
        //            {
        //                "id": 22,
        //                "title": "node2.2",
        //                "nodes": []
        //            }
        //        ]
        //    }, {
        //        "id": 3,
        //        "title": "node3",
        //        "nodes": [
        //            {
        //                "id": 31,
        //                "title": "node3.1",
        //                "nodes": []
        //            }
        //        ]
        //    }];

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
            return d.format("DD-MM-YYYY");
        }

        $scope.getRlTypeName=function(id)
        {
            return rlTypesService.getTypeById(id).Rl_TYPE_NAME;
        }

        $scope.getDoctorName=function(id)
        {
            return doctorsService.getDoctorById(id).NAME;
        }
        $scope.getDoctorAddress=function(id)
        {
            return doctorsService.getDoctorById(id).Address;
        }

        $scope.getLocationAddress=function(id)
        {
            return locationService.getLocationById(id).Site_addr;
        }


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
            var address=$scope.getLocationAddress($scope.selectedBooking.SITE_ID);
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

        $scope.showBookingDetailDialog=function(bookingId)
        {
            $http({
                method:"GET",
                url:"/api/rlob/rl_bookings/get-booking-by-id",
                params:{bookingId:bookingId}
            })
            .success(function(data) {
                if(data.status=='success')
                {
                    $scope.selectedBooking=data.data;
                    $("#view-detail-booking-dialog").modal({show:true,backdrop:'static'});
                    codeAddress();
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

        //---------------------------------------------------------------
        //HANDLE UPLOAD FILES
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
            var fileInfo=response.fileInfo;
            var refId=angular.copy(fileInfo.BOOKING_ID);

            fileInfo.DISPLAY=fileInfo.FILE_NAME;
            fileInfo.style_class='lob_admin_booking_file_node';
            fileInfo.BOOKING_ID=null;
            $scope.currentNode.nodes.push(fileInfo);
            console.info('onSuccessItem', fileItem, response, status, headers);
            //Put notification
            if(fileInfo.isClientDownLoad==1)
            {
                $scope.rlob_add_notification($scope.loginInfo.id,refId,$scope.sourceName,$scope.notificationType.result);
            }


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



        $scope.show_lob_upload_file_dialog=function(bookingId,scope)
        {
            uploader.clearQueue();
            $http({
                method:"GET",
                url:"/api/rlob/rl_bookings/get-booking-by-id",
                params:{bookingId:bookingId}
            })
                .success(function(data) {
                    if(data.status=='success')
                    {

                        $scope.selectedBooking=data.data;
                        uploader.formData[0]={};
                        uploader.formData[0].booking_id=$scope.selectedBooking.BOOKING_ID;
                        uploader.formData[0].company_id=$scope.loginInfo.company_id;
                        uploader.formData[0].worker_name=$scope.selectedBooking.WRK_SURNAME;
        //                    uploader.formData[0].push({booking_id:$scope.selectedBooking.BOOKING_ID,company_id:$scope.loginInfo.company_id,worker_name:$scope.selectedBooking.WRK_SURNAME});
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
         * Luu notification
         * @param userId: id cua nguoi dang nhap
         * @param refId: id cua booking
         * @param sourceName: booking type
         * @param msg: noi dung thong bao
         * tannv.dts@gmail.com
         */
        $scope.rlob_add_notification=function(userId,refId,sourceName,type)
        {
            var deferred=$q.defer();
            var promise=deferred.promise;
            promise.then(function(data){
                var msg="["+sourceName+"]-" + "["+type+"]-"
                    + "["+data.WRK_SURNAME + ":"+moment(data.BOOKING_DATE).format("DD-MM-YYYY hh:mm") +"]-"
                    + "[at: "+moment().format("DD-MM-YYYY hh:mm:ss")+"]";
                console.log("GGGGGGGGGGG>>>>>>>:"+msg);
                $http({
                    method:"POST",
                    url:"/api/rlob/sys_user_notifications/add-notification",
                    data:{userId:userId,refId:refId,sourceName:sourceName,msg:msg}
                })
                .success(function(data) {
                    if(data.status=='success')
                    {

                    }
                    else
                    {

                    }
                })
                .error(function (data) {

                })
                .finally(function() {

                });
            },function(reason){

            });

            $http({
                method:"GET",
                url:"/api/rlob/rl_bookings/get-booking-by-id",
                params:{bookingId:refId}
            })
            .success(function(data) {
                if(data.status=='success')
                {
                    deferred.resolve(data.data);
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
                    $scope.showMsgDialog(".lob-msg-dialog",'Change Booking Status','success','Changing status to ['+status+'] success!');
                    var userId=assId;
                    var refId=bookingId;
                    $scope.rlob_add_notification(userId,refId,$scope.sourceName,$scope.notificationType.changeStatus);
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

        $scope.lob_change_booking_file_role=function(fileId,role,scope)
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
                    var userId=$scope.loginInfo.id;
                    var refId=scope.$modelValue.PARENT_ID;
                    if(role==1)
                        $scope.rlob_add_notification(userId,refId,$scope.sourceName,$scope.notificationType.result);
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

        //---------------------------------------------------------------------------------------------------
        //Tạo schedule update notification
        //tannv.dts@gmail.com
        //
        $scope.updateNotificationManual=function(){

        }


        $scope.showNotificationPopup=function(styleClass,msg)
        {
            $(styleClass).notify({
                message: { text: msg },
                type:'warning'
            }).show();
        }
        var notificationSchedule;
        $scope.updateNotification = function() {
            // Don't start a new fight if we are already fighting
            if ( angular.isDefined(notificationSchedule) ) return;
            notificationSchedule = $interval(function() {
//                alert('toi ne');
                $http({
                    method:"GET",
                    url:"/api/rlob/sys_user_notifications/get-new-notifications",
                    params:{userId:10,currentIndex:20}
                })
                .success(function(data) {
                    if(data.status=='success')
                    {
                        for(var i=0;i<data.data.length;i++)
                        {
                            $scope.showNotificationPopup(".lob_notification_popup",data.data[i].msg);
                        }
                    }
                })
                .error(function (data) {
                    console.log("error");
                })
                .finally(function() {

                });
            }, 2000);
        };

        $scope.stopUpdateNotification = function() {
            if (angular.isDefined(notificationSchedule)) {
                $interval.cancel(notificationSchedule);
                notificationSchedule = undefined;
            }
        };

        $scope.$on('$destroy', function() {
            // Make sure that the interval is destroyed too
            $scope.stopUpdateNotification();
        });

});





