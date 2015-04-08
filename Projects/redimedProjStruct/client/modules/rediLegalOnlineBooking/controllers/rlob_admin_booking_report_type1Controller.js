/**
 * Created by meditech on 11/17/2014.
 */
angular.module('app.loggedIn.rlob.adminBookingReport.type1.controller',[])
    .controller("rlob_admin_bookingReport_type1Controller", function($scope,$http,$cookieStore,$q,rlobService) {
        $scope.removeSelectedBooking();
        // chien status
        $scope.report = 'report1';
        $scope.status = "Confirmed";
        
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

        $scope.initPagingReportUpcommingBooking=function()
        {
            $scope.removeSelectedBooking();
            $scope.filterInfo.Type=$scope.rlTypeSelected && $scope.rlTypeSelected.Rl_TYPE_NAME?$scope.rlTypeSelected.Rl_TYPE_NAME:'';
            $scope.filterInfo.Location=$scope.locationSelected && $scope.locationSelected.Site_name?$scope.locationSelected.Site_name:'';
            $scope.filterInfo.Doctor=$scope.doctorSelected && $scope.doctorSelected.NAME?$scope.doctorSelected.NAME:'';
            rlobService.getCountReportUpcommingBookings($scope.bookingType,$scope.doctorId,$scope.filterInfo)
                .then(function(data)
                {
                    $scope.totalItemsReport1=data.data.count_upcomming_bookings;
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
                            if(data.data[i].DOCUMENT_STATUS == $scope.rlobDocumentStatus.notConfirmed.value){
                                data.data[i].style_class = 'warning'
                            }
                            else{
                                if(data.data[i].DOCUMENT_STATUS == $scope.rlobDocumentStatus.checked.value){
                                    data.data[i].style_class = 'info'
                                }
                                else{
                                    if(data.data[i].DOCUMENT_STATUS == $scope.rlobDocumentStatus.noDocuments.value){
                                        data.data[i].style_class = 'danger'
                                    }
                                }
                            }
                        }
                        $scope.listUpcommingBookings= data.data;
                    }
                    else{
                        $scope.listUpcommingBookings = '';
                    }
                })
        }
        $scope.pagingHandlerUpcommingBooking=function()
        {
            // //$scope.isChangingDocumentStatus
            // if(!$scope.isChangingDocumentStatus)
            // {
            //     $scope.removeSelectedBooking();
            // }
            // $scope.isChangingDocumentStatus=false;
            // //change booking
            // if(!$scope.isChangingBookingStatus)
            // {
            //     $scope.removeSelectedBooking();
            // }
            // $scope.isChangingBookingStatus=false;
            var info={
                bookingType:$scope.bookingType,
                doctorId:$scope.doctorId,
                currentPage:$scope.currentPageReport1,
                itemsPerPage:$scope.itemsPerPageReport1,
                filterInfo:$scope.filterInfo
            }
            rlobService.getCountReportUpcommingBookings(info.bookingType,info.doctorId,$scope.filterInfo)
                .then(function(data){
                    $scope.totalItemsReport1=data.data.count_upcomming_bookings;
                    //alert($scope.totalItemsReport1);
                    //alert(JSON.stringify(info));
                    return info;
                })
                .then(rlobService.getItemsOfPageReportUpcommingBookings)
                .then(function(data){
                    if(data.status == 'success')
                    {
                        for (var i = 0; i < data.data.length; i++) {
                            if(data.data[i].DOCUMENT_STATUS == $scope.rlobDocumentStatus.notConfirmed.value){
                                data.data[i].style_class = 'warning'
                            }
                            else{
                                if(data.data[i].DOCUMENT_STATUS == $scope.rlobDocumentStatus.checked.value){
                                    data.data[i].style_class = 'info'
                                }
                                else{
                                    if(data.data[i].DOCUMENT_STATUS == $scope.rlobDocumentStatus.noDocuments.value){
                                        data.data[i].style_class = 'danger'
                                    }
                                }
                            }
                        }
                        $scope.listUpcommingBookings= data.data;
                    }
                })

        }

        $scope.$watch('[filterInfo.FromAppointmentDate,filterInfo.ToAppointmentDate]',function(newValue,oldValue){
            $scope.initPagingReportUpcommingBooking();
        },true);

        
        //chien set rlobhelper
        //phanquocchien.c1109g@gmail.com
        $scope.rlobDocumentStatus=rlobConstant.documentStatus;

        // $scope.isChangingDocumentStatus=false;
        // $scope.$watch('documentStatusChangedFlag',function(newValue,oldValue){
        //     if($scope.documentStatusChangedFlag && $scope.documentStatusChangedFlag>0)
        //     {
        //         $scope.isChangingDocumentStatus=true;
        //         $scope.pagingHandlerUpcommingBooking();
        //     }
        // })
        // $scope.isChangingBookingStatus=false;
        // $scope.$watch('bookingStatusChangedFlag',function(newValue,oldValue){
        //     if($scope.bookingStatusChangedFlag && $scope.bookingStatusChangedFlag>0)
        //     {
        //         $scope.isChangingBookingStatus=true;
        //         $scope.pagingHandlerUpcommingBooking();
        //     }
        // })


        //Ham cot loi cua page
        //-------------------------------------------------------------------
        //-------------------------------------------------------------------
        //-------------------------------------------------------------------
        //-------------------------------------------------------------------
        //-------------------------------------------------------------------
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
            $scope.initPagingReportUpcommingBooking();
        });
        //-------------------------------------------------------------------
        //-------------------------------------------------------------------
        //-------------------------------------------------------------------
        //-------------------------------------------------------------------
        //-------------------------------------------------------------------
    });
