/**
 * Created by meditech on 25/09/2014.
 */
angular.module('app.loggedIn.booking.package.controller',[])
.controller('PackageController',function($scope,$state,$modal,$filter,ngTableParams,OnlineBookingService,$http,toastr,$cookieStore){
        var companyInfo;
        $scope.isSelected = false;
        var ass = [];
        $scope.assList = [];
        $scope.data=[];
        $scope.data1=[];

        if($cookieStore.get('companyInfo') !== 'undefined')
        {
            companyInfo = $cookieStore.get('companyInfo');
        }

        OnlineBookingService.getPackage(companyInfo[0].id).then(function(data){
            if(data.status === 'success')
            {
                OnlineBookingService.getAssList().then(function(data){
                    $scope.assList = data;
                })

                $scope.data = data.rs;
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

                OnlineBookingService.getPackageAss().then(function(data){

                    ass = data.rs;
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
            }
        })

        $scope.removePackage = function(p)
        {
            OnlineBookingService.deletePackage(p.id,companyInfo[0].id).then(function(data){
                if(data.status === 'success')
                {
                    $state.go('loggedIn.package',null,{reload:true});
                }
                else
                {
                    alert('Failed To Delete!');
                }
            })
        }

        $scope.addPackage = function()
        {
            var modalInstance = $modal.open({
                templateUrl: 'modules/onlineBooking/views/addPackage.html',
                controller: 'AddPackageController',
                size:'md',
                resolve:{
                    comId: function(){
                        return companyInfo[0].id;
                    }
                }
            });
        }

        $scope.showChild = function(p)
        {
            $scope.data1 = [];
            $scope.isSelected = true;
            for(var i=0; i<ass.length;i++)
            {
                if(p.id === ass[i].pack_id)
                    $scope.data1.push(ass[i]);
            }
            $scope.tableParams2.reload();

        }
        var preAss;

        $scope.editAss = function(a){
            a.$edit = true;
            $scope.preAss = a.ass_name;
        }

        $scope.cancelAss = function(a){
            a.$edit = false;
            a.ass_name = $scope.preAss;
        }

        $scope.saveAss = function(a){
            alert('ID:'+ a.id);
        }
})

.controller('AddPackageController',function($scope,$state,$modalInstance,OnlineBookingService,comId){
        $scope.info = {
            packName: ''
        };

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

        $scope.submit = function(){
            if($scope.info.packName !== '')
            {
                OnlineBookingService.insertPackage($scope.info.packName,comId).then(function(data){
                    if(data.status === 'success')
                    {
                        alert('Insert Successfully!')
                        $modalInstance.dismiss('cancel');
                        $state.go('loggedIn.package',null,{reload:true});
                    }
                    else
                    {
                        alert('Insert Failed!');
                    }
                })
            }
        }
})