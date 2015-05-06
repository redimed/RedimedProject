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

            book:function(postData)
            {
                var result = api.all('medifood/book');
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
