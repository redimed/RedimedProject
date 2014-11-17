/**
 * Created by Minh on 10/28/2014.
 */

angular.module("app.loggedIn.waworkcover.controller", [
    "app.loggedIn.waworkcover.home.controller",
    "app.loggedIn.waworkcover.first.controller",
    "app.loggedIn.waworkcover.progress.controller",
    "app.loggedIn.waworkcover.final.controller"
])
    .controller("waworkcoverController", function ($scope, ConfigService) {

        var init = function(){
            var today = new Date();

            $scope.wafirst = {
                examDate: today
            };

            $scope.waprogress = {
                examDate: today
            };

            $scope.wafinal = {
                examDate: today
            };

            $scope.isSubmitted = false;

            //$scope.assessID={
            //    assessID:14
            //    //first: 94
            //    //progress: 26
            //    //final: 14
            //
            //};
        };

        init();

    });