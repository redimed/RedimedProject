angular.module('app.loggedIn.referral.detail.directive',[])
    .directive('referralDetail',function(ReferralModel, ReferralService, DoctorService, ConfigService, toastr, $stateParams){
        return{
            restrict: "EA",
            scope: {
                data: "@",
                options: "=",
                onsuccess: '=onsuccess'
            },
            templateUrl: "modules/referral/directives/templates/detail.html",
            link: function(scope, element, attrs){
                var loadData = function (id) {
                ReferralService.referralDetail(id).then(function (data) {
                    angular.extend(scope.modelObjectMap, data.data);
                    ConfigService.autoConvertData(scope.modelObjectMap);
                });
            };

            scope.modelObjectMap = angular.copy(ReferralModel);
            scope.mode = {type: 'add', text: 'Add referral'};
            scope.modelObjectMap.APPOINTMENT_DATE = new Date();
            // scope.modelObjectMap.APPOINTMENT_DATE = moment().format('YYYY-MM-DD');
            if (scope.data) {
                var data = scope.$eval(scope.data);
                if (data.id) { 
                    loadData(data.id);
                    scope.mode = {type: 'edit', text: 'Edit referral'};
                }
            }
                
            //Get doctor siganture
//            ReceptionistService.apptDetail($stateParams.cal_id).then(function (res) {
//                        if (res.data !== undefined && res.data !== null && res.data !== '') {
//                            if (res.data.DOCTOR_ID !== undefined && res.data.DOCTOR_ID !== null && res.data.DOCTOR_ID !== '')                             {
//                                DoctorService.getById(res.data.DOCTOR_ID).then(function (res2) {
//                                    if (res2 !== null && res2 !== undefined && res2 !== '') {
//                                        scope.modelObjectMap.doctorSign = res2.Signature;
//                                    }
//                                })
//                            }
//                        }
//                    })

             var addProcess = function (postData) {
                postData.Patient_id = $stateParams.patient_id;
                postData.CAL_ID = $stateParams.cal_id; 
                ReferralService.referralInsert(postData).then(function (response) {
                    if (response.status === 'success') {
                        toastr.success("Added a referral", "Success");
                        scope.modelObjectMap = angular.copy(ReferralModel);
                        scope.isSubmit = false;
                        if (scope.onsuccess) {
                            scope.onsuccess(response);
                        }
                    }
                })
            }
             
//            scope.clearSignature = function(){
//                scope.modelObjectMap.patientSign = '';
//            }

            var editProcess = function (postData) {
                var id = postData.id;
                delete postData.id;
                ReferralService.referralUpdate(postData).then(function (response) {
                    if (response.status === 'success') {
                        toastr.success("Edit referral Successfully", "Success");
                        scope.isSubmit = false;
                        if (scope.onsuccess) {
                            scope.onsuccess(response);
                        }
                    }
                })
            }

            scope.clickAction = function (option) {
                if (option.type != 'view') {
                    scope.isSubmit = true;
                    if (!scope.mainForm.$invalid) {
                        var postData = angular.copy(scope.modelObjectMap);

                        // DATE
                        for (var key in postData) {
                            if (postData[key] instanceof Date) {
                                postData[key] = ConfigService.getCommonDate(postData[key]);
                            }
                        }
                        // END DATE

                        if (option.type == 'add') {
                            addProcess(postData);
                        } else if (option.type == 'edit') {
                            editProcess(postData);
                        }
                    }
                } else {
                    // view process
                }
            }
            }
        }
    });