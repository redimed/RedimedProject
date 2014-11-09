/**
 * Created by HUYNHAN on 9/25/2014.
 */
angular.module('app.loggedIn.document.form18.controllers', [])
    .controller("form18Controller", function ($scope, DocumentService, $rootScope, $http, $cookieStore, toastr, $state) {
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        var userInfo = $cookieStore.get('userInfo');
        if (userInfo === undefined) {
            console.log("ERROR: Cookies not exist");
            $state.go('loggedIn.home', null, {"reload": true});
        }
        else {
            $scope.info = {
                PATIENT_ID: userInfo.id
            }
            var info = $scope.info;
            DocumentService.loadForm18(info).then(function (response) {
                if ('fail' === response['status']) {
                    $state.go("loggedIn.home", null, {"reload": true});
                }
                else if ('findNull' === response['status']) {
                    $scope.isNew = true;
                }
                else if ('success' === response[0].status) {
                    $scope.isNew = false;
                    var data = response[0].dataF18;
                    $scope.info = [];
                    $scope.info = {
                        GORGON_ID: data[0].GORGON_ID,
                        PATIENT_ID: data[0].PATIENT_ID,
                        CAL_ID: data[0].CAL_ID,
                        DocId: data[0].DocId,
                        TIME_TEST: data[0].TIME_TEST,
                        WORK_COVER_NO: data[0].WORK_COVER_NO,
                        PERSON_ARRANGING_SIGNATURE: data[0].PERSON_ARRANGING_SIGNATURE,
                        PERSON_ARRANGING_NAME: data[0].PERSON_ARRANGING_NAME,
                        PERSON_ARRANGING_POSITION: data[0].PERSON_ARRANGING_POSITION,
                        DOCTOR_ID: data[0].DOCTOR_ID,
                        WORKER_SIGNATURE: data[0].WORKER_SIGNATURE
                    };
                }
                else {
                    $state.go('loggedIn.home', null, {"reload": true});
                }
            })
        }

        $scope.submit = function () {
            var info = $scope.info;
            if ($scope.isNew === true) {
                /**
                 * add new
                 */
                DocumentService.insertForm18(info).then(function (response) {
                    if (response['status'] === 'success') {
                        toastr.success("Add success!", 'Success');
                        $state.go("loggedIn.Form18", null, {"reload": true});
                    }
                    else if (response['status'] === 'fail') {
                        toastr.error("Add fail!", "fail");
                    }
                    else {
                        //throw exception
                        $state.go("loggedIn.home", null, {'reload': true});
                    }
                })
            }
            else if ($scope.isNew === false) {
                /**
                 * edit
                 */
                DocumentService.editForm18(info).then(function (response) {
                    if (response['status'] === 'success') {
                        toastr.success("Edit success!", 'Success');
                        $state.go("loggedIn.Form18", null, {"reload": true});
                    }
                    else if (response['status'] === 'fail') {
                        toastr.error("Edit fail!", "fail");
                    }
                    else {
                        //throw exception
                        $state.go("loggedIn.home", null, {'reload': true});
                    }
                })
            }
        };
    });