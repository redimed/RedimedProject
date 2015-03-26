/**
 * Created by meditech on 9/15/2014.
 */

angular.module('app.loggedIn.rlob.list.controller',[])
.controller("rlob_bookingListController", function ($scope, $http, $state,$stateParams, $cookieStore, FileUploader,rlobService,$window,Mailto,bookingService) {
        //Co cho nguoi su dung upload File hay khong, su dung bien isCanUpload
        $scope.isCanUpload=true;
        $scope.loginInfo = $cookieStore.get('userInfo');
        // console.log($scope.loginInfo.company_id);
        $scope.bookingStatus=rlobConstant.bookingStatus;
        $scope.documentStatus=rlobConstant.documentStatus;
        $scope.documentStatusDisplay=rlobConstant.documentStatusDisplay;
        $scope.sizePageList=[
            {value:10,display:'10 Rows'},
            {value:20,display:'20 Rows'},
            {value:30,display:'30 Rows'},
            {value:40,display:'40 Rows'},
            {value:50,display:'50 Rows'},
            {value:60,display:'60 Rows'},
            {value:70,display:'70 Rows'},
            {value:80,display:'80 Rows'},
            {value:90,display:'90 Rows'},
            {value:100,display:'100 Rows'}

        ];
        $scope.rl_types=[];
        $http({
            method:"GET",
            url:"/api/rlob/rl_types/list",
            params:{sourceType:$scope.bookingType}
        })
            .success(function(data) {
                $scope.rl_types=data;
            })
            .error(function (data) {
                console.log("error");
            })
            .finally(function() {

            });

            //GO TO BOOKING DETAIL

            $scope.goToBookingDetail = function (l) {
                //        $state.go("loggedIn.rlob_booking_list.detail", {'bookingId':l.BOOKING_ID});

                if($scope.isClickActionMenu)
                {
                    $scope.isClickActionMenu=false;
                    return;
                }            //END GO TO BOOKING DETAIL

                //OPEN MODAL
                $http({
                    method: "POST",
                    url: "/api/rlob/rl_bookings/get-booking-by-id",
                    data: {bookingId: l.BOOKING_ID,userId:$scope.loginInfo.id}
                }).success(function (data) {
                    if (data.status == 'success')
                    {
                        $scope.selectedBooking = data.data;
                        $("#view-detail-booking-dialog").modal({show: true, backdrop: 'static'});
                        // console.log($scope.selectedBooking);
                    }
                    else
                    {
                        alert("data not exist!");
                    }
                })
                .error(function (data) {
                    console.log("error");
                });
            }

            //SEARCH FUNCTION
            $scope.searchInfoMap = {
                currentPage: 1, //page hien tai tren phan trang
                itemsPerPage:$scope.sizePageList[0].value,//so luong item tren 1 page
                totalItems:'',//tong so result (tong phan tu tren tat ca cac trang)
                maxSize:15, //so luong danh dau trang hien thi
                claimNo:'',
                surname:'',
                firstName:'',
                fullName:'',
                type:'',
                appointmentDateFromTemp:'',
                appointmentDateFrom:'',
                appointmentDateToTemp:'',
                appointmentDateTo:'',
                bookingStatus:'',
                documentStatus:'',
                orderBy: "APPOINTMENT_DATE DESC"
            }



            $scope.list = [];
            $scope.pagingHandle = function () {
                if($scope.searchInfo.appointmentDateFromTemp)
                    $scope.searchInfo.appointmentDateFrom=moment($scope.searchInfo.appointmentDateFromTemp).format("YYYY/MM/DD");
                else
                    $scope.searchInfo.appointmentDateFrom=null;
                if($scope.searchInfo.appointmentDateToTemp)
                    $scope.searchInfo.appointmentDateTo=moment($scope.searchInfo.appointmentDateToTemp).format("YYYY/MM/DD");
                else
                    $scope.searchInfo.appointmentDateTo=null;
                $http.post("/api/rlob/rl_bookings/list-bookings-for-customer", {searchInfo: $scope.searchInfo}).then(function (response) {
                    if(response.data.status=='success')
                    {
                        $scope.list = response.data.data.list;
                        $scope.searchInfo.totalItems=response.data.data.totalItems;
                    }
                    else
                    {
                        $scope.list=[];
                    }
                    
                })
            }
            //END LOAD SEARCH

            $scope.searchHandle=function()
            {
                $scope.searchInfo.currentPage=1;
                $scope.pagingHandle();
            }

            $scope.reset = function () {
                $scope.searchInfo = angular.copy($scope.searchInfoMap);
                $scope.pagingHandle();
            }

            //Sort function
            //tannv.dts@gmail.com
            //------------------------------------------------------
            $scope.sortDirect = "NO_SORT";
            $scope.sortable = {
                'APPOINTMENT_DATE': 'DESC',
                'BOOKING_DATE': 'NO_SORT'
            }
            $scope.currentFieldSort="APPOINTMENT_DATE";
            $scope.sortBy=function()
            {
                $scope.searchHandle();
            }

            $scope.$watch("[searchInfo.appointmentDateFromTemp,searchInfo.appointmentDateToTemp]",function(newValue,oldValue){
                if($scope.searchInfo)
                {
                    $scope.searchHandle();
                }
                
            },true);

            $scope.searchInfo = angular.copy($scope.searchInfoMap);
            $scope.searchHandle();
            //-----------------------------------------------------------

            $scope.isClickActionMenu=false;
            $scope.clickActionMenu=function(bookingId)
            {

                $scope.isClickActionMenu=true;
                rlobService.getBookingById(bookingId)
                    .then(function(data){
                        if(data.status=='success'){
                            $scope.selectedBooking=data.data;
                            // console.log($scope.selectedBooking);
                        }
                    })
            }
            $scope.printContent=function()
            {
                var printable = document.getElementsByClassName("printable");
                $(printable[0]).printArea();
            }

            $scope.downloadResult=function(bookingId)
            {
                $window.location.href = '/api/download/structure/attach-file/'+$scope.bookingType+'/'+bookingId;
            }


            $scope.$watch("selectedBooking",function(newValue,oldValue){
                if (newValue != oldValue) {
                    $scope.updateMailTo(newValue);
                };
            });

            $scope.showDialogSendDocument=function()
            {
                $("#view-detail-booking-dialog").modal('hide');
                $("#lob-client-send-document-dialog").modal({show:true,backdrop:'static'});
            }
            $scope.uploadDocument=function ()
            {
                $("#lob-client-send-document-dialog").modal('hide');
                $("#lob-client-upload-dialog").modal({show:true,backdrop:'static'});
            }
            $scope.updateMailTo=function(data){
                $scope.mailBodyData={
                    requestBy:$scope.loginInfo.user_name?$scope.loginInfo.user_name:'',
                    company: data.Company_name?data.Company_name:'',
                    time:moment(new Date(data.APPOINTMENT_DATE)).format("HH:mm"),
                    date:moment(new Date(data.APPOINTMENT_DATE)).format("DD/MM/YYYY"),
                    typeOfAppointment:data.BOOKING_TYPE,
                    doctor:data.NAME?data.NAME:'',
                    address:data.Site_addr?data.Site_addr:'',
                    isContactPatient:data.ISCONTACTPATIENT?data.ISCONTACTPATIENT:'',
                    notes:data.NOTES?data.NOTES:'',
                    claimNumber:data.CLAIM_NO?data.CLAIM_NO:'',
                    wrkName:data.WRK_SURNAME?data.WRK_SURNAME:'',
                    wrkDOB:moment(data.WRK_DOB).format("DD/MM/YYYY"),
                    wrkContactNo:data.WRK_CONTACT_NO?data.WRK_CONTACT_NO:'',
                    injuryDesc:data.DESC_INJURY?data.DESC_INJURY:''
                }

                 $scope.emailContent=
                "The below appointment has been requested by "+$scope.mailBodyData.requestBy+" from "+$scope.mailBodyData.company+".\n\n"+
                "Appointment Details:\n\n"+
                "Date: "+$scope.mailBodyData.date+"\n"+
                "Time: "+$scope.mailBodyData.time+"\n"+
                "Type of appointment: "+$scope.mailBodyData.Rl_TYPE_NAME+"\n"+
                "Doctor: "+$scope.mailBodyData.doctor+"\n"+
                "Address: "+$scope.mailBodyData.address+"\n"+
                "Notes: "+$scope.mailBodyData.notes+" \n\n"+
                "Patient information:\n\n"+
                "Claim number: "+$scope.mailBodyData.claimNumber+"\n"+
                "Name: "+$scope.mailBodyData.wrkName+"\n"+
                "Date of Birth: "+$scope.mailBodyData.wrkDOB+"\n"+
                "Contact number: "+$scope.mailBodyData.wrkContactNo+" \n"+
                "Injury description: "+$scope.mailBodyData.injuryDesc+"\n";

            var recepient = "medicolegal@redimed.com.au";
            var options = {
//                cc: "tannv.dts@gmail.com",
//                bcc: "nguyenvantan27binhduong@gmail.com",
                subject: ("Medico-Legal Paperwork "+$scope.mailBodyData.wrkName),
                body: $scope.emailContent
            };

                $scope.mailtoLink = Mailto.url(recepient, options);

            }

            $scope.sendEmail=function()
            {
                console.log($scope.mailtoLink);
                $window.location.href = $scope.mailtoLink;
                $("#lob-client-send-document-dialog").modal('hide');
            }

            $scope.reuseBookingInfo=function()
            {
                bookingService.setBookingInfoReuse($scope.selectedBooking);
                rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.success,"Please choose appointment calendar!");
                $state.go("loggedIn.rlob.rlob_booking");
            }

            $scope.cancelBooking=function()
            {
                var appTime=new Date($scope.selectedBooking.APPOINTMENT_DATE);
                var currentTime=new Date();
                if(appTime>currentTime)
                {
                    if($scope.selectedBooking.STATUS==rlobConstant.bookingStatus.confirmed)
                    {
                        rlobService.cancelBooking($scope.selectedBooking.CAL_ID,$scope.selectedBooking.PATIENT_ID)
                        .then(function(data){
                            if (data.status == 'success') 
                            {
                                rlobService.changeBookingStatus($scope.selectedBooking.BOOKING_ID,rlobConstant.bookingStatus.canel).then(function(data){
                                    if(data.status=='success')
                                    {
                                        $scope.selectedBooking.STATUS=rlobConstant.bookingStatus.canel;
                                        rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.success,"Cancel booking success!");
                                        $scope.pagingHandle();
                                    }
                                    else
                                    {
                                        rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Cancel booking fail!");
                                    };
                                });
                            }
                            else
                            {
                                rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Cancel booking fail!");
                            };
                        });
                    }
                    else
                    {
                        rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"You cannot cancel this booking!");
                    }
                    
                }
                else
                {
                    rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"You cannot cancel this booking!");
                }
                
            }

        });


