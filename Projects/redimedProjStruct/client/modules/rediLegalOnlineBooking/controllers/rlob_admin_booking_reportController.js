/**
 * Created by Phan Quoc Chien on 07/11/2014.
 */

angular.module('app.loggedIn.rlob.adminBookingReport.controller',[])
    .controller("rlob_admin_bookingReportController", function($scope,rlobService,$q) {
        $scope.status = "Confirmed";
        $scope.report = "report1";
        /**
         * Paging Upcomming booking
         * phanquocchien.c1109g@gmail.com
         */
        rlobService.getcountTotalBookings().then(function(data){
            var deferred=$q.defer();
            if(data.status=='success')
            {
                $scope.totalItems=data.data.count_bookings;
                $scope.itemsPerPage=10;
                $scope.maxSize=10;
                $scope.currentPage=1;
                deferred.resolve({currentPage:$scope.currentPage,itemsPerPage:$scope.itemsPerPage});
            }
            return deferred.promise;
        });

        function getItemsPagingBooking(data){
            rlobService.getItemsOfPagingBookings($scope.currentPage,$scope.itemsPerPage).then(function(data){
                var deferred=$q.defer();
                if(data.status == 'success')
                {
                    for (var i = 0; i < data.data.length; i++) {
                        if(data.data[i].FILE_ID == null){
                            data.data[i].style_class = "danger";
                        }
                        else{
                            data.data[i].style_class = "success";
                        }
                    }
                    $scope.bookingslist= data.data;
                    deferred.resolve();
                }
                return deferred.promise;
            });
        }
        rlobService.getcountTotalBookings()
                .then(getItemsPagingBooking)
        $scope.pagingBookingsChange=function()
        {
            getItemsPagingBooking($scope.currentPage,$scope.itemsPerPage);
        }
        /**
         * Paging booking Status
         * phanquocchien.c1109g@gmail.com
         */
        rlobService.getcountTotalBookingsStatus().then(function(data){
            var deferred=$q.defer();
            if(data.status=='success')
            {
                $scope.totalItemsStatus=data.data.count_bookings_status;
                $scope.itemsPerPageStatus=10;
                $scope.maxSizeStatus=10;
                $scope.currentPageStatus=1;
                deferred.resolve({currentPageStatus:$scope.currentPageStatus,itemsPerPageStatus:$scope.itemsPerPageStatus});
            }
            return deferred.promise;
        });

        function getItemsPagingBookingStatus(data){
            rlobService.getItemsOfPagingBookingsStatus($scope.currentPageStatus,$scope.itemsPerPageStatus).then(function(data){
                var deferred=$q.defer();
                if(data.status == 'success')
                {
                    for (var i = 0; i < data.data.length; i++) {
                        if(data.data[i].STATUS == $scope.status){
                            data.data[i].style_class = "danger";
                        }
                        else{
                            data.data[i].style_class = "success";
                        }
                    }
                    $scope.bookingslistStatus= data.data;
                    deferred.resolve();
                }
                return deferred.promise;
            });
        }
        rlobService.getcountTotalBookingsStatus()
            .then(getItemsPagingBookingStatus)
        $scope.pagingBookingsStatusChange=function()
        {
            getItemsPagingBookingStatus($scope.currentPageStatus,$scope.itemsPerPageStatus);
        }
/**
 * Report Pass booking (completed) have not result
 * tannv.dts@gmail.com
 */
$scope.reportPassBookingHaveNotResult=[];
rlobService.getReportPassBookingHaveNotResult($scope.bookingType)
    .then(function(data){
        if(data.status=='success')
        {
            $scope.reportPassBookingHaveNotResult=data.data;
        }
    },function(error){

    })
});