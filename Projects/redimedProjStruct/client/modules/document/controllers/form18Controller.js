/**
 * Created by HUYNHAN on 9/25/2014.
 */
angular.module('app.loggedIn.document.form18.controllers', [])
    .controller("form18Controller", function ($scope, DocumentService, $rootScope, $http, $cookieStore, toastr, $state) {
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.info = [];
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
                    $scope.isNew = false;
                }
                else if ('success' === response[0].status) {
                    $scope.isNew = true;
                    var data = response[0].data;
                    $scope.info = {
                        GORGON_ID: data.GORGON_ID,
                        PATIENT_ID: data.PATIENT_ID,
                        CAL_ID: data.CAL_ID,
                        DocId: data.DocId,
                        TIME_TEST: data.TIME_TEST,
                        WORK_COVER_NO: data.WORK_COVER_NO,
                        PERSON_ARRANGING_SIGNATURE: data.PERSON_ARRANGING_SIGNATURE,
                        PERSON_ARRANGING_NAME: data.PERSON_ARRANGING_NAME,
                        PERSON_ARRANGING_POSITION: data.PERSON_ARRANGING_POSITION,
                        DOCTOR_ID: data.DOCTOR_ID,
                        WORKER_SIGNATURE: data.WORKER_SIGNATURE
                    }
                }
                else {
                    $state.go('loggedIn.home', null, {"reload": true});
                }
            });
        }

        $scope.submit = function () {
            var info = $scope.info;
            if ($scope.isNew == true) {
                /**
                 * add new
                 */
                DocumentService.insertForm18(info).then(function (response) {
                    if (response['status'] === 'success') {
                        toastr.success("Add success!", 'Success');
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
            else if ($scope.isNew == false) {
                /**
                 * edit
                 */
                DocumentService.editForm18(info).then(function (response) {
                    if (response['status'] === 'success') {
                        toastr.success("Edit success!", 'Success');
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