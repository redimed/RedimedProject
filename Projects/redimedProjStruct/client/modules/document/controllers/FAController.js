
angular.module('app.loggedIn.document.FA.controllers',[])
    .controller("FAController",function($scope,DocumentService,$http,$cookieStore) {
        //Date picker
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


        $scope.listFA = [];

        DocumentService.newFA().then(function(response){
            if(response['status'] === 'success') {
                alert("Insert Successfully!");
            }
            else
            {
                //alert("Insert Failed!");
            }
        });

        $scope.listFA = [];


        DocumentService.loadFA().then(function(response){
            if(response['status'] === 'fail') {
                alert("load fail!");
            }
            else
            {
                $scope.listFA = response;
                console.log(JSON.stringify($scope.listFA));


            }
        });




    });




