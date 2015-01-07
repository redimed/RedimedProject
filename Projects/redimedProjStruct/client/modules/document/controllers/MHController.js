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
                var oriInfo, clearInfo, clearWorks, clearMedications;
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
                clearWorks = works;
                clearMedications = medications;
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
                                "col3": dataTemp.s3_regularly1,
                                "stt": dataTemp.s3_name1 == null ? false : true
                            },
                            {
                                "col1": dataTemp.s3_name2 || null,
                                "col2": dataTemp.s3_reason2 || null,
                                "col3": dataTemp.s3_regularly2,
                                "stt": dataTemp.s3_name2 == null ? false : true
                            },
                            {
                                "col1": dataTemp.s3_name3 || null,
                                "col2": dataTemp.s3_reason3 || null,
                                "col3": dataTemp.s3_regularly3,
                                "stt": dataTemp.s3_name3 == null ? false : true
                            },
                            {
                                "col1": dataTemp.s3_name4 || null,
                                "col2": dataTemp.s3_reason4 || null,
                                "col3": dataTemp.s3_regularly4,
                                "stt": dataTemp.s3_name4 == null ? false : true
                            },
                            {
                                "col1": dataTemp.s3_name5 || null,
                                "col2": dataTemp.s3_reason5 || null,
                                "col3": dataTemp.s3_regularly5,
                                "stt": dataTemp.s3_name5 == null ? false : true
                            },
                            {
                                "col1": dataTemp.s3_name6 || null,
                                "col2": dataTemp.s3_reason6 || null,
                                "col3": dataTemp.s3_regularly6,
                                "stt": dataTemp.s3_name6 == null ? false : true
                            }];
                        //check again value works
                        for (var i = 0; i <= works.length - 1; i++) {
                            if (works[i].stt == false) {
                                works.splice(i, 1);
                                i--;
                            }
                        }
                        //check again value works
                        for (var j = 0; j <= medications.length - 1; j++) {
                            if (medications[j].stt == false) {
                                medications.splice(j, 1);
                                j--;
                            }
                        }
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
                        mh_id: data.mh_id || null,
                        patient_id: patient_id,
                        cal_id: cal_id,

                        s2_occupation1: data.s2_occupation1 || null,
                        s2_startdate1: data.s2_startdate1 || null,
                        s2_enddate1: data.s2_enddate1 || null,
                        s2_employ1: data.s2_employ1 || null,

                        s2_occupation2: data.s2_occupation2 || null,
                        s2_startdate2: data.s2_startdate2 || null,
                        s2_enddate2: data.s2_enddate2 || null,
                        s2_employ2: data.s2_employ2 || null,

                        s2_occupation3: data.s2_occupation3 || null,
                        s2_startdate3: data.s2_startdate3 || null,
                        s2_enddate3: data.s2_enddate3 || null,
                        s2_employ3: data.s2_employ3 || null,

                        s2_occupation4: data.s2_occupation4 || null,
                        s2_startdate4: data.s2_startdate4 || null,
                        s2_enddate4: data.s2_enddate4 || null,
                        s2_employ4: data.s2_employ4 || null,

                        s2_occupation5: data.s2_occupation5 || null,
                        s2_startdate5: data.s2_startdate5 || null,
                        s2_enddate5: data.s2_enddate5 || null,
                        s2_employ5: data.s2_employ5 || null,

                        s2_samework: data.s2_samework || null,
                        s2_sameworkenvironment: data.s2_sameworkenvironment || null,
                        s2_comments: data.s2_comments || null,

                        s3_name1: data.s3_name1 || null,
                        s3_reason1: data.s3_reason1 || null,
                        s3_regularly1: data.s3_regularly1 || null,

                        s3_name2: data.s3_name2 || null,
                        s3_reason2: data.s3_reason2 || null,
                        s3_regularly2: data.s3_regularly2 || null,

                        s3_name3: data.s3_name3 || null,
                        s3_reason3: data.s3_reason3 || null,
                        s3_regularly3: data.s3_regularly3 || null,

                        s3_name4: data.s3_name4 || null,
                        s3_reason4: data.s3_reason4 || null,
                        s3_regularly4: data.s3_regularly4 || null,

                        s3_name5: data.s3_name5 || null,
                        s3_reason5: data.s3_reason5 || null,
                        s3_regular5: data.s3_regularly5 || null,

                        s3_comments: data.s3_comments || null,
                        s4_concerning: data.s4_concerning || null,
                        s4_weight_altered: data.s4_weight_altered || null,
                        s4_medicaltreatment: data.s4_medicaltreatment || null,
                        s4_hospital: data.s4_hospital || null,
                        s4_stranfustion: data.s4_stranfustion || null,
                        s4_diabetes: data.s4_diabetes || null,
                        s4_pressure: data.s4_pressure || null,
                        s4_asthma: data.s4_asthma || null,
                        s4_emphysema: data.s4_emphysema || null,
                        s4_veins: data.s4_veins || null,
                        s4_epilepsy: data.s4_epilepsy || null,
                        s4_episodes: data.s4_episodes || null,
                        s4_cancer_or_tumour: data.s4_cancer_or_tumour || null,
                        s4_concussion_or_headinjury: data.s4_concussion_or_headinjury || null,
                        s4_migraine: data.s4_migraine || null,
                        s4_eczema: data.s4_eczema || null,
                        s4_hepatitis: data.s4_hepatitis || null,
                        s4_desease: data.s4_desease || null,
                        s4_hormonal: data.s4_hormonal || null,
                        s4_allergies: data.s4_allergies || null,
                        s4_comments: data.s4_comments || null,
                        s5_disease: data.s5_disease || null,
                        s5_claim: data.s5_claim || null,
                        s5_claim_comment: data.s5_claim_comment || null,
                        s5_lodged: data.s5_lodged || null,
                        s5_closed: data.s5_closed || null,
                        s5_duties: data.s5_duties || null,
                        s5_sickness: data.s5_sickness || null,
                        s5_equipment: data.s5_equipment || null,
                        s5_chermicals: data.s5_chermicals || null,
                        s5_noise: data.s5_noise || null,
                        s5_radiation: data.s5_radiation || null,
                        s5_dust: data.s5_dust || null,
                        s5_asbestos: data.s5_asbestos || null,
                        s5_solvents: data.s5_solvents || null,
                        s5_other: data.s5_other || null,
                        s5_comments: data.s5_comments || null,
                        s6_neck: data.s6_neck || null,
                        s6_shoulder: data.s6_shoulder || null,
                        s6_elbow: data.s6_elbow || null,
                        s6_wrist_or_hand: data.s6_wrist_or_hand || null,
                        s6_lower_black: data.s6_lower_black || null,
                        s6_hip: data.s6_hip || null,
                        s6_knee: data.s6_knee || null,
                        s6_ankle_or_foot: data.s6_ankle_or_foot || null,
                        s6_comments1: data.s6_comments1 || null,
                        s6_cervical: data.s6_cervical || null,
                        s6_lower: data.s6_lower || null,
                        s6_sciatica: data.s6_sciatica || null,
                        s6_pins_needles: data.s6_pins_needles || null,
                        s6_muscle_aches_pains: data.s6_muscle_aches_pains || null,
                        s6_joint_aches_pains: data.s6_joint_aches_pains || null,
                        s6_comments2: data.s6_comments2 || null,
                        s6_rsi: data.s6_rsi || null,
                        s6_tennis: data.s6_tennis || null,
                        s6_carpal: data.s6_carpal || null,
                        s6_hernia: data.s6_hernia || null,
                        s6_osteoarthritis: data.s6_osteoarthritis || null,
                        s6_arthritis: data.s6_arthritis || null,
                        s6_osteoporosis: data.s6_osteoporosis || null,
                        s6_fibromyalgia: data.s6_fibromyalgia || null,
                        s6_fractured_bones: data.s6_fractured_bones || null,
                        s6_affects: data.s6_affects || null,
                        s6_joint_or_bones: data.s6_joint_or_bones || null,
                        s6_comments3: data.s6_comments3 || null,
                        s7_directfamily: data.s7_directfamily || null,
                        s7_undergone: data.s7_undergone || null,
                        s7_conditions: data.s7_conditions || null,
                        s7_disease: data.s7_disease || null,
                        s7_murmurs: data.s7_murmurs || null,
                        s7_palpitations: data.s7_palpitations || null,
                        s7_angina: data.s7_angina || null,
                        s7_blood_presure: data.s7_blood_presure || null,
                        s7_comments: data.s7_comments || null,
                        s8_exercise: data.s8_exercise || null,
                        s8_asthma: data.s8_asthma || null,
                        s8_emphysema: data.s8_emphysema || null,
                        s8_hay_fever: data.s8_hay_fever || null,
                        s8_tuberculosis: data.s8_tuberculosis || null,
                        s8_obstructive: data.s8_obstructive || null,
                        s8_disease: data.s8_disease || null,
                        s8_rheumatic_fever: data.s8_rheumatic_fever || null,
                        s8_bronchitis: data.s8_bronchitis || null,
                        s8_coughed_blood: data.s8_coughed_blood || null,
                        s8_shortness: data.s8_shortness || null,
                        s8_comments: data.s8_comments || null,
                        s9_hearing: data.s9_hearing || null,
                        s9_infections_or_discharge: data.s9_infections_or_discharge || null,
                        s9_hearing_aid: data.s9_hearing_aid || null,
                        s9_injury_or_condition: data.s9_injury_or_condition || null,
                        s9_near_or_distance: data.s9_near_or_distance || null,
                        s9_color_blind: data.s9_color_blind || null,
                        s9_eyes_or_ears: data.s9_eyes_or_ears || null,
                        s9_comments: data.s9_comments || null,
                        s10_indigestion: data.s10_indigestion || null,
                        s10_vomited_blood: data.s10_vomited_blood || null,
                        s10_bowel_habit: data.s10_bowel_habit || null,
                        s10_time_you_urinate: data.s10_time_you_urinate || null,
                        s10_night_to_urinate: data.s10_night_to_urinate || null,
                        s10_start_stop_urine: data.s10_start_stop_urine || null,
                        s10_change_urine: data.s10_change_urine || null,
                        s10_comments: data.s10_comments || null,
                        s11_medicaltion_or_counselling: data.s11_medicaltion_or_counselling || null,
                        s11_psychologist_or_psychiatrist: data.s11_psychologist_or_psychiatrist || null,
                        s11_sleeping_tablets: data.s11_sleeping_tablets || null,
                        s11_drug_or_alcohol: data.s11_drug_or_alcohol || null,
                        s11_depression: data.s11_depression || null,
                        s11_panic: data.s11_panic || null,
                        s11_anxiety: data.s11_anxiety || null,
                        s11_insomnia: data.s11_insomnia || null,
                        s11_any_condition: data.s11_any_condition || null,
                        s11_comments: data.s11_comments || null,
                        s12_narcolepsy: data.s12_narcolepsy || null,
                        s12_exhaustion: data.s12_exhaustion || null,
                        s12_shift_work: data.s12_shift_work || null,
                        s12_environment: data.s12_environment || null,
                        s12_very_hot_environment: data.s12_very_hot_environment || null,
                        s12_illness: data.s12_illness || null,
                        s12_sweat: data.s12_sweat || null,
                        s12_hormonal: data.s12_hormonal || null,
                        s12_stones_or_renal: data.s12_stones_or_renal || null,
                        s12_comments: data.s12_comments || null,
                        s13_ever_smoked: data.s13_ever_smoked || null,
                        s13_many_cigarettes: data.s13_many_cigarettes || null,
                        s13_start_stop_smoked: data.s13_start_stop_smoked || null,
                        s13_exercise: data.s13_exercise || null,
                        s13_aspect: data.s13_aspect || null,
                        s13_comments: data.s13_comments || null,
                        s14_tetanus: data.s14_tetanus || null,
                        s14_helpa_helpb: data.s14_helpa_helpb || null,
                        s14_comments: data.s14_comments || null,
                        rmi_physical: data.rmi_physical || null,
                        rmi_physical_initials: data.rmi_physical_initials || null,
                        rmi_mental: data.rmi_mental || null,
                        rmi_mental_initials: data.rmi_mental_initials || null,
                        rmi_date: data.rmi_date || new Date(),
                        dec_signed: data.dec_signed || null,
                        dec_witness: data.dec_witness || null,
                        dec_date: data.dec_date || new Date(),
                        doctor_id: response[0].doctor.doctor_id || null,
                        created_by: data.created_by || null,
                        last_updated_by: data.last_updated_by || null,
                        patient: response[0].patient || [],
                        doctor: response[0].doctor || [],
                        company: response[0].company || [],
                        works: works || [],
                        medications: medications || []
                    };
                    oriInfo = angular.copy($scope.info);
                    if ($scope.isNew) {
                        clearInfo = angular.copy($scope.info);
                    }
                    else {
                        clearInfo = {
                            mh_id: $scope.info.mh_id || null,
                            patient_id: patient_id,
                            cal_id: cal_id,
                            s2_occupation1: null,
                            s2_startdate1: null,
                            s2_enddate1: null,
                            s2_employ1: null,

                            s2_occupation2: null,
                            s2_startdate2: null,
                            s2_enddate2: null,
                            s2_employ2: null,

                            s2_occupation3: null,
                            s2_startdate3: null,
                            s2_enddate3: null,
                            s2_employ3: null,

                            s2_occupation4: null,
                            s2_startdate4: null,
                            s2_enddate4: null,
                            s2_employ4: null,

                            s2_occupation5: null,
                            s2_startdate5: null,
                            s2_enddate5: null,
                            s2_employ5: null,

                            s2_samework: null,
                            s2_sameworkenvironment: null,
                            s2_comments: null,

                            s3_name1: null,
                            s3_reason1: null,
                            s3_regularly1: null,

                            s3_name2: null,
                            s3_reason2: null,
                            s3_regularly2: null,

                            s3_name3: null,
                            s3_reason3: null,
                            s3_regularly3: null,

                            s3_name4: null,
                            s3_reason4: null,
                            s3_regularly4: null,

                            s3_name5: null,
                            s3_reason5: null,
                            s3_regular5: null,

                            s3_comments: null,
                            s4_concerning: null,
                            s4_weight_altered: null,
                            s4_medicaltreatment: null,
                            s4_hospital: null,
                            s4_stranfustion: null,
                            s4_diabetes: null,
                            s4_pressure: null,
                            s4_asthma: null,
                            s4_emphysema: null,
                            s4_veins: null,
                            s4_epilepsy: null,
                            s4_episodes: null,
                            s4_cancer_or_tumour: null,
                            s4_concussion_or_headinjury: null,
                            s4_migraine: null,
                            s4_eczema: null,
                            s4_hepatitis: null,
                            s4_desease: null,
                            s4_hormonal: null,
                            s4_allergies: null,
                            s4_comments: null,
                            s5_disease: null,
                            s5_claim: null,
                            s5_claim_comment: null,
                            s5_lodged: null,
                            s5_closed: null,
                            s5_duties: null,
                            s5_sickness: null,
                            s5_equipment: null,
                            s5_chermicals: null,
                            s5_noise: null,
                            s5_radiation: null,
                            s5_dust: null,
                            s5_asbestos: null,
                            s5_solvents: null,
                            s5_other: null,
                            s5_comments: null,
                            s6_neck: null,
                            s6_shoulder: null,
                            s6_elbow: null,
                            s6_wrist_or_hand: null,
                            s6_lower_black: null,
                            s6_hip: null,
                            s6_knee: null,
                            s6_ankle_or_foot: null,
                            s6_comments1: null,
                            s6_cervical: null,
                            s6_lower: null,
                            s6_sciatica: null,
                            s6_pins_needles: null,
                            s6_muscle_aches_pains: null,
                            s6_joint_aches_pains: null,
                            s6_comments2: null,
                            s6_rsi: null,
                            s6_tennis: null,
                            s6_carpal: null,
                            s6_hernia: null,
                            s6_osteoarthritis: null,
                            s6_arthritis: null,
                            s6_osteoporosis: null,
                            s6_fibromyalgia: null,
                            s6_fractured_bones: null,
                            s6_affects: null,
                            s6_joint_or_bones: null,
                            s6_comments3: null,
                            s7_directfamily: null,
                            s7_undergone: null,
                            s7_conditions: null,
                            s7_disease: null,
                            s7_murmurs: null,
                            s7_palpitations: null,
                            s7_angina: null,
                            s7_blood_presure: null,
                            s7_comments: null,
                            s8_exercise: null,
                            s8_asthma: null,
                            s8_emphysema: null,
                            s8_hay_fever: null,
                            s8_tuberculosis: null,
                            s8_obstructive: null,
                            s8_disease: null,
                            s8_rheumatic_fever: null,
                            s8_bronchitis: null,
                            s8_coughed_blood: null,
                            s8_shortness: null,
                            s8_comments: null,
                            s9_hearing: null,
                            s9_infections_or_discharge: null,
                            s9_hearing_aid: null,
                            s9_injury_or_condition: null,
                            s9_near_or_distance: null,
                            s9_color_blind: null,
                            s9_eyes_or_ears: null,
                            s9_comments: null,
                            s10_indigestion: null,
                            s10_vomited_blood: null,
                            s10_bowel_habit: null,
                            s10_time_you_urinate: null,
                            s10_night_to_urinate: null,
                            s10_start_stop_urine: null,
                            s10_change_urine: null,
                            s10_comments: null,
                            s11_medicaltion_or_counselling: null,
                            s11_psychologist_or_psychiatrist: null,
                            s11_sleeping_tablets: null,
                            s11_drug_or_alcohol: null,
                            s11_depression: null,
                            s11_panic: null,
                            s11_anxiety: null,
                            s11_insomnia: null,
                            s11_any_condition: null,
                            s11_comments: null,
                            s12_narcolepsy: null,
                            s12_exhaustion: null,
                            s12_shift_work: null,
                            s12_environment: null,
                            s12_very_hot_environment: null,
                            s12_illness: null,
                            s12_sweat: null,
                            s12_hormonal: null,
                            s12_stones_or_renal: null,
                            s12_comments: null,
                            s13_ever_smoked: null,
                            s13_many_cigarettes: null,
                            s13_start_stop_smoked: null,
                            s13_exercise: null,
                            s13_aspect: null,
                            s13_comments: null,
                            s14_tetanus: null,
                            s14_helpa_helpb: null,
                            s14_comments: null,
                            rmi_physical: null,
                            rmi_physical_initials: null,
                            rmi_mental: null,
                            rmi_mental_initials: null,
                            rmi_date: new Date(),
                            dec_signed: null,
                            dec_witness: null,
                            dec_date: new Date(),
                            doctor_id: null,
                            created_by: null,
                            last_updated_by: null,
                            patient: $scope.info.patient || [],
                            doctor: $scope.info.doctor || [],
                            company: $scope.info.company || [],
                            works: clearWorks,
                            medications: clearMedications
                        };
                    }
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
                    if ($scope.count_sec3 < 5) {
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
                //clearForm
                $scope.clearForm = function () {
                    $scope.info = angular.copy(clearInfo);
                    $scope.mhForm.$setPristine();
                };
                $scope.infoChanged = function () {
                    return !angular.equals(oriInfo, $scope.info);
                };
                $scope.infoClear = function () {
                    return !angular.equals(clearInfo, $scope.info);
                };
                $scope.submit = function (mhForm) {
                    //check validate
                    if (mhForm.$error.required || mhForm.$error.maxlength || mhForm.$error.pattern) {
                        toastr.error("Please Input All Required Information!", "Error");
                    } else {
                        var info = $scope.info;
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