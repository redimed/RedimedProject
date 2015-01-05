angular.module('app.loggedIn.script.detail.directive',[])
    .directive('scriptDetail',function(ScriptReferralModel, ScriptService, DoctorService, ReceptionistService, ConfigService, toastr, $stateParams, PatientService){
        return{
            restrict: "EA",
            scope: {
                data: "@",
                options: "=",
                onsuccess: '=onsuccess'
            },
            templateUrl: "modules/script/directives/templates/detail.html",
            link: function(scope, element, attrs){
                var loadData = function (id) {
                ScriptService.scriptDetail(id).then(function (data) {
                    angular.extend(scope.modelObjectMap, data.data);
                    ConfigService.autoConvertData(scope.modelObjectMap);
                });
            };

            scope.modelObjectMap = angular.copy(ScriptReferralModel);
            scope.mode = {type: 'add', text: 'Add script'};

            if (scope.data) {
                var data = scope.$eval(scope.data);
                if (data.id) { 
                    loadData(data.id);
                    scope.mode = {type: 'edit', text: 'Edit script'};
                }
            }
                
            //Get doctor siganture
            ReceptionistService.apptDetail($stateParams.cal_id).then(function (res) {
                        if (res.data !== undefined && res.data !== null && res.data !== '') {
                            if (res.data.DOCTOR_ID !== undefined && res.data.DOCTOR_ID !== null && res.data.DOCTOR_ID !== '') {
                                DoctorService.getById(res.data.DOCTOR_ID).then(function (res2) {
                                    if (res2 !== null && res2 !== undefined && res2 !== '') {
                                        scope.modelObjectMap.doctorSign = res2.Signature;
                                    }
                                })
                            }
                        }
                    })
            
            //Get Medicare ID
            var patient_id = $stateParams.patient_id;
                
            PatientService.getById(patient_id).then(function(res){
                if(!res){
                    
                }
                else{
                    scope.modelObjectMap.Medicare = res.Medicare_no;
                }
            })
            

             var addProcess = function (postData) {
                postData.Patient_id = $stateParams.patient_id;
                postData.CAL_ID = $stateParams.cal_id; 
                ScriptService.scriptInsert(postData).then(function (response) {
                    if (response.status === 'success') {
                        toastr.success("Added a script", "Success");
                        scope.modelObjectMap = angular.copy(ScriptReferralModel);
                        scope.isSubmit = false;
                        if (scope.onsuccess) {
                            scope.onsuccess(response);
                        }
                    }
                })
            }
             
            scope.clearSignature = function(){
                scope.modelObjectMap.patientSign = '';
            }

            var editProcess = function (postData) {
                var id = postData.id;
                delete postData.id;
                ScriptService.scriptUpdate(postData).then(function (response) {
                    if (response.status === 'success') {
                        toastr.success("Edit script Successfully", "Success");
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