/**
 * Created by meditech on 30/09/2014.
 */
angular.module('app.loggedIn.booking.admin.booking.controller',[])
    .controller('AdminBookingController',function($scope,$modal,$filter,ngTableParams,FileUploader,OnlineBookingAdminService,OnlineBookingService,$http,toastr,$cookieStore){
        $scope.data = [];
        $scope.isSelected = false
        $scope.selectedCanId = null;
        $scope.selectedBookId = null;

        $scope.info = {};

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

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
                controller: 'AdminBookingDetailController',
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
            $scope.selectedCanId = b.Candidate_id;
            $scope.selectedBookId = b.Booking_id;
            $scope.isSelected = true;
            OnlineBookingService.getBookingDetail(b.Booking_id, b.Candidate_id).then(function(data){
                var arrAss = [];
                $scope.info = data.rs[0];

                OnlineBookingService.getSite().then(function(rs){
                    $scope.siteList = rs;
                })

                var from = $filter('date')(data.rs[0].from_date,'yyyy-MM-dd');
                var to = $filter('date')(data.rs[0].to_date,'yyyy-MM-dd');

                OnlineBookingService.getCalendar(data.rs[0].site_id,from,to).then(function(data){
                    $scope.calList = data;
                })

                OnlineBookingService.getPackageAssById(data.rs[0].package_id).then(function(data){
                    if(data.status === 'success')
                    {
                        for(var i=0; i<data.rs.length; i++)
                        {
                            arrAss.push({head_name:data.rs[i].HeaderName,ass_name:data.rs[i].ass_name});
                        }

                        $scope.packAss = _.groupBy(arrAss,"head_name");


                    }
                })

            })
        }

        var uploader = $scope.uploader = new FileUploader({
            url: '/api/booking/upload'
        });

        $scope.saveInfo = function(){

            uploader.uploadAll();

            uploader.filters.push({
                name: 'customFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    return this.queue.length < 10;
                }
            });


            uploader.formData.push({booking_id:$scope.info.Booking_id,Candidate_id:$scope.info.Candidate_id,fileName:uploader.queue[0].file.name});

            uploader.onCompleteAll = function() {
                console.info('onCompleteAll');
            };


            OnlineBookingAdminService.editBookingInfo($scope.info).then(function(data){
                if(data.status === 'success')
                {
                    toastr.success("Edit Successfully!","Success");
                    //$state.go('loggedIn.package',null,{reload:true});
                }
                else
                {
                    toastr.error("Edit Failed!","Error");
                }
            })
        }

        $scope.sendEmail = function(){
            OnlineBookingAdminService.confirmBooking($scope.info).then(function(data){
                if(data.status === 'success')
                {
                    toastr.success("Send Mail Successfully! Please check your email!","Success");
                }
                else
                {
                    toastr.error("Send Mail Failed!","Error");
                }
            })
        }

        $scope.searchModal = function(){
            var modalInstance = $modal.open({
                templateUrl:'modules/onlineBooking/views/searchBookingModal.html',
                controller:'SearchAdminBookingController',
                size:'md',
                resolve:{
                    companyId: function(){
                        return null;
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

    })

    .controller('SearchAdminBookingController',function($scope,$modalInstance,OnlineBookingService,OnlineBookingAdminService,companyId){
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
            OnlineBookingAdminService.getList().then(function(data){
                $modalInstance.close(data.rs);
            })
        }
    })

    .controller('AdminBookingDetailController',function($scope,$modalInstance,OnlineBookingService, bookingId, candidateId){
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