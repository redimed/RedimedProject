/**
 * Created by meditech on 25/09/2014.
 */
angular.module('app.loggedIn.booking.package.controller',[])
.controller('PackageController',function($scope,$state,$modal,$filter,ngTableParams,OnlineBookingService,$http,toastr,$cookieStore){
        var companyInfo;
        $scope.isSelected = false;
        $scope.selectedPack = null;
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
            OnlineBookingService.deletePackage(p.PackId,companyInfo[0].id).then(function(data){
                if(data.status === 'success')
                {
                    OnlineBookingService.getPackage(companyInfo[0].id).then(function(d){
                        if(d.status === 'success')
                        {
                            $scope.data = d.rs;
                        }
                        $scope.$watch('data',function(data){
                            $scope.data = data;
                            $scope.tableParams.reload();
                        })
                    })
                    toastr.success('Delete Successfully','Success');
                }
                else
                {
                    toastr.error('Delete Failed','Error');
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
            modalInstance.result.then(function(){
                OnlineBookingService.getPackage(companyInfo[0].id).then(function(d){
                    if(d.status === 'success')
                    {
                        $scope.data = d.rs;
                    }
                    $scope.$watch('data',function(data){
                        $scope.data = data;
                        $scope.tableParams.reload();
                    })
                })
            })
        }

        $scope.addPackageAss = function(){
            var modalInstances = $modal.open({
                templateUrl: 'modules/onlineBooking/views/addPackageAss.html',
                controller:'AddPackageAssController',
                size:'md',
                resolve:{
                    packId: function(){
                        return $scope.selectedPack;
                    }
                }
            });


        }

        $scope.showChild = function(p)
        {
            $scope.data1 = [];
            $scope.isSelected = true;
            $scope.selectedPack = p.PackId;
            for(var i=0; i<ass.length;i++)
            {
                if(p.PackId === ass[i].pack_id)
                    $scope.data1.push(ass[i]);
            }
            $scope.tableParams2.reload();

        }



        $scope.removeAss = function(a){
            $scope.data1 = [];
            OnlineBookingService.removePackAss(a.ass_id, a.pack_id).then(function(data){
                if(data.status === 'success')
                {
                    toastr.success("Delete Successfully!","Success");

                    OnlineBookingService.getPackageAss().then(function(data) {
                        ass = data.rs;

                        for(var i=0; i<ass.length;i++)
                        {
                            if(p.PackId === ass[i].pack_id)
                                $scope.data1.push(ass[i]);
                        }

                    })
                    $scope.tableParams2.reload();

                }
                else
                {
                    toastr.error("Delete Failed!","Error");
                }
            })
        }
})

.controller('AddPackageController',function($scope,$state,toastr,$modalInstance,OnlineBookingService,comId){
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
                        toastr.success("Insert Successfully!","Success");
                        $modalInstance.close();
                    }
                    else
                    {
                        toastr.error("Insert Failed!","Error");
                    }
                })
            }
        }
})

.controller('AddPackageAssController',function($scope,$state,toastr,$modalInstance,OnlineBookingService,packId){
    OnlineBookingService.getAssList().then(function(data){
        $scope.assList = data;
    })

    $scope.a = {
        id:''
    };

    $scope.b = {
        price: null
    };

    $scope.cancel = function(){
        $modalInstance.dismiss('cancel');
    }

    $scope.getPrice = function(id){
        if(id != null)
        {
            OnlineBookingService.getAssPrice(id).then(function(data){
                console.log(data[0].price);
                $scope.b.price = data[0].price;
            })
        }
        else{
            $scope.b.price = '';
        }

    }

    $scope.submit = function(){
        if($scope.a.id !== null){
            OnlineBookingService.insertPackAss($scope.a.id,packId).then(function(data){
                if(data.status === 'success')
                {
                    toastr.success("Insert Successfully!","Success");
                    $modalInstance.dismiss('cancel');
                    $state.go('loggedIn.package',null,{reload:true});
                }
                else
                {
                    toastr.error("Insert Failed!","Error");
                }
            })
        }
    }

})

