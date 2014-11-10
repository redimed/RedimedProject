/**
 * Created by meditech on 9/15/2014.
 */

angular.module('app.loggedIn.rlob.list.controller',[])
.controller("rlob_bookingListController", function ($scope, $http, $state,$stateParams, $cookieStore, FileUploader,rlobService,$window) {
        //Co cho nguoi su dung upload File hay khong, su dung bien isCanUpload
        $scope.isCanUpload=true;
        $scope.loginInfo = $cookieStore.get('userInfo');

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

            //CONFIG
            var getDate = function (date) {
                var res = date.split("/");
                return res[2] + "-" + res[1] + "-" + res[0];
            }

            $scope.rows = [
                {"code": 10},
                {"code": 20},
                {"code": 50},
                {"code": 500}
            ];
            //END CONFIG

            //GO TO BOOKING DETAIL

            $scope.goToBookingDetail = function (l) {
                //        $state.go("loggedIn.rlob_booking_list.detail", {'bookingId':l.BOOKING_ID});

                if($scope.isClickActionMenu)
                {
                    $scope.isClickActionMenu=false;
                    return;
                }

                $http({
                    method: "POST",
                    url: "/api/rlob/rl_bookings/get-booking-by-id",
                    data: {bookingId: l.BOOKING_ID,userId:$scope.loginInfo.id}
                }).success(function (data) {
                    if (data.status == 'success')
                    {
                        $scope.selectedBooking = data.data;
                        $("#view-detail-booking-dialog").modal({show: true, backdrop: 'static'});
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
            //END GO TO BOOKING DETAIL

            //OPEN MODAL
            $scope.openModal = function (id) {
                angular.element("#" + id).fadeIn();
            }

            $scope.closeModal = function (id) {
                angular.element("#" + id).fadeOut();
            }

            $scope.saveModal = function (id) {
                angular.element("#" + id).fadeOut();
                $scope.loadList();
            }
            //END OPEN MODAL

            //CHANGE PAGE
            $scope.setPage = function () {
                $scope.search.offset = ($scope.search.currentPage - 1) * $scope.search.limit;
                $scope.loadList();
            }
            //END CHANGE PAGE

            //SEARCH FUNCTION
            $scope.search_map = {
                limit: 10,
                offset: 0,
                maxSize: 5,
                currentPage: 1,
                data: {
                    ASS_ID:$scope.loginInfo.id,
                    CLAIM_NO: "",
                    ASS_SURNAME: "",
                    RL_TYPE_ID: "",
                    BOOKING_TYPE:$scope.bookingType,
                    DATE: {
                        BOOKING_DATE: {
                            from: null,
                            to: null,
                            from_map: null,
                            to_map: null
                        },
                        APPOINTMENT_DATE: {
                            from: null,
                            to: null,
                            from_map: null,
                            to_map: null
                        }
                    }
                },
                ORDER_BY: "APPOINTMENT_DATE DESC"
            }

            $scope.search = angular.copy($scope.search_map);
            //END SEARCH FUNCTION

            //LOAD SEARCH
            $scope.list = [];

            $scope.reset = function () {
                $scope.search = angular.copy($scope.search_map);
                $scope.loadList();
            }

            $scope.loadList = function () {
                if ($scope.search.data.DATE.BOOKING_DATE.from !== null && $scope.search.data.DATE.BOOKING_DATE.to !== null) {
                    $scope.search.data.DATE.BOOKING_DATE.from_map = getDate($scope.search.data.DATE.BOOKING_DATE.from);
                    $scope.search.data.DATE.BOOKING_DATE.to_map = getDate($scope.search.data.DATE.BOOKING_DATE.to);
                }

                if ($scope.search.data.DATE.APPOINTMENT_DATE.from !== null && $scope.search.data.DATE.APPOINTMENT_DATE.to !== null) {
                    $scope.search.data.DATE.APPOINTMENT_DATE.from_map = getDate($scope.search.data.DATE.APPOINTMENT_DATE.from);
                    $scope.search.data.DATE.APPOINTMENT_DATE.to_map = getDate($scope.search.data.DATE.APPOINTMENT_DATE.to);
                }



                $http.post("/api/rlob/rl_bookings/list", {search: $scope.search}).then(function (response) {
                    $scope.list = response.data;
                    var i = 0;
                    angular.forEach($scope.list.results, function (l) {
                        $scope.list.results[i].BOOKING_DATE = moment($scope.list.results[i].BOOKING_DATE).format("DD/MM/YYYY");
                        $scope.list.results[i].APPOINMENT_DATE = moment($scope.list.results[i].APPOINMENT_DATE).format("DD/MM/YYYY");
                        i++;
                    })
                })
            }
            //END LOAD SEARCH


            $scope.loadList();

            //Sort function
            //tannv.dts@gmail.com
            //------------------------------------------------------
            /***
             * Sort
             * @param field
             * @param direct
             */
            $scope.sortDirect = "NO_SORT";
            $scope.sortable = {
                'APPOINTMENT_DATE': 'DESC',
                'BOOKING_DATE': 'NO_SORT'
            }
            $scope.currentFieldSort="APPOINTMENT_DATE";
            $scope.sortBy=function()
            {
                //alert($scope.search.ORDER_BY);
                $scope.loadList();
            }

            $scope.isClickActionMenu=false;
            $scope.clickActionMenu=function(bookingId)
            {
                $scope.isClickActionMenu=true;
                rlobService.getBookingById(bookingId)
                    .then(function(data){
                        if(data.status=='success'){
                            $scope.selectedBooking=data.data;
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

        });


