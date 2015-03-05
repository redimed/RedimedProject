/**
 * Created by tannv.dts@gmail.com on 12/2/2014.
 */
angular.module('app.loggedIn.pr.service',[])
    .factory('prService',function(Restangular,$http,$q,$window){
        var prService = {};
        var api = Restangular.all('api');
        return prService;
    })
