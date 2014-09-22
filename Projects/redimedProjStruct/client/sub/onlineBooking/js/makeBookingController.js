/**
 * Created by meditech on 22/09/2014.
 */
app.controller('makeBookingController',function($scope,$rootScope,$http,$cookieStore){
    var companyInfo = $cookieStore.get('companyInfo');
    $scope.companyName = companyInfo[0].Company_name;
    $scope.companyList = [];
    $scope.packageList = [];

    $scope.c = companyInfo[0];

    $http({
        method:'POST',
        url:'/api/company/getSub',
        data: {id: companyInfo[0].id}
    }).success(function(data){
        if(data.status === 'success')
        {
            $scope.companyList = data.rs;
        }
    });

    $http({
        method:'POST',
        url: '/api/booking/package',
        data: {id: companyInfo[0].id}
    }).success(function(data){
        if(data.status === 'success')
        {
            $scope.packageList = data.rs;
        }
    })



});