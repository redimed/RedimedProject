/**
 * Created by tannv.dts@gmail.com on 12/2/2014.
 */
/**
 * Created by tannv.dts@gmail.com on 9/27/2014.
 */
angular.module('app.loggedIn.pr',
    ['app.loggedIn.pr.controller'
        ,'app.loggedIn.pr.service'
        ,'app.loggedIn.pr.directive'
        ,'app.loggedIn.pr.prImportTaxList.directive'
        ])
    .config(function($stateProvider){
        $stateProvider
            .state("loggedIn.pr",{
                url:'/pr',
                templateUrl: "modules/hrPayroll/views/pr.html",
                controller: "prController"
            })
    });