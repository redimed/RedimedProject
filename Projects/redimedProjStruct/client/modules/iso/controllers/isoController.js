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
	.directive('ngConfirmClick', [
		function() {
			return {
				priority: 1,
				link: function(scope, element, attr) {
					var msg = attr.ngConfirmClick || "Are you sure?";
					var clickAction = attr.ngClick;
					attr.ngClick = "";
					element.bind('click', function(event) {
						if (window.confirm(msg)) {
							scope.$eval(clickAction)
						}
					});
				}
			};
		}
	]);

