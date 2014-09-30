/**
 * Created by meditech on 30/09/2014.
 */
angular.module('app.loggedIn.booking.admin.booking.controller',[])
    .controller('BookingController',function($scope,$modal,$filter,ngTableParams,OnlineBookingAdminService,OnlineBookingService,$http,toastr,$cookieStore){
        $scope.data = [];

        $scope.info = {

        }

        OnlineBookingAdminService.getList().then(function(data){
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
                templateUrl: 'modules/onlineBooking_Admin/views/bookingDetailModal.html',
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

        $scope.showDetail = function(b){
            OnlineBookingService.getBookingDetail(b.Booking_id, b.Candidate_id).then(function(data){
                var arrAss = [];
                $scope.info = data.rs[0];

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