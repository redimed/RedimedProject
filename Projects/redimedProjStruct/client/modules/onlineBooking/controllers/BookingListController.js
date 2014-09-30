/**
 * Created by meditech on 24/09/2014.
 */
angular.module('app.loggedIn.booking.list.controller',[])
    .controller('BookingListController',function($scope,$modal,$filter,ngTableParams,OnlineBookingService,$http,toastr,$cookieStore){
        var companyInfo;
        if($cookieStore.get('companyInfo') !== 'undefined')
        {
            companyInfo = $cookieStore.get('companyInfo');
        }

        OnlineBookingService.getBookingList(companyInfo[0].id).then(function(data){
            if(data.status === 'success')
            {
                $scope.data=data.rs;
                $scope.tableParams = new ngTableParams({
                    page: 1,            // show first page
                    count: 10           // count per page
                }, {
                    total: data.length, // length of data
                    getData: function($defer, params) {
                        var filteredData = params.filter() ?
                            $filter('filter')($scope.data, params.filter()) :
                            $scope.data;

                        var orderedData = params.sorting() ?
                            $filter('orderBy')(filteredData, params.orderBy()) :
                            $scope.data;

                        params.total(orderedData.length);
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });
            }
        })

        $scope.openDetail = function(b){

            var modalInstance = $modal.open({
                templateUrl: 'modules/onlineBooking/views/bookingDetailModal.html',
                controller: 'BookingDetailController',
                size: 'lg',
                resolve: {
                    bookingId: function(){
                        return b.Booking_id;
                    }
                }
            });

        }

        $scope.cancelBooking = function(b){
            var modalInstance = $modal.open({
                templateUrl: 'modules/onlineBooking/views/confirmCancel.html',
                controller: 'CancelController',
                size: 'md',
                resolve: {
                    bookingId: function(){
                        return b.Booking_id;
                    }
                }
            });
        }

        $scope.changeBookingTime = function(b){
            var modalInstance = $modal.open({
               templateUrl: 'modules/onlineBooking/views/changeBookingTime.html',
                controller: 'ChangeBookingController',
                size: 'md',
                resolve:{
                    bookingId: function(){
                        return b.Booking_id;
                    }
                }
            });
        }

    })

    .controller('BookingDetailController',function($scope,$modalInstance,OnlineBookingService, bookingId){
        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        };

        OnlineBookingService.getBookingDetail(bookingId).then(function(data){

            console.log(data.rs[0]);

            $scope.detail = data.rs[0];

            var str = data.rs[0].ass_name;

            $scope.detail.ass = str.split(' - ');
        })



    })

    .controller('CancelController',function($scope,$state,$modalInstance,OnlineBookingService, bookingId){
        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

        $scope.okClick = function(){
            OnlineBookingService.cancelBooking(bookingId).then(function(data){
                if(data.status === 'success')
                {
                    $modalInstance.dismiss('cancel');
                    $state.go('loggedIn.bookingList', null, {"reload":true});
                }

                else
                    alert('Failed');
            })
        }
    })

    .controller('ChangeBookingController',function($scope,$filter,$state,$modalInstance,OnlineBookingService,toastr, bookingId){
        $scope.info = {
            siteId:'',
            fromDate: '',
            toDate: '',
            calId:'',
            appointmentTime: '',
            submitTime: ''
        };
        $scope.siteList = [];
        $scope.calList = [];
        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

        OnlineBookingService.getSite().then(function(data){
            $scope.siteList = data;
        })

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.siteChange = function(){
            if(typeof $scope.info.siteId !== 'undefined' && $scope.info.siteId !== null && typeof $scope.info.fromDate !== 'undefined' && typeof $scope.info.toDate !== 'undefined')
            {
                var id = $scope.info.siteId;
                var from = $filter('date')($scope.info.fromDate,'yyyy-MM-dd');
                var to = $filter('date')($scope.info.toDate,'yyyy-MM-dd');

                OnlineBookingService.getCalendar(id,from,to).then(function(data){
                    $scope.calList = data;
                })
            }
            else
            {
                $scope.calList = [];
                $scope.info.appointmentTime = '';
            }

        }

        $scope.fromDateChange = function()
        {
            if(typeof $scope.info.siteId !== 'undefined' && typeof $scope.info.fromDate !== 'undefined' && typeof $scope.info.toDate !== 'undefined')
            {
                var id = $scope.info.siteId;
                var from = $filter('date')($scope.info.fromDate,'yyyy-MM-dd');
                var to = $filter('date')($scope.info.toDate,'yyyy-MM-dd');

                OnlineBookingService.getCalendar(id,from,to).then(function(data){
                    $scope.calList = data;
                })
            }
            else
            {
                $scope.calList = [];
                $scope.info.appointmentTime = '';
            }



        }

        $scope.toDateChange = function()
        {
            if(typeof $scope.info.siteId !== 'undefined' && typeof $scope.info.fromDate !== 'undefined' && typeof $scope.info.toDate !== 'undefined')
            {
                var id = $scope.info.siteId;
                var from = $filter('date')($scope.info.fromDate,'yyyy-MM-dd');
                var to = $filter('date')($scope.info.toDate,'yyyy-MM-dd');

                OnlineBookingService.getCalendar(id,from,to).then(function(data){
                    $scope.calList = data;
                })
            }
            else
            {
                $scope.calList = [];
                $scope.info.appointmentTime = '';
            }
        }

        $scope.calChange = function()
        {
            if($scope.info.calId !== null && typeof $scope.info.calId !== 'undefined')
            {
                var calId = $scope.info.calId;

                OnlineBookingService.getAppointmentTime(calId).then(function(data){

                    var date = $filter('date')(data[0].From_time,'dd/MM/yyyy HH:mm:ss')
                    var submitDate = $filter('date')(data[0].From_time,'yyyy-MM-dd HH:mm:ss');
                    $scope.info.appointmentTime = date;
                    $scope.info.submitTime = submitDate;

                })
            }
            else
            {
                $scope.info.appointmentTime = '';
            }

        }

        $scope.submit = function(){
            if($scope.info.siteId !== null && typeof $scope.info.fromDate !== 'undefined' && typeof $scope.info.toDate !== 'undefined' && $scope.info.calId !== null)
            {
                var siteId = $scope.info.siteId;
                var from = $filter('date')($scope.info.fromDate,'yyyy-MM-dd');
                var to = $filter('date')($scope.info.toDate,'yyyy-MM-dd');
                var calId = $scope.info.calId;
                var time = $scope.info.submitTime;

                OnlineBookingService.changeBookingTime(siteId,from,to,calId,time,bookingId).then(function(data){
                    if(data.status === 'success')
                    {
                        $modalInstance.dismiss('cancel');
                        toastr.success("Submit Successfully!","Success");
                        $state.go('loggedIn.bookingList', null, {"reload":true});
                    }
                    else
                    {
                        toastr.error("Submit Failed!", "Error");
                    }
                })

            }
        }

    })