/**
 * Created by thanh on 10/1/2014.
 */
angular.module('app.loggedIn.document.MRS.controllers', [])
    .controller("MRSController", function($filter, $scope, DocumentService, $http, $cookieStore, $state, toastr, $stateParams, localStorageService) {
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        var userInfo = $cookieStore.get('userInfo');
        if (userInfo === undefined) {
            console.log("ERROR: Cookies not exist!");
            $state.go("loggedIn.MRS", null, {
                "reload": true
            });
        } else {
            //begin signature
            var tempSignature;
            $scope.isSignature = false;
            $scope.showSignature = function() {
                $scope.isSignature = !$scope.isSignature;
            };

            $scope.cancelClick = function() {
                $scope.isSignature = !$scope.isSignature;
                $scope.info.practitionSign = tempSignature;
            };
            $scope.clearClick = function() {
                $scope.info.practitionSign = '';
            };
            $scope.okClick = function() {
                $scope.isSignature = !$scope.isSignature;
                tempSignature = $scope.info.practitionSign;
            };
            //end signature

            //var apptInfo = localStorageService.get('tempAppt');
            $scope.patientInfo = localStorageService.get('tempPatient');
            if ($scope.patientInfo === null || $scope.patientInfo === 'undefined') {
                $state.go("loggedIn.home", null, {
                    "reload": true
                });
                toastr.error("Load information fail, Please try again", "Error");
            } else {
                var patient_id = $scope.patientInfo.Patient_id;
                //var CAL_ID = $scope.apptInfo.CAL_ID;
                var cal_id = -1; //set default cal_id
                //set value default

                $scope.patientInfo.DOB = $filter('date')($scope.patientInfo.DOB, 'dd/MM/yyyy');
                $scope.info = {
                    patient_id: patient_id,
                    cal_id: cal_id,
                    idC: $scope.patientInfo.company_id
                };
                /**
                 * exist cookies
                 */
                var oriInfo;
                var info = $scope.info;
                DocumentService.loadMRS(info).then(function(response) {
                    if (response['status'] === 'fail') {
                        $state.go('loggedIn.MRS', null, {
                            raw: true
                        });
                    } else if (response['status'] == 'not') {
                        toastr.error("You have to make Medical Assessment first", "Error");
                        $state.go('loggedIn.MA', null, {
                            'reload': true
                        });
                        return;
                    } else if (response[0].status === 'findNull') {
                        //add new mrs
                        $scope.isNew = true;
                    } else if (response[0].status === 'findFound') {
                        $scope.isNew = false;
                    }
                    /**
                     * load data to input
                     */
                    if (response[0].status === "findFound" || response[0].status === "findNull") {
                        var data = response[0].data;
                        //set value load
                        $scope.companyName = response[0].nameCompany;
                        $scope.patient = response[0].patient;
                        $scope.doctor = response[0].doctor;
                        $scope.appt = response[0].appt;
                        $scope.info = {
                            mrs_id: data.mrs_id,
                            patient_id: patient_id,
                            cal_id: cal_id,
                            sticker_here: data.sticker_here,
                            proposed: data.proposed,
                            as_height: response[0].dataMA.HEIGHT,
                            as_weight: response[0].dataMA.WEIGHT,
                            as_whr: response[0].dataMA.WHR,
                            as_bmi: response[0].dataMA.BMI,
                            as_height_weight: data.as_height_weight,
                            as_medical_history: data.as_medical_history,
                            as_medical_assessment: data.as_medical_assessment,
                            as_functional_assessment: data.as_functional_assessment,
                            as_hearing_test: data.as_hearing_test,
                            as_spirometry: data.as_spirometry,
                            as_drug_test: data.as_drug_test,
                            as_other: data.as_other,
                            ac_any_existing_or_active: data.ac_any_existing_or_active,
                            ac_any_history: data.ac_any_history,
                            ac_cardiovascular: data.ac_cardiovascular,
                            ac_any_current_or_work_related: data.ac_any_current_or_work_related,
                            ac_any_medical_or_functional: data.ac_any_medical_or_functional,
                            ac_any_diagnosed_or_previous: data.ac_any_diagnosed_or_previous,
                            ac_examiner_comment: data.ac_examiner_comment,
                            risk_rating: data.risk_rating,
                            rr_amber_comment: data.rr_amber_comment,
                            rr_red_comment: data.rr_red_comment,
                            mrs_review: data.mrs_review,
                            mrs_doc_date: data.mrs_doc_date || new Date(),
                            doctor_id: $scope.doctor.doctor_id,
                            created_by: $scope.isNew ? userInfo.id : data.created_by,
                            last_updated_by: $scope.isNew ? data.last_updated_by : userInfo.id
                        };
                    }
                    oriInfo = angular.copy($scope.info);
                });
                $scope.resetForm = function() {
                    $scope.info = angular.copy(oriInfo);
                    $scope.mrsForm.$setPristine();
                };

                $scope.infoChanged = function() {
                    return !angular.equals(oriInfo, $scope.info);
                };
                $scope.submit = function(mrsForm) {
                    if (mrsForm.$error.pattern || mrsForm.$error.maxlength || mrsForm.$error.required) {
                        toastr.error("Please Input All Required Information!", "Error");
                    } else {
                        var info = $scope.info;
                        if ($scope.isNew === true) {
                            //add new mrs
                            DocumentService.insertMRS(info).then(function(response) {
                                if (response['status'] === 'fail') {
                                    //insert error
                                    toastr.error("Add new fail", "Error");
                                } else if (response['status'] === 'success') {
                                    toastr.success("Add new success", "Success");
                                    $state.go('loggedIn.MRS', null, {
                                        "reload": true
                                    });
                                } else {
                                    //throw exception
                                    $state.go('loggedIn.MRS', null, {
                                        "reload": true
                                    });
                                }
                            });
                        } else if ($scope.isNew === false) {
                            //edit old mrs
                            DocumentService.editMRS(info).then(function(response) {
                                if (response['status'] === 'fail') {
                                    //edit error
                                    toastr.error("Update fail!", "Error");
                                } else if (response['status'] === 'success') {
                                    toastr.success("Update success!", "Success");
                                    $state.go('loggedIn.MRS', null, {
                                        "reload": true
                                    });
                                }
                            });
                        }
                    }
                };
            }
        }
    });
