angular.module("app.loggedIn.controller",[
])

.controller("callDialogController",function($scope, $state,$modalInstance, UserService,socket,toastr ,userInfo,$cookieStore,notify){

        var audio = new Audio('theme/assets/notification.mp3');
        audio.loop = true;
        audio.play();



        socket.on("messageReceived",function(fromId,fromUser,message){
            if(message.type == 'cancel')
            {
                audio.pause();
                notify.close();
                $modalInstance.close();
            }
        })


        if(userInfo){
            $scope.username = userInfo.user_name;

            if(data.img)
                $scope.img = userInfo.img;
            else
                $scope.img = "theme/assets/icon.png"
        }


        $scope.ignoreCall = function(){
            audio.pause();
            notify.close();
            $modalInstance.close();
            socket.emit("sendMessage",$cookieStore.get('userInfo').id,userInfo.id,{type:'ignore'});
        }

        $scope.acceptCall = function(){
            audio.pause();
            notify.close();
            $modalInstance.close();
            $state.go("call",{callUser:userInfo.id,isCaller:false},{reload:true});
        }

    })

.controller("loggedInController", function($scope, $state, $cookieStore,$modal,$filter, UserService,$http,$interval,$q, ConfigService,rlobService,$timeout,socket,toastr){

    socket.on("forceLogout",function(){

        toastr.error("Someone Is Logged Into Your Account!");

        $cookieStore.remove("userInfo");
        $cookieStore.remove("companyInfo");
        $cookieStore.remove("doctorInfo");
        $cookieStore.remove("fromState");
        $state.go("security.login",null,{location: "replace", reload: true});

        socket.removeAllListeners();
    })


    socket.on("messageReceived",function(fromId,fromUser,message){
        if(message.type == 'call')
        {
            var options = {
                body: fromUser + " Is Calling You...",
                icon: "theme/assets/icon.png",
                dir : "ltr"
            };
            var notification = new Notification("You Have A Call!",options);

            notification.onclick = function(){
                window.open().close();
                window.focus();
            }

            UserService.getUserInfo(fromId).then(function(data){
                if(data)
                {
                    var modalInstance = $modal.open({
                        templateUrl: 'common/views/dialog/callDialog.html',
                        controller: 'callDialogController',
                        size: 'sm',
                        resolve:{
                            userInfo: function(){
                                return data;
                            },
                            notify: function(){
                                return notification;
                            }
                        },
                        backdrop: 'static',
                        keyboard: false
                    })
                }
            })


        }
    })

    $scope.userImg = null;
    $scope.onlineUsers = [];
    $scope.onlineUsersTemp = [];

    UserService.getOnlineUsers().then(function(data){
        $scope.onlineUsers = data;
        $scope.onlineUsersTemp = data;
    })

    socket.on("online",function(data){
        $scope.onlineUsers = [];
        $scope.onlineUsers = data;
        $scope.onlineUsersTemp = data;
    })

    $scope.searchOnlineUser = function(str){
        $scope.onlineUsers = $filter('filter')($scope.onlineUsersTemp, {
            username: str
        });
    }

    $scope.makeCall = function(user){
        $state.go("call",{callUser:user.id,isCaller:true},{reload:true});
    }


    // DATE
    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        dateFormat: "dd/mm/yy"
    };
    
    $scope.reloadpage = function () {
        $state.go($state.current, {}, {reload: true});
    }

    // OPTIONS
    $scope.options = {
        titles: ConfigService.title_option(),
        sexes: ConfigService.sex_option(),
        sms: ConfigService.yes_no_option(),
        gaps: ConfigService.yes_no_option(),
        acc_types: ConfigService.acc_type_option(),
        app_types: ConfigService.app_type_option(),
        priorities: ConfigService.priority_option(),
        timetable_dow: ConfigService.timetable_dow_option(),
        weeks_of_month: ConfigService.number_of_week_option(),

        month_in_year: ConfigService.month_in_year(),
        date_in_month: ConfigService.date_in_month(),
        invoice_status: ConfigService.invoice_status_option(),
    }

    var loadOptionsApi = function(){
        ConfigService.countries_option().then(function(response){
            if(response.status === 'success')
                $scope.options.countries = response.data;
        })

        ConfigService.redimedsite_option().then(function(response){
            if(response.status === 'success')
                $scope.options.redimedsites = response.data;
        })

        ConfigService.rl_type_option().then(function(response){
            if(response.status === 'success'){
                $scope.options.rl_types = response.data;
            }
        })

        ConfigService.title_option().then(function(response){
            if(response.status === 'success')
                $scope.options.titles = response.data;
        })

        ConfigService.provider_option().then(function(response){
            if(response.status === 'success')
                $scope.options.providers = response.data;
        })

        ConfigService.department_option().then(function(response){
            if(response.status === 'success')
                $scope.options.departments = response.data;
        })

        ConfigService.qualification_option().then(function(response){
            if(response.status === 'success')
                $scope.options.qualifications = response.data;
        })

        ConfigService.account_type_option().then(function(response){
            if(response.status === 'success')
                $scope.options.account_types = response.list;
        })

        ConfigService.private_type_option().then(function(response){
            if(response.status === 'success')
                $scope.options.private_types = response.list;
        })

        ConfigService.referral_source_option().then(function(response){
            if(response.status === 'success')
                $scope.options.referral_types = response.list;
        })

        ConfigService.marial_status_option().then(function(response){
            if(response.status === 'success')
                $scope.options.marial_status_types = response.list;
        })

        ConfigService.culture_option().then(function(response){
            if(response.status === 'success')
                $scope.options.culture_types = response.list;
        })

        ConfigService.language_option().then(function(response){
            if(response.status === 'success')
                $scope.options.language_types = response.list;
        })

        /*ConfigService.doctors_option().then(function(response){
            if(response.status === 'success')
                $scope.options.doctor_types = response.data;
        })

        ConfigService.patients_option().then(function(response){
            if(response.status === 'success')
                $scope.options.patient_types = response.data;
        })*/

        ConfigService.taxes_option().then(function(data){
            $scope.options.taxes = data;
        });
        ConfigService.prefix_headers_option('item').then(function(data){
            $scope.options.prefix_headers = data;
        });

        ConfigService.fee_type_option().then(function(response){
            if(response.status === 'success')
                $scope.options.fee_types = response.data;
        });



        /*ConfigService.provider_types_option().then(function(data){
            $scope.options.provider_types = data;
        });*/
        
        ConfigService.inv_uoms_option().then(function(data){
            $scope.options.uoms = data;
        });
    }

    loadOptionsApi();
    // END OPTIONS

    var userInfo = null;
    if( typeof $cookieStore.get('userInfo') != 'undefined')
         userInfo = $cookieStore.get('userInfo');
    if(userInfo != null)
    {
        $scope.userInfo=userInfo;
        $scope.user = userInfo.Booking_Person;
    }
    $scope.loggedInMenus = [];
    $scope.selectedMenu = null;

    UserService.getUserInfo(userInfo.id).then(function(data){
        if(data.img)
           $scope.userImg = data.img;
        else
            $scope.userImg = "theme/assets/icon.png"
    })



    // Load before logged in    
    var loadLoggedIn = function(){
        // MENU


        UserService.menu(userInfo.id).then(function(response){
            if(response != null || typeof response != 'undefined')
            {
                var i = 0;
                angular.forEach(response, function(menu){
                    if(menu.Parent_Id === -1)
                        $scope.loggedInMenus.push({"parent": {"name": menu.Description, "icon": menu.MenuIcon, "definition":menu.MenuDefinition , "menu_id": menu.Menu_Id, "childs":[]}});
                    else{
                        var j = 0;
                        angular.forEach($scope.loggedInMenus, function(lmenu){
                            if(lmenu.parent.menu_id === menu.Parent_Id){

                                $scope.loggedInMenus[j].parent.childs.push({"name": menu.Description , "definition":menu.Definition, "id": menu.Menu_Id});
                            }
                            j++;
                        })
                    }
                    i++;
                });

                console.log($scope.loggedInMenus);
            }

        });
        // END MENU
    }

    loadLoggedIn();
    //End load before logged in

    $scope.menuParentClick = function(state){
        if(state != null && state != ' ' && state != undefined)
            $state.go(state);

    }

    $scope.lockscreen = function(){
        $state.go('lockscreen',null,{location: "replace", reload: true});
    }

    //Logout
    $scope.logout = function(){
        socket.emit('logout',$cookieStore.get("userInfo").user_name,$cookieStore.get("userInfo").id,$cookieStore.get("userInfo").UserType.user_type,null);

        socket.on('logoutSuccess',function(){
            $cookieStore.remove("userInfo");
            $cookieStore.remove("companyInfo");
            $cookieStore.remove("doctorInfo");
            $cookieStore.remove("fromState");
            $state.go("security.login",null,{location: "replace", reload: true});

            socket.removeAllListeners();
        })

    }

    // Toggle Menu
    $scope.toggle = false;

    $scope.toggleMenu = function(){
        $scope.toggle = !$scope.toggle;

        if($scope.toggle){
            angular.element("#main-page").addClass("page-sidebar-closed");
            angular.element("#main-menu").addClass("page-sidebar-menu-closed");
        }else{
            angular.element("#main-page").removeClass("page-sidebar-closed");
            angular.element("#main-menu").removeClass("page-sidebar-menu-closed");
        }
    }
    // End Toggle Menu
//-------------------------------------------------------------------------------
    //Xu ly notification
    //tannv.dts@gmail.com
    //2-10-2014


        $scope.$on('$idleTimeout', function() {
            $state.go('lockscreen',{reload:true});
        })

        /****
         *Config get source link
         * tannv.dts@gmail.com
         */
        var sourceNames={
            REDiLEGAL:'REDiLEGAL',
            Vaccination:'Vaccination'
        }

        var getSourceLink=function(sourceName,refId){
            var link='';
            switch(sourceName)
            {
                case sourceNames.REDiLEGAL:
                    link='loggedIn.rlob.rlob_booking_detail({bookingId:'+refId+"})";
                    break;
                case sourceNames.Vaccination:
                    link='loggedIn.vaccinob.vaccinob_booking_detail({bookingId:'+refId+"})";
                    break;
                default:
                    link='';
            }
            return link;
        }

        /**
         * Tao scroll cho notification dropdown
         * tannv.dts@gmail.com
         */
        $scope.setSlimCroll=function(selector)
        {
            $(selector).slimscroll({});
        }

        //-----------------------------------------

        /***
         * update Notification thu cong (startup hoac nhan nut refresh)
         * tannv.dts@gmail.com
         */
        $scope.numbersBellUnread=0;
        $scope.numbersLetterUnread=0;

        $scope.bellUnreadList=[];
        $scope.letterUnreadList=[];

        $scope.maxIndex=0;
        $scope.updateNotificationManual=function(){
            $http({
                method:"GET",
                url:"/api/rlob/sys_user_notifications/get-unread-notifications",
                params:{userId:userInfo.id}
            })
            .success(function(data) {
                if(data.status=='success' && data.data.length>0)
                {
                    $scope.numbersBellUnread=0;
                    $scope.numbersLetterUnread=0;
                    $scope.bellUnreadList=[];
                    $scope.letterUnreadList=[];
                    //Lay max Index cua table notification
                    $scope.maxIndex=data.data[0].id;
                    for(var i=0;i<data.data.length;i++)
                    {
                        data.data[i].link=getSourceLink(data.data[i].source_name,data.data[i].ref_id);
                        if(data.data[i].TYPE=='bell')
                        {
                            $scope.numbersBellUnread++;
                            $scope.bellUnreadList.push(data.data[i]);
                        }
                        else if(data.data[i].TYPE=='letter')
                        {
                            $scope.numbersLetterUnread++;
                            $scope.letterUnreadList.push(data.data[i]);
                        }
                    }
                    $scope.setSlimCroll('.bell-dropdown');
                    $scope.setSlimCroll('.letter-dropdown')


                }
            })
            .error(function (data) {
                console.log("error");
            })
            .finally(function() {

            });
        }
        $scope.updateNotificationManual();
        $scope.functionTimeout=function()
        {
            $scope.updateNotificationManual();
        }
        $timeout($scope.functionTimeout,4000);




        /***
         * Ghi nhan notification da duoc doc (khi click vao notification trong danh sach xo xuong
         * tannv.dts@gmail.com
         */
        $scope.setNotificationHaveRead=function(notificationId)
        {
            $http({
                method:"GET",
                url:"/api/rlob/sys_user_notifications/set-notification-have-read",
                params:{userId:userInfo.id,notificationId:notificationId}
            })
                .success(function(data) {
                    if(data.status=='success')
                    {
                        var finish=false;
                        for(var i=0;i<$scope.bellUnreadList.length;i++)
                        {
                            if($scope.bellUnreadList[i].id==notificationId)
                            {
                                $scope.bellUnreadList.splice(i, 1);
                                $scope.numbersBellUnread--;
                                $scope.setSlimCroll('.bell-dropdown');
                                finish=true;
                                break;
                            }
                        }

                        if(!finish)
                        {
                            for(var i=0;i<$scope.letterUnreadList.length;i++)
                            {
                                if($scope.letterUnreadList[i].id==notificationId)
                                {
                                    $scope.letterUnreadList.splice(i, 1);
                                    $scope.numbersLetterUnread--;
                                    $scope.setSlimCroll('.letter-dropdown');
                                    break;
                                }
                            }
                        }
                    }
                })
                .error(function (data) {
                    console.log("error");
                })
                .finally(function() {

                });
        }

        //------------------------------------------------------

        /***
         * show popup hien thi notification moi (dang alert)
         * tannv.dts@gmail.com
         */
        $scope.notificationColor={
            warning:'warning',
            danger:'danger',
            success:'success'
        }
        $scope.showNotificationPopup=function(styleClass,msg,notifyColor)
        {
            $(styleClass).notify({
                message: { text: msg },
                type:notifyColor
            }).show();
        }



        /***
         * Tao update notification schedule
         * tannv.dts@gmail.com
         */

        var notificationSchedule;

        /***
         * kiem tra xem bell co trong trong danh sach dropdown hay chua
         * tannv.dts@gmail.com
         */
        $scope.checkBellExist=function(id)
        {
            var result=false;
            for(var i=0;i<$scope.bellUnreadList.length;i++)
            {
                if($scope.bellUnreadList[i].id==id) {
                    result = true;
                    break;
                }
            }
            return result;
        }

        /***
         * kiem tra xem letter co trong danh sach dropdown hay chua
         * @param id
         * @returns {boolean}
         * tannv.dts@gmail.com
         */
        $scope.checkLetterExist=function(id)
        {
            var result=false;
            for(var i=0;i<$scope.letterUnreadList.length;i++)
            {
                if($scope.letterUnreadList[i].id==id) {
                    result = true;
                    break;
                }
            }
            return result;
        }

        /***
         * Defined Schedule List
         * @type {{}}
         */
        $scope.scheduleList={

        }

        $scope.updateNotification = function() {
            // Don't start a new fight if we are already fighting
            if ( angular.isDefined(notificationSchedule) ) return;
            notificationSchedule = $interval(function() {
                for(var key in $scope.scheduleList)
                {
                    $scope.scheduleList[key]();
                }
                $http({
                    method:"GET",
                    url:"/api/rlob/sys_user_notifications/get-new-notifications",
                    params:{userId:userInfo.id,currentIndex:$scope.maxIndex}
                })
                    .success(function(data) {
                        if(data.status=='success' && data.data.length>0)
                        {
                            $scope.maxIndex=data.data[0].id;
                            for(var i=0;i<data.data.length;i++)
                            {
                                data.data[i].link=getSourceLink(data.data[i].source_name,data.data[i].ref_id);
                                $scope.showNotificationPopup(".lob_notification_popup",data.data[i].msg,$scope.notificationColor.warning);
                                if(data.data[i].TYPE=='bell')
                                {
                                    $scope.bellUnreadList.unshift(data.data[i]);
                                    $scope.numbersBellUnread++;
                                }
                                else if(data.data[i].TYPE=='letter')
                                {
                                    $scope.letterUnreadList.unshift(data.data[i]);
                                    $scope.numbersLetterUnread++;
                                }

                            }
                            $scope.setSlimCroll('.bell-dropdown');
                            $scope.setSlimCroll('.letter-dropdown');
                        }

                    })
                    .error(function (data) {
                        console.log("error");
                    })
                    .finally(function() {

                    });
            }, 5000);
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


        //---------------------------------------------------------------------------

        /***
         * Phan trang notification
         * tannv.dts@gmail.com
         */

        $http({
            method:"GET",
            url:"api/rlob/sys_user_notifications/get-max-index",
            params:{userId:userInfo.id}
        })
        .success(function(data) {
            if(data.status=='success')
            {
                if(data.data.max_index!=null)
                {
                    $scope.maxIndex=data.data.max_index;
                    $scope.updateNotification();
                }

            }
        })
        .error(function (data) {
            console.log("error");
        })
        .finally(function() {

        });

        /***
         * Hien thi popup liet ke tat ca cac notification theo type
         * @param selector : selector (id hoac class) cua popup
         * tannv.dts@gmail.com
         */
        $scope.showListNotification=function(selector)
        {
            $(selector).modal({show:true,backdrop:'static'});
        }

//        $scope.totalItems=30;
//        $scope.itemsPerPage=10;
//        $scope.maxSize=10;
//        $scope.currentPage=2;

        /***
         * T?o thanh paging cho list nofitication
         * tannv.dts@gmail.com
         */
        function initNotificationPaging(type)
        {
            var deferred=$q.defer();
            $http({
                method:"GET",
                url:"/api/rlob/sys_user_notifications/count-total-notification",
                params:{userId:userInfo.id,type:type}
            })
            .success(function(data) {
                if(data.status=='success')
                {

                    $scope.totalItems=data.data.count_total_notification;
                    $scope.itemsPerPage=10;
                    $scope.maxSize=10;
                    $scope.currentPage=1;
                    //$scope.getItemsOfPaging($scope.currentPage,$scope.itemsPerPage);
                    deferred.resolve({type:type,pageIndex:$scope.currentPage,itemsPerPage:$scope.itemsPerPage});
                }
            })
            .error(function (data) {
                console.log("error");
            })
            .finally(function() {

            });
            return deferred.promise;
        }

        $scope.listNotifications=[];

        /***
         * Lay danh sach cac item tai moi trang
         * @param data: gom: user_id: userid cua  nguoi dang nhap, type: type cua notification, pageIndex: page hien tai,
         *                      itemsPerPage: so luong item tren mot page
         * tannv.dts@gmail.com
         */
        function getItemsOfPaging(data)
        {

            var deferred=$q.defer();
            $http({
                method:"GET",
                url:"/api/rlob/sys_user_notifications/get-items-of-paging",
                params:{userId:userInfo.id,type:data.type,pageIndex:data.pageIndex,itemsPerPage:data.itemsPerPage}
            })
            .success(function(data) {
                if(data.status=='success')
                {
                    $scope.listNotifications.splice(0,$scope.listNotifications.length);
                    for(var i=0;i<data.data.length;i++)
                    {
                        data.data[i].link=getSourceLink(data.data[i].source_name,data.data[i].ref_id);
                        $scope.listNotifications.push(data.data[i]);
                    }
                    deferred.resolve();

                }
            })
            .error(function (data) {
                console.log("error");
            })
            .finally(function() {

            });
            return deferred.promise;
        }

        /***
         * Su ly de hien thi ra danh sach notification theo type
         * tannv.dts@gmail.com
         * @param type: loai cua notification: bell hoac letter
         */
        $scope.currentNotificationType='';
        $scope.getListNotification=function(type)
        {
            initNotificationPaging(type)
            .then(getItemsOfPaging)
            .then(function()
            {
                $scope.showListNotification('#list-notification-popup');
                $scope.setSlimCroll('.notification-list');
                //Update hien thi so luong notification moi
                $scope.updateNotificationManual();
            });
            $scope.currentNotificationType=angular.copy(type);
        };

        /***
         * xu ly khi nhan nut phan trang
         * tannv.dts@gmail.com
         */

        $scope.pagingHandler=function()
        {
            if($scope.currentPage==1)
            {
                $scope.getListNotification($scope.currentNotificationType);
                //Update hien thi so luong notification moi
                $scope.updateNotificationManual();
            }
            else
            {
                getItemsOfPaging({type:$scope.currentNotificationType,pageIndex:$scope.currentPage,itemsPerPage:$scope.itemsPerPage});
            }

        }

    //-------------------------------------------------------------------------------

    /***
     *  ham xu ly khi click vao notification trong list (xu ly rang da read)
     * @param index : index cua row duoc click trong table
     * tannnv.dts@gmail.com
     */
    $scope.setNotificationHaveRead2=function(index)
    {
        if($scope.listNotifications[index].STATUS!=1)
        {
            $scope.setNotificationHaveRead($scope.listNotifications[index].id);
            $scope.listNotifications[index].STATUS=1;
            //Update hien thi so luong notification moi
            $scope.updateNotificationManual();
        }
    }

    /***
     * Lay danh sach cac appointment Sap toi
     * tannv.dts@gmail.com
     */
    $scope.listAppointmentCalendarUpcoming=[];
    $scope.numberAppointmentCalendarUpcoming=0;
    $scope.getAppointmentCalendarUpcoming=function()
    {
        $scope.listAppointmentCalendarUpcoming=[];
        $scope.numberAppointmentCalendarUpcoming=0;
        $http({
            method:"POST",
            url:"/api/structure/list-appointments-upcoming",
            data:{userId:userInfo.id}
        })
        .success(function(data) {
            if(data.status=='success')
            {
                if(data.data.length>0)
                {
                    $scope.numberAppointmentCalendarUpcoming=data.data.length;
                    for(var i=0;i<data.data.length;i++)
                    {
                        $scope.listAppointmentCalendarUpcoming[i]=data.data[i];
                        $scope.listAppointmentCalendarUpcoming[i].NOTIFICATION=
                            $scope.listAppointmentCalendarUpcoming[i].NOTIFICATION
                            +' - '+moment($scope.listAppointmentCalendarUpcoming[i].DATE_UPCOMING).format("HH:mm")
                            +' '  +moment($scope.listAppointmentCalendarUpcoming[i].DATE_UPCOMING).format("DD/MM/YYYY")

                        $scope.listAppointmentCalendarUpcoming[i].link=getSourceLink($scope.listAppointmentCalendarUpcoming[i].SOURCE_NAME,$scope.listAppointmentCalendarUpcoming[i].ID);

                    }
                }
                $scope.setSlimCroll('.appointments-upcoming-dropdown');
            }
        })
        .error(function (data) {
            console.log("error");
        })
        .finally(function() {

        });
    }

    $scope.getAppointmentCalendarUpcoming();

    $scope.closeNotificationListPopup=function()
    {
        $("#list-notification-popup").modal('hide');
    }

    $scope.showMyCalendar=function()
    {
        $scope.showListNotification("#list-my-calendar");
        $scope.setSlimCroll('.notification-list');
    }
    $scope.closeMyCalendarPopup=function()
    {
        $("#list-my-calendar").modal('hide');
    }

        /**
         * Function add notification for global
         * sourceName: Redilegal or Vaccination...
         * bellType: message,change status, change appointment calendar...
         * notification type: bell or letter
         * content: content of message (if bellType=message)
         * tannv.dts@gmail.com
         */
        $scope.add_notification=function(assId,refId,sourceName,bellType,notificationType,content,appearance)
        {
            var deferred=$q.defer();
            var promise=deferred.promise;
            promise.then(function(data){
                var msg="";
                var claimNo=(sourceName==rlobConstant.bookingType.REDiLEGAL.name?data.CLAIM_NO:"");
                var employeeNumber=(sourceName==rlobConstant.bookingType.Vaccination.name?data.EMPLOYEE_NUMBER:"");
                if(notificationType==rlobConstant.notificationType.letter)
                {
                    msg="["+sourceName+"] - "
                        +data.Rl_TYPE_NAME+" - "
                        +data.WRK_SURNAME+" - "
                        +claimNo
                        +employeeNumber
                        +" - "
                        +moment(data.APPOINTMENT_DATE).format("HH:mm DD/MM/YYYY");
                }
                else if(notificationType==rlobConstant.notificationType.bell)
                {
                    msg="["+sourceName+"] - "
                        +data.WRK_SURNAME+ " - "
                        +claimNo
                        +employeeNumber
                        +" - "
                        +bellType+(content!=undefined &&content!=null && content!=""?(":"+content):'')
                        +" - "
                        +moment(data.APPOINTMENT_DATE).format("HH:mm DD/MM/YYYY");

                }

                $http({
                    method:"POST",
                    url:"/api/rlob/sys_user_notifications/add-notification",
                    data:{assId:assId,refId:refId,sourceName:sourceName,type:notificationType,msg:msg,appearance:appearance}
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
                method:"POST",
                url:"/api/rlob/rl_bookings/get-booking-by-id",
                data:{bookingId:refId}
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

        /***
         * Contact detail
         * tannv.dts@gmail.com
         */
        $scope.contactDetails=[];

        $scope.myExpand=function(index)
        {
            $('.collapse'+index).collapse('toggle')
        }


        /***
         * 
         * phanquocchien.c1109g@gmail.com
         */
        $scope.userclick = function(){
            if(userInfo.function_id != null){
                UserService.getFunction(userInfo.function_id).then(function(data){
                    $state.go(data.definition);
                })
            }
            else{
                $state.go("loggedIn.home");
            }
        }
    
		$scope.navigator = {
			next: function(){
				window.history.forward();
			},
			prev: function(){
				window.history.back();
	
			}
		}

        /**
         * tannv.dts@gmail.com
         * REDiLEGAL online booking
         *
         */
        $scope.updateDailyNotificationRlobBooking=function(){
            rlobService.getUpcommingBookingHaveNotClientDocument(rlobConstant.bookingType.REDiLEGAL.name)
                .then(function(data){
                    if(data.status=='success'){
                        for(var i=0;i<data.data.length;i++)
                        {
                            rlobService.checkNotificationExist(data.data[i].BOOKING_ID,rlobConstant.bookingType.REDiLEGAL.name,rlobConstant.notificationAppearance.whenAccess)
                                .then(function(data){

                                    if(data.status=='success')
                                    {
                                        if(data.data.NOTIFICATION_COUNT<=0)
                                        {
                                            $scope.add_notification($scope.userInfo.id,data.data.BOOKING_ID,rlobConstant.bookingType.REDiLEGAL.name,rlobConstant.bellType.notification,rlobConstant.notificationType.bell,'Please send documents before appointment',rlobConstant.notificationAppearance.whenAccess);
                                        }
                                        else
                                        {
                                            //UPDATE
                                            rlobService.recreateNotification(data.data.BOOKING_ID,rlobConstant.notificationAppearance.whenAccess)
                                                .then(function(result){
                                                    $scope.showNotificationPopup(".lob_notification_popup",result.data.msg,$scope.notificationColor.warning);
                                                },function(err){

                                                })
                                        }
                                    }
                                },function(err){

                                })
                        }
                    }

                },function(err){

                })

        }
        $scope.updateDailyNotificationRlobBooking();


	})
