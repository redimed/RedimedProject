
angular.module('app.loggedIn.document.cat2.controllers',[])
    .controller("Cat2Controller",function($scope,$rootScope,$http,$cookieStore) {
    var initPickers = function () {
        //init date pickers
        $('.date-picker').datepicker({
            rtl: Metronic.isRTL(),
            autoclose: true
        }).on('changeDate',function(evn){

        });

    }
    initPickers();
    $scope.submit = function(){
        var info = $scope.info;
    };
});