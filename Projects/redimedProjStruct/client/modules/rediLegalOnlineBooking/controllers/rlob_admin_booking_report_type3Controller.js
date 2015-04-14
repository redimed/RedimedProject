/**
 * Created by meditech on 11/17/2014.
 */
angular.module('app.loggedIn.rlob.adminBookingReport.type3.controller',[])
    .controller("rlob_admin_bookingReport_type3Controller", function($scope,$http,$cookieStore,$q,rlobService) {
        $scope.removeSelectedBooking();
        // chien status
        $scope.currentReport.name = 'report3';
        $scope.status = "Confirmed";
        $scope.bookingStatus=rlobConstant.bookingStatus;
        $scope.documentStatus=rlobConstant.documentStatusFilter;
        

        /**
         * Report Pass booking (completed) have not result
         * tannv.dts@gmail.com
         */

        
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
        //khong xai
        $scope.listArchiveBookings=[];
        $scope.getReportArchiveBooking=function(doctorId)
        {
            rlobService.getReportArchiveBooking($scope.bookingType,doctorId)
                .then(function(data){
                    if(data.status=='success')
                    {
                        $scope.listArchiveBookings=data.data;
                    }
                },function(error){

                })
        }
        //$scope.getReportArchiveBooking();

        //Outstanding Report paginator
        //tannv.dts@gmail.com
        $scope.currentPage=1;
        $scope.searchKeys={
            doctor:'',
            location:'',
            surname:'',
            rltype:'',
            fromAppointmentDate:'',
            toAppointmentDate:'',
            bookingStatus:'',
            documentStatus:''
        }


        $scope.initPagingReportArchiveBooking=function(doctorId)
        {
            $scope.removeSelectedBooking();
            $scope.searchKeys.rltype=$scope.rlTypeSelected && $scope.rlTypeSelected.Rl_TYPE_NAME?$scope.rlTypeSelected.Rl_TYPE_NAME:'';
            $scope.searchKeys.location=$scope.locationSelected && $scope.locationSelected.Site_name?$scope.locationSelected.Site_name:'';
            $scope.searchKeys.doctor=$scope.doctorSelected && $scope.doctorSelected.NAME?$scope.doctorSelected.NAME:'';
            rlobService.getCountReportArchiveBooking($scope.bookingType,doctorId,$scope.searchKeys)
                .then(function(data){
//                    exlog.alert(data)
                    $scope.totalItems=data.data.count_archive_bookings;
                    // console.log($scope.totalItems);
                    $scope.itemsPerPage=10;
                    $scope.maxSize=10;
                    $scope.currentPage=1;
                    return {bookingType:$scope.bookingType,doctorId:doctorId,pageIndex:$scope.currentPage,itemsPerPage:$scope.itemsPerPage,searchKeys:$scope.searchKeys}
                })
                .then(rlobService.getItemsOfPageReportArchiveBooking)
                .then(function(data){
                    if(data.status=='success')
                    {
                        $scope.listArchiveBookings=data.data;
                    }
                    else{
                        $scope.listArchiveBookings = '';
                    }
                });

        }
        //khong xai
        $scope.pagingHandlerArchiveBooking=function()
        {
            $scope.removeSelectedBooking();
            var info={
                bookingType:$scope.bookingType,
                doctorId:$scope.doctorId,
                pageIndex:$scope.currentPage,
                itemsPerPage:$scope.itemsPerPage,
                searchKeys:$scope.searchKeys
            }
            rlobService.getCountReportArchiveBooking(info.bookingType,info.doctorId,info.searchKeys)
                .then(function(data){
                    $scope.totalItems=data.data.count_archive_bookings;
                    console.log($scope.totalItems);
                    return info;
                })
                .then(rlobService.getItemsOfPageReportArchiveBooking)
                .then(function(data){
                    if(data.status=='success')
                        $scope.listArchiveBookings=data.data;
                })

        }

        $scope.$watch('[searchKeys.fromAppointmentDate,searchKeys.toAppointmentDate]',function(newValue,oldValue){
            $scope.initPagingReportArchiveBooking($scope.doctorId);
        },true);

        
        //HAM COT LOI CUA PAGE
        //-----------------------------------------------------------------------
        //-----------------------------------------------------------------------
        //-----------------------------------------------------------------------
        //-----------------------------------------------------------------------
        //-----------------------------------------------------------------------
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
            $scope.initPagingReportArchiveBooking($scope.doctorId);
        });

        $scope.actionCenter.adminReport.reloadReport3=function()
        {
            $scope.initPagingReportArchiveBooking();
        }
        //-----------------------------------------------------------------------
        //-----------------------------------------------------------------------
        //-----------------------------------------------------------------------
        //-----------------------------------------------------------------------
        //-----------------------------------------------------------------------
    })
