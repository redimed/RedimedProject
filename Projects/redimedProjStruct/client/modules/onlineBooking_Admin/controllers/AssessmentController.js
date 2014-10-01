/**
 * Created by meditech on 01/10/2014.
 */
angular.module('app.loggedIn.booking.admin.assessment.controller',[])
    .controller('AssessmentController',function($scope,$modal,$filter,ngTableParams,FileUploader,OnlineBookingAdminService,OnlineBookingService,$http,toastr,$cookieStore){
        $scope.data = [];
        $scope.data1 = [];
        var ass = [];
        $scope.isSelected = false;
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
            $scope.data1 = [];
            $scope.isSelected = true;
            for(var i=0; i<ass.length;i++)
            {
                if(p.id === ass[i].HEADER_ID)
                    $scope.data1.push(ass[i]);
            }
            $scope.tableParams2.reload();

        }


    })