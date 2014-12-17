module.exports = function (sequelize, DataTypes) {
    var MedicalHistory = sequelize.define('MedicalHistory', {
        "mh_id": {
            type: DataTypes.INTEGER(11),
            primaryKey: true
        },
        "patient_id": DataTypes.INTEGER(11),
        "cal_id": DataTypes.INTEGER(11),
        "s2_occupation1": DataTypes.STRING(200),
        "s2_startdate1": DataTypes.DATE,
        "s2_enddate1": DataTypes.DATE,
        "s2_employ1": DataTypes.STRING(200),
        "s2_occupation2": DataTypes.STRING(200),
        "s2_startdate2": DataTypes.DATE,
        "s2_enddate2": DataTypes.DATE,
        "s2_employ2": DataTypes.STRING(200),
        "s2_occupation3": DataTypes.STRING(200),
        "s2_startdate3": DataTypes.DATE,
        "s2_enddate3": DataTypes.DATE,
        "s2_employ3": DataTypes.STRING(200),
        "s2_occupation4": DataTypes.STRING(200),
        "s2_startdate4": DataTypes.DATE,
        "s2_enddate4": DataTypes.DATE,
        "s2_employ4": DataTypes.STRING(200),
        "s2_occupation5": DataTypes.STRING(200),
        "s2_startdate5": DataTypes.DATE,
        "s2_enddate5": DataTypes.DATE,
        "s2_employ5": DataTypes.STRING(200),
        "s2_samework": DataTypes.INTEGER(11),
        "s2_sameworkenvironment": DataTypes.INTEGER(11),
        "s2_comments": DataTypes.STRING(500),
        "s3_name1": DataTypes.STRING(200),
        "s3_reason1": DataTypes.STRING(200),
        "s3_regularly1": DataTypes.INTEGER(11),
        "s3_name2": DataTypes.STRING(200),
        "s3_reason2": DataTypes.STRING(200),
        "s3_regularly2": DataTypes.INTEGER(11),
        "s3_name3": DataTypes.STRING(200),
        "s3_reason3": DataTypes.STRING(200),
        "s3_regularly3": DataTypes.INTEGER(11),
        "s3_name4": DataTypes.STRING(200),
        "s3_reason4": DataTypes.STRING(200),
        "s3_regularly4": DataTypes.INTEGER(11),
        "s3_name5": DataTypes.STRING(200),
        "s3_reason5": DataTypes.STRING(200),
        "s3_regularly5": DataTypes.INTEGER(11),
        "s3_name6": DataTypes.STRING(200),
        "s3_reason6": DataTypes.STRING(200),
        "s3_regularly6": DataTypes.INTEGER(11),
        "s3_comments": DataTypes.STRING(500),
        "s4_concerning": DataTypes.INTEGER(11),
        "s4_weight_altered": DataTypes.INTEGER(11),
        "s4_medicaltreatment": DataTypes.INTEGER(11),
        "s4_hospital": DataTypes.INTEGER(11),
        "s4_stranfustion": DataTypes.INTEGER(11),
        "s4_diabetes": DataTypes.INTEGER(11),
        "s4_pressure": DataTypes.INTEGER(11),
        "s4_asthma": DataTypes.INTEGER(11),
        "s4_emphysema": DataTypes.INTEGER(11),
        "s4_veins": DataTypes.INTEGER(11),
        "s4_epilepsy": DataTypes.INTEGER(11),
        "s4_episodes": DataTypes.INTEGER(11),
        "s4_cancer_or_tumour": DataTypes.INTEGER(11),
        "s4_concussion_or_headinjury": DataTypes.INTEGER(11),
        "s4_migraine": DataTypes.INTEGER(11),
        "s4_eczema": DataTypes.INTEGER(11),
        "s4_hepatitis": DataTypes.INTEGER(11),
        "s4_desease": DataTypes.INTEGER(11),
        "s4_hormonal": DataTypes.INTEGER(11),
        "s4_allergies": DataTypes.INTEGER(11),
        "s4_comments": DataTypes.STRING(500),
        "s5_disease": DataTypes.INTEGER(11),
        "s5_claim": DataTypes.INTEGER(11),
        "s5_claim_comment": DataTypes.STRING(200),
        "s5_lodged": DataTypes.STRING(200),
        "s5_closed": DataTypes.STRING(200),
        "s5_duties": DataTypes.INTEGER(11),
        "s5_sickness": DataTypes.INTEGER(11),
        "s5_equipment": DataTypes.INTEGER(11),
        "s5_chermicals": DataTypes.INTEGER(11),
        "s5_noise": DataTypes.INTEGER(11),
        "s5_radiation": DataTypes.INTEGER(11),
        "s5_dust": DataTypes.INTEGER(11),
        "s5_asbestos": DataTypes.INTEGER(11),
        "s5_solvents": DataTypes.INTEGER(11),
        "s5_other": DataTypes.INTEGER(11),
        "s5_comments": DataTypes.STRING(500),
        "s6_neck": DataTypes.INTEGER(11),
        "s6_shoulder": DataTypes.INTEGER(11),
        "s6_elbow": DataTypes.INTEGER(11),
        "s6_wrist_or_hand": DataTypes.INTEGER(11),
        "s6_lower_black": DataTypes.INTEGER(11),
        "s6_hip": DataTypes.INTEGER(11),
        "s6_knee": DataTypes.INTEGER(11),
        "s6_ankle_or_foot": DataTypes.INTEGER(11),
        "s6_comments1": DataTypes.STRING(500),
        "s6_cervical": DataTypes.INTEGER(11),
        "s6_lower": DataTypes.INTEGER(11),
        "s6_sciatica": DataTypes.INTEGER(11),
        "s6_pins_needles": DataTypes.INTEGER(11),
        "s6_muscle_aches_pains": DataTypes.INTEGER(11),
        "s6_joint_aches_pains": DataTypes.INTEGER(11),
        "s6_comments2": DataTypes.STRING(500),
        "s6_rsi": DataTypes.INTEGER(11),
        "s6_tennis": DataTypes.INTEGER(11),
        "s6_carpal": DataTypes.INTEGER(11),
        "s6_hernia": DataTypes.INTEGER(11),
        "s6_osteoarthritis": DataTypes.INTEGER(11),
        "s6_arthritis": DataTypes.INTEGER(11),
        "s6_osteoporosis": DataTypes.INTEGER(11),
        "s6_fibromyalgia": DataTypes.INTEGER(11),
        "s6_fractured_bones": DataTypes.INTEGER(11),
        "s6_affects": DataTypes.INTEGER(11),
        "s6_joint_or_bones": DataTypes.INTEGER(11),
        "s6_comments3": DataTypes.STRING(500),
        "s7_directfamily": DataTypes.INTEGER(11),
        "s7_undergone": DataTypes.INTEGER(11),
        "s7_conditions": DataTypes.INTEGER(11),
        "s7_disease": DataTypes.INTEGER(11),
        "s7_murmurs": DataTypes.INTEGER(11),
        "s7_palpitations": DataTypes.INTEGER(11),
        "s7_angina": DataTypes.INTEGER(11),
        "s7_blood_presure": DataTypes.INTEGER(11),
        "s7_comments": DataTypes.STRING(500),
        "s8_exercise": DataTypes.INTEGER(11),
        "s8_asthma": DataTypes.INTEGER(11),
        "s8_emphysema": DataTypes.INTEGER(11),
        "s8_hay_fever": DataTypes.INTEGER(11),
        "s8_tuberculosis": DataTypes.INTEGER(11),
        "s8_obstructive": DataTypes.INTEGER(11),
        "s8_disease": DataTypes.INTEGER(11),
        "s8_rheumatic_fever": DataTypes.INTEGER(11),
        "s8_bronchitis": DataTypes.INTEGER(11),
        "s8_coughed_blood": DataTypes.INTEGER(11),
        "s8_shortness": DataTypes.INTEGER(11),
        "s8_comments": DataTypes.STRING(500),
        "s9_hearing": DataTypes.INTEGER(11),
        "s9_infections_or_discharge": DataTypes.INTEGER(11),
        "s9_hearing_aid": DataTypes.INTEGER(11),
        "s9_injury_or_condition": DataTypes.INTEGER(11),
        "s9_near_or_distance": DataTypes.INTEGER(11),
        "s9_color_blind": DataTypes.INTEGER(11),
        "s9_eyes_or_ears": DataTypes.INTEGER(11),
        "s9_comments": DataTypes.STRING(500),
        "s10_indigestion": DataTypes.INTEGER(11),
        "s10_vomited_blood": DataTypes.INTEGER(11),
        "s10_bowel_habit": DataTypes.INTEGER(11),
        "s10_time_you_urinate": DataTypes.INTEGER(11),
        "s10_night_to_urinate": DataTypes.INTEGER(11),
        "s10_start_stop_urine": DataTypes.INTEGER(11),
        "s10_change_urine": DataTypes.INTEGER(11),
        "s10_comments": DataTypes.STRING(500),
        "s11_medicaltion_or_counselling": DataTypes.INTEGER(11),
        "s11_psychologist_or_psychiatrist": DataTypes.INTEGER(11),
        "s11_sleeping_tablets": DataTypes.INTEGER(11),
        "s11_drug_or_alcohol": DataTypes.INTEGER(11),
        "s11_depression": DataTypes.INTEGER(11),
        "s11_panic": DataTypes.INTEGER(11),
        "s11_anxiety": DataTypes.INTEGER(11),
        "s11_insomnia": DataTypes.INTEGER(11),
        "s11_any_condition": DataTypes.INTEGER(11),
        "s11_comments": DataTypes.STRING(500),
        "s12_narcolepsy": DataTypes.INTEGER(11),
        "s12_exhaustion": DataTypes.INTEGER(11),
        "s12_shift_work": DataTypes.INTEGER(11),
        "s12_environment": DataTypes.INTEGER(11),
        "s12_very_hot_environment": DataTypes.INTEGER(11),
        "s12_illness": DataTypes.INTEGER(11),
        "s12_sweat": DataTypes.INTEGER(11),
        "s12_hormonal": DataTypes.INTEGER(11),
        "s12_stones_or_renal": DataTypes.INTEGER(11),
        "s12_comments": DataTypes.STRING(500),
        "s13_ever_smoked": DataTypes.INTEGER(11),
        "s13_many_cigarettes": DataTypes.INTEGER(11),
        "s13_start_stop_smoked": DataTypes.STRING(200),
        "s13_exercise": DataTypes.INTEGER(11),
        "s13_aspect": DataTypes.INTEGER(11),
        "s13_comments": DataTypes.STRING(500),
        "s14_tetanus": DataTypes.INTEGER(11),
        "s14_helpa_helpb": DataTypes.INTEGER(11),
        "s14_comments": DataTypes.STRING(500),
        "rmi_physical": DataTypes.INTEGER(11),
        "rmi_physical_initials": DataTypes.STRING(200),
        "rmi_mental": DataTypes.INTEGER(11),
        "rmi_mental_initials": DataTypes.STRING(200),
        "rmi_date": DataTypes.DATE,
        "dec_signed": DataTypes.TEXT,
        "dec_witness": DataTypes.STRING(200),
        "dec_date": DataTypes.DATE,
        "doctor_id": DataTypes.INTEGER(11),
        "created_by": DataTypes.INTEGER(11),
        "creation_date": DataTypes.DATE,
        "last_updated_by": DataTypes.INTEGER(11),
        "last_update_date": DataTypes.DATE
    }, {
        tableName: 'medical_history',
        createdAt: 'creation_date',
        updatedAt: 'last_update_date'
    });
    return MedicalHistory;
};