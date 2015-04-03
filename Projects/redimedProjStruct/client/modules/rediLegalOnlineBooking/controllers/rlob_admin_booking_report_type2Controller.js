/**
 * Created by meditech on 11/17/2014.
 */
angular.module('app.loggedIn.rlob.adminBookingReport.type2.controller',[])
    .controller("rlob_admin_bookingReport_type2Controller", function($scope,$http,$cookieStore,$q,rlobService) {
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

        //list type
        $scope.rlTypeList=[];
        rlobService.getRlTypeList($scope.bookingType)
            .then(function(data){
                $scope.rlTypeList=data;
            });
        // list doctor
        $scope.doctorList=[];
        rlobService.listDoctorReport()
            .then(function(data){
                if (data.status == 'success') {
                    $scope.doctorList=data.data;
                };
            });
        // list location
        $scope.locationList=[];
        rlobService.listLocationReport()
            .then(function(data){
                if (data.status == 'success') {
                    $scope.locationList=data.data;
                };
            });

        /**
         * Paging booking Status
         * phanquocchien.c1109g@gmail.com
         */
        $scope.filterInfo1 = {
            Surname:'',
            Location:'',
            Type:'',
            Doctor:'',
            employeeNumber:'',
            FromAppointmentDate:'',
            ToAppointmentDate:''
        };

        $scope.initPagingReportStatusBookingHaveNotResult=function()
        {
            $scope.removeSelectedBooking();
            $scope.filterInfo1.Type=$scope.rlTypeSelected && $scope.rlTypeSelected.Rl_TYPE_NAME?$scope.rlTypeSelected.Rl_TYPE_NAME:'';
            $scope.filterInfo1.Location=$scope.locationSelected && $scope.locationSelected.Site_name?$scope.locationSelected.Site_name:'';
            $scope.filterInfo1.Doctor=$scope.doctorSelected && $scope.doctorSelected.NAME?$scope.doctorSelected.NAME:'';
            rlobService.getCountReportStatusBookings($scope.bookingType,$scope.doctorId,$scope.filterInfo1)
                .then(function(data)
                {

                    $scope.totalItemsReport2=data.data.count_bookings_status;
                    //alert($scope.totalItemsReport2);
                    $scope.itemsPerPageReport2=10;
                    $scope.maxSizeReport2=10;
                    $scope.currentPageReport2=1;
                    return ({bookingType:$scope.bookingType,doctorId:$scope.doctorId,currentPage:$scope.currentPageReport2,itemsPerPage:$scope.itemsPerPageReport2,filterInfo:$scope.filterInfo1});
                })
                .then(rlobService.getItemsOfPageReportStatusBookings)
                .then(function(data){

                    if(data.status == 'success')
                    {
                        $scope.reportStatusBookingsList= data.data;
                    }
                    else{
                        $scope.reportStatusBookingsList = '';
                    }
                })
        }
        $scope.pagingHandlerStatusBookingHaveNotResult=function()
        {
            if(!$scope.isChangingBookingStatus)
            {
                $scope.removeSelectedBooking();
            }
            $scope.isChangingBookingStatus=false;

            var info={
                bookingType:$scope.bookingType,
                doctorId:$scope.doctorId,
                currentPage:$scope.currentPageReport2,
                itemsPerPage:$scope.itemsPerPageReport2,
                filterInfo:$scope.filterInfo1
            }
            rlobService.getCountReportStatusBookings(info.bookingType,info.doctorId,$scope.filterInfo1)
                .then(function(data){
                    $scope.totalItemsReport2=data.data.count_bookings_status;
                    //alert($scope.totalItemsReport2);
                    //alert(JSON.stringify(info));
                    return info;
                })
                .then(rlobService.getItemsOfPageReportStatusBookings)
                .then(function(data){

                    if(data.status == 'success')
                    {
                        $scope.reportStatusBookingsList= data.data;
                    }
                })

        }

        $scope.$watch('[filterInfo1.FromAppointmentDate,filterInfo1.ToAppointmentDate]',function(newValue,oldValue){
            $scope.initPagingReportStatusBookingHaveNotResult();
        },true);

        $scope.getDoctorInfoByUserId()
            .then(function(){

                $scope.doctorId=$scope.doctorInfo?$scope.doctorInfo.doctor_id:'';
                $scope.initPagingReportStatusBookingHaveNotResult();
            });
        $scope.isChangingBookingStatus=false;
        $scope.$watch('bookingStatusChangedFlag',function(newValue,oldValue){
            if($scope.bookingStatusChangedFlag && $scope.bookingStatusChangedFlag>0)
            {
                $scope.isChangingBookingStatus=true;
                $scope.pagingHandlerStatusBookingHaveNotResult();
            }
        })
    })
