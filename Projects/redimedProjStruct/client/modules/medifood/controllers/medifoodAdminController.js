/**
 * Created by meditech on 8/29/2014.
 */
angular.module('app.loggedIn.medifood.admin.controller',[])
    .controller("medifoodAdminController", function($window,$scope,$http,$state,$modal,$cookieStore,medifoodService) {
        $scope.getAllBookingOfSession=function()
        {
        	var sessionCode=$scope.dataCenter.SESSION_CODE;
        	$scope.totalCashSession=0;
        	medifoodService.core.getAllBookingOfSession(sessionCode)
        	.then(function(data){
        		if(data.status=='success')
        		{
        			var tempData=data.data;
        			$scope.listBooking={};
        			for(var i=0;i<tempData.length;i++)
        			{
        				var item=tempData[i];
        				$scope.totalCashSession=$scope.totalCashSession+item.COST;
        				if(!$scope.listBooking[item.USER_ID])
        				{
        					$scope.listBooking[item.USER_ID]={
        						USER_ID:item.USER_ID,
        						user_name:item.user_name,
        						Booking_Person:item.Booking_Person,
        						LIST_ITEMS:[],
        						totalCost:item.COST
        					}
        					$scope.listBooking[item.USER_ID].LIST_ITEMS.push(item);

        				}
        				else
        				{
        					$scope.listBooking[item.USER_ID].LIST_ITEMS.push(item);
        					$scope.listBooking[item.USER_ID].totalCost=$scope.listBooking[item.USER_ID].totalCost+item.COST;
        				}
        			}
        		}
        		else
        		{
        			alert("Error get data.");
        		}
        	},function(err){
        		alert("Error get data.");
        	});
        }

        $scope.refresh=function()
        {
        	$scope.getAllBookingOfSession();
        }

        $scope.changeSessionStatus=function(status)
        {
            var postData={
                SESSION_CODE:$scope.dataCenter.SESSION_CODE,
                STATUS:status
            }
            medifoodService.core.changeSessionStatus(postData)
            .then(function(data){
                if(data.status=='success')
                {
                    alert("Change status success.");
                    $scope.dataCenter.SESSION_STATUS=status;
                }
                else
                {
                    alert("Change status fail.");
                }
            },function(err){
                alert("Change status fail.");
            });
        }
        
        $scope.$watch("dataCenter.SESSION_CODE",function(newValue,oldValue){
            if($scope.dataCenter && $scope.dataCenter.SESSION_CODE)
            {
                $scope.getAllBookingOfSession();
            }
        })



    })






