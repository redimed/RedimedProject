/**
 * Created by Phan Quoc Chien on 07/11/2014.
 */

angular.module('app.loggedIn.rlob.adminBookingReport.controller',[])
    .controller("rlob_admin_bookingReportController", function($scope,$http,$cookieStore,$q,rlobService) {
        // chien status
        $scope.report = 'report1';
        $scope.status = "Confirmed";

        $scope.loginInfo=$cookieStore.get('userInfo');
        /***
         * Get Doctor Info
         * tannv.dts@gmail.com
         */
        $scope.doctorInfo=undefined;
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



//        if($scope.loginInfo.user_type=='Doctor')
//        {
//            $scope.getDoctorInfoByUserId()
//                .then($scope.filterBooking);
//        }
//        else
//        {
//            $scope.getUpcommingBooking();
//            $scope.getPassBooking();
//            $scope.getReportPassBookingHaveNotResult();
//        }

        $scope.getUpcommingBooking=function(doctorId)
        {
            rlobService.getbookingsList(doctorId).then(function(data){
                for (var i = 0; i < data.length; i++) {
                    if(data[i].FILE_ID == null){
                        data[i].style_class = "danger";
                    }
                    else{
                        data[i].style_class = "success";
                    }
                }
                //$scope.bookingslist = data;
                $scope.totalItems1 = data.length;
                $scope.itemsPerPage1 = 10;
                $scope.currentPage1 = 1;

                //$scope.maxSize = 5;
                //$scope.bigTotalItems = 175;
                //$scope.bigCurrentPage = 1;

                $scope.pageCount = function () {
                    return Math.ceil(data.length / $scope.itemsPerPage1);
                };

                $scope.$watch('currentPage1 + itemsPerPage1', function() {
                    var begin = (($scope.currentPage1 - 1) * $scope.itemsPerPage1),
                        end = begin + $scope.itemsPerPage1;

                    $scope.bookingslist = data.slice(begin, end);
                });
            })
        };
        //$scope.getUpcommingBooking();


        $scope.getPassBooking=function(doctorId)
        {
            rlobService.getbookingsListStatus(doctorId).then(function(data){
                for (var i = 0; i < data.length; i++) {
                    if(data[i].STATUS == $scope.status){
                        data[i].style_class = "danger";
                    }
                    else{
                        data[i].style_class = "success";
                    }
                }
                //$scope.bookingslistStatus = data;
                //console.log(data);
                $scope.totalItems = data.length;
                $scope.itemsPerPage = 10;
                $scope.currentPage = 1;

                //$scope.maxSize = 5;
                //$scope.bigTotalItems = 175;
                //$scope.bigCurrentPage = 1;

                $scope.pageCount = function () {
                    return Math.ceil(data.length / $scope.itemsPerPage);
                };

                $scope.$watch('currentPage + itemsPerPage', function() {
                    var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                        end = begin + $scope.itemsPerPage;

                    $scope.bookingslistStatus = data.slice(begin, end);
                });
            })
        }
        //$scope.getPassBooking();

        /**
         * Report Pass booking (completed) have not result
         * tannv.dts@gmail.com
         */
        $scope.reportPassBookingHaveNotResult=[];
        $scope.getReportPassBookingHaveNotResult=function(doctorId)
        {
            rlobService.getReportPassBookingHaveNotResult($scope.bookingType,doctorId)
                .then(function(data){
                    if(data.status=='success')
                    {
                        $scope.reportPassBookingHaveNotResult=data.data;
                    }
                },function(error){

                })
        }
        //$scope.getReportPassBookingHaveNotResult();

        $scope.getDoctorInfoByUserId()
            .then(function(){

                var doctorId=$scope.doctorInfo?$scope.doctorInfo.doctor_id:'';
                $scope.getUpcommingBooking(doctorId);
                $scope.getPassBooking(doctorId);
                $scope.getReportPassBookingHaveNotResult(doctorId);
            });
    });
