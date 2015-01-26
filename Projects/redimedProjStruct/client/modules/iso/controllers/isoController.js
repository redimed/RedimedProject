/**
 * Created by tannv.dts@gmail.com on 12/2/2014.
 */
angular.module('app.loggedIn.iso.controller',[])
    .controller("isoController", function($scope,isoService) {      
    	$scope.permissionFunction=isoConst.permissionFunction;
    	$scope.isoAdminFunction=isoConst.isoAdminFunction;
    	if(isoTest)
    	{
    		$scope.permissionFunction['1']=angular.copy($scope.permissionFunction['0']);
    		$scope.permissionFunction['2']=angular.copy($scope.permissionFunction['0']);
    		$scope.permissionFunction['3']=angular.copy($scope.permissionFunction['0']);
    		$scope.permissionFunction['4']=angular.copy($scope.permissionFunction['0']);
    	}
    	$scope.checkInStatus=isoConst.checkInStatus;
    	$scope.submitStatus=isoConst.submitStatus;
        $scope.isoPermission=isoConst.isoPermission;

        $scope.isIsoAdminSystem=0;
        isoService.isoAdmin.checkIsAdminIsoSystem()
        .then(function(data){
            if(data.status=='success')
            {
                $scope.isIsoAdminSystem=1;
            }
            else
            {
                $scope.isIsoAdminSystem=0;
            }
        },function(err){
            $scope.isIsoAdminSystem=0;
        });

        
        $scope.isIsoAdminSystemMaster=0;
        isoService.isoAdmin.checkIsAdminIsoSystemMaster()
        .then(function(data){
            if(data.status=='success')
            {
                $scope.isIsoAdminSystemMaster=1;
            }
            else
            {
                $scope.isIsoAdminSystemMaster=0;
            }
        },function(err){
            $scope.isIsoAdminSystemMaster=0;
        });
        

        $scope.isIsoApprover=0;
        isoService.isoApprover.checkIsIsoApprover()
        .then(function(data){
            if(data.status=='success')
            {
                $scope.isIsoApprover=1;
            }
            else
            {
                $scope.isIsoApprover=0;
            }
        },function(err){
            $scope.isIsoApprover=0;
        })
        
    })
	

