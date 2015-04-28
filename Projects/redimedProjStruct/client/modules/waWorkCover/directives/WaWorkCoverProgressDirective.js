/**
 * Created by Minh Hikari on 12/1/2014.
 */
angular.module('app.loggedIn.waworkcover.progress.directive', [])
    .directive('workCoverProgress', function (DoctorService, ReceptionistService, ConfigService, PatientService, toastr, WaWorkCoverService, $cookieStore, $state,CompanyService) {
        return {
            restrict: 'EA',
            scope: {
                data: '@',
                params: '='
            },
            templateUrl: "modules/waWorkCover/directives/templates/progress.html",
            link: function (scope, element, attrs) {
                var init = function () {
                    scope.oneAtATime = false;
                    scope.isSubmit = false;
                    scope.waprogress = {
                        examDate: new Date()
                    };
                    //get patient info
                    PatientService.mdtById(scope.params.patientInfo).then(function (res) {
                        if (res.status === 'success') {
                            if (res.data !== '' && res.data !== null && res.data !== undefined) {
                                scope.patient = res.data;
                                scope.patient.DOB = new Date(scope.patient.DOB);
                                if (scope.patient.company_id !== undefined && scope.patient.company_id !== null && scope.patient.company_id !== '') { // get company info
                                    CompanyService.mdtById(scope.patient.company_id).then(function (res2) {
                                        if (res2.status === 'success') {
                                            if (res.data !== undefined && res.data !== null && res.data !== '') {
                                                scope.company = res2.data;
                                            }
                                        }
                                    })
                                }
                            }
                        }
                    });
                    //get appointment info
                    ReceptionistService.apptDetail(scope.params.apptInfo).then(function (res) {
                        if (res.data !== undefined && res.data !== null && res.data !== '') {
                            if (res.data.DOCTOR_ID !== undefined && res.data.DOCTOR_ID !== null && res.data.DOCTOR_ID !== '') {
                                DoctorService.getById(res.data.DOCTOR_ID).then(function (res2) {
                                    if (res2 !== null && res2 !== undefined && res2 !== '') {
                                        scope.doctor = res2;
                                    }
                                })
                            }
                        }
                    })

                    
                    
                    if(scope.params.edit === true && scope.params.workcover){
                        WaWorkCoverService.progressdetail(scope.params.workcover).then(function(res){
                            if(res.status === 'success' && !!res.data){
                                scope.waprogress = res.data;
                                    for (var key in scope.waprogress) {
                                        if (scope.waprogress[key]) {
                                            if (key.indexOf('is') != -1 || key.indexOf('Is') != -1 || key.indexOf('IS') != -1)
                                                scope.waprogress[key] = scope.waprogress[key].toString();
                                            if (key.indexOf('date') != -1 || key.indexOf('Date') != -1 || key.indexOf('DATE') != -1 || key.indexOf('reviewOn') != -1 || key.indexOf('From') != -1 || key.indexOf('To') != -1)
                                                scope.waprogress[key] = new Date(scope.waprogress[key]);
                                        }
                                    }
                            }
                        })
                    }
                };
                init();

                scope.clearSignature = function () {
                    scope.waprogress.signature = '';
                }

                scope.clickAction = function () {
                    scope.isSubmit = true;
                    if (!scope.waprogressform.$invalid) {
                        var postData = angular.copy(scope.waprogress);
                        postData.cal_id = scope.params.apptInfo;
                        postData.patient_id = scope.params.patientInfo;
                        for (var key in postData) {
                            if (postData[key] instanceof Date) postData[key] = ConfigService.getCommonDate(postData[key]);
                        } //end for
                        if (scope.params.edit === false) {
                            WaWorkCoverService.progressadd(postData).then(function (result) {
                                console.log('this is insert result',result)
                                if (result.status === 'success') {
                                    toastr.success('Add successfully!', 'Success!');
                                    //GET BACK TO THE LIST
                                    $state.go('loggedIn.patient.workcover',{
                                        patient_id: scope.params.patientInfo,
                                        cal_id: scope.params.apptInfo
                                    })
//                                    $state.go('loggedIn.waworkcover.progress', {
//                                        patient_id: scope.params.patientInfo,
//                                        cal_id: scope.params.apptInfo,
//                                        action: 'edit',
//                                        wc_id: result.data.progress_id
//                                    });
                                } else {
                                    toastr.error('Unexpected Error!', 'Error!');
                                }
                            })
                        } else {
                            WaWorkCoverService.progressedit(postData.progress_id, postData).then(function (result) {
                                if (result.status === 'success') {
                                    toastr.success('Edit successfully!', 'Success!');
//                                    $state.go('loggedIn.patient.workcover', {
//                                        patient_id: scope.params.patientInfo.Patient_id,
//                                        cal_id: scope.params.apptInfo.CAL_ID
//                                    });
                                } else {
                                    toastr.error('Unexpected Error!', 'Error!');
                                }
                            })
                        }
                    } else {
                        toastr.error('Please fix the red field!', 'Invalid information');
                    }
                }

                scope.printAssessment = function () {
                    var printId = scope.waprogress.progress_id;
                    WaWorkCoverService.progressprint(printId).then(function (result) {})
                }


                //Data dependencies
                scope.$watch('waprogress.isFullCapacity', function (fullCapa) {
                    if (fullCapa !== '1') {
                        scope.waprogress.fullCapaFrom = null;
                        scope.waprogress.isRequireTreat = null;
                    }
                })

                scope.$watch('waprogress.isSomeCapacity', function (someCapa) {
                    if (someCapa !== '1') {
                        scope.waprogress.someCapaFrom = null;
                        scope.waprogress.someCapaTo = null;
                        scope.waprogress.isPreDuties = null;
                        scope.waprogress.isModiDuties = null;
                        scope.waprogress.isWorkModifi = null;
                        scope.waprogress.isPreHours = null;
                        scope.waprogress.isModiHours = null;
                    }
                })

                scope.$watch('waprogress.isModiHours', function (isModi) {
                    if (isModi !== '1') {
                        scope.waprogress.modiHrs = null;
                        scope.waprogress.modiDays = null;
                    }
                })

                scope.$watch('waprogress.modiHrs', function (modiHrs) {
                    if (modiHrs !== undefined && modiHrs !== null && modiHrs !== '' && scope.waprogress.modiDays !== undefined && scope.waprogress.modiDays !== null && scope.waprogress.modiDays !== '') {
                        if (scope.waprogress.isModiHours !== '1')
                            scope.waprogress.isModiHours = '1';
                    }
                })

                scope.$watch('waprogress.modiDays', function (modiDays) {
                    if (modiDays !== undefined && modiDays !== null && modiDays !== '' && scope.waprogress.modiHrs !== undefined && scope.waprogress.modiHrs !== null && scope.waprogress.modiHrs !== '') {
                        if (scope.waprogress.isModiHours !== '1')
                            scope.waprogress.isModiHours = '1';
                    }
                })

                scope.$watch('waprogress.isNoCapacity', function (noCapa) {
                    if (noCapa !== '1') {
                        scope.waprogress.noCapaFrom = null;
                        scope.waprogress.noCapaTo = null;
                    }
                })

                scope.$watch('waprogress.isLiftUp', function (isLiftUp) {
                    if (isLiftUp !== '1') {
                        scope.waprogress.liftUpKg = null;
                    }
                })
                scope.$watch('waprogress.liftUpKg', function (liftUpKg) {
                    if (liftUpKg !== undefined && liftUpKg !== null && liftUpKg !== '') {
                        scope.waprogress.isLiftUp = '1';
                    } else {
                        scope.waprogress.isLiftUp = '0';
                    }
                })

                scope.$watch('waprogress.isSitUp', function (isSitUp) {
                    if (isSitUp !== '1') {
                        scope.waprogress.sitUpMins = null;
                    }
                })
                scope.$watch('waprogress.sitUpMins', function (sitUpMins) {
                    if (sitUpMins !== undefined && sitUpMins !== null && sitUpMins !== '') {
                        scope.waprogress.isSitUp = '1';
                    } else {
                        scope.waprogress.isSitUp = '0';
                    }

                })

                scope.$watch('waprogress.isStandUp', function (isStandUp) {
                    if (isStandUp !== '1') {
                        scope.waprogress.standUpMins = null;
                    }
                })
                scope.$watch('waprogress.standUpMins', function (standUpMins) {
                    if (standUpMins !== undefined && standUpMins !== null && standUpMins !== '') {
                        scope.waprogress.isStandUp = '1';
                    } else {
                        scope.waprogress.isStandUp = '0';
                    }
                })


                scope.$watch('waprogress.isWalkUp', function (isWalkUp) {
                    if (isWalkUp !== '1') {
                        scope.waprogress.walkUpMeter = null;
                    }
                })
                scope.$watch('waprogress.walkUpMeter', function (walkUpMeter) {
                    if (walkUpMeter !== undefined && walkUpMeter !== null && walkUpMeter !== '') {
                        scope.waprogress.isWalkUp = '1';
                    } else {
                        scope.waprogress.isWalkUp = '0';
                    }
                })

                scope.$watch('waprogress.activities_1', function (activities_1) {
                    if (activities_1 === null || activities_1 === undefined || activities_1 === '') {
                        scope.waprogress.outcome_1 = null;
                        scope.waprogress.isRequired_1 = null;
                    }
                })
                scope.$watch('waprogress.activities_2', function (activities_2) {
                    if (activities_2 === null || activities_2 === undefined || activities_2 === '') {
                        scope.waprogress.outcome_2 = null;
                        scope.waprogress.isRequired_2 = null;
                    }
                })
                scope.$watch('waprogress.activities_3', function (activities_3) {
                    if (activities_3 === null || activities_3 === undefined || activities_3 === '') {
                        scope.waprogress.outcome_3 = null;
                        scope.waprogress.isRequired_3 = null;
                    }
                })
                scope.$watch('waprogress.activities_4', function (activities_4) {
                    if (activities_4 === null || activities_4 === undefined || activities_4 === '') {
                        scope.waprogress.outcome_4 = null;
                        scope.waprogress.isRequired_4 = null;
                    }
                })
                scope.$watch('waprogress.activities_5', function (activities_5) {
                    if (activities_5 === null || activities_5 === undefined || activities_5 === '') {
                        scope.waprogress.outcome_5 = null;
                        scope.waprogress.isRequired_5 = null;
                    }
                })
                scope.$watch('waprogress.activities_6', function (activities_6) {
                    if (activities_6 === null || activities_6 === undefined || activities_6 === '') {
                        scope.waprogress.outcome_6 = null;
                        scope.waprogress.isRequired_6 = null;
                    }
                })

                scope.$watch('waprogress.isReview', function (isReview) {
                    if (isReview !== '1') {
                        scope.waprogress.reviewOn = null;
                    }
                })

                scope.$watch('waprogress.reviewOn', function (reviewOn) {
                    if (reviewOn !== undefined && reviewOn !== null && reviewOn !== '') {
                        scope.waprogress.isReview = '1';
                    }
                })

            }
        }
    });