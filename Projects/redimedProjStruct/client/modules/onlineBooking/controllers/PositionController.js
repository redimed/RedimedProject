/**
 * Created by meditech on 29/09/2014.
 */
angular.module('app.loggedIn.booking.position.controller',[])
    .controller('PositionController',function($scope,$state,$modal,$filter,ngTableParams,OnlineBookingService,$http,toastr,$cookieStore){
        var companyInfo;
        if($cookieStore.get('companyInfo') !== 'undefined')
        {
            companyInfo = $cookieStore.get('companyInfo');
        }


        $scope.data = [];

        OnlineBookingService.getPositionList(companyInfo.id).then(function(data){


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

        $scope.removePosition = function(p){

            OnlineBookingService.deletePosition(p.Position_name,companyInfo.id).then(function(data){
                if(data.status === 'success')
                {
                    toastr.success("Delete Successfully!","Success");

                    $state.go('loggedIn.position',null,{reload:true});
                }
                else
                {
                    toastr.error("Delete Failed!","Error");
                }
            })
        }

        $scope.addPosition = function(){
            var modalInstances = $modal.open({
                templateUrl: 'modules/onlineBooking/views/addPosition.html',
                controller:'AddPositionController',
                size:'md',
                resolve:{
                    comId: function(){
                        return companyInfo.id;
                    }
                }
            })
        }
    })

.controller('AddPositionController',function($scope,$state,toastr,$modalInstance,OnlineBookingService,comId){
        $scope.info = {
            positionName: ''
        };

        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }

        $scope.submit = function(){
            if($scope.info.positionName !== '')
            {
                OnlineBookingService.insertPos($scope.info.positionName,comId).then(function(data){
                    if(data.status === 'success')
                    {
                        toastr.success("Insert Successfully!","Success");
                        $modalInstance.dismiss('cancel');
                        $state.go('loggedIn.position',null,{reload:true});
                    }
                    else
                    {
                        toastr.error("Insert Failed!","Error");
                    }
                })
            }
        }
})