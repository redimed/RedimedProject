module.exports = function(sequelize, DataTypes){
    var gorgonMA = sequelize.define('gorgonMA',{
        GORGON_ID : {type:DataTypes.INTEGER(11), primaryKey:true},
        PATIENT_ID : DataTypes.INTEGER(11),
        PHOTO_ID : DataTypes.INTEGER(11),
        HAND_DOR : DataTypes.INTEGER(11),
        HEIGHT : DataTypes.INTEGER(11),
        WEIGHT : DataTypes.INTEGER(11),
        PROTEIN : DataTypes.INTEGER(11),
        GLUCOSE : DataTypes.INTEGER(11),
        BLOOD : DataTypes.INTEGER(11),
        CANNABIS : DataTypes.INTEGER(11),
        OPIATES : DataTypes.INTEGER(11),
        AMPHETS : DataTypes.INTEGER(11),
        ANCOHOL : DataTypes.INTEGER(11),
        BENZOS : DataTypes.INTEGER(11),
        COCAIN : DataTypes.INTEGER(11),
        METHAMPH : DataTypes.INTEGER(11),
        AUDIOGRAM : DataTypes.INTEGER(11),
        SPIROMETRY : DataTypes.INTEGER(11),
        SPIROMETRY_STATIS : DataTypes.INTEGER(11),
        CANDIDATE_EVER : DataTypes.INTEGER(11),
        YES_TO_EITHER : DataTypes.INTEGER(11),
        SPI_EXAMINERS_COMMENTS : DataTypes.STRING(500),
        VA_UNCORRECTED_LEFT : DataTypes.INTEGER(11),
        VA_UNCORRECTED_RIGHT : DataTypes.INTEGER(11),
        VA_CORRECTED_LEFT : DataTypes.INTEGER(11),
        VA_CORRECTED_RIGHT : DataTypes.INTEGER(11),
        NV_UNCORRECTED_LEFT : DataTypes.INTEGER(11),
        NV_UNCORRECTED_RIGHT : DataTypes.INTEGER(11),
        NV_CORRECTED_LEFT : DataTypes.INTEGER(11),
        NV_CORRECTED_RIGHT : DataTypes.INTEGER(11),
        VF_LEFT : DataTypes.INTEGER(11),
        VF_RIGHT : DataTypes.INTEGER(11),
        ISHIHARA_RESPONSE : DataTypes.INTEGER(11),
        SYSTOLIC_BP : DataTypes.STRING(100),
        DIASTOLIC_BP : DataTypes.STRING(100),
        PULSE : DataTypes.STRING(100),
        HEART_RHYTHM : DataTypes.INTEGER(11),
        HEART_SOUNDS : DataTypes.INTEGER(11),
        PACEMAKER : DataTypes.INTEGER(11),
        CHEST : DataTypes.INTEGER(11),
        UPPER_ZONES : DataTypes.INTEGER(11),
        LOWER_ZONES : DataTypes.INTEGER(11),
        ADDED_SOUNDS : DataTypes.INTEGER(11),
        EXTERNAL_CANALS : DataTypes.INTEGER(11),
        TYMPANIC_MEMBRANES : DataTypes.INTEGER(11),
        ECZEMA : DataTypes.INTEGER(11),
        PSORIASIS : DataTypes.INTEGER(11),
        TINEA : DataTypes.INTEGER(11),
        SOLAR_DAMAGE : DataTypes.INTEGER(11),
        FOLLICULITIS : DataTypes.INTEGER(11),
        EC_OTHER : DataTypes.INTEGER(11),
        SKIN_EXAMINERS_COMMENTS : DataTypes.STRING(500),
        SCARS_NIL : DataTypes.INTEGER(11),
        SCARS_APPENDIX : DataTypes.INTEGER(11),
        SCARS_GALLBLADDER : DataTypes.INTEGER(11),
        SCARS_HERNIA : DataTypes.INTEGER(11),
        SCARS_OTHER : DataTypes.INTEGER(11),
        HERNIAL : DataTypes.INTEGER(11),
        HERNIAL_LEFT : DataTypes.INTEGER(11),
        HERNIAL_RIGHT : DataTypes.INTEGER(11),
        RECTUS : DataTypes.INTEGER(11),
        MUSCLE_TONE : DataTypes.INTEGER(11),
        MUSCLE_POWER : DataTypes.INTEGER(11),
        MUSCLE_WASTING : DataTypes.INTEGER(11),
        TREMOR : DataTypes.INTEGER(11),
        GAIT : DataTypes.INTEGER(11),
        LOWER_LEFT : DataTypes.INTEGER(11),
        LOWER_RIGHT : DataTypes.INTEGER(11),
        CNS_COMMENTS : DataTypes.STRING(500),
        NECK_POSTURE : DataTypes.INTEGER(11),
        NECK_RHYTHM : DataTypes.INTEGER(11),
        NECK_FLEXION : DataTypes.INTEGER(11),
        NECK_EXTENSION : DataTypes.INTEGER(11),
        NECK_LATERAL : DataTypes.INTEGER(11),
        NECK_ROTATION : DataTypes.INTEGER(11),
        BACK_POSTURE : DataTypes.INTEGER(11),
        BACK_RHYTHM : DataTypes.INTEGER(11),
        BACK_FLEXION : DataTypes.INTEGER(11),
        BACK_EXTENSION : DataTypes.INTEGER(11),
        BACK_LATERAL : DataTypes.INTEGER(11),
        BACK_ROTATION : DataTypes.INTEGER(11),
        BACK_EXAMINERS_COMMENTS : DataTypes.STRING(500),
        SHOULDER : DataTypes.INTEGER(11),
        SHOULDER_PAINFUL : DataTypes.INTEGER(11),
        ELBOWS : DataTypes.INTEGER(11),
        ELBOWS_PAINFUL : DataTypes.INTEGER(11),
        WRISTS : DataTypes.INTEGER(11),
        WRISTS_PAINFUL : DataTypes.INTEGER(11),
        KNEES : DataTypes.INTEGER(11),
        KNEES_PAINFUL : DataTypes.INTEGER(11),
        ANKLES : DataTypes.INTEGER(11),
        ANKLES_PAINFUL : DataTypes.INTEGER(11),
        GRIP_STRENGTH : DataTypes.INTEGER(11),
        EPICONDYLES : DataTypes.INTEGER(11),
        HEEL_WALK : DataTypes.INTEGER(11),
        DUCK_WALK : DataTypes.INTEGER(11),
        TOE_WALK : DataTypes.INTEGER(11),
        RHOMBERGS : DataTypes.INTEGER(11),
        FUTHER_COMMENTS : DataTypes.STRING(500),
        LIMB_EXAMINERS_COMMENTS : DataTypes.STRING(500),
        GORGON_DATE : DataTypes.DATE,
        SIGNATURE : DataTypes.TEXT,
        Created_by : DataTypes.INTEGER(11),
        //Creation_date : DataTypes.DATE,
        Last_updated_by : DataTypes.INTEGER(11),
        //Last_update_date : DataTypes.DATE,
        CalId : DataTypes.INTEGER(20),
        DocId : DataTypes.INTEGER(11),
        EXAMINER_NAME : DataTypes.STRING(100),
        EXAMINER_ADDRESS : DataTypes.STRING(100),
        RIGHT_EAR_500 : DataTypes.INTEGER(11),
        RIGHT_EAR_1000 : DataTypes.INTEGER(11),
        RIGHT_EAR_1500 : DataTypes.INTEGER(11),
        RIGHT_EAR_2000 : DataTypes.INTEGER(11),
        RIGHT_EAR_3000 : DataTypes.INTEGER(11),
        RIGHT_EAR_4000 : DataTypes.INTEGER(11),
        RIGHT_EAR_6000 : DataTypes.INTEGER(11),
        RIGHT_EAR_8000 : DataTypes.INTEGER(11),
        LEFT_EAR_500 : DataTypes.INTEGER(11),
        LEFT_EAR_1000 : DataTypes.INTEGER(11),
        LEFT_EAR_1500 : DataTypes.INTEGER(11),
        LEFT_EAR_2000 : DataTypes.INTEGER(11),
        LEFT_EAR_3000 : DataTypes.INTEGER(11),
        LEFT_EAR_4000 : DataTypes.INTEGER(11),
        LEFT_EAR_6000 : DataTypes.INTEGER(11),
        LEFT_EAR_8000 : DataTypes.INTEGER(11),
        PRE_BR1_V1 : DataTypes.INTEGER(11),
        PRE_BR1_V2 : DataTypes.INTEGER(11),
        PRE_BR1_V3 : DataTypes.INTEGER(11),
        PRE_BR1_V4 : DataTypes.INTEGER(11),
        PRE_BR1_V5 : DataTypes.INTEGER(11),
        PRE_BR1_V6 : DataTypes.INTEGER(11),
        PRE_BR1_V7 : DataTypes.INTEGER(11),
        PRE_BR2_V1 : DataTypes.INTEGER(11),
        PRE_BR2_V2 : DataTypes.INTEGER(11),
        PRE_BR2_V3 : DataTypes.INTEGER(11),
        PRE_BR2_V4 : DataTypes.INTEGER(11),
        PRE_BR2_V5 : DataTypes.INTEGER(11),
        PRE_BR2_V6 : DataTypes.INTEGER(11),
        PRE_BR2_V7 : DataTypes.INTEGER(11),
        PROTEIN_COMMENT : DataTypes.STRING(500),
        GLUCOSE_COMMENT : DataTypes.STRING(500),
        BLOOD_COMMENT : DataTypes.STRING(500)

    },{
        tableName: 'gorgon_doc_ma', // đặt tên bảng
        createdAt : "Creation_date",
        updatedAt : "Last_update_date"
    });
    return gorgonMA;
};
