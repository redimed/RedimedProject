/**
 * Created by meditech on 24/09/2014.
 */
angular.module('app.loggedIn.booking.list.controller',[])
    .controller('BookingListController',function($scope,$modal,$filter,ngTableParams,OnlineBookingService,$http,toastr,$cookieStore){
        var companyInfo;
        $scope.selectedCanId = null;
        $scope.selectedBookId = null;
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
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
                    total: $scope.data.length, // length of data
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

        $scope.bookingSelected = function(b){
            $scope.selectedCanId = b.Candidate_id;
            $scope.selectedBookId = b.Booking_id;
        }

        $scope.openDetail = function(b){

            var modalInstance = $modal.open({
                templateUrl: 'modules/onlineBooking/views/bookingDetailModal.html',
                controller: 'BookingDetailController',
                size: 'lg',
                resolve: {
                    bookingId: function(){
                        return b.Booking_id;
                    },
                    candidateId: function(){
                        return b.Candidate_id;
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

        $scope.submitInfo = function(){

        }

        $scope.searchModal = function(){
            var modalInstance = $modal.open({
                templateUrl:'modules/onlineBooking/views/searchBookingModal.html',
                controller:'SearchBookingController',
                size:'md',
                resolve:{
                    companyId: function(){
                        return companyInfo[0].id;
                    }
                }
            });

            modalInstance.result.then(function(data){
                $scope.data = data;

                $scope.$watch('data',function(data){
                    $scope.data = data;
                    $scope.tableParams.reload();
                })

            })
        }

        $scope.showAppointmentNote = function(b){
            var modalInstance = $modal.open({
                templateUrl:'modules/onlineBooking/views/appointmentNote.html',
                controller:'AppointmentNoteController',
                size:'md',
                resolve:{
                    bookId: function(){
                        return b.Booking_id;
                    },
                    canId: function(){
                        return b.Candidate_id;
                    },
                    note: function(){
                        return b.Appointment_notes;
                    }
                }
            });

            modalInstance.result.then(function(){
                OnlineBookingService.getBookingList(companyInfo[0].id).then(function(data) {
                    if (data.status === 'success') {
                        $scope.data = data.rs;

                        $scope.$watch('data',function(data){
                            $scope.data = data;
                            $scope.tableParams.reload();
                        })
                    }
                })

            })
        }

    })

    .controller('AppointmentNoteController',function($scope,$modalInstance,OnlineBookingService,bookId,canId,note,toastr){

        $scope.info = {
            bookingId: bookId,
            candidateId: canId,
            note: note
        }

        $scope.okClick = function(){
            OnlineBookingService.updateNote($scope.info).then(function(data){
                if(data.status === 'success')
                {
                    $modalInstance.close();
                    toastr.success("Edit Successfully!","Success");
                }
                else
                {
                    toastr.error("Edit Failed!", "Error");
                }
            })
        }

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }
    })

    .controller('SearchBookingController',function($scope,$modalInstance,OnlineBookingService,companyId){
        $scope.minDate = new Date();

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.info = {
            companyId: companyId,
            companyName: null,
            candidateName: null,
            fromDate: null,
            toDate: null,
            bookingPerson: null,
            status: null,
            siteName: null
        }

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

        $scope.search = function(){
            OnlineBookingService.searchBooking($scope.info).then(function(data){
                $modalInstance.close(data);
            })
        }

        $scope.reset = function(){
            OnlineBookingService.getBookingList(companyId).then(function(data){
                $modalInstance.close(data.rs);
            })
        }
    })

    .controller('BookingDetailController',function($scope,$modalInstance,OnlineBookingService, bookingId, candidateId){
        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        };

        OnlineBookingService.getBookingDetail(bookingId,candidateId).then(function(data){
            var arrAss = [];
            $scope.detail = data.rs[0];

            if(typeof data.rs[0].package_id !== 'undefined'){
                OnlineBookingService.getPackageAssById(data.rs[0].package_id).then(function(data){
                    if(data.status === 'success')
                    {
                        for(var i=0; i<data.rs.length; i++)
                        {
                            arrAss.push({head_name:data.rs[i].HeaderName,ass_name:data.rs[i].ass_name});
                        }

                        $scope.detail.ass = _.groupBy(arrAss,"head_name");


                    }
                })
            }

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