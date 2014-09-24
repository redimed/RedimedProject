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

    .controller('ChangeBookingController',function($scope,$state,$modalInstance,OnlineBookingService, bookingId){
        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }


    })