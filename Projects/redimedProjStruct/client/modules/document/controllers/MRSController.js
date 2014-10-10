/**
 * Created by HUYNHAN on 10/1/2014.
 */
angular.module('app.loggedIn.document.MRS.controllers', [])
    .controller("MRSController", function ($scope, DocumentService, $http, $cookieStore) {
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.submit = function () {
            var info = $scope.info;
        };

        $scope.listMRS = [];
        DocumentService.newMRS().then(function (response) {
            if (response['status'] === 'success') {
                console.log('Insert Successfully!');
            }
            else {
                alert("Insert Failed!");
            }
        });

        DocumentService.loadMRS().then(function (response) {
            if (response['status'] === 'fail') {
                alert("load fail!");
            }
            else {
                var data = response[0];
                var dataH = data.Header[0];
                var dataP = data.Patient[0];
                $scope.listMRS.push({ "header_id": dataH.MRS_DF_ID, "header_name": dataH.DESCRIPTION, "patient_id": dataP.Patient_id, "patient_name": dataP.Title + " " + dataP.First_name + " "
                    + dataP.Sur_name, "patient_birth_day": dataP.DOB, "patient_address": dataP.Address1 + ", "
                    + dataP.Address2, "patient_contact_no": dataP.Home_phone, "patient_suburb": dataP.Surburb, "patient_state": dataP.State, "patient_post_code": dataP.Post_code, "group": []});
                var i = 0;
                angular.forEach(data.Group, function (dataG) {
                    if (dataG.MRS_DF_ID == $scope.listMRS[0].header_id) {
                        $scope.listMRS[0].group.push({"group_id": dataG.MRS_GROUP_ID, "group_name": dataG.GROUP_NAME, "line": []});
                    }
                    angular.forEach(data.Line, function (dataL) {
                        if (dataL.MRS_GROUP_ID == $scope.listMRS[0].group[i].group_id) {
                            $scope.listMRS[0].group[i].line.push({ "line_id": dataL.MRS_LINE_ID, "line_name": dataL.QUEST_LABEL, "line_ord": dataL.ORD, "line_type": dataL.COMP_TYPE, "line_label": dataL.COMMENT_LABEL});
                        }
                    });
                    i++;
                });
            }
        });

    });
