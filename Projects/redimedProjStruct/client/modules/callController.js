/**
 * Created by Luan Nguyen on 1/26/2015.
 */
angular.module("app.call.controller",[
])

    .controller("callController", function($scope,$rootScope, $state, $cookieStore, SecurityService, UserService,toastr,$window,socket,$location){
        var userInfo;
        var from = $cookieStore.get('fromState');

        var params = {};

        if(from.fromParams != null || typeof from.fromParams !== 'undefined')
        {
            angular.forEach(from.fromParams, function(value , key) {
                params[key] = value;
            })
        }

        if($cookieStore.get('userInfo') == null || typeof $cookieStore.get('userInfo') == 'undefined')
            $state.go('security.login');
        else
        {
            userInfo = $cookieStore.get('userInfo');
        }



    })
