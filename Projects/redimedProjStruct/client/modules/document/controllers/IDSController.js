
angular.module('app.loggedIn.document.IDS.controllers',[])
    .controller("IDSController",function($scope,DocumentService,$http,$cookieStore) {

        $scope.listIDS = [];

        DocumentService.newIDS().then(function(response){
            DocumentService.loadIDS().then(function(response){
                if(response['status'] === 'fail') {
                    alert("load fail!");
                }
                else
                {
                    var data = response[0];
                    var dataH = data.Header[0];
                    $scope.listIDS.push({"header_id" : dataH.IDAS_ID, "group":[]});
                    var i = 0;
                    angular.forEach(data.Group, function(dataG){
                        if(dataG.IDAS_ID ==  $scope.listIDS[0].header_id  )
                        {
                            $scope.listIDS[0].group.push({"group_id" : dataG.IDAS_GROUP_ID, "group_name": dataG.GROUP_NAME, "line":[]});
                            angular.forEach(data.Line, function(dataL){
                                if(dataL.IDAS_GROUP_ID ==  $scope.listIDS[0].group[i].group_id )
                                {
                                    $scope.listIDS[0].group[i].line.push({ "line_id" : dataL.IDAS_LINE_ID,"line_name": dataL.QUESTION, "yesno" : dataL.YES_NO });
                                }

                            });
                            i++;
                        }
                    });
                }
            });
        });






    });




