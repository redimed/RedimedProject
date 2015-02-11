/**
 * Created by meditech on 11/17/2014.
 */
angular.module('app.loggedIn.rlob.adminBookingReport.type1.controller',[])
    .controller("rlob_admin_bookingReport_type1Controller", function($scope,$http,$cookieStore,$q,rlobService) {
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

        $scope.rlTypeList=[];
        rlobService.getRlTypeList($scope.bookingType)
            .then(function(data){
                $scope.rlTypeList=data;
            });

        /**
         * Paging Upcomming booking
         * phanquocchien.c1109g@gmail.com
         */

            //$scope.currentPageReport1=1;
        $scope.filterInfo = {
            Doctor:'',
            Surname:'',
            Type:'',
            Location:'',
            FromAppointmentDate:'',
            ToAppointmentDate:''
        };

        $scope.initPagingReportUpcommingBookingHaveNotResult=function()
        {
            $scope.removeSelectedBooking();
            $scope.filterInfo.Type=$scope.rlTypeSelected && $scope.rlTypeSelected.Rl_TYPE_NAME?$scope.rlTypeSelected.Rl_TYPE_NAME:'';
            rlobService.getCountReportUpcommingBookings($scope.bookingType,$scope.doctorId,$scope.filterInfo)
                .then(function(data)
                {
                    $scope.totalItemsReport1=data.data.count_bookings;
                    //alert($scope.totalItemsReport1);
                    $scope.itemsPerPageReport1=10;
                    $scope.currentPageReport1=1;
                    $scope.maxSizeReport1=10;
                    return ({bookingType:$scope.bookingType,doctorId:$scope.doctorId,currentPage:$scope.currentPageReport1,itemsPerPage:$scope.itemsPerPageReport1,filterInfo:$scope.filterInfo});

                })
                .then(rlobService.getItemsOfPageReportUpcommingBookings)
                .then(function(data){
                    if(data.status == 'success')
                    {
                        for (var i = 0; i < data.data.length; i++) {
                            if(data.data[i].DOCUMENT_STATUS == $scope.rlobDocumentStatus.notConfirmed){
                                data.data[i].style_class = 'warning'
                            }
                            else{
                                if(data.data[i].DOCUMENT_STATUS == $scope.rlobDocumentStatus.checked){
                                    data.data[i].style_class = 'info'
                                }
                                else{
                                    if(data.data[i].DOCUMENT_STATUS == $scope.rlobDocumentStatus.noDocuments){
                                        data.data[i].style_class = 'danger'
                                    }
                                }
                            }
                        }
                        $scope.reportUpcommingBookingsList= data.data;
                    }
                    else{
                        $scope.reportUpcommingBookingsList = '';
                    }
                })
        }
        $scope.pagingHandlerUpcommingBookingHaveNotResult=function()
        {
            //$scope.isChangingDocumentStatus
            if(!$scope.isChangingDocumentStatus)
            {
                $scope.removeSelectedBooking();
            }
            $scope.isChangingDocumentStatus=false;

            var info={
                bookingType:$scope.bookingType,
                doctorId:$scope.doctorId,
                currentPage:$scope.currentPageReport1,
                itemsPerPage:$scope.itemsPerPageReport1,
                filterInfo:$scope.filterInfo
            }
            rlobService.getCountReportUpcommingBookings(info.bookingType,info.doctorId,$scope.filterInfo)
                .then(function(data){
                    $scope.totalItemsReport1=data.data.count_bookings;
                    //alert($scope.totalItemsReport1);
                    //alert(JSON.stringify(info));
                    return info;
                })
                .then(rlobService.getItemsOfPageReportUpcommingBookings)
                .then(function(data){
                    if(data.status == 'success')
                    {
                        for (var i = 0; i < data.data.length; i++) {
                            if(data.data[i].DOCUMENT_STATUS == $scope.rlobDocumentStatus.notConfirmed){
                                data.data[i].style_class = 'warning'
                            }
                            else{
                                if(data.data[i].DOCUMENT_STATUS == $scope.rlobDocumentStatus.checked){
                                    data.data[i].style_class = 'info'
                                }
                                else{
                                    if(data.data[i].DOCUMENT_STATUS == $scope.rlobDocumentStatus.noDocuments){
                                        data.data[i].style_class = 'danger'
                                    }
                                }
                            }
                        }
                        $scope.reportUpcommingBookingsList= data.data;
                    }
                })

        }

        $scope.$watch('[filterInfo.FromAppointmentDate,filterInfo.ToAppointmentDate]',function(newValue,oldValue){
            $scope.initPagingReportUpcommingBookingHaveNotResult();
        },true);

        $scope.getDoctorInfoByUserId()
            .then(function(){
                $scope.doctorId=$scope.doctorInfo?$scope.doctorInfo.doctor_id:'';
                $scope.initPagingReportUpcommingBookingHaveNotResult();
            });
        //chien set rlobhelper
        //phanquocchien.c1109g@gmail.com
        $scope.rlobDocumentStatus=rlobConstant.documentStatus;

        $scope.isChangingDocumentStatus=false;
        $scope.$watch('documentStatusChangedFlag',function(newValue,oldValue){
            if($scope.documentStatusChangedFlag && $scope.documentStatusChangedFlag>0)
            {
                $scope.isChangingDocumentStatus=true;
                $scope.pagingHandlerUpcommingBookingHaveNotResult();
            }
        })
    });
