
angular.module('app.loggedIn.document.MA.controllers',[])
    .controller("MAController",function($scope,DocumentService,$http,$cookieStore) {

        $scope.listMA = [];

        DocumentService.newMA().then(function(response){
            DocumentService.loadMA().then(function(response){
                if(response['status'] === 'fail') {
                    alert("load fail!");
                }
                else
                {
                    var data = response[0];
                    var dataH = data.Header[0];
                    $scope.listMA.push({ "header_name": dataH.DESCRIPTION,"header_id" : dataH.MA_ID, "group":[]});
                    var i = 0;
                    angular.forEach(data.Group, function(dataG){
                        if(dataG.MA_ID ==  $scope.listMA[0].header_id  )
                        {
                            $scope.listMA[0].group.push({"group_id" : dataG.GROUP_ID, "group_name": dataG.GROUP_NAME, "line":[]});
                            angular.forEach(data.Line, function(dataL){
                                if(dataL.GROUP_ID ==  $scope.listMA[0].group[i].group_id )
                                {
                                    $scope.listMA[0].group[i].line.push({ "line_id" : dataL.MA_LINE_ID,"line_name": dataL.QUESTION, "value1" : dataL.VAL1_NAME, "value2" : dataL.VAL2_NAME, "yesno" : dataL.YES_NO });
                                }

                            });
                            i++;
                        }
                    });
                }
            });
        });






    });




