angular.module("app.loggedIn.controller",[
])

.controller("loggedInController", function($scope, $state, $cookieStore, UserService,$http,$interval,$q){
    var userInfo = $cookieStore.get('userInfo');
    $scope.loggedInMenus = [];
    $scope.user = userInfo.Booking_Person;

    UserService.getUserInfo(userInfo.id).then(function(data){
       $scope.img = data.img;
    })

    


    // Load before logged in    
    var loadLoggedIn = function(){
        // MENU


        UserService.menu(userInfo.id).then(function(response){

            var i = 0;
            angular.forEach(response, function(menu){
                if(menu.Parent_Id === -1)
                    $scope.loggedInMenus.push({"parent": {"name": menu.Description, "definition":menu.Definition , "menu_id": menu.Menu_Id, "childs":[]}});
                else{
                    var j = 0;
                    angular.forEach($scope.loggedInMenus, function(lmenu){
                        if(lmenu.parent.menu_id === menu.Parent_Id){

                            $scope.loggedInMenus[j].parent.childs.push({"name": menu.Description, "definition":menu.Definition, "id": menu.Menu_Id});
                        }
                        j++;
                    })
                }
                i++;
            });
        });
        // END MENU
    }

    loadLoggedIn();
    //End load before logged in

    //Logout
    $scope.logout = function(){
        $cookieStore.remove("userInfo");
        $cookieStore.remove("companyInfo");
        $state.go("security.login",null,{reload:true});
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
            $state.go('lockscreen');
        })
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
        $scope.showNotificationPopup=function(styleClass,msg)
        {
            $(styleClass).notify({
                message: { text: msg },
                type:'warning'
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

        $scope.updateNotification = function() {
            // Don't start a new fight if we are already fighting
            if ( angular.isDefined(notificationSchedule) ) return;
            notificationSchedule = $interval(function() {
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
                                $scope.showNotificationPopup(".lob_notification_popup",data.data[i].msg);
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
                    $scope.listNotifications=data.data;
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
                        $scope.listAppointmentCalendarUpcoming.push(data.data[i]);
                        if($scope.listAppointmentCalendarUpcoming[i].SOURCE_TYPE='REDiLEGAL')
                        {
                            $scope.listAppointmentCalendarUpcoming[i].link="loggedIn.rlob_booking_detail({bookingId:"+$scope.listAppointmentCalendarUpcoming[i].ID+"})";
                        }
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
})