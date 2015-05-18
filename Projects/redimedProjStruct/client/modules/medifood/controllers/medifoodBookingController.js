/**
 * Created by meditech on 8/29/2014.
 */
angular.module('app.loggedIn.medifood.booking.controller',[])
    .controller("medifoodBookingController", function($window,$scope,$http,$state,$modal,$cookieStore,medifoodService) {
        /**
         * Lay cac data can thiet
         * tannv.dts@gmail.com
         */
        $scope.loginInfo=$cookieStore.get('userInfo');

        /**
         * Lay danh sach cac mon an
         * tannv.dts@gmail.com
         */
        $scope.getListFood=function()
        {
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
        }

        /**
         * Lay danh sach cac mon da chon
         * tannv.dts@gmail.com
         */
        $scope.getChosenFoods=function()
        {
            $scope.chosenFoods={};
            $scope.cartCost=null;
            var postData={
                SESSION_CODE:$scope.dataCenter.SESSION_CODE,
                USER_ID:$scope.loginInfo.id
            }
            medifoodService.core.getChosenFoods(postData)
            .then(function(data){
                if(data.status=='success')
                {
                    for(var i=0;i<data.data.length;i++)
                    {
                        var item=data.data[i];
                        $scope.chosenFoods[item.FOOD_ID]=item;
                        $scope.cartCost=$scope.cartCost+item.COST;
                    }
                }
                else
                {
                    alert("Get chosen list error.");
                }
            },function(err){
                alert("Get chosen list error.");
            });
        }

        
        /**
         * Add item to cart
         * tannv.dts@gmail.com
         */
        $scope.addItemToCart=function(item)
        {
            if(!$scope.chosenFoods[item.FOOD_ID])
            {
                var postData={
                    FOOD_ID:item.FOOD_ID,
                    USER_ID:$scope.loginInfo.id,
                    SESSION_CODE:$scope.dataCenter.SESSION_CODE
                }
                medifoodService.core.addItemToCart(postData)
                .then(function(data){
                    $scope.getChosenFoods();
                    alert("Add success.");
                },function(err){
                    alert("Add fail.");
                });
            }
        }

        /**
         * Xoa item ra khoi cart
         * tannv.dts@gmail.com
         */
        $scope.cancelItem=function(item)
        {
            var postData={
                SESSION_CODE:$scope.dataCenter.SESSION_CODE,
                USER_ID:$scope.loginInfo.id,
                FOOD_ID:item.FOOD_ID
            }
            medifoodService.core.cancelItem(postData)
            .then(function(data){
                if(data.status=="success")
                {
                    alert("Cancel item success.");
                    $scope.getChosenFoods();
                }
                else
                {
                    alert("Cancel item fail.");
                }
            },function(err){
                alert("Cancel item fail.")
            });
        }

        $scope.$watch("dataCenter.SESSION_CODE",function(newValue,oldValue){
            if($scope.dataCenter && $scope.dataCenter.SESSION_CODE)
            {
                $scope.getListFood();
                $scope.getChosenFoods();
            }
        })
    })






