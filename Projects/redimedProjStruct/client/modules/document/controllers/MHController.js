/**
 * Created by HUYNHAN on 9/27/2014.
 */
angular.module('app.loggedIn.document.MH.controllers', [])
    .controller("MHController", function ($scope, DocumentService, $http, $cookieStore) {
        
        $scope.submit = function () {
            var info = $scope.info;
        };


        $scope.listMH = [];
        DocumentService.newMH().then(function (response) {
            if (response['status'] === 'success') {
                console.log('Insert Successfully!');
            }
            else {
                alert("Insert Failed!");
            }
        });

        $scope.listMH = [];


        DocumentService.loadMH().then(function (response) {
            if (response['status'] === 'fail') {
                alert("load fail!");
            }
            else {
                var data = response[0];
                var dataH = data.Header[0];
                var dataG = data.Group;
                $scope.listMH.push({ "header_name": dataH.DESCRIPTION, "group": []});
                var i = 0;
                angular.forEach(data.Group, function (dataG) {
                    $scope.listMH[0].group.push({"group_id": dataG.GROUP_ID, "group_name": dataG.GROUP_NAME, "line": []});
                    var j = 0;
                    angular.forEach(data.Line, function (dataL) {
                        if (dataL.GROUP_ID == $scope.listMH[0].group[i].group_id) {
                            $scope.listMH[0].group[i].line.push({ "line_id": dataL.MH_LINE_ID, "line_name": dataL.QUESTION, "line_ord": dataL.ORD, "line_isdetails_answer_ifyes": dataL.ISDETAILS_ANSWER_IFYES, "subquestion": []});
                            angular.forEach(data.Subquestion, function (dataS) {
                                if ($scope.listMH[0].group[i].line[j] != undefined && dataS.MH_LINE_ID == $scope.listMH[0].group[i].line[j].line_id) {
                                    $scope.listMH[0].group[i].line[j].subquestion.push({ "subquestion_name": dataS.QUESTION, "subquestion_ord": dataS.ORD});
                                }
                            });
                        }
                        j++;
                    });
                    i++;
                });
            }
        });

    });



