/**
 * Created by meditech on 01/10/2014.
 */
angular.module('app.loggedIn.booking.admin.assessment.controller',[])
    .controller('AdminAssessmentController',function($scope,$state,$modal,$filter,ngTableParams,FileUploader,OnlineBookingAdminService,OnlineBookingService,$http,toastr,$cookieStore){
        $scope.data = [];
        $scope.data1 = [];
        $scope.selectedHeader = '';
        var ass = [];
        $scope.isSelected = false;
        $scope.selectedId = null;
        OnlineBookingAdminService.getAssHeader().then(function(data){
            $scope.data = data;
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: $scope.data.length, // length of data
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                        $filter('filter')($scope.data, params.filter()) :
                        $scope.data;

                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        $scope.data;

                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        })

        OnlineBookingAdminService.getAssessment().then(function(data){
            ass = data;
            $scope.tableParams2 = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: $scope.data1.length, // length of data
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                        $filter('filter')($scope.data1, params.filter()) :
                        $scope.data1;

                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        $scope.data1;

                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        })

        $scope.showChild = function(p)
        {
            $scope.selectedId = p.id;
            $scope.data1 = [];
            $scope.isSelected = true;
            $scope.selectedHeader = p.id;
            for(var i=0; i<ass.length;i++)
            {
                if(p.id === ass[i].HEADER_ID)
                    $scope.data1.push(ass[i]);
            }
            $scope.tableParams2.reload();

        }

        $scope.removeHeaderAssessment = function(p){
            var headerId = p.id;
            OnlineBookingAdminService.deleteHeaderAssessment(headerId).then(function(data){
                if(data.status === 'success')
                {
                    toastr.success("Delete Successfully!","Success");
                    $state.go('loggedIn.admin_assessment',null,{reload:true});

                }
                else if(data.status === 'error')
                    toastr.error("Delete Failed!", "Error");
            })
        }

        $scope.removeAssessment = function(a){
            var id = a.id;
            OnlineBookingAdminService.deleteAssessment(id).then(function(data){
                if(data.status === 'success')
                {
                    toastr.success("Delete Successfully!","Success");
                    $state.go('loggedIn.admin_assessment',null,{reload:true});
                }
                else if(data.status === 'error')
                    toastr.error("Delete Failed!", "Error");
            })
        }

        $scope.addHeader = function(){
            var modalInstance = $modal.open({
                templateUrl: 'modules/onlineBooking_Admin/views/assessmentHeaderModal.html',
                controller: 'AddAssHeaderController',
                size:'md'
            })
        }

        $scope.addAssessment = function(){
            var modalInstance = $modal.open({
                templateUrl: 'modules/onlineBooking_Admin/views/assessmentModal.html',
                controller: 'AddAssessmentController',
                size:'md',
                resolve:{
                    headId: function(){
                        return $scope.selectedHeader;
                    }
                }
            })
        }


    })

    .controller('AddAssHeaderController',function($scope,$state,$modalInstance,OnlineBookingAdminService,toastr){
        $scope.info = {
            name:''
        }

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        };

        $scope.submit = function(){
            OnlineBookingAdminService.addNewHeaderAssessment($scope.info).then(function(data){
                if(data.status === 'success')
                {
                    toastr.success("Delete Successfully!","Success");
                    $modalInstance.dismiss('cancel');
                    $state.go('loggedIn.admin_assessment',null,{reload:true});
                }
                else if(data.status === 'error')
                    toastr.error("Delete Failed!", "Error");
            })
        }
    })

    .controller('AddAssessmentController',function($scope,$state,$modalInstance,OnlineBookingAdminService,toastr,headId){
        $scope.info = {
            headId:headId,
            name:''
        }

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        };

        $scope.submit = function(){
            OnlineBookingAdminService.addNewAssessment($scope.info).then(function(data){
                if(data.status === 'success')
                {
                    toastr.success("Delete Successfully!","Success");
                    $modalInstance.dismiss('cancel');
                    $state.go('loggedIn.admin_assessment',null,{reload:true});
                }
                else if(data.status === 'error')
                    toastr.error("Delete Failed!", "Error");
            })
        }
    })