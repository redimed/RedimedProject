/**
 * Created by meditech on 02/10/2014.
 */
angular.module('app.loggedIn.booking.admin.company.controller',[])
    .controller('CompanyController',function($scope,$state,$modal,$filter,ngTableParams,FileUploader,OnlineBookingAdminService,OnlineBookingService,$http,toastr,$cookieStore){
        $scope.data = [];
        var comArr = [];
        var subArr = [];
        $scope.data1 = [];


        OnlineBookingAdminService.getCompanyList().then(function(data){

            comArr = data;
            for(var i=0; i<comArr.length; i++){
                if(comArr[i].father_id === null){
                    $scope.data.push(comArr[i]);
                }
            }

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

        $scope.showSubCompany = function(b){
            $scope.data1 = [];
            for(var i=0 ; i<comArr.length; i++){
                if(comArr[i].father_id === b.id){
                    $scope.data1.push(comArr[i]);
                }

            }


            $scope.tableParams2.reload();
        }



    })