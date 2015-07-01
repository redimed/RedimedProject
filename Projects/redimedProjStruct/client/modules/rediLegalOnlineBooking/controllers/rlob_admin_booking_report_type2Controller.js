/**
 * Created by meditech on 11/17/2014.
 */
angular.module('app.loggedIn.rlob')
    .controller("rlob_admin_bookingReport_type2Controller", function($scope,$http,$cookieStore,$q,rlobService) {
        $scope.removeSelectedBooking();
        // chien status
        $scope.currentReport.name = 'report2';
        $scope.status = "Confirmed";
        $scope.bookingStatus=rlobConstant.bookingStatus;
        $scope.documentStatus=rlobConstant.documentStatusFilter;

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
            ToAppointmentDate:'',
            bookingStatus:'',
            documentStatus:''
        };

        $scope.initPagingReportOutstandingBooking=function()
        {
            $scope.removeSelectedBooking();
            $scope.filterInfo1.Type=$scope.rlTypeSelected && $scope.rlTypeSelected.Rl_TYPE_NAME?$scope.rlTypeSelected.Rl_TYPE_NAME:'';
            $scope.filterInfo1.Location=$scope.locationSelected && $scope.locationSelected.Site_name?$scope.locationSelected.Site_name:'';
            $scope.filterInfo1.Doctor=$scope.doctorSelected && $scope.doctorSelected.NAME?$scope.doctorSelected.NAME:'';
            rlobService.getCountReportOutstandingBookings($scope.bookingType,$scope.doctorId,$scope.filterInfo1)
                .then(function(data)
                {

                    $scope.totalItemsReport2=data.data.count_outstanding_bookings;
                    //alert($scope.totalItemsReport2);
                    $scope.itemsPerPageReport2=10;
                    $scope.maxSizeReport2=10;
                    $scope.currentPageReport2=1;
                    return ({bookingType:$scope.bookingType,doctorId:$scope.doctorId,currentPage:$scope.currentPageReport2,itemsPerPage:$scope.itemsPerPageReport2,filterInfo:$scope.filterInfo1});
                })
                .then(rlobService.getItemsOfPageReportOutstandingBookings)
                .then(function(data){

                    if(data.status == 'success')
                    {
                        $scope.listOutstandingBookings= data.data;
                    }
                    else{
                        $scope.listOutstandingBookings = '';
                    }
                })
        }
        $scope.pagingHandlerOutstandingBooking=function()
        {
            // if(!$scope.isChangingBookingStatus)
            // {
            //     $scope.removeSelectedBooking();
            // }
            // $scope.isChangingBookingStatus=false;

            var info={
                bookingType:$scope.bookingType,
                doctorId:$scope.doctorId,
                currentPage:$scope.currentPageReport2,
                itemsPerPage:$scope.itemsPerPageReport2,
                filterInfo:$scope.filterInfo1
            }
            rlobService.getCountReportOutstandingBookings(info.bookingType,info.doctorId,$scope.filterInfo1)
                .then(function(data){
                    $scope.totalItemsReport2=data.data.count_outstanding_bookings;
                    //alert($scope.totalItemsReport2);
                    //alert(JSON.stringify(info));
                    return info;
                })
                .then(rlobService.getItemsOfPageReportOutstandingBookings)
                .then(function(data){

                    if(data.status == 'success')
                    {
                        $scope.listOutstandingBookings= data.data;
                    }
                })

        }

        $scope.$watch('[filterInfo1.FromAppointmentDate,filterInfo1.ToAppointmentDate]',function(newValue,oldValue){
            $scope.initPagingReportOutstandingBooking();
        },true);

        
        // $scope.isChangingBookingStatus=false;
        // $scope.$watch('bookingStatusChangedFlag',function(newValue,oldValue){
        //     if($scope.bookingStatusChangedFlag && $scope.bookingStatusChangedFlag>0)
        //     {
        //         $scope.isChangingBookingStatus=true;
        //         $scope.pagingHandlerOutstandingBooking();
        //     }
        // })

        //HAM XU LY COT LOI CUA PAGE
        //--------------------------------------------------------------------------
        //--------------------------------------------------------------------------
        //--------------------------------------------------------------------------
        //--------------------------------------------------------------------------
        //--------------------------------------------------------------------------
        /***
         * Get Doctor Info
         * tannv.dts@gmail.com
         */
        $scope.userInfo=$cookieStore.get('userInfo');
        $scope.doctorInfo=null;
        $scope.doctorId=null;
        $scope.getDoctorInfoByUserId=function()
        {
            var deferred=$q.defer();
            rlobService.getDoctorInfoByUserId($scope.userInfo.id)
            .then(function(data){
                if(data.status=='success')
                {
                    $scope.doctorInfo=data.data;
                    $scope.doctorId=$scope.doctorInfo?$scope.doctorInfo.doctor_id:null;
                }
            },function(err){
                console.log("Loi lay thong tin doctor");
            })
            .then(function(){
                deferred.resolve();
            })
            return deferred.promise;
        }

        $scope.getDoctorInfoByUserId()
        .then(function(){
            $scope.initPagingReportOutstandingBooking();
        });

        $scope.actionCenter.adminReport.reloadReport2=function()
        {
            $scope.initPagingReportOutstandingBooking();
        }
        //--------------------------------------------------------------------------
        //--------------------------------------------------------------------------
        //--------------------------------------------------------------------------
        //--------------------------------------------------------------------------
        //--------------------------------------------------------------------------
    })
