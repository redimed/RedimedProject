/**
 * Created by meditech on 8/29/2014.
 */
angular.module('app.loggedIn.medifood.booking.controller',[])
    .controller("medifoodBookingController", function($window,$scope,$http,$state,$modal,$cookieStore,medifoodService) {
        medifoodService.core.getListFood()
        .then(function(data){
        	if(data.status=='success')
        	{
        		$scope.foodList={};
                for (var i=0;i<data.data.length;i++)
                {
                    $scope.foodList[data.data[i].FOOD_ID]=data.data[i];
                }
        	}
        	else
        	{
        		alert("Load foods list fail.");
        	}
        },function(err){
        	alert("Load foods list fail.");
        });

        $scope.chosenFoods={};
        $scope.chooseFood=function(item)
        {
            if(!$scope.chosenFoods[item.FOOD_ID])
                $scope.chosenFoods[item.FOOD_ID]=item;
        }

        $scope.cancelFood=function(item)
        {
            delete $scope.chosenFoods[item.FOOD_ID];
        }

        $scope.loginInfo=$cookieStore.get('userInfo');
        $scope.book=function()
        {
            var selectedFoods=[];
            for (var key in $scope.chosenFoods) 
            {
                var item={};
                item.FOOD_ID=$scope.chosenFoods[key].FOOD_ID;
                item.USER_ID=$scope.loginInfo.id;
                item.SESSION_CODE=$scope.dataCenter.SESSION_CODE;
                selectedFoods.push(item);
            }

            medifoodService.core.book(selectedFoods)
            .then(function(data){
                if(data.status=='success')
                {
                    alert("Book success");
                }
                else
                {
                    alert("Book fail.");
                }
            },function(err){
                alert("Book fail.");
            })
        }
    })






