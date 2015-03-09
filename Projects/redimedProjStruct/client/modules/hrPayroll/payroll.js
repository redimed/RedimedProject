/**
 * Created by tannv.dts@gmail.com on 12/2/2014.
 */
/**
 * Created by tannv.dts@gmail.com on 9/27/2014.
 */
angular.module('app.loggedIn.payroll',
    ['app.loggedIn.payroll.controller'
        ,'app.loggedIn.payroll.service'
        ,'app.loggedIn.payroll.directive'
        ])
    .config(function($stateProvider){
        $stateProvider
            .state("loggedIn.payroll",{
                url:'/payroll',
                templateUrl: "modules/hrPayroll/views/payroll.html",
                controller: "payrollController"
            })
    });