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
                $scope.info.dec_signed = tempSignature;
            };
            $scope.clearClick = function () {
                $scope.info.dec_signed = '';
            };
            $scope.okClick = function () {
                $scope.isSignature = !$scope.isSignature;
                tempSignature = $scope.info.dec_signed;
            }
            //End signature

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
                var medications = [{
                    "col1": null,
                    "col2": null,
                    "col3": null,
                    "stt": true
                }];
                var works = [{
                    "col1": null,
                    "col2": null,
                    "col3": null,
                    "col4": null,
                    "stt": true
                }];
                var info = $scope.info;
                DocumentService.loadMH(info).then(function (response) {
                    if (response['status'] === 'fail') {
                        $state.go('loggedIn.home', null, {
                            "reload": true
                        });
                    } else if (response[0].status === 'findNull') {
                        //Add new document MH.
                        $scope.isNew = true;
                        $scope.count_sec2 = 0;
                        $scope.count_sec3 = 0;
                    } else if (response[0].status === 'findFound') {
                        //Edit document MH
                        $scope.isNew = false;
                        var dataTemp = response[0].data;
                        //sec1 2
                        works = [
                            {
                                "col1": dataTemp.s2_occupation1 || null,
                                "col2": dataTemp.s2_startdate1 || null,
                                "col3": dataTemp.s2_enddate1 || null,
                                "col4": dataTemp.s2_employ1 || null,
                                "stt": dataTemp.s2_occupation1 == null ? false : true
                            },
                            {
                                "col1": dataTemp.s2_occupation2 || null,
                                "col2": dataTemp.s2_startdate2 || null,
                                "col3": dataTemp.s2_enddate2 || null,
                                "col4": dataTemp.s2_employ2 || null,
                                "stt": dataTemp.s2_occupation2 == null ? false : true
                            },
                            {
                                "col1": dataTemp.s2_occupation3 || null,
                                "col2": dataTemp.s2_startdate3 || null,
                                "col3": dataTemp.s2_enddate3 || null,
                                "col4": dataTemp.s2_employ3 || null,
                                "stt": dataTemp.s2_occupation3 == null ? false : true
                            },
                            {
                                "col1": dataTemp.s2_occupation4 || null,
                                "col2": dataTemp.s2_startdate4 || null,
                                "col3": dataTemp.s2_enddate4 || null,
                                "col4": dataTemp.s2_employ4 || null,
                                "stt": dataTemp.s2_occupation4 == null ? false : true
                            },
                            {
                                "col1": dataTemp.s2_occupation5 || null,
                                "col2": dataTemp.s2_startdate5 || null,
                                "col3": dataTemp.s2_enddate5 || null,
                                "col4": dataTemp.s2_employ5 || null,
                                "stt": dataTemp.s2_occupation5 == null ? false : true
                            }];
                        //sec 3
                        medications = [
                            {
                                "col1": dataTemp.s3_name1 || null,
                                "col2": dataTemp.s3_reason1 || null,
                                "col3": dataTemp.s3_regularly1 || null,
                                "stt": dataTemp.s3_name1 == null ? false : true
                            },
                            {
                                "col1": dataTemp.s3_name2 || null,
                                "col2": dataTemp.s3_reason2 || null,
                                "col3": dataTemp.s3_regularly2 || null,
                                "stt": dataTemp.s3_name2 == null ? false : true
                            },
                            {
                                "col1": dataTemp.s3_name3 || null,
                                "col2": dataTemp.s3_reason3 || null,
                                "col3": dataTemp.s3_regularly3 || null,
                                "stt": dataTemp.s3_name3 == null ? false : true
                            },
                            {
                                "col1": dataTemp.s3_name4 || null,
                                "col2": dataTemp.s3_reason4 || null,
                                "col3": dataTemp.s3_regularly4 || null,
                                "stt": dataTemp.s3_name4 == null ? false : true
                            },
                            {
                                "col1": dataTemp.s3_name5 || null,
                                "col2": dataTemp.s3_reason5 || null,
                                "col3": dataTemp.s3_regularly5 || null,
                                "stt": dataTemp.s3_name5 == null ? false : true
                            }];
                        //check again value works
                        angular.forEach(works, function (w, wIndex) {
                            if (w.stt == false) {
                                works.splice(wIndex, 1);
                            }
                        });
                        //check again value works
                        angular.forEach(medications, function (m, mIndex) {
                            if (m.stt == false) {
                                medications.splice(mIndex, 1);
                            }
                        });
                        $scope.count_sec2 = works.length - 1;
                        $scope.count_sec3 = medications.length - 1;
                    } else {
                        //Throw exception
                        $state.go('loggedIn.home', null, {
                            "reload": true
                        });
                    }
                    /**
                     * Load data
                     */
                    var data = response[0].data;
                    $scope.info = {
                        mh_id: data.mh_id,
                        patient_id: patient_id,
                        cal_id: cal_id,

                        s2_occupation1: data.s2_occupation1,
                        s2_startdate1: data.s2_startdate1,
                        s2_enddate1: data.s2_enddate1,
                        s2_employ1: data.s2_employ1,

                        s2_occupation2: data.s2_occupation2,
                        s2_startdate2: data.s2_startdate2,
                        s2_enddate2: data.s2_enddate2,
                        s2_employ2: data.s2_employ2,

                        s2_occupation3: data.s2_occupation3,
                        s2_startdate3: data.s2_startdate3,
                        s2_enddate3: data.s2_enddate3,
                        s2_employ3: data.s2_employ3,

                        s2_occupation4: data.s2_occupation4,
                        s2_startdate4: data.s2_startdate4,
                        s2_enddate4: data.s2_enddate4,
                        s2_employ4: data.s2_employ4,

                        s2_occupation5: data.s2_occupation5,
                        s2_startdate5: data.s2_startdate5,
                        s2_enddate5: data.s2_enddate5,
                        s2_employ5: data.s2_employ5,

                        s2_samework: data.s2_samework,
                        s2_sameworkenvironment: data.s2_sameworkenvironment,
                        s2_comments: data.s2_comments,

                        s3_name1: data.s3_name1,
                        s3_reason1: data.s3_reason1,
                        s3_regularly1: data.s3_regularly1,

                        s3_name2: data.s3_name2,
                        s3_reason2: data.s3_reason2,
                        s3_regularly2: data.s3_regularly2,

                        s3_name3: data.s3_name3,
                        s3_reason3: data.s3_reason3,
                        s3_regularly3: data.s3_regularly3,

                        s3_name4: data.s3_name4,
                        s3_reason4: data.s3_reason4,
                        s3_regularly4: data.s3_regularly4,

                        s3_name5: data.s3_name5,
                        s3_reason5: data.s3_reason5,
                        s3_regular5: data.s3_regularly5,

                        s3_comments: data.s3_comments,
                        s4_concerning: data.s4_concerning,
                        s4_weight_altered: data.s4_weight_altered,
                        s4_medicaltreatment: data.s4_medicaltreatment,
                        s4_hospital: data.s4_hospital,
                        s4_stranfustion: data.s4_stranfustion,
                        s4_diabetes: data.s4_diabetes,
                        s4_pressure: data.s4_pressure,
                        s4_asthma: data.s4_asthma,
                        s4_emphysema: data.s4_emphysema,
                        s4_veins: data.s4_veins,
                        s4_epilepsy: data.s4_epilepsy,
                        s4_episodes: data.s4_episodes,
                        s4_cancer_or_tumour: data.s4_cancer_or_tumour,
                        s4_concussion_or_headinjury: data.s4_concussion_or_headinjury,
                        s4_migraine: data.s4_migraine,
                        s4_eczema: data.s4_eczema,
                        s4_hepatitis: data.s4_hepatitis,
                        s4_desease: data.s4_desease,
                        s4_hormonal: data.s4_hormonal,
                        s4_allergies: data.s4_allergies,
                        s4_comments: data.s4_comments,
                        s5_disease: data.s5_disease,
                        s5_claim: data.s5_claim,
                        s5_claim_comment: data.s5_claim_comment,
                        s5_lodged: data.s5_lodged,
                        s5_closed: data.s5_closed,
                        s5_duties: data.s5_duties,
                        s5_sickness: data.s5_sickness,
                        s5_equipment: data.s5_equipment,
                        s5_chermicals: data.s5_chermicals,
                        s5_noise: data.s5_noise,
                        s5_radiation: data.s5_radiation,
                        s5_dust: data.s5_dust,
                        s5_asbestos: data.s5_asbestos,
                        s5_solvents: data.s5_solvents,
                        s5_other: data.s5_other,
                        s5_comments: data.s5_comments,
                        s6_neck: data.s6_neck,
                        s6_shoulder: data.s6_shoulder,
                        s6_elbow: data.s6_elbow,
                        s6_wrist_or_hand: data.s6_wrist_or_hand,
                        s6_lower_black: data.s6_lower_black,
                        s6_hip: data.s6_hip,
                        s6_knee: data.s6_knee,
                        s6_ankle_or_foot: data.s6_ankle_or_foot,
                        s6_comments1: data.s6_comments1,
                        s6_cervical: data.s6_cervical,
                        s6_lower: data.s6_lower,
                        s6_sciatica: data.s6_sciatica,
                        s6_pins_needles: data.s6_pins_needles,
                        s6_muscle_aches_pains: data.s6_muscle_aches_pains,
                        s6_joint_aches_pains: data.s6_joint_aches_pains,
                        s6_comments2: data.s6_comments2,
                        s6_rsi: data.s6_rsi,
                        s6_tennis: data.s6_tennis,
                        s6_carpal: data.s6_carpal,
                        s6_hernia: data.s6_hernia,
                        s6_osteoarthritis: data.s6_osteoarthritis,
                        s6_arthritis: data.s6_arthritis,
                        s6_osteoporosis: data.s6_osteoporosis,
                        s6_fibromyalgia: data.s6_fibromyalgia,
                        s6_fractured_bones: data.s6_fractured_bones,
                        s6_affects: data.s6_affects,
                        s6_joint_or_bones: data.s6_joint_or_bones,
                        s6_comments3: data.s6_comments3,
                        s7_directfamily: data.s7_directfamily,
                        s7_undergone: data.s7_undergone,
                        s7_conditions: data.s7_conditions,
                        s7_disease: data.s7_disease,
                        s7_murmurs: data.s7_murmurs,
                        s7_palpitations: data.s7_palpitations,
                        s7_angina: data.s7_angina,
                        s7_blood_presure: data.s7_blood_presure,
                        s7_comments: data.s7_comments,
                        s8_exercise: data.s8_exercise,
                        s8_asthma: data.s8_asthma,
                        s8_emphysema: data.s8_emphysema,
                        s8_hay_fever: data.s8_hay_fever,
                        s8_tuberculosis: data.s8_tuberculosis,
                        s8_obstructive: data.s8_obstructive,
                        s8_disease: data.s8_disease,
                        s8_rheumatic_fever: data.s8_rheumatic_fever,
                        s8_bronchitis: data.s8_bronchitis,
                        s8_coughed_blood: data.s8_coughed_blood,
                        s8_shortness: data.s8_shortness,
                        s8_comments: data.s8_comments,
                        s9_hearing: data.s9_hearing,
                        s9_infections_or_discharge: data.s9_infections_or_discharge,
                        s9_hearing_aid: data.s9_hearing_aid,
                        s9_injury_or_condition: data.s9_injury_or_condition,
                        s9_near_or_distance: data.s9_near_or_distance,
                        s9_color_blind: data.s9_color_blind,
                        s9_eyes_or_ears: data.s9_eyes_or_ears,
                        s9_comments: data.s9_comments,
                        s10_indigestion: data.s10_indigestion,
                        s10_vomited_blood: data.s10_vomited_blood,
                        s10_bowel_habit: data.s10_bowel_habit,
                        s10_time_you_urinate: data.s10_time_you_urinate,
                        s10_night_to_urinate: data.s10_night_to_urinate,
                        s10_start_stop_urine: data.s10_start_stop_urine,
                        s10_change_urine: data.s10_change_urine,
                        s10_comments: data.s10_comments,
                        s11_medicaltion_or_counselling: data.s11_medicaltion_or_counselling,
                        s11_psychologist_or_psychiatrist: data.s11_psychologist_or_psychiatrist,
                        s11_sleeping_tablets: data.s11_sleeping_tablets,
                        s11_drug_or_alcohol: data.s11_drug_or_alcohol,
                        s11_depression: data.s11_depression,
                        s11_panic: data.s11_panic,
                        s11_anxiety: data.s11_anxiety,
                        s11_insomnia: data.s11_insomnia,
                        s11_any_condition: data.s11_any_condition,
                        s11_comments: data.s11_comments,
                        s12_narcolepsy: data.s12_narcolepsy,
                        s12_exhaustion: data.s12_exhaustion,
                        s12_shift_work: data.s12_shift_work,
                        s12_environment: data.s12_environment,
                        s12_very_hot_environment: data.s12_very_hot_environment,
                        s12_illness: data.s12_illness,
                        s12_sweat: data.s12_sweat,
                        s12_hormonal: data.s12_hormonal,
                        s12_stones_or_renal: data.s12_stones_or_renal,
                        s12_comments: data.s12_comments,
                        s13_ever_smoked: data.s13_ever_smoked,
                        many_cigarettes: data.many_cigarettes,
                        s13_start_stop_smoked: data.s13_start_stop_smoked,
                        s13_exercise: data.s13_exercise,
                        s13_aspect: data.s13_aspect,
                        s13_comments: data.s13_comments,
                        s14_tetanus: data.s14_tetanus,
                        s14_helpa_helpb: data.s14_helpa_helpb,
                        s14_comments: data.s14_comments,
                        rmi_physical: data.rmi_physical,
                        rmi_physical_initials: data.rmi_physical_initials,
                        rmi_mental: data.rmi_mental,
                        rmi_mental_initials: data.rmi_mental_initials,
                        rmi_date: data.rmi_date || new Date(),
                        dec_signed: data.dec_signed,
                        dec_witness: data.dec_witness,
                        dec_date: data.dec_date || new Date(),
                        doctor_id: data.doctor_id,
                        created_by: data.created_by,
                        last_updated_by: data.last_updated_by,
                        patient: response[0].patient,
                        doctor: response[0].doctor,
                        company: response[0].company,
                        works: works,
                        medications: medications
                    };

                });
                //begin sec 2
                //click add
                $scope.add_sec2 = function () {
                    if ($scope.count_sec2 < 4) {
                        $scope.info.works.push({
                            "col1": null,
                            "col2": null,
                            "col3": null,
                            "col4": null,
                            "stt": true
                        });
                        ++$scope.count_sec2;
                    }
                };

                //click del
                $scope.del_sec2 = function (index) {
                    $scope.info.works.splice(index, 1);
                    --$scope.count_sec2;
                };
                //end sec 2
                //begin sec 3
                //click add
                $scope.add_sec3 = function () {
                    if ($scope.count_sec3 < 4) {
                        $scope.info.medications.push({
                            "col1": null,
                            "col2": null,
                            "col3": null,
                            "stt": true
                        });
                        ++$scope.count_sec3;
                    }
                };

                //click del
                $scope.del_sec3 = function (index) {
                    $scope.info.medications.splice(index, 1);
                    --$scope.count_sec3;
                };
                //end sec 3
                $scope.resetForm = function () {
                    $scope.info = angular.copy(oriInfo);
                    $scope.mhForm.$setPristine();
                };
                $scope.maxDate = new Date();

                $scope.infoChanged = function () {
                    return !angular.equals(oriInfo, $scope.info);
                };
                $scope.submit = function (mhForm) {
                    //check validate
                    if (mhForm.$error.required || mhForm.$error.maxlength || mhForm.$error.pattern) {
                        toastr.error("Please Input All Required Information!", "Error");
                    } else {
                        var info = $scope.info;
                        console.log(info);
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
    })
;