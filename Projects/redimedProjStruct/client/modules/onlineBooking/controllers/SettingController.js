/**
 * Created by meditech on 29/09/2014.
 */
angular.module('app.loggedIn.booking.setting.controller',[])
.controller('SettingController',function($scope,$state,$modal,$filter,ngTableParams,OnlineBookingService,$http,toastr,$cookieStore){
        var companyInfo;
        var userInfo;
        $scope.data = [];

        if(typeof $cookieStore.get('companyInfo') !== 'undefined')
        {
            companyInfo = $cookieStore.get('companyInfo');
        }

        if(typeof $cookieStore.get('userInfo') !== 'undefined')
        {
            userInfo = $cookieStore.get('userInfo');
        }

        OnlineBookingService.getUserByCompany(companyInfo[0].id).then(function(data){
            $scope.data = data;
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: data.length, // length of data
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
})