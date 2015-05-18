/**
 * Created by tannv.dts@gmail.com on 12/2/2014.
 */
angular.module('app.loggedIn.medifood.service',[])
    .factory('medifoodService',function(Restangular,$http,$q,$window){
        var medifoodService = {};
        var api = Restangular.all('api');

        /**
         * tannv.dts@gmail.com
         * core api
         */
        medifoodService.core={
            createSession:function()
            {
                var result=api.one('medifood/create-session');
                return result.get();
            },

            getListFood:function()
            {
                var result=api.one('medifood/get-list-food');
                return result.get();
            },

            addItemToCart:function(postData)
            {
                var result = api.all('medifood/add-item-to-cart');
                return result.post({postData:postData});
            },

            getChosenFoods:function(postData)
            {
                var result = api.all('medifood/get-chosen-foods');
                return result.post({postData:postData});
            },

            cancelItem:function(postData)
            {
                var result = api.all('medifood/cancel-item');
                return result.post({postData:postData});
            },

            getAllBookingOfSession:function(sessionCode)
            {
                var result = api.all('medifood/get-all-booking-of-session');
                return result.post({sessionCode:sessionCode});
            },

            changeSessionStatus:function(postData)
            {
                var result = api.all('medifood/change-session-status');
                return result.post({postData:postData});
            }

            // getUserNameList:function(userNameKey,pageIndex,itemsPerPage)
            // {
            //     var result=api.one('iso/core/get-user-name-list');
            //     return result.get({userNameKey:userNameKey,pageIndex:pageIndex,itemsPerPage:itemsPerPage});
            // },
            
            // gerUsersInPermissionGroup:function(nodeId,groupValue)
            // {
            //     var result = api.all('iso/core/get-users-in-permission-group');
            //     return result.post({nodeId:nodeId,groupValue:groupValue});
            // },

            // getDepartmentList:function()
            // {
            //     var result=api.one('iso/core/get-department-list');
            //     return result.get();
            // }
        }

        
        return medifoodService;
    })
