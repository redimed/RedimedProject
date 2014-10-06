/**
 * Created by meditech on 04/10/2014.
 */
angular.module('app.loggedIn.booking.admin.site.controller',[])
    .controller('AdminSiteController',function($scope,$state,$modal,$filter,ngTableParams,FileUploader,OnlineBookingAdminService,$http,toastr,$cookieStore){
        $scope.selectedId = null;
        $scope.selectedCal = null;
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.arr = [];

        $scope.info = {
            site_id: null,
            cal_id: null,
            From_time: null,
            to_time: null,
            available: null,
            booking: null
        }

        OnlineBookingAdminService.getSiteList().then(function(data){
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: data.length, // length of data
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                        $filter('filter')(data, params.filter()) :
                        data;

                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        data;

                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

            $scope.tableParams2 = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: $scope.arr.length, // length of data
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                        $filter('filter')($scope.arr, params.filter()) :
                        $scope.arr;

                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        $scope.arr;

                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });


        })

        $scope.addNewSite = function(){
            $state.go('loggedIn.admin_sites_new');
        }

        $scope.editSite = function(b){
            $state.go('loggedIn.admin_sites_edit',{id: b.id});
        }

        $scope.showSiteCalendar = function(b){
            $scope.selectedId = b.id;
            $scope.arr = [];
            $scope.rs = [];
            OnlineBookingAdminService.getCalendarBySiteId(b.id).then(function(data){
                $scope.rs = data;

            })

            $scope.$watch('rs',function(rs){
                $scope.arr = rs;
                $scope.tableParams2.reload();
            })



        }

        $scope.showCalendarDetail = function(b){
            $scope.selectedCal = b.cal_id;

            OnlineBookingAdminService.getCalendarById(b.cal_id).then(function(data){
                $scope.info = data;


            })


        }

        $scope.submitCalendar = function(calendarForm){

            $scope.showClickedValidation = true;
            if(calendarForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else {
                OnlineBookingAdminService.submitNewCalendar($scope.info).then(function(data){
                    if(data.status === 'success')
                    {
                        toastr.success("Edit Calendar Successfully!","Success");
                        OnlineBookingAdminService.getCalendarBySiteId($scope.selectedId).then(function(data){
                            $scope.rs = data;
                        })

                        $scope.$watch('rs',function(rs){
                            $scope.arr = rs;
                            $scope.tableParams2.reload();
                        })
                    }
                    else if(data.status === 'error')
                        toastr.error("Edit Calendar Failed!", "Error");
                })
            }
        }
    })

    .controller('AdminNewSiteController',function($scope,$state,OnlineBookingAdminService,toastr){
        $scope.isEdit = false;

        $scope.info = {
            Site_name : null,
            Site_addr : null,
            postcode : null,
            State : null,
            latitude : null,
            longitude : null,
            country : null,
            Available_def : null,
            booking_status : null,
            isPreEmpBK : null
        };

        $scope.submitSite = function(siteForm){
            $scope.showClickedValidation = true;
            if(siteForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else {
                OnlineBookingAdminService.insertNewSite($scope.info).then(function(data){
                    if(data.status === 'success')
                    {
                        toastr.success("Submit New Site Successfully!","Success");
                        $state.go('loggedIn.admin_sites_new', null, {"reload":true});
                    }
                    else if(data.status === 'error')
                        toastr.error("Submit New Site Failed!", "Error");
                })
            }
        }
    })

    .controller('AdminEditSiteController',function($scope,$state,$stateParams,OnlineBookingAdminService,toastr,$cookieStore){
        $scope.isEdit = true;
        var id = $stateParams.id;

        $scope.info = {
            id: id,
            Site_name : null,
            Site_addr : null,
            postcode : null,
            State : null,
            latitude : null,
            longitude : null,
            country : null,
            Available_def : null,
            booking_status : null,
            isPreEmpBK : null
        };

        OnlineBookingAdminService.getSiteInfo(id).then(function(data){
            $scope.info = data;
            $scope.info.isPreEmpBK = data.isPreEmpBK == 1 ? '1':'0';
        })

        $scope.submitSite = function(siteForm){
            $scope.showClickedValidation = true;
            if(siteForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else {
                OnlineBookingAdminService.editSiteInfo($scope.info).then(function(data){
                    if(data.status === 'success')
                    {
                        toastr.success("Edit Site Successfully!","Success");

                    }
                    else if(data.status === 'error')
                        toastr.error("Edit Site Failed!", "Error");
                })
            }
        }
    })