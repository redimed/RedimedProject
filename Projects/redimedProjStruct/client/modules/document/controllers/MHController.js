/**
 * Created by thanh on 9/27/2014.
 */
angular.module('app.loggedIn.document.MH.controllers', [])
    .controller("MHController", function ($scope, DocumentService, $http, $cookieStore, toastr, $state, localStorageService, $stateParams) {
        var userInfo = $cookieStore.get('userInfo');
        if (userInfo === undefined) {
            console.log("ERROR: Cookies not exist!");
        } else {
            //Set value default
            $scope.today = new Date();
            $scope.info = [];

            //Begin signature
            var tempSignature;
            $scope.isSignature = false;
            $scope.showSignature = function () {
                $scope.isSignature = !$scope.isSignature;
            }

            $scope.cancelClick = function () {
                $scope.isSignature = !$scope.isSignature;
                $scope.info.Sign = tempSignature;
            };
            $scope.clearClick = function () {
                $scope.info.Sign = '';
            };
            $scope.okClick = function () {
                $scope.isSignature = !$scope.isSignature;
                tempSignature = $scope.info.Sign;
            }
            //End signature

            //Begin signature 1
            var tempSignature1;
            $scope.isSignature1 = false;
            $scope.showSignature1 = function () {
                $scope.isSignature1 = !$scope.isSignature1;
            }

            $scope.cancelClick1 = function () {
                $scope.isSignature1 = !$scope.isSignature1;
                $scope.info.Declaration_sign = tempSignature1;
            };
            $scope.clearClick1 = function () {
                $scope.info.Declaration_sign = '';
            };
            $scope.okClick1 = function () {
                $scope.isSignature1 = !$scope.isSignature1;
                tempSignature1 = $scope.info.Declaration_sign;
            }
            //End signature 1

            //Begin signature 2
            var tempSignature2;
            $scope.isSignature2 = false;
            $scope.showSignature2 = function () {
                $scope.isSignature2 = !$scope.isSignature2;
            }

            $scope.cancelClick2 = function () {
                $scope.isSignature2 = !$scope.isSignature2;
                $scope.info.Signature2 = tempSignature2;
            };
            $scope.clearClick2 = function () {
                $scope.info.Signature2 = '';
            };
            $scope.okClick2 = function () {
                $scope.isSignature2 = !$scope.isSignature2;
                tempSignature2 = $scope.info.Signature2;
            }
            //End signature 2

            $scope.info.Date = new Date();
            $scope.info.Statement_Date = new Date();
            //var tempAppt = localStorageService.get('tempAppt');
            var tempPatient = localStorageService.get('tempPatient') || [];
            if (tempPatient == null || tempPatient === 'undefined') {
                $state.go('loggedIn.home', null, {
                    "reload": true
                });
                toastr.error("Load information fail, please try again!", "Error");
            } else {
                var patient_id = tempPatient.Patient_id;
                //var cal_id = tempAppt.CAL_ID;
                var cal_id = -1; //Set default cal_id
                $scope.info = {
                    patient_id: patient_id,
                    cal_id: cal_id
                };
                var oriInfo;
                var info = $scope.info;
                DocumentService.loadMH(info).then(function (response) {
                    if (response['status'] === 'fail') {
                        $state.go('loggedIn.home', null, {
                            "reload": true
                        });
                    } else if (response[0].status === 'findNull') {
                        //Add new document MH.
                        $scope.isNew = true;
                    } else if (response[0].status === 'findFound') {
                        //Edit document MH
                        $scope.isNew = false;
                    } else {
                        //Throw exception
                        $state.go('loggedIn.home', null, {
                            "reload": true
                        });
                    }
                    /**
                     * Load data normal input
                     */
                    var data = response[0];
                    $scope.info.patient = response[0].patient;
                });

                $scope.resetForm = function () {
                    $scope.info = angular.copy(oriInfo);
                    $scope.mhForm.$setPristine();
                };
                //begin section 2
                $scope.works = [1];
                $scope.add_sec2 = function (index) {
                    if (index == $scope.works.length - 1 && index != 4) {
                        $scope.works.push({
                            "index": $scope.works.length
                        });
                    }
                };
                $scope.delete_sec2 = function (index) {
                    if (index != 0) {
                        $scope.works.splice(index, 1);
                    };
                }
                //end section 2
                //begin section 3
                $scope.medications = [1];
                $scope.add_sec3 = function (index) {
                    if (index == $scope.medications.length - 1 && index != 4) {
                        $scope.medications.push({
                            "index": $scope.medications.length
                        });
                    }
                };
                $scope.delete_sec3 = function (index) {
                    if (index != 0) {
                        $scope.medications.splice(index, 1);
                    };
                }
                //end section 3
                $scope.checkAbove = function () {
                    if ($scope.info.asAbove == 1) {
                        $scope.info.Above = ($scope.info.patient.Address1 == null ? "" : $scope.info.patient.Address1);
                    } else {
                        $scope.info.Above = '';
                        $scope.info.asAbove == 0;
                    }
                };

                $scope.infoChanged = function () {
                    return !angular.equals(oriInfo, $scope.info);
                };
                $scope.submit = function (mhForm) {
                    //check validate
                    console.log($scope.info);
                    if (mhForm.$error.required || mhForm.$error.maxlength || mhForm.$error.pattern) {
                        toastr.error("Please Input All Required Information!", "Error");
                    } else {
                        var info = angular.copy($scope.info);
                        if ($scope.isNew) {
                            /**
                             * new document MH
                             */
                            DocumentService.insertMH(info).then(function (response) {
                                if (response['status'] === 'success') {
                                    toastr.success("Add new success!", "Success");
                                    $state.go('loggedIn.MH', null, {
                                        "reload": true
                                    });
                                } else if (response['status'] === 'fail') {
                                    toastr.error("Add new fail!", "Error");
                                }
                            })
                        } else {
                            /**
                             * edit document MH
                             */
                            DocumentService.editMH(info).then(function (response) {
                                if (response['status'] === 'success') {
                                    toastr.success("Update success!", "Success");
                                    $state.go('loggedIn.MH', null, {
                                        "reload": true
                                    });
                                } else if (response['status'] === 'fail') {
                                    toastr.error("Update fail!", "Error");
                                }
                            });
                        }
                    }
                }
            }
        }
    });