/**
 * Created by Minh Hikari on 12/1/2014.
 */
angular.module('app.loggedIn.waworkcover.first.directive', [])
    .directive('workCoverFirst', function (DocumentService, DoctorService, ReceptionistService, ConfigService, PatientService, toastr, WaWorkCoverService, $state, $cookieStore,CompanyService) {
        return {
            restrict: 'EA',
            scope: {
                data: '@',
                params: '='
            },
            templateUrl: "modules/waWorkCover/directives/templates/first.html",
            link: function (scope, element, attrs) {
                scope.isTakeSignatureFromInjury = false;
                var init = function () {
                    scope.oneAtATime = false;
                    scope.isSubmit = false;
                    scope.wafirst = {
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

                    //get injury info
                    console.log(scope.params);
                    WaWorkCoverService.firstGetInjury(scope.params.patientInfo, scope.params.apptInfo).then(function(result){
                        if(result.data.length !== 0){
                            scope.isTakeSignatureFromInjury = true;
                            scope.wafirst.signature = result.data[0].signature;
                        }
                    })

                    //get doctor info
                    // ReceptionistService.apptDetail(scope.params.apptInfo).then(function (res) {
                    //     if (res.data !== undefined && res.data !== null && res.data !== '') {
                    //         if (res.data.DOCTOR_ID !== undefined && res.data.DOCTOR_ID !== null && res.data.DOCTOR_ID !== '') {
                    //             DoctorService.getById(res.data.DOCTOR_ID).then(function (res2) {
                    //                 if (res2 !== null && res2 !== undefined && res2 !== '') {
                    //                     scope.doctor = res2;
                    //                 }
                    //             })
                    //         }
                    //     }
                    // })

                    var userInfo = $cookieStore.get('userInfo');
                    var apptInfo = {user_id: userInfo.id};
                    DocumentService.getDoctor(apptInfo).then(function(result){
                        if(result.status === "error") toastr.error("Unexpected error!","Error");
                        else if(result.status === "no doctor") toastr.error("The account treating this workcover have no doctor link with it", "Error!");
                        else {
                            console.log('this is doctor', result);
                            scope.doctor = result.data[0];
                        }
                    })

                    //this will dceide the form to "add" or "edit" mode
                    //create search filter
//                    WaWorkCoverService.firstsearch(searchValue).then(function (result) {
//                        if (result.status === 'success') {
//                            if (result.data !== null && result.data !== undefined && result.data !== '' && result.data.length > 0) {
//                                if (result.data[0] !== null && result.data[0] !== undefined && result.data[0] !== '') {
//                                    scope.wafirst = result.data[0];
//                                    for (var key in scope.wafirst) {
//                                        if (scope.wafirst[key]) {
//                                            if (key.indexOf('is') != -1 || key.indexOf('Is') != -1 || key.indexOf('IS') != -1)
//                                                scope.wafirst[key] = scope.wafirst[key].toString();
//                                            if (key.indexOf('date') != -1 || key.indexOf('Date') != -1 || key.indexOf('DATE') != -1 || key.indexOf('reviewOn') != -1 || key.indexOf('From') != -1 || key.indexOf('To') != -1)
//                                                scope.wafirst[key] = new Date(scope.wafirst[key]);
//                                        }
//                                    } //end for
//                                    scope.params.edit = true;
//                                }
//                            }
//                        }
//                    })
                    
                    if(scope.params.edit === true && scope.params.workcover){
                        WaWorkCoverService.firstdetail(scope.params.workcover).then(function(res){
                            if(!!res.data){
                                scope.wafirst = res.data;
                                    for (var key in scope.wafirst) {
                                        if (scope.wafirst[key]) {
                                            if (key.indexOf('is') != -1 || key.indexOf('Is') != -1 || key.indexOf('IS') != -1)
                                                scope.wafirst[key] = scope.wafirst[key].toString();
                                            if (key.indexOf('date') != -1 || key.indexOf('Date') != -1 || key.indexOf('DATE') != -1 || key.indexOf('reviewOn') != -1 || key.indexOf('From') != -1 || key.indexOf('To') != -1)
                                                scope.wafirst[key] = new Date(scope.wafirst[key]);
                                        }
                                    }
                            }
                        })
                    }
                };
                init();

                scope.clearSignature = function () {
                    scope.wafirst.signature = '';
                }

                scope.clickAction = function () {
                    scope.isSubmit = true;
                    if (!scope.wafirstform.$invalid) {
                        var postData = angular.copy(scope.wafirst);
                        postData.cal_id = scope.params.apptInfo;
                        postData.patient_id = scope.params.patientInfo;
                        for (var key in postData) {
                            if (postData[key] instanceof Date) postData[key] = ConfigService.getCommonDate(postData[key]);
                        } //end for
                        if (scope.params.edit === false) {
                            postData.Created_by = $cookieStore.get('userInfo').id;
                            WaWorkCoverService.firstadd(postData).then(function (result) {
                                console.log('this is insert result',result)
                                if (result.status === 'success') {
                                    toastr.success('Add successfully!', 'Success!');
                                    //GET BACK TO THE LIST
                                    $state.go('loggedIn.patient.workcover',{
                                        patient_id: scope.params.patientInfo,
                                        cal_id: scope.params.apptInfo
                                    })
//                                    $state.go('loggedIn.waworkcover.first', {
//                                        patient_id: scope.params.patientInfo,
//                                        cal_id: scope.params.apptInfo,
//                                        action: 'edit',
//                                        wc_id: result.data.Ass_id
//                                    });
                                } else {
                                    toastr.error('Unexpected Error!', 'Error!');
                                }
                            })
                        } else {
                            WaWorkCoverService.firstedit(postData.Ass_id, postData).then(function (result) {
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
                    var printId = scope.wafirst.Ass_id;
                    WaWorkCoverService.firstprint(printId).then(function (result) {})
                }

                //Data dependencies
                scope.$watch('wafirst.isFullCapacity', function (fullCapa) {
                    if (fullCapa !== '1') {
                        scope.wafirst.fullCapaFrom = null;
                        scope.wafirst.isRequireTreat = null;
                    }
                })

                scope.$watch('wafirst.isSomeCapacity', function (someCapa) {
                    if (someCapa !== '1') {
                        scope.wafirst.someCapaFrom = null;
                        scope.wafirst.someCapaTo = null;
                        scope.wafirst.isPreDuties = null;
                        scope.wafirst.isModiDuties = null;
                        scope.wafirst.isWorkModifi = null;
                        scope.wafirst.isPreHours = null;
                        scope.wafirst.isModiHours = null;
                    }
                })

                scope.$watch('wafirst.isModiHours', function (isModi) {
                    if (isModi !== '1') {
                        scope.wafirst.modiHrs = null;
                        scope.wafirst.modiDays = null;
                    }
                })

                scope.$watch('wafirst.modiHrs', function (modiHrs) {
                    if (modiHrs !== undefined && modiHrs !== null && modiHrs !== '' && scope.wafirst.modiDays !== undefined && scope.wafirst.modiDays !== null && scope.wafirst.modiDays !== '') {
                        if (scope.wafirst.isModiHours !== '1')
                            scope.wafirst.isModiHours = '1';
                    }
                })

                scope.$watch('wafirst.modiDays', function (modiDays) {
                    if (modiDays !== undefined && modiDays !== null && modiDays !== '' && scope.wafirst.modiHrs !== undefined && scope.wafirst.modiHrs !== null && scope.wafirst.modiHrs !== '') {
                        if (scope.wafirst.isModiHours !== '1')
                            scope.wafirst.isModiHours = '1';
                    }
                })

                scope.$watch('wafirst.isNoCapacity', function (noCapa) {
                    if (noCapa !== '1') {
                        scope.wafirst.noCapaFrom = null;
                        scope.wafirst.noCapaTo = null;
                    }
                })

                scope.$watch('wafirst.isLiftUp', function (isLiftUp) {
                    if (isLiftUp !== '1') {
                        scope.wafirst.liftUpKg = null;
                    }
                })
                scope.$watch('wafirst.liftUpKg', function (liftUpKg) {
                    if (liftUpKg !== undefined && liftUpKg !== null && liftUpKg !== '') {
                        scope.wafirst.isLiftUp = '1';
                    } else {
                        scope.wafirst.isLiftUp = '0';
                    }
                })

                scope.$watch('wafirst.isSitUp', function (isSitUp) {
                    if (isSitUp !== '1') {
                        scope.wafirst.sitUpMins = null;
                    }
                })
                scope.$watch('wafirst.sitUpMins', function (sitUpMins) {
                    if (sitUpMins !== undefined && sitUpMins !== null && sitUpMins !== '') {
                        scope.wafirst.isSitUp = '1';
                    } else {
                        scope.wafirst.isSitUp = '0';
                    }

                })

                scope.$watch('wafirst.isStandUp', function (isStandUp) {
                    if (isStandUp !== '1') {
                        scope.wafirst.standUpMins = null;
                    }
                })
                scope.$watch('wafirst.standUpMins', function (standUpMins) {
                    if (standUpMins !== undefined && standUpMins !== null && standUpMins !== '') {
                        scope.wafirst.isStandUp = '1';
                    } else {
                        scope.wafirst.isStandUp = '0';
                    }
                })


                scope.$watch('wafirst.isWalkUp', function (isWalkUp) {
                    if (isWalkUp !== '1') {
                        scope.wafirst.walkUpMeter = null;
                    }
                })
                scope.$watch('wafirst.walkUpMeter', function (walkUpMeter) {
                    if (walkUpMeter !== undefined && walkUpMeter !== null && walkUpMeter !== '') {
                        scope.wafirst.isWalkUp = '1';
                    } else {
                        scope.wafirst.isWalkUp = '0';
                    }
                })

                scope.$watch('wafirst.isReview', function (isReview) {
                    if (isReview !== '1') {
                        scope.wafirst.reviewOn = null;
                    }
                })

                scope.$watch('wafirst.reviewOn', function (reviewOn) {
                    if (reviewOn !== undefined && reviewOn !== null && reviewOn !== '') {
                        scope.wafirst.isReview = '1';
                    }
                })



            }
        }
    });