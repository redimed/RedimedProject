/**
 * Created by HUYNHAN on 10/1/2014.
 */
angular.module('app.loggedIn.document.AUD2.controllers', [])
    .controller("AUD2Controller", function ($scope, DocumentService, $http, $cookieStore) {
        //Date picker
        var initPickers = function () {
            //init date pickers
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                autoclose: true
            }).on('changeDate', function (evn) {

            });

        }
        initPickers();
        $scope.submit = function () {
            var info = $scope.info;
        };

        $scope.listAUD2 = [];
        DocumentService.newAUD2().then(function (response) {
            if (response['status'] === 'success') {
                console.log('Insert Successfully!');
            }
            else {
                alert("Insert failed!");
            }
        });

        DocumentService.loadAUD2().then(function (response) {
            if (response['status'] === 'fail') {
                alert("Load fail!");
            }
            else {
                var data = response[0];
                var i = 0;
                angular.forEach(data.Header, function (dataH) {
                    $scope.listAUD2.push({ "header_id": dataH.SA_ID, "header_name": dataH.SA_NAME, "section": []});
                    angular.forEach(data.Section, function (dataS) {
                        var j = 0;
                        if (dataS.SA_ID == $scope.listAUD2[i].header_id) {
                            $scope.listAUD2[i].section.push({"section_id": dataS.SECTION_ID,
                                "section_name": dataS.SECTION_NAME, "line": []});
                            angular.forEach(data.Line, function (dataL) {
                                if (dataL.SECTION_ID == $scope.listAUD2[i].section[j].section_id) {
                                    $scope.listAUD2[i].section[j].line.push({ "line_id": dataL.LINE_ID,
                                        "line_name": dataL.NAME, "line_value_right": dataL.VALUE_RIGHT, "line_value_left": dataL.VALUE_LEFT});
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
