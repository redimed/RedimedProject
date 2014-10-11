/**
 * Created by meditech on 04/10/2014.
 */
angular.module('app.loggedIn.booking.admin.site.controller',[])
    .controller('AdminSiteController',function($scope,$state,$modal,$filter,ngTableParams,FileUploader,OnlineBookingAdminService, OnlineBookingService,$http,toastr,$cookieStore){
        $scope.selectedId = null;
        $scope.selectedCal = null;
        $scope.selectedState = null;
        $scope.selectedSuburb = null;

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.arr = [];
        $scope.arrState = [];
        $scope.arrSuburb = [];

        $scope.info = {
            site_id: null,
            cal_id: null,
            From_time: null,
            to_time: null,
            available: null,
            booking: null
        }

        $scope.stateInfo = {
            state_id:null,
            site_id:null,
            state_name: null,
            isenable: null
        }

        $scope.suburbInfo = {
            suburb_id:null,
            state_id:null,
            site_id:null,
            suburb_name: null,
            isenable: null
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

            $scope.tableParams3 = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: $scope.arrState.length, // length of data
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                        $filter('filter')($scope.arrState, params.filter()) :
                        $scope.arrState;

                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        $scope.arrState;

                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

            $scope.tableParams4 = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: $scope.arrSuburb.length, // length of data
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                        $filter('filter')($scope.arrSuburb, params.filter()) :
                        $scope.arrSuburb;

                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        $scope.arrSuburb;

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
            $scope.selectedCal = null;
            $scope.arr = [];
            $scope.arrState = [];
            $scope.arrSuburb = [];
            $scope.rs = [];
            $scope.rsState = [];
            $scope.rsSuburb = [];
            OnlineBookingAdminService.getCalendarBySiteId(b.id).then(function(data){
                $scope.rs = data;

            })

            OnlineBookingService.getSiteState(b.id).then(function(data){
                $scope.rsState = data;
            })

            $scope.$watch('rs',function(rs){
                $scope.arr = rs;
                $scope.tableParams2.reload();
            })

            $scope.$watch('rsState',function(rs){
                $scope.arrState = rs;
                $scope.tableParams3.reload();
            })

            $scope.$watch('rsSuburb',function(rs){
                $scope.arrSuburb = rs;
                $scope.tableParams4.reload();
            })

        }

        $scope.showStateDetail = function(b)
        {
            $scope.selectedState = b.state_id;
            $scope.arrSuburb = [];
            $scope.rsSuburb = [];

            OnlineBookingService.getStateSuburb(b.state_id).then(function(data){
                $scope.rsSuburb = data;
            })

            $scope.$watch('rsSuburb',function(rs){
                $scope.arrSuburb = rs;
                $scope.tableParams4.reload();
            })

            OnlineBookingAdminService.getStateById(b.state_id).then(function(data){
                $scope.stateInfo = data[0];
                $scope.stateInfo.isenable = data[0].isenable == 1 ? '1':'0';
            })

        }

        $scope.showSuburbDetail = function(b){
            $scope.selectedSuburb = b.suburb_id;

            OnlineBookingAdminService.getSuburbById(b.suburb_id).then(function(data){
                $scope.suburbInfo = data[0];
                $scope.suburbInfo.isenable = data[0].isenable == 1 ? '1':'0';
            })
        }

        $scope.showCalendarDetail = function(b){
            $scope.selectedCal = b.cal_id;

            OnlineBookingAdminService.getCalendarById(b.cal_id).then(function(data){
                $scope.info = data;

            })
        }

        $scope.submitState = function(stateForm){
            $scope.showStateValidation = true;
            if(stateForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else {
                OnlineBookingAdminService.editStateInfo($scope.stateInfo).then(function(data){
                    if(data.status === 'success')
                    {
                        toastr.success("Edit State Successfully!","Success");
                        OnlineBookingService.getSiteState($scope.selectedId).then(function(data){
                            $scope.rsState = data;
                        })

                        $scope.$watch('rsState',function(rs){
                            $scope.arrState = rs;
                            $scope.tableParams3.reload();
                        })
                    }
                    else if(data.status === 'error')
                        toastr.error("Edit State Failed!", "Error");
                })
            }
        }

        $scope.submitSuburb = function(suburbForm){
            $scope.showSuburbValidation = true;
            if(suburbForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else {
                OnlineBookingAdminService.editSuburbInfo($scope.suburbInfo).then(function(data){
                    if(data.status === 'success')
                    {
                        toastr.success("Edit Suburb Successfully!","Success");
                        OnlineBookingService.getStateSuburb($scope.selectedState).then(function(data){
                            $scope.rsSuburb = data;
                        })

                        $scope.$watch('rsSuburb',function(rs){
                            $scope.arrSuburb = rs;
                            $scope.tableParams4.reload();
                        })
                    }
                    else if(data.status === 'error')
                        toastr.error("Edit Suburb Failed!", "Error");
                })
            }
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

        $scope.addNewState = function(){
            var modalInstance = $modal.open({
                templateUrl:'modules/onlineBooking_Admin/views/newStateModal.html',
                controller:'NewStateController',
                size:'md',
                resolve:{
                    siteId:function(){
                        return $scope.selectedId;
                    }
                }
            });

            modalInstance.result.then(function(){
                OnlineBookingService.getSiteState($scope.selectedId).then(function(data){
                    $scope.rsState = data;
                })

                $scope.$watch('rsState',function(rs){
                    $scope.arrState = rs;
                    $scope.tableParams3.reload();
                })
            })
        }

        $scope.addNewSuburb = function(){
            var modalInstance = $modal.open({
                templateUrl:'modules/onlineBooking_Admin/views/newSuburbModal.html',
                controller:'NewSuburbController',
                size:'md',
                resolve:{
                    siteId:function(){
                        return $scope.selectedId;
                    },
                    stateId:function(){
                        return $scope.selectedState;
                    }
                }
            });

            modalInstance.result.then(function(){
                OnlineBookingService.getStateSuburb($scope.selectedState).then(function(data){
                    $scope.rsSuburb = data;
                })

                $scope.$watch('rsSuburb',function(rs){
                    $scope.arrSuburb = rs;
                    $scope.tableParams4.reload();
                })
            })
        }


    })

    .controller('NewStateController',function($scope,$filter,$state,$modalInstance,OnlineBookingService,OnlineBookingAdminService,siteId, toastr){
        $scope.stateInfo = {
            state_id:null,
            site_id:siteId,
            state_name: null,
            isenable: null
        }

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

        $scope.addState = function(stateForm){
            $scope.showStateValidation = true;
            if(stateForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else {
                OnlineBookingAdminService.insertState($scope.stateInfo).then(function(data){
                    if(data.status === 'success')
                    {
                        toastr.success("Insert State Successfully!","Success");
                        $modalInstance.close();

                    }
                    else if(data.status === 'error')
                        toastr.error("Insert State Failed!", "Error");
                })
            }
        }
    })

    .controller('NewSuburbController',function($scope,$filter,$state,$modalInstance,OnlineBookingService,OnlineBookingAdminService, siteId, stateId, toastr){
        $scope.suburbInfo = {
            suburb_id:null,
            state_id:stateId,
            site_id:siteId,
            suburb_name: null,
            isenable: null
        }

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

        $scope.addSuburb = function(suburbForm){
            $scope.showSuburbValidation = true;
            if(suburbForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else {
                OnlineBookingAdminService.insertSuburb($scope.suburbInfo).then(function(data){
                    if(data.status === 'success')
                    {
                        toastr.success("Insert Suburb Successfully!","Success");
                        $modalInstance.close();
                    }
                    else if(data.status === 'error')
                        toastr.error("Insert Suburb Failed!", "Error");
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
