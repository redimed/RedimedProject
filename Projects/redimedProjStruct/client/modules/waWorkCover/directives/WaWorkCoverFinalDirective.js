/**
 * Created by Minh Hikari on 12/1/2014.
 */
angular.module('app.loggedIn.waworkcover.final.directive', [])
    .directive('workCoverFinal', function (DoctorService, ReceptionistService, ConfigService, PatientService, toastr, WaWorkCoverService, $state, $cookieStore,CompanyService) {
        return {
            restrict: 'EA',
            scope: {
                data: '@',
                params: '='
            },
            templateUrl: "modules/waWorkCover/directives/templates/final.html",
            link: function (scope, element, attrs) {
                				var init = function () {
                    scope.oneAtATime = false;
                    scope.isSubmit = false;
                    scope.wafinal = {
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

                    //this will dceide the form to "add" or "edit" mode
                    //create search filter
//                    WaWorkCoverService.finalsearch(searchValue).then(function (result) {
//                        if (result.status === 'success') {
//                            if (result.data !== null && result.data !== undefined && result.data !== '' && result.data.length > 0) {
//                                if (result.data[0] !== null && result.data[0] !== undefined && result.data[0] !== '') {
//                                    scope.wafinal = result.data[0];
//                                    for (var key in scope.wafinal) {
//                                        if (scope.wafinal[key]) {
//                                            if (key.indexOf('is') != -1 || key.indexOf('Is') != -1 || key.indexOf('IS') != -1)
//                                                scope.wafinal[key] = scope.wafinal[key].toString();
//                                            if (key.indexOf('date') != -1 || key.indexOf('Date') != -1 || key.indexOf('DATE') != -1 || key.indexOf('reviewOn') != -1 || key.indexOf('From') != -1 || key.indexOf('To') != -1)
//                                                scope.wafinal[key] = new Date(scope.wafinal[key]);
//                                        }
//                                    } //end for
//                                    scope.params.edit = true;
//                                }
//                            }
//                        }
//                    })
                    
                    if(scope.params.edit === true && scope.params.workcover){
                        WaWorkCoverService.finaldetail(scope.params.workcover).then(function(res){
                            if(!!res.data){
                                scope.wafinal = res.data;
                                    for (var key in scope.wafinal) {
                                        if (scope.wafinal[key]) {
                                            if (key.indexOf('is') != -1 || key.indexOf('Is') != -1 || key.indexOf('IS') != -1)
                                                scope.wafinal[key] = scope.wafinal[key].toString();
                                            if (key.indexOf('date') != -1 || key.indexOf('Date') != -1 || key.indexOf('DATE') != -1 || key.indexOf('reviewOn') != -1 || key.indexOf('From') != -1 || key.indexOf('To') != -1)
                                                scope.wafinal[key] = new Date(scope.wafinal[key]);
                                        }
                                    }
                            }
                        })
                    }
                };
                init();

                scope.clearSignature = function () {
                    scope.wafinal.signature = '';
                }

                scope.clickAction = function () {
                    scope.isSubmit = true;
                    if (!scope.wafinalform.$invalid) {
                        var postData = angular.copy(scope.wafinal);
                        postData.cal_id = scope.params.apptInfo;
                        postData.patient_id = scope.params.patientInfo;
                        for (var key in postData) {
                            if (postData[key] instanceof Date) postData[key] = ConfigService.getCommonDate(postData[key]);
                        } //end for
                        if (scope.params.edit === false) {
                            WaWorkCoverService.finaladd(postData).then(function (result) {
                                console.log('this is insert result',result)
                                if (result.status === 'success') {
                                    toastr.success('Add successfully!', 'Success!');
                                    
                                    //GET BACK TO THE LIST
                                    $state.go('loggedIn.patient.workcover',{
                                        patient_id: scope.params.patientInfo,
                                        cal_id: scope.params.apptInfo
                                    })
//                                    $state.go('loggedIn.waworkcover.final', {
//                                        patient_id: scope.params.patientInfo,
//                                        cal_id: scope.params.apptInfo,
//                                        action: 'edit',
//                                        wc_id: result.data.id
//                                    });
                                } else {
                                    toastr.error('Unexpected Error!', 'Error!');
                                }
                            })
                        } else {
                            WaWorkCoverService.finaledit(postData.id, postData).then(function (result) {
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
                    var printId = scope.wafinal.id;
                    WaWorkCoverService.finalprint(printId).then(function (result) {})
                }


                //Data dependencies
                scope.$watch('wafinal.isFullCapacity', function (fullCapa) {
                    if (fullCapa !== '1') {
                        scope.wafinal.fullCapaFrom = null;
                        scope.wafinal.isRequireTreat = null;
                    }
                })

                scope.$watch('wafinal.isCapacityForWork', function (isCapacityForWork) {
                    if (isCapacityForWork !== '1') {
                        scope.wafinal.capaFrom = null;
                        scope.wafinal.capaHours = null;
                        scope.wafinal.capaDays = null;
                        scope.wafinal.isLiftUp = null;
                        scope.wafinal.isStandUp = null;
                        scope.wafinal.isSitUp = null;
                        scope.wafinal.isWalkUp = null;
                        scope.wafinal.liftUpKg = null;
                        scope.wafinal.standUpMins = null;
                        scope.wafinal.sitUpMins = null;
                        scope.wafinal.walkUpMeter = null;
                        scope.wafinal.isWorkBelow = null;
                        scope.wafinal.capaCmt = null;
                    }
                })

                scope.$watch('wafinal.isLiftUp', function (isLiftUp) {
                    if (isLiftUp !== '1') {
                        scope.wafinal.liftUpKg = null;
                    }
                })
                scope.$watch('wafinal.liftUpKg', function (liftUpKg) {
                    if (liftUpKg !== undefined && liftUpKg !== null && liftUpKg !== '') {
                        scope.wafinal.isLiftUp = '1';
                    } else {
                        scope.wafinal.isLiftUp = '0';
                    }
                })

                scope.$watch('wafinal.isSitUp', function (isSitUp) {
                    if (isSitUp !== '1') {
                        scope.wafinal.sitUpMins = null;
                    }
                })
                scope.$watch('wafinal.sitUpMins', function (sitUpMins) {
                    if (sitUpMins !== undefined && sitUpMins !== null && sitUpMins !== '') {
                        scope.wafinal.isSitUp = '1';
                    } else {
                        scope.wafinal.isSitUp = '0';
                    }

                })

                scope.$watch('wafinal.isStandUp', function (isStandUp) {
                    if (isStandUp !== '1') {
                        scope.wafinal.standUpMins = null;
                    }
                })
                scope.$watch('wafinal.standUpMins', function (standUpMins) {
                    if (standUpMins !== undefined && standUpMins !== null && standUpMins !== '') {
                        scope.wafinal.isStandUp = '1';
                    } else {
                        scope.wafinal.isStandUp = '0';
                    }
                })


                scope.$watch('wafinal.isWalkUp', function (isWalkUp) {
                    if (isWalkUp !== '1') {
                        scope.wafinal.walkUpMeter = null;
                    }
                })
                scope.$watch('wafinal.walkUpMeter', function (walkUpMeter) {
                    if (walkUpMeter !== undefined && walkUpMeter !== null && walkUpMeter !== '') {
                        scope.wafinal.isWalkUp = '1';
                    } else {
                        scope.wafinal.isWalkUp = '0';
                    }
                })




            }
        }
    });