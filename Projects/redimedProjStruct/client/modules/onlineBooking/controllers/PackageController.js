/**
 * Created by meditech on 25/09/2014.
 */
angular.module('app.loggedIn.booking.package.controller',[])
.controller('PackageController',function($scope,$state,$modal,$filter,ngTableParams,OnlineBookingService,$http,toastr,$cookieStore){
        var companyInfo;
        $scope.isSelected = false;
        $scope.selectedPack = '';
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

        $scope.addPackageAss = function(){
            var modalInstances = $modal.open({
                templateUrl: 'modules/onlineBooking/views/addPackageAss.html',
                controller:'AddPackageAssController',
                size:'lg',
                resolve:{
                    packId: function(){
                        return $scope.selectedPack;
                    }
                }
            })
        }

        $scope.showChild = function(p)
        {
            $scope.data1 = [];
            $scope.isSelected = true;
            $scope.selectedPack = p.id;
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

            OnlineBookingService.updatePackAss(a.ass_id, a.id, a.pack_id).then(function(data){
                if(data.status === 'success')
                {
                    toastr.success("Edit Successfully!","Success");
                    a.$edit = false;
                    $state.go('loggedIn.package',null,{reload:true});
                }
                else
                {
                    toastr.error("Edit Failed!","Error");
                }
            })
        }

        $scope.removeAss = function(a){
            OnlineBookingService.removePackAss(a.ass_id, a.pack_id).then(function(data){
                if(data.status === 'success')
                {
                    toastr.success("Delete Successfully!","Success");

                    $state.go('loggedIn.package',null,{reload:true});
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

.controller('AddPackageAssController',function($scope,$state,toastr,$modalInstance,OnlineBookingService,packId){
    OnlineBookingService.getAssList().then(function(data){
        $scope.assList = data;
    })

    $scope.a = {
        id:''
    };
    $scope.cancel = function(){
        $modalInstance.dismiss('cancel');
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