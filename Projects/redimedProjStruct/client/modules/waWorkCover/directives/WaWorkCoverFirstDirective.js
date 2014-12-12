/**
 * Created by Minh Hikari on 12/1/2014.
 */
angular.module('app.loggedIn.waworkcover.first.directive', [])
    .directive('workCoverFirst', function (DoctorService, CompanyService, ReceptionistService, ConfigService, PatientService, toastr, WaWorkCoverService, $state, $cookieStore) {
        return {
            restrict: 'EA',
            scope: {
                data: '@',
                params: '='
            },
            templateUrl: "modules/waWorkCover/directives/templates/first.html",
            link: function (scope, element, attrs) {
                var init = function () {
                    scope.oneAtATime = false;
                    scope.isSubmit = false;
                    scope.wafirst = {
                        examDate: ConfigService.getCommonDateDefault(new Date())
                    };
                    //get patient info
                    PatientService.mdtById(scope.params.patientInfo.Patient_id).then(function (res) {
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
                    ReceptionistService.apptDetail(scope.params.apptInfo.CAL_ID).then(function (res) {
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
                    var checkID = scope.params.apptInfo.CAL_ID;
                    var searchValue = {
                        filters: [{
                            type: 'text',
                            name: 'cal_id',
                            value: checkID
                        }]
                    };
                    WaWorkCoverService.firstsearch(searchValue).then(function (result) {
                        if (result.status === 'success') {
                            if (result.data !== null && result.data !== undefined && result.data !== '' && result.data.length > 0) {
                                if (result.data[0] !== null && result.data[0] !== undefined && result.data[0] !== '') {
                                    scope.wafirst = result.data[0];
                                    for (var key in scope.wafirst) {
                                        if (scope.wafirst[key]) {
                                            if (key.indexOf('is') != -1 || key.indexOf('Is') != -1 || key.indexOf('IS') != -1)
                                                scope.wafirst[key] = scope.wafirst[key].toString();
                                            if (key.indexOf('date') != -1 || key.indexOf('Date') != -1 || key.indexOf('DATE') != -1 || key.indexOf('reviewOn') != -1 || key.indexOf('From') != -1 || key.indexOf('To') != -1)
                                                scope.wafirst[key] = new Date(scope.wafirst[key]);
                                        }
                                    } //end for
                                    scope.params.edit = true;
                                }
                            }
                        }
                    })
                };
                init();

                scope.clearSignature = function () {
                    scope.wafirst.signature = '';
                }

                scope.clickAction = function () {
                    scope.isSubmit = true;
                    if (!scope.wafirstform.$invalid) {
                        var postData = angular.copy(scope.wafirst);
                        postData.cal_id = scope.params.apptInfo.CAL_ID;
                        for (var key in postData) {
                            if (postData[key] instanceof Date) postData[key] = ConfigService.getCommonDate(postData[key]);
                        } //end for
                        if (scope.params.edit === false) {
                            console.log(scope.wafirst);
                            WaWorkCoverService.firstadd(postData).then(function (result) {
                                if (result.status === 'success') {
                                    toastr.success('Add successfully!', 'Success!');
                                    $state.go('loggedIn.patient.workcover', {
                                        patient_id: scope.params.patientInfo.Patient_id,
                                        cal_id: scope.params.apptInfo.CAL_ID
                                    });
                                } else {
                                    toastr.error('Unexpected Error!', 'Error!');
                                }
                            })
                        } else {
                            WaWorkCoverService.firstedit(postData.Ass_id, postData).then(function (result) {
                                if (result.status === 'success') {
                                    toastr.success('Edit successfully!', 'Success!');
                                    $state.go('loggedIn.patient.workcover', {
                                        patient_id: scope.params.patientInfo.Patient_id,
                                        cal_id: scope.params.apptInfo.CAL_ID
                                    });
                                } else {
                                    toastr.error('Unexpected Error!', 'Error!');
                                }
                            })
                        }
                    } else {
                        toastr.error('Please fix the red field!', 'Invalid information');
                    }
                }

                //Data dependencies
                scope.$watch('wafirst.isFullCapacity', function (fullCapa) {
                    if (fullCapa !== 1) {
                        scope.wafirst.fullCapaFrom = null;
                        scope.wafirst.isRequireTreat = null;
                    }
                })
            }
        }
    });