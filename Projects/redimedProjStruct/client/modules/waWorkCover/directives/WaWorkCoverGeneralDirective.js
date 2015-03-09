angular.module('app.loggedIn.waworkcover.general.directive',[])
    .directive('workCoverGeneral',function(PatientService, CompanyService, InsurerService, ReceptionistService, WaWorkCoverService, DoctorService, ConfigService, $state, $cookieStore, toastr){
        return{
            restrict: 'EA',
            scope: {
                data: '@',
                params: '='
            },
            templateUrl: "modules/waWorkCover/directives/templates/general.html",
            link: function(scope,element,attrs){
                var init = function(){
                    scope.oneAtATime = false;
                    scope.isOpen = true;
                    scope.isSubmit = false;
                    scope.generalwc = {
                        examDate: new Date()
                    };
                    //GET PATIENT INFO
                    PatientService.mdtById(scope.params.patientInfo).then(function(res){
                        if(res.status === 'success'){
                            if(!!res.data){
                                scope.patient = res.data;
                                scope.patient.fullname = scope.patient.First_name;
                                if(!!scope.patient.Middle_name){
                                    scope.patient.fullname = scope.patient.fullname + " " + scope.patient.Middle_name;
                                }
                                scope.patient.fullname = scope.patient.fullname + " " + scope.patient.Sur_name;
                                scope.patient.DOB = new Date(scope.patient.DOB);
                                if(!!scope.patient.company_id){
                                    //GET COMPANY INFO
                                    CompanyService.mdtById(scope.patient.company_id).then(function(res2){
                                        if(res2.status === 'success'){
                                            if(!!res2.data){
                                                scope.companyInfo = res2.data;
                                                if(!!scope.companyInfo.Insurer){
                                                    //GET INSURER INFO
                                                    InsurerService.detail(scope.companyInfo.Insurer).then(function(res3){
                                                        if(res3.status === "success"){
                                                            if(!!res3.row){
                                                                scope.insurer = res3.row;
                                                            }
                                                        }
                                                    })
                                                }
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
                        WaWorkCoverService.generaldetail(scope.params.workcover).then(function(res){
                            if(!!res.data){
                                scope.generalwc = res.data;
                                    for (var key in scope.generalwc) {
                                        if (scope.generalwc[key]) {
                                            if (key.indexOf('is') != -1 || key.indexOf('Is') != -1 || key.indexOf('IS') != -1)
                                                scope.generalwc[key] = scope.generalwc[key].toString();
                                            if (key.indexOf('date') != -1 || key.indexOf('Date') != -1 || key.indexOf('DATE') != -1 || key.indexOf('reviewOn') != -1 || key.indexOf('From') != -1 || key.indexOf('To') != -1)
                                                scope.generalwc[key] = new Date(scope.generalwc[key]);
                                        }
                                    }
                            }
                        })
                    }
                };
                
                init();
                
                scope.clickAction = function(){
                    scope.isSubmit = true;
                    if(!scope.generalform.$invalid){
                        var postData = angular.copy(scope.generalwc);
                        postData.cal_id = scope.params.apptInfo;
                        postData.patient_id = scope.params.patientInfo;
                        for (var key in postData) {
                            if (postData[key] instanceof Date) postData[key] = ConfigService.getCommonDate(postData[key]);
                        } //end for
                        
                        if(scope.params.edit === false){
                            WaWorkCoverService.generaladd(postData).then(function(result){
                                if(result.status === 'success'){
                                    toastr.success('Add successfully!','Success!');
                                    //GET BACK TO THE LIST
                                    $state.go('loggedIn.patient.workcover',{
                                        patient_id: scope.params.patientInfo,
                                        cal_id: scope.params.apptInfo
                                    })
                                }
                                else{
                                    toastr.error('Unexpected error!','Error!');
                                }
                            })
                        }
                        else{
                            WaWorkCoverService.generaledit(postData.id, postData).then(function (result) {
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
                        
                    } else{
                        toastr.error('Please fix the red field!', 'Invalid information');
                    }
                }
                
            }
        }
    });