
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
                var data = response[0];
                var dataH = data.Header[0];
                var dataS = data.Section;
                $scope.listFA.push({ "header_name": dataH.FA_NAME, "section":[]});
                angular.forEach(data.Section, function(dataS){
                    $scope.listFA[0].section.push({ "section_name": dataS.SECTION_NAME, "line":[]});
                    angular.forEach(data.Line, function(dataL){
                        if(dataL.SECTION_ID == dataS.SECTION_ID)
                        {
                            console.log(dataL.SECTION_ID + " " + dataS.SECTION_ID);
                            $scope.listFA[0].section[0].line.push({ "line_name": dataL.LINE_NAME, "detail":[]});
                        }
                    });
                });

                console.log(JSON.stringify($scope.listFA));
            }
        });




    });




