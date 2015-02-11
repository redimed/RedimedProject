/**
 * Created by meditech on 11/17/2014.
 */
angular.module('app.loggedIn.rlob.adminBookingReport.type3.controller',[])
    .controller("rlob_admin_bookingReport_type3Controller", function($scope,$http,$cookieStore,$q,rlobService) {
        $scope.removeSelectedBooking();
        // chien status
        $scope.report = 'report1';
        $scope.status = "Confirmed";
        $scope.loginInfo=$cookieStore.get('userInfo');
        /***
         * Get Doctor Info
         * tannv.dts@gmail.com
         */
        $scope.doctorInfo=undefined;
        $scope.doctorId='';
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

        /**
         * Report Pass booking (completed) have not result
         * tannv.dts@gmail.com
         */

        $scope.rlTypeList=[];
        rlobService.getRlTypeList($scope.bookingType)
            .then(function(data){
                $scope.rlTypeList=data;
            });

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

        //Outstanding Report paginator
        //tannv.dts@gmail.com
        $scope.currentPage=1;
        $scope.searchKeys={
            doctor:'',
            location:'',
            surname:'',
            rltype:'',
            fromAppointmentDate:'',
            toAppointmentDate:''
        }


        $scope.initPagingReportPassBookingHaveNotResult=function(doctorId)
        {
            $scope.removeSelectedBooking();
            $scope.searchKeys.rltype=$scope.rlTypeSelected && $scope.rlTypeSelected.Rl_TYPE_NAME?$scope.rlTypeSelected.Rl_TYPE_NAME:'';
            rlobService.getCountReportPassBookingHaveNotResult($scope.bookingType,doctorId,$scope.searchKeys)
                .then(function(data){
//                    exlog.alert(data)
                    $scope.totalItems=data.data.TOTAL_NUMBEROF_BOOKINGS;
                    $scope.itemsPerPage=10;
                    $scope.maxSize=10;
                    return {bookingType:$scope.bookingType,doctorId:doctorId,pageIndex:$scope.currentPage,itemsPerPage:$scope.itemsPerPage,searchKeys:$scope.searchKeys}
                })
                .then(rlobService.getItemsOfPageReportPassBookingHaveNotResult)
                .then(function(data){
                    if(data.status=='success')
                    {
                        $scope.reportPassBookingHaveNotResult=data.data;
                    }
                    else{
                        $scope.reportPassBookingHaveNotResult = '';
                    }
                });

        }

        $scope.pagingHandlerPassBookingHaveNotResult=function()
        {
            $scope.removeSelectedBooking();
            var info={
                bookingType:$scope.bookingType,
                doctorId:$scope.doctorId,
                pageIndex:$scope.currentPage,
                itemsPerPage:$scope.itemsPerPage,
                searchKeys:$scope.searchKeys
            }
            rlobService.getCountReportPassBookingHaveNotResult(info.bookingType,info.doctorId,info.searchKeys)
                .then(function(data){
                    $scope.totalItems=data.data.TOTAL_NUMBEROF_BOOKINGS;
                    return info;
                })
                .then(rlobService.getItemsOfPageReportPassBookingHaveNotResult)
                .then(function(data){
                    if(data.status=='success')
                        $scope.reportPassBookingHaveNotResult=data.data;
                })

        }

        $scope.$watch('[searchKeys.fromAppointmentDate,searchKeys.toAppointmentDate]',function(newValue,oldValue){
            $scope.initPagingReportPassBookingHaveNotResult($scope.doctorId);
        },true);

        $scope.getDoctorInfoByUserId()
            .then(function(){

                $scope.doctorId=$scope.doctorInfo?$scope.doctorInfo.doctor_id:'';
                //$scope.getReportPassBookingHaveNotResult($scope.doctorId);
                $scope.initPagingReportPassBookingHaveNotResult($scope.doctorId);
            });
    })
