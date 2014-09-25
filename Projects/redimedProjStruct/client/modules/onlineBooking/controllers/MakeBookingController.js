/**
 * Created by meditech on 24/09/2014.
 */
angular.module('app.loggedIn.booking.make.controller',[])
    .controller('MakeBookingController',function($scope,$filter,ngTableParams,OnlineBookingService,$http,toastr,$cookieStore){
        var companyInfo;
        if($cookieStore.get('companyInfo') !== 'undefined')
        {
            companyInfo = $cookieStore.get('companyInfo');
        }

        $scope.companyName = companyInfo[0].Company_name;
        $scope.companyList = [];
        $scope.packageList = [];

        $scope.c = companyInfo[0];

        OnlineBookingService.getSubCompany(companyInfo[0].id).then(function(response){
            if(response.status === 'success')
            {
                $scope.companyList = response.rs;
            }
        })

        OnlineBookingService.getPackage(companyInfo[0].id).then(function(data){
            if(data.status === 'success')
            {
                $scope.packageList = data.rs;
            }
        })

        $scope.packageChange = function(PackId){
            var arrAss = [];
            var arrHead = [];

            if(PackId !== null)
            {
                OnlineBookingService.getPackageAss(PackId).then(function(data){
                    if(data.status === 'success')
                    {
                        for(var i=0; i<data.rs.length; i++)
                        {
                            arrAss.push(data.rs[i]);

                        }

                        $scope.packAss = arrAss;

                    }
                })
            }else
            {
                $scope.packAss = [];
            }

        };
    });