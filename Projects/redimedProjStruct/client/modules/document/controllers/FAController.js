
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
                alert("Insert Failed!");
            }
        });


            // Start load
            DocumentService.loadFA().then(function(response){
                if(response['status'] === 'fail') {
                    alert("load fail!");
                }
                else
                {
                    alert($scope.listFA.length);
                    var i = 0;
                    angular.forEach(response, function(list){

                        if($scope.listFA.length === 0)
                        {
                            $scope.listFA.push({"list": {"listH":{"header" : list.FA_NAME}});
                        }else
                        {
                            var j = 0;
                            angular.forEach($scope.listFA, function(listH) {
                                if (listH.list.header !== list.FA_NAME) {
                                    $scope.listFA.push({"list": {"header" : list.FA_NAME}});

                                }
                                j++;
                            });
                        }

                        i++;
                    });
                }

            });
            // END load
    });