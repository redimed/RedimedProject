/**
 * Created by tannv.dts@gmail.com on 12/2/2014.
 */
angular.module('app.loggedIn.iso.controller',[])
    .controller("isoController", function($scope) {      
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
    })
	

