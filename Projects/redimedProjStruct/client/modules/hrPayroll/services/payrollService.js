/**
 * Created by tannv.dts@gmail.com on 12/2/2014.
 */
angular.module('app.loggedIn.payroll.service',[])
    .factory('payrollService',function(Restangular,$http,$q,$window){
        var payrollService = {};
        var api = Restangular.all('api');
        return payrollService;
    })
