
angular.module('app.loggedIn.document.gorgonMH.controllers',[])
    .controller("gorgonMHController",function($scope,$rootScope,$http,$cookieStore,$window) {
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

        $scope.print = function(){
            $window.location.href = '/api/document/gorgonMH/print/5';
        }
    });