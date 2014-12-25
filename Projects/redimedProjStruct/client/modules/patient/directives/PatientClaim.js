angular.module("app.loggedIn.patient.claim.directive", [])

.directive("patientClaim", function (PatientService, ClaimService, ClaimModel, ConfigService, toastr, Restangular, CompanyService, InsurerService) {
    return {
        restrict: "EA",
        scope: {
            options: "=",
            isClose: "@",
            params: "=",
            claim: "="
        },
        templateUrl: "modules/patient/directives/templates/claim.html",
        link: function (scope, element, attrs) {
            scope.$watch("patientId", function(newPatientId){
                if(typeof newPatientId !== 'undefined'){

                }
            })

            scope.$watch('params.permission.edit', function () {
                if (scope.params.permission.edit === true) {
                    scope.mode = {
                        type: 'edit',
                        text: 'Edit Claim'
                    };
                    loadInit();
                }// endif
            });
            var loadInit = function () {
                console.log("This is the company service", CompanyService);
                if (scope.params.permission.edit === true) {
                    PatientService.getClaim(scope.params.permission.Claim_id).then(function (response) {
                        if (response.status === 'success') {
                            angular.extend(scope.modelObjectMap, response.data);
                            for (var key in scope.modelObjectMap) {
                                if (scope.modelObjectMap[key]) {
                                    if (key.indexOf("is") != -1 || key.indexOf("Is") != -1)
                                        scope.modelObjectMap[key] = scope.modelObjectMap[key].toString();
                                    if (key.indexOf("_date") != -1)
                                        scope.modelObjectMap[key] = new Date(scope.modelObjectMap[key]);
                                }
                            }
                        }
                    }) // end Patient Service
                } // end if
                
            }
            
            var getInsurerInfo = function(){
            PatientService.mdtById(scope.params.Patient_id).then(function (response) {
                    if (response.status === 'success') {
                        if (response.data.company_id !== null && response.data.company_id !== undefined && response.data.company_id !== '') {
                            CompanyService.mdtById(response.data.company_id).then(function (response2) {
                                if (response2.data.Insurer !== null && response2.data.Insurer !== undefined && response2.data.Insurer !== '') {
                                    InsurerService.detail(response2.data.Insurer).then(function(insurerData){
                                        if(insurerData.row !== null && insurerData.row !== undefined && insurerData.row !== ''){
                                            console.log('this is insurer', insurerData);
                                            scope.modelObjectMap.insurer_site = insurerData.row.id;
                                            scope.modelObjectMap.Insurer = insurerData.row.insurer_name;
//                                            scope.modelObjectMap.insurerId = insurerData.row.id;
                                        }
                                        else{
                                            scope.modelObjectMap.insurer_site = '';
                                            scope.modelObjectMap.Insurer = '';
                                        }
                                    })
                                } else {
                                    scope.modelObjectMap.insurer_site = '';
                                    scope.modelObjectMap.Insurer = '';
                                }
                            })
                        } else {
                            scope.modelObjectMap.insurer_site = '';
                            scope.modelObjectMap.Insurer = '';
                        }
                    } // end if
                })
            }

            //            var getInsurerList = function () {
            //                var insurer_list_api = {
            //                    api: 'api/erm/v2/insurers/search',
            //                    method: 'post'
            //                };
            //                Restangular.all(insurer_list_api.api).post().then(function (data) {
            //                    scope.insurer_list = data.list;
            //                    console.log(scope.insurer_list);
            //                });
            //            }
            //
            //            getInsurerList();


            if (scope.isClose) {
                var idClose = "#" + scope.isClose;
            }

            // DECLARE
            scope.isSubmit = false;
            scope.modelObjectMap = angular.copy(ClaimModel);
            scope.modelObjectMap.Patient_id = scope.params.Patient_id;
            scope.modelObjectMap.insurer_site = scope.insurerId;
            scope.mode = {
                type: 'add',
                text: 'Add Claim'
            };

            // END DECLARE

            //POPUP
            scope.closePopup = function () {
                angular.element(idClose).fadeOut();
                scope.params.permission.edit = false;
                scope.mode = {
                    type: 'add',
                    text: 'Add Claim'
                };
                var patientid = scope.modelObjectMap.Patient_id;
                scope.modelObjectMap = {};
                scope.isSubmit = false;
                scope.modelObjectMap.Patient_id = patientid;
                scope.modelObjectMap.insurer_site = scope.insurerId;
                scope.modelObjectMap.Claim_date = new Date();
                scope.params.Patient_id = patientid;
                getInsurerInfo();
            }
            //END POPUP

            // ACTION
            scope.clickAction = function (option) {
                if (option.type != 'view') {
                    scope.isSubmit = true;
                    if (!scope.claimForm.$invalid) {
                        var postData = angular.copy(scope.modelObjectMap);

                        // DATE
                        for (var key in postData) {
                            if (postData[key] instanceof Date) {
                                postData[key] = ConfigService.getCommonDate(postData[key]);
                            }
                        }
                        // END DATE

                        if (option.type == 'add') {
                            ClaimService.add(postData).then(function (response) {
                                if (response.status === 'success') {
                                    toastr.success("Added a new Claim", "Success");
                                    scope.modelObjectMap = angular.copy(ClaimModel);
                                    scope.isSubmit = false;
                                    scope.claim = response.data;
                                    scope.modelObjectMap = {};
                                    scope.modelObjectMap.Patient_id = response.data.Patient_id;
                                    scope.modelObjectMap.Claim_date = new Date();
                                    scope.modelObjectMap.insurer_site = scope.insurerId;
                                }
                            });
                        } else {
                            PatientService.editClaim(postData).then(function (response) {
                                if (response.status === 'success') {
                                    toastr.success("Edited a new Claim", "Success");
                                    scope.isSubmit = false;
                                    angular.element(idClose).fadeOut()
                                    scope.params.permission.edit = false;
                                    scope.mode = {
                                        type: 'add',
                                        text: 'Add Claim'
                                    };
                                    scope.modelObjectMap = {};
                                    scope.modelObjectMap.Patient_id = postData.Patient_id;
                                    scope.modelObjectMap.Claim_date = new Date();
                                    scope.modelObjectMap.insurer_site = scope.insurerId;
                                }
                            })
                        }
                    }
                } else {

                } // end else
            }
            // END ACTION
        }
    } // end return
}) // end Patient Claim