/**
 * Created by thanh on 10/8/2014.
 */
var db = require('../../models');

//Begin table module
var MedicalHistory = db.MedicalHistory;
var Patient = db.Patient;
var Doctor = db.Doctor;
var APPTCAL = db.APPTCAL;
var Company = db.Company;
//End table module


module.exports = {
    loadMH: function (req, res) {
        var info = req.body.info || [];
        var patient_id = info.patient_id;
        var cal_id = info.cal_id;
        //load doc medical history
        MedicalHistory.find({where: {cal_id: cal_id, patient_id: patient_id}}, {raw: true})
            .success(function (data) {
                //check patient
                Patient.find({where: {Patient_id: patient_id}}, {raw: true})
                    .success(function (patient) {
                        if (patient == null || patient.length == 0) {
                            console.log("******************* Find not found patient in cln_patient table *******************");
                            res.json({status: 'fail'});
                            return false;
                        }
                        //check appt
                        APPTCAL.find({where: {cal_id: cal_id}}, {raw: true})
                            .success(function (appt) {
                                if (appt == null || appt.length == 0) {
                                    console.log("******************* Find not found appt in appt table *******************");
                                    res.json({status: 'fail'});
                                    return false;
                                }
                                Company.find({where: {id: patient.company_id}}, {raw: true})
                                    .success(function (company) {
                                        //check company
                                        if (company == null || company.length == 0) {
                                            console.log("******************* Find not found company in company table *******************");
                                        }
                                        //check doctor
                                        Doctor.find({where: {doctor_id: appt.DOCTOR_ID}})
                                            .success(function (doctor) {
                                                if (doctor == null || doctor.length == 0) {
                                                    console.log("******************* Find not found doctor in doctor table *******************");
                                                    res.json({status: 'fail'});
                                                    return false;
                                                }
                                                var status = "findFound";
                                                if (data == null || data.length == 0) {
                                                    status = "findNull";
                                                }
                                                var response = [{
                                                    "data": data || [],
                                                    "patient": patient,
                                                    "appt": appt,
                                                    "doctor": doctor,
                                                    "company": company || [],
                                                    "status": status
                                                }];
                                                res.json(response);
                                                return true;
                                            })
                                            .error(function (err) {
                                                console.log("*******************" + err + "*******************");
                                                res.json({status: 'fail'});
                                                return false;
                                            });
                                    })
                                    .error(function (err) {
                                        console.log("*******************" + err + "*******************");
                                        res.json({status: 'fail'});
                                        return false;
                                    });
                            })
                            .error(function (err) {
                                console.log("*******************" + err + "*******************");
                                res.json({status: 'fail'});
                                return false;
                            });
                    })
                    .error(function (err) {
                        console.log("*******************" + err + "*******************");
                        res.json({status: 'fail'});
                        return false;
                    });
            })
            .error(function (err) {
                console.log("*******************" + err + "*******************");
                res.json({status: 'fail'});
                return false;
            });
    },
    insertMH: function (req, res) {
        var info = req.body.info || [];
        MedicalHistory.create({
            patient_id: info.patient_id,
            cal_id: info.cal_id,
            s1_relationship: info.s1_relationship,
            s1_job_location: info.s1_job_location,
            s2_occupation1: info.works[0] != undefined ? info.works[0].col1 : null,
            s2_startdate1: info.works[0] != undefined ? info.works[0].col2 : null,
            s2_enddate1: info.works[0] != undefined ? info.works[0].col3 : null,
            s2_employ1: info.works[0] != undefined ? info.works[0].col4 : null,

            s2_occupation2: info.works[1] != undefined ? info.works[1].col1 : null,
            s2_startdate2: info.works[1] != undefined ? info.works[1].col2 : null,
            s2_enddate2: info.works[1] != undefined ? info.works[1].col3 : null,
            s2_employ2: info.works[1] != undefined ? info.works[1].col4 : null,

            s2_occupation3: info.works[2] != undefined ? info.works[2].col1 : null,
            s2_startdate3: info.works[2] != undefined ? info.works[2].col2 : null,
            s2_enddate3: info.works[2] != undefined ? info.works[2].col3 : null,
            s2_employ3: info.works[2] != undefined ? info.works[2].col4 : null,

            s2_occupation4: info.works[3] != undefined ? info.works[3].col1 : null,
            s2_startdate4: info.works[3] != undefined ? info.works[3].col2 : null,
            s2_enddate4: info.works[3] != undefined ? info.works[3].col3 : null,
            s2_employ4: info.works[3] != undefined ? info.works[3].col4 : null,

            s2_occupation5: info.works[4] != undefined ? info.works[4].col1 : null,
            s2_startdate5: info.works[4] != undefined ? info.works[4].col2 : null,
            s2_enddate5: info.works[4] != undefined ? info.works[4].col3 : null,
            s2_employ5: info.works[4] != undefined ? info.works[4].col4 : null,

            s2_samework: info.s2_samework,
            s2_sameworkenvironment: info.s2_sameworkenvironment,
            s2_comments: info.s2_comments,

            s3_name1: info.medications[0] != undefined ? info.medications[0].col1 : null,
            s3_reason1: info.medications[0] != undefined ? info.medications[0].col2 : null,
            s3_regularly1: info.medications[0] != undefined ? info.medications[0].col3 : null,

            s3_name2: info.medications[1] != undefined ? info.medications[1].col1 : null,
            s3_reason2: info.medications[1] != undefined ? info.medications[1].col2 : null,
            s3_regularly2: info.medications[1] != undefined ? info.medications[1].col3 : null,

            s3_name3: info.medications[2] != undefined ? info.medications[2].col1 : null,
            s3_reason3: info.medications[2] != undefined ? info.medications[2].col2 : null,
            s3_regularly3: info.medications[2] != undefined ? info.medications[2].col3 : null,

            s3_name4: info.medications[3] != undefined ? info.medications[3].col1 : null,
            s3_reason4: info.medications[3] != undefined ? info.medications[3].col2 : null,
            s3_regularly4: info.medications[3] != undefined ? info.medications[3].col3 : null,

            s3_name5: info.medications[4] != undefined ? info.medications[4].col1 : null,
            s3_reason5: info.medications[4] != undefined ? info.medications[4].col2 : null,
            s3_regular5: info.medications[4] != undefined ? info.medications[4].col3 : null,

            s3_name6: info.medications[5] != undefined ? info.medications[5].col1 : null,
            s3_reason6: info.medications[5] != undefined ? info.medications[5].col2 : null,
            s3_regular6: info.medications[5] != undefined ? info.medications[5].col3 : null,

            s3_comments: info.s3_comments,
            s4_concerning: info.s4_concerning,
            s4_weight_altered: info.s4_weight_altered,
            s4_medicaltreatment: info.s4_medicaltreatment,
            s4_hospital: info.s4_hospital,
            s4_stranfustion: info.s4_stranfustion,
            s4_diabetes: info.s4_diabetes,
            s4_pressure: info.s4_pressure,
            s4_asthma: info.s4_asthma,
            s4_emphysema: info.s4_emphysema,
            s4_veins: info.s4_veins,
            s4_epilepsy: info.s4_epilepsy,
            s4_episodes: info.s4_episodes,
            s4_cancer_or_tumour: info.s4_cancer_or_tumour,
            s4_concussion_or_headinjury: info.s4_concussion_or_headinjury,
            s4_migraine: info.s4_migraine,
            s4_eczema: info.s4_eczema,
            s4_hepatitis: info.s4_hepatitis,
            s4_desease: info.s4_desease,
            s4_hormonal: info.s4_hormonal,
            s4_allergies: info.s4_allergies,
            s4_comments: info.s4_comments,
            s5_disease: info.s5_disease,
            s5_claim: info.s5_claim,
            s5_claim_comment: info.s5_claim_comment,
            s5_lodged: info.s5_lodged,
            s5_closed: info.s5_closed,
            s5_duties: info.s5_duties,
            s5_sickness: info.s5_sickness,
            s5_equipment: info.s5_equipment,
            s5_chermicals: info.s5_chermicals,
            s5_noise: info.s5_noise,
            s5_radiation: info.s5_radiation,
            s5_dust: info.s5_dust,
            s5_asbestos: info.s5_asbestos,
            s5_solvents: info.s5_solvents,
            s5_other: info.s5_other,
            s5_comments: info.s5_comments,
            s6_neck: info.s6_neck,
            s6_shoulder: info.s6_shoulder,
            s6_elbow: info.s6_elbow,
            s6_wrist_or_hand: info.s6_wrist_or_hand,
            s6_lower_black: info.s6_lower_black,
            s6_hip: info.s6_hip,
            s6_knee: info.s6_knee,
            s6_ankle_or_foot: info.s6_ankle_or_foot,
            s6_comments1: info.s6_comments1,
            s6_cervical: info.s6_cervical,
            s6_lower: info.s6_lower,
            s6_sciatica: info.s6_sciatica,
            s6_pins_needles: info.s6_pins_needles,
            s6_muscle_aches_pains: info.s6_muscle_aches_pains,
            s6_joint_aches_pains: info.s6_joint_aches_pains,
            s6_comments2: info.s6_comments2,
            s6_rsi: info.s6_rsi,
            s6_tennis: info.s6_tennis,
            s6_carpal: info.s6_carpal,
            s6_hernia: info.s6_hernia,
            s6_osteoarthritis: info.s6_osteoarthritis,
            s6_arthritis: info.s6_arthritis,
            s6_osteoporosis: info.s6_osteoporosis,
            s6_fibromyalgia: info.s6_fibromyalgia,
            s6_fractured_bones: info.s6_fractured_bones,
            s6_affects: info.s6_affects,
            s6_joint_or_bones: info.s6_joint_or_bones,
            s6_comments3: info.s6_comments3,
            s7_directfamily: info.s7_directfamily,
            s7_undergone: info.s7_undergone,
            s7_conditions: info.s7_conditions,
            s7_disease: info.s7_disease,
            s7_murmurs: info.s7_murmurs,
            s7_palpitations: info.s7_palpitations,
            s7_angina: info.s7_angina,
            s7_blood_presure: info.s7_blood_presure,
            s7_comments: info.s7_comments,
            s8_exercise: info.s8_exercise,
            s8_asthma: info.s8_asthma,
            s8_emphysema: info.s8_emphysema,
            s8_hay_fever: info.s8_hay_fever,
            s8_tuberculosis: info.s8_tuberculosis,
            s8_obstructive: info.s8_obstructive,
            s8_disease: info.s8_disease,
            s8_rheumatic_fever: info.s8_rheumatic_fever,
            s8_bronchitis: info.s8_bronchitis,
            s8_coughed_blood: info.s8_coughed_blood,
            s8_shortness: info.s8_shortness,
            s8_comments: info.s8_comments,
            s9_hearing: info.s9_hearing,
            s9_infections_or_discharge: info.s9_infections_or_discharge,
            s9_hearing_aid: info.s9_hearing_aid,
            s9_injury_or_condition: info.s9_injury_or_condition,
            s9_near_or_distance: info.s9_near_or_distance,
            s9_color_blind: info.s9_color_blind,
            s9_eyes_or_ears: info.s9_eyes_or_ears,
            s9_comments: info.s9_comments,
            s10_indigestion: info.s10_indigestion,
            s10_vomited_blood: info.s10_vomited_blood,
            s10_bowel_habit: info.s10_bowel_habit,
            s10_time_you_urinate: info.s10_time_you_urinate,
            s10_night_to_urinate: info.s10_night_to_urinate,
            s10_start_stop_urine: info.s10_start_stop_urine,
            s10_change_urine: info.s10_change_urine,
            s10_comments: info.s10_comments,
            s11_medicaltion_or_counselling: info.s11_medicaltion_or_counselling,
            s11_psychologist_or_psychiatrist: info.s11_psychologist_or_psychiatrist,
            s11_sleeping_tablets: info.s11_sleeping_tablets,
            s11_drug_or_alcohol: info.s11_drug_or_alcohol,
            s11_depression: info.s11_depression,
            s11_panic: info.s11_panic,
            s11_anxiety: info.s11_anxiety,
            s11_insomnia: info.s11_insomnia,
            s11_any_condition: info.s11_any_condition,
            s11_comments: info.s11_comments,
            s12_narcolepsy: info.s12_narcolepsy,
            s12_exhaustion: info.s12_exhaustion,
            s12_shift_work: info.s12_shift_work,
            s12_environment: info.s12_environment,
            s12_very_hot_environment: info.s12_very_hot_environment,
            s12_illness: info.s12_illness,
            s12_sweat: info.s12_sweat,
            s12_hormonal: info.s12_hormonal,
            s12_stones_or_renal: info.s12_stones_or_renal,
            s12_comments: info.s12_comments,
            s13_each_date: info.s13_each_date,
            s13_one_date: info.s13_one_date,
            s13_ever_smoked: info.s13_ever_smoked,
            s13_many_cigarettes: info.s13_many_cigarettes,
            s13_start_stop_smoked: info.s13_start_stop_smoked,
            s13_exercise: info.s13_exercise,
            s13_aspect: info.s13_aspect,
            s13_comments: info.s13_comments,
            s14_tetanus: info.s14_tetanus,
            s14_helpa_helpb: info.s14_helpa_helpb,
            s14_comments: info.s14_comments,
            rmi_physical: info.rmi_physical,
            rmi_physical_initials: info.rmi_physical == 1 ? info.rmi_physical_initials : null,
            rmi_mental: info.rmi_mental,
            rmi_mental_initials: info.rmi_mental == 1 ? info.rmi_mental_initials : null,
            rmi_date: info.rmi_date || new Date(),
            rmi_witness: info.rmi_witness,
            rmi_signed_witness: info.rmi_signed_witness,
            dec_signed: info.dec_signed,
            dec_witness: info.dec_witness,
            dec_signed_witness: info.dec_signed_witness,
            dec_date: info.dec_date || new Date(),
            doctor_id: info.doctor_id,
            created_by: info.created_by,
            last_updated_by: info.last_updated_by
        }, {
            raw: true
        })
            .success(function () {
                Patient.update({
                    Sur_name: info.patient.Sur_name,
                    First_name: info.patient.First_name,
                    DOB: info.patient.DOB,
                    Sex: info.patient.Sex,
                    Address1: info.patient.Address1,
                    Post_code: info.patient.Post_code,
                    Home_phone: info.patient.Home_phone,
                    Email: info.patient.Email,
                    NOK_Emerg_Contact: info.patient.NOK_Emerg_Contact,
                    NOK_Phone: info.patient.NOK_Phone,
                    Occupation: info.patient.Occupation,
                    Addr: info.patient.Addr
                }, {Patient_id: info.patient_id})
                    .success(function () {
                        res.json({
                            status: 'success'
                        });
                        return true;
                    })
                    .error(function (err) {
                        console.log('******************' + err + '******************');
                        res.json({
                            status: 'fail'
                        });
                        return false;
                    });
            })
            .error(function (err) {
                console.log('******************' + err + '******************');
                res.json({
                    status: 'fail'
                });
                return false;
            });
    },
    editMH: function (req, res) {
        var info = req.body.info || [];
        MedicalHistory.update({
            patient_id: info.patient_id,
            cal_id: info.cal_id,
            s1_relationship: info.s1_relationship,
            s1_job_location: info.s1_job_location,
            s2_occupation1: info.works[0] != undefined ? info.works[0].col1 : null,
            s2_startdate1: info.works[0] != undefined ? info.works[0].col2 : null,
            s2_enddate1: info.works[0] != undefined ? info.works[0].col3 : null,
            s2_employ1: info.works[0] != undefined ? info.works[0].col4 : null,

            s2_occupation2: info.works[1] != undefined ? info.works[1].col1 : null,
            s2_startdate2: info.works[1] != undefined ? info.works[1].col2 : null,
            s2_enddate2: info.works[1] != undefined ? info.works[1].col3 : null,
            s2_employ2: info.works[1] != undefined ? info.works[1].col4 : null,

            s2_occupation3: info.works[2] != undefined ? info.works[2].col1 : null,
            s2_startdate3: info.works[2] != undefined ? info.works[2].col2 : null,
            s2_enddate3: info.works[2] != undefined ? info.works[2].col3 : null,
            s2_employ3: info.works[2] != undefined ? info.works[2].col4 : null,

            s2_occupation4: info.works[3] != undefined ? info.works[3].col1 : null,
            s2_startdate4: info.works[3] != undefined ? info.works[3].col2 : null,
            s2_enddate4: info.works[3] != undefined ? info.works[3].col3 : null,
            s2_employ4: info.works[3] != undefined ? info.works[3].col4 : null,

            s2_occupation5: info.works[4] != undefined ? info.works[4].col1 : null,
            s2_startdate5: info.works[4] != undefined ? info.works[4].col2 : null,
            s2_enddate5: info.works[4] != undefined ? info.works[4].col3 : null,
            s2_employ5: info.works[4] != undefined ? info.works[4].col4 : null,

            s2_samework: info.s2_samework,
            s2_sameworkenvironment: info.s2_sameworkenvironment,
            s2_comments: info.s2_comments,

            s3_name1: info.medications[0] != undefined ? info.medications[0].col1 : null,
            s3_reason1: info.medications[0] != undefined ? info.medications[0].col2 : null,
            s3_regularly1: info.medications[0] != undefined ? info.medications[0].col3 : null,

            s3_name2: info.medications[1] != undefined ? info.medications[1].col1 : null,
            s3_reason2: info.medications[1] != undefined ? info.medications[1].col2 : null,
            s3_regularly2: info.medications[1] != undefined ? info.medications[1].col3 : null,

            s3_name3: info.medications[2] != undefined ? info.medications[2].col1 : null,
            s3_reason3: info.medications[2] != undefined ? info.medications[2].col2 : null,
            s3_regularly3: info.medications[2] != undefined ? info.medications[2].col3 : null,

            s3_name4: info.medications[3] != undefined ? info.medications[3].col1 : null,
            s3_reason4: info.medications[3] != undefined ? info.medications[3].col2 : null,
            s3_regularly4: info.medications[3] != undefined ? info.medications[3].col3 : null,

            s3_name5: info.medications[4] != undefined ? info.medications[4].col1 : null,
            s3_reason5: info.medications[4] != undefined ? info.medications[4].col2 : null,
            s3_regular5: info.medications[4] != undefined ? info.medications[4].col3 : null,

            s3_name6: info.medications[5] != undefined ? info.medications[5].col1 : null,
            s3_reason6: info.medications[5] != undefined ? info.medications[5].col2 : null,
            s3_regular6: info.medications[5] != undefined ? info.medications[5].col3 : null,

            s3_comments: info.s3_comments,
            s4_concerning: info.s4_concerning,
            s4_weight_altered: info.s4_weight_altered,
            s4_medicaltreatment: info.s4_medicaltreatment,
            s4_hospital: info.s4_hospital,
            s4_stranfustion: info.s4_stranfustion,
            s4_diabetes: info.s4_diabetes,
            s4_pressure: info.s4_pressure,
            s4_asthma: info.s4_asthma,
            s4_emphysema: info.s4_emphysema,
            s4_veins: info.s4_veins,
            s4_epilepsy: info.s4_epilepsy,
            s4_episodes: info.s4_episodes,
            s4_cancer_or_tumour: info.s4_cancer_or_tumour,
            s4_concussion_or_headinjury: info.s4_concussion_or_headinjury,
            s4_migraine: info.s4_migraine,
            s4_eczema: info.s4_eczema,
            s4_hepatitis: info.s4_hepatitis,
            s4_desease: info.s4_desease,
            s4_hormonal: info.s4_hormonal,
            s4_allergies: info.s4_allergies,
            s4_comments: info.s4_comments,
            s5_disease: info.s5_disease,
            s5_claim: info.s5_claim,
            s5_claim_comment: info.s5_claim_comment,
            s5_lodged: info.s5_lodged,
            s5_closed: info.s5_closed,
            s5_duties: info.s5_duties,
            s5_sickness: info.s5_sickness,
            s5_equipment: info.s5_equipment,
            s5_chermicals: info.s5_chermicals,
            s5_noise: info.s5_noise,
            s5_radiation: info.s5_radiation,
            s5_dust: info.s5_dust,
            s5_asbestos: info.s5_asbestos,
            s5_solvents: info.s5_solvents,
            s5_other: info.s5_other,
            s5_comments: info.s5_comments,
            s6_neck: info.s6_neck,
            s6_shoulder: info.s6_shoulder,
            s6_elbow: info.s6_elbow,
            s6_wrist_or_hand: info.s6_wrist_or_hand,
            s6_lower_black: info.s6_lower_black,
            s6_hip: info.s6_hip,
            s6_knee: info.s6_knee,
            s6_ankle_or_foot: info.s6_ankle_or_foot,
            s6_comments1: info.s6_comments1,
            s6_cervical: info.s6_cervical,
            s6_lower: info.s6_lower,
            s6_sciatica: info.s6_sciatica,
            s6_pins_needles: info.s6_pins_needles,
            s6_muscle_aches_pains: info.s6_muscle_aches_pains,
            s6_joint_aches_pains: info.s6_joint_aches_pains,
            s6_comments2: info.s6_comments2,
            s6_rsi: info.s6_rsi,
            s6_tennis: info.s6_tennis,
            s6_carpal: info.s6_carpal,
            s6_hernia: info.s6_hernia,
            s6_osteoarthritis: info.s6_osteoarthritis,
            s6_arthritis: info.s6_arthritis,
            s6_osteoporosis: info.s6_osteoporosis,
            s6_fibromyalgia: info.s6_fibromyalgia,
            s6_fractured_bones: info.s6_fractured_bones,
            s6_affects: info.s6_affects,
            s6_joint_or_bones: info.s6_joint_or_bones,
            s6_comments3: info.s6_comments3,
            s7_directfamily: info.s7_directfamily,
            s7_undergone: info.s7_undergone,
            s7_conditions: info.s7_conditions,
            s7_disease: info.s7_disease,
            s7_murmurs: info.s7_murmurs,
            s7_palpitations: info.s7_palpitations,
            s7_angina: info.s7_angina,
            s7_blood_presure: info.s7_blood_presure,
            s7_comments: info.s7_comments,
            s8_exercise: info.s8_exercise,
            s8_asthma: info.s8_asthma,
            s8_emphysema: info.s8_emphysema,
            s8_hay_fever: info.s8_hay_fever,
            s8_tuberculosis: info.s8_tuberculosis,
            s8_obstructive: info.s8_obstructive,
            s8_disease: info.s8_disease,
            s8_rheumatic_fever: info.s8_rheumatic_fever,
            s8_bronchitis: info.s8_bronchitis,
            s8_coughed_blood: info.s8_coughed_blood,
            s8_shortness: info.s8_shortness,
            s8_comments: info.s8_comments,
            s9_hearing: info.s9_hearing,
            s9_infections_or_discharge: info.s9_infections_or_discharge,
            s9_hearing_aid: info.s9_hearing_aid,
            s9_injury_or_condition: info.s9_injury_or_condition,
            s9_near_or_distance: info.s9_near_or_distance,
            s9_color_blind: info.s9_color_blind,
            s9_eyes_or_ears: info.s9_eyes_or_ears,
            s9_comments: info.s9_comments,
            s10_indigestion: info.s10_indigestion,
            s10_vomited_blood: info.s10_vomited_blood,
            s10_bowel_habit: info.s10_bowel_habit,
            s10_time_you_urinate: info.s10_time_you_urinate,
            s10_night_to_urinate: info.s10_night_to_urinate,
            s10_start_stop_urine: info.s10_start_stop_urine,
            s10_change_urine: info.s10_change_urine,
            s10_comments: info.s10_comments,
            s11_medicaltion_or_counselling: info.s11_medicaltion_or_counselling,
            s11_psychologist_or_psychiatrist: info.s11_psychologist_or_psychiatrist,
            s11_sleeping_tablets: info.s11_sleeping_tablets,
            s11_drug_or_alcohol: info.s11_drug_or_alcohol,
            s11_depression: info.s11_depression,
            s11_panic: info.s11_panic,
            s11_anxiety: info.s11_anxiety,
            s11_insomnia: info.s11_insomnia,
            s11_any_condition: info.s11_any_condition,
            s11_comments: info.s11_comments,
            s12_narcolepsy: info.s12_narcolepsy,
            s12_exhaustion: info.s12_exhaustion,
            s12_shift_work: info.s12_shift_work,
            s12_environment: info.s12_environment,
            s12_very_hot_environment: info.s12_very_hot_environment,
            s12_illness: info.s12_illness,
            s12_sweat: info.s12_sweat,
            s12_hormonal: info.s12_hormonal,
            s12_stones_or_renal: info.s12_stones_or_renal,
            s12_comments: info.s12_comments,
            s13_each_date: info.s13_each_date,
            s13_one_date: info.s13_one_date,
            s13_ever_smoked: info.s13_ever_smoked,
            s13_many_cigarettes: info.s13_many_cigarettes,
            s13_start_stop_smoked: info.s13_start_stop_smoked,
            s13_exercise: info.s13_exercise,
            s13_aspect: info.s13_aspect,
            s13_comments: info.s13_comments,
            s14_tetanus: info.s14_tetanus,
            s14_helpa_helpb: info.s14_helpa_helpb,
            s14_comments: info.s14_comments,
            rmi_physical: info.rmi_physical,
            rmi_physical_initials: info.rmi_physical == 1 ? info.rmi_physical_initials : null,
            rmi_mental: info.rmi_mental,
            rmi_mental_initials: info.rmi_mental == 1 ? info.rmi_mental_initials : null,
            rmi_date: info.rmi_date || new Date(),
            rmi_witness: info.rmi_witness,
            rmi_signed_witness: info.rmi_signed_witness,
            dec_signed: info.dec_signed,
            dec_witness: info.dec_witness,
            dec_signed_witness: info.dec_signed_witness,
            dec_date: info.dec_date || new Date(),
            doctor_id: info.doctor_id,
            created_by: info.created_by,
            last_updated_by: info.last_updated_by
        }, {
            mh_id: info.mh_id
        })
            .success(function () {
                Patient.update({
                    Sur_name: info.patient.Sur_name,
                    First_name: info.patient.First_name,
                    DOB: info.patient.DOB,
                    Sex: info.patient.Sex,
                    Address1: info.patient.Address1,
                    Post_code: info.patient.Post_code,
                    Home_phone: info.patient.Home_phone,
                    Email: info.patient.Email,
                    NOK_Emerg_Contact: info.patient.NOK_Emerg_Contact,
                    NOK_Phone: info.patient.NOK_Phone,
                    Occupation: info.patient.Occupation,
                    Addr: info.patient.Addr
                }, {Patient_id: info.patient_id})
                    .success(function () {
                        res.json({
                            status: 'success'
                        });
                        return true;
                    })
                    .error(function (err) {
                        console.log('******************' + err + '******************');
                        res.json({
                            status: 'fail'
                        });
                        return false;
                    });
            })
            .error(function (err) {
                console.log('******************' + err + '******************');
                res.json({
                    status: 'fail'
                });
                return false;
            });
    }
};