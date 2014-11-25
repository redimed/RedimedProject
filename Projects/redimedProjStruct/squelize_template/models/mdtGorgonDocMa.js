module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtGorgonDocMa", {
            'GORGON_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'PATIENT_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PHOTO_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'HAND_DOR': { 
    type: DataTypes.INTEGER(11),  
            },
            'HEIGHT': { 
    type: DataTypes.INTEGER(11),  
            },
            'WEIGHT': { 
    type: DataTypes.INTEGER(11),  
            },
            'PROTEIN': { 
    type: DataTypes.INTEGER(11),  
            },
            'GLUCOSE': { 
    type: DataTypes.INTEGER(11),  
            },
            'BLOOD': { 
    type: DataTypes.INTEGER(11),  
            },
            'CANNABIS': { 
    type: DataTypes.INTEGER(11),  
            },
            'OPIATES': { 
    type: DataTypes.INTEGER(11),  
            },
            'AMPHETS': { 
    type: DataTypes.INTEGER(11),  
            },
            'ANCOHOL': { 
    type: DataTypes.INTEGER(11),  
            },
            'BENZOS': { 
    type: DataTypes.INTEGER(11),  
            },
            'COCAIN': { 
    type: DataTypes.INTEGER(11),  
            },
            'METHAMPH': { 
    type: DataTypes.INTEGER(11),  
            },
            'AUDIOGRAM': { 
    type: DataTypes.INTEGER(11),  
            },
            'SPIROMETRY': { 
    type: DataTypes.INTEGER(11),  
            },
            'SPIROMETRY_STATIS': { 
    type: DataTypes.INTEGER(11),  
            },
            'CANDIDATE_EVER': { 
    type: DataTypes.INTEGER(11),  
            },
            'YES_TO_EITHER': { 
    type: DataTypes.INTEGER(11),  
            },
            'SPI_EXAMINERS_COMMENTS': { 
    type: DataTypes.STRING(500),  
            },
            'VA_UNCORRECTED_LEFT': { 
    type: DataTypes.INTEGER(11),  
            },
            'VA_UNCORRECTED_RIGHT': { 
    type: DataTypes.INTEGER(11),  
            },
            'VA_CORRECTED_LEFT': { 
    type: DataTypes.INTEGER(11),  
            },
            'VA_CORRECTED_RIGHT': { 
    type: DataTypes.INTEGER(11),  
            },
            'NV_UNCORRECTED_LEFT': { 
    type: DataTypes.INTEGER(11),  
            },
            'NV_UNCORRECTED_RIGHT': { 
    type: DataTypes.INTEGER(11),  
            },
            'NV_CORRECTED_LEFT': { 
    type: DataTypes.INTEGER(11),  
            },
            'NV_CORRECTED_RIGHT': { 
    type: DataTypes.INTEGER(11),  
            },
            'VF_LEFT': { 
    type: DataTypes.INTEGER(11),  
            },
            'VF_RIGHT': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISHIHARA_RESPONSE': { 
    type: DataTypes.INTEGER(11),  
            },
            'SYSTOLIC_BP': { 
    type: DataTypes.STRING(100),  
            },
            'DIASTOLIC_BP': { 
    type: DataTypes.STRING(100),  
            },
            'PULSE': { 
    type: DataTypes.STRING(100),  
            },
            'HEART_RHYTHM': { 
    type: DataTypes.INTEGER(11),  
            },
            'HEART_SOUNDS': { 
    type: DataTypes.INTEGER(11),  
            },
            'PACEMAKER': { 
    type: DataTypes.INTEGER(11),  
            },
            'CHEST': { 
    type: DataTypes.INTEGER(11),  
            },
            'UPPER_ZONES': { 
    type: DataTypes.INTEGER(11),  
            },
            'LOWER_ZONES': { 
    type: DataTypes.INTEGER(11),  
            },
            'ADDED_SOUNDS': { 
    type: DataTypes.INTEGER(11),  
            },
            'EXTERNAL_CANALS': { 
    type: DataTypes.INTEGER(11),  
            },
            'TYMPANIC_MEMBRANES': { 
    type: DataTypes.INTEGER(11),  
            },
            'ECZEMA': { 
    type: DataTypes.INTEGER(11),  
            },
            'PSORIASIS': { 
    type: DataTypes.INTEGER(11),  
            },
            'TINEA': { 
    type: DataTypes.INTEGER(11),  
            },
            'SOLAR_DAMAGE': { 
    type: DataTypes.INTEGER(11),  
            },
            'FOLLICULITIS': { 
    type: DataTypes.INTEGER(11),  
            },
            'EC_OTHER': { 
    type: DataTypes.INTEGER(11),  
            },
            'SKIN_EXAMINERS_COMMENTS': { 
    type: DataTypes.STRING(500),  
            },
            'SCARS_NIL': { 
    type: DataTypes.INTEGER(11),  
            },
            'SCARS_APPENDIX': { 
    type: DataTypes.INTEGER(11),  
            },
            'SCARS_GALLBLADDER': { 
    type: DataTypes.INTEGER(11),  
            },
            'SCARS_HERNIA': { 
    type: DataTypes.INTEGER(11),  
            },
            'SCARS_OTHER': { 
    type: DataTypes.INTEGER(11),  
            },
            'HERNIAL': { 
    type: DataTypes.INTEGER(11),  
            },
            'HERNIAL_LEFT': { 
    type: DataTypes.INTEGER(11),  
            },
            'HERNIAL_RIGHT': { 
    type: DataTypes.INTEGER(11),  
            },
            'RECTUS': { 
    type: DataTypes.INTEGER(11),  
            },
            'MUSCLE_TONE': { 
    type: DataTypes.INTEGER(11),  
            },
            'MUSCLE_POWER': { 
    type: DataTypes.INTEGER(11),  
            },
            'MUSCLE_WASTING': { 
    type: DataTypes.INTEGER(11),  
            },
            'TREMOR': { 
    type: DataTypes.INTEGER(11),  
            },
            'GAIT': { 
    type: DataTypes.INTEGER(11),  
            },
            'LOWER_LEFT': { 
    type: DataTypes.INTEGER(11),  
            },
            'LOWER_RIGHT': { 
    type: DataTypes.INTEGER(11),  
            },
            'CNS_COMMENTS': { 
    type: DataTypes.STRING(500),  
            },
            'NECK_POSTURE': { 
    type: DataTypes.INTEGER(11),  
            },
            'NECK_RHYTHM': { 
    type: DataTypes.INTEGER(11),  
            },
            'NECK_FLEXION': { 
    type: DataTypes.INTEGER(11),  
            },
            'NECK_EXTENSION': { 
    type: DataTypes.INTEGER(11),  
            },
            'NECK_LATERAL': { 
    type: DataTypes.INTEGER(11),  
            },
            'NECK_ROTATION': { 
    type: DataTypes.INTEGER(11),  
            },
            'BACK_POSTURE': { 
    type: DataTypes.INTEGER(11),  
            },
            'BACK_RHYTHM': { 
    type: DataTypes.INTEGER(11),  
            },
            'BACK_FLEXION': { 
    type: DataTypes.INTEGER(11),  
            },
            'BACK_EXTENSION': { 
    type: DataTypes.INTEGER(11),  
            },
            'BACK_LATERAL': { 
    type: DataTypes.INTEGER(11),  
            },
            'BACK_ROTATION': { 
    type: DataTypes.INTEGER(11),  
            },
            'BACK_EXAMINERS_COMMENTS': { 
    type: DataTypes.STRING(500),  
            },
            'SHOULDER': { 
    type: DataTypes.INTEGER(11),  
            },
            'SHOULDER_PAINFUL': { 
    type: DataTypes.INTEGER(11),  
            },
            'ELBOWS': { 
    type: DataTypes.INTEGER(11),  
            },
            'ELBOWS_PAINFUL': { 
    type: DataTypes.INTEGER(11),  
            },
            'WRISTS': { 
    type: DataTypes.INTEGER(11),  
            },
            'WRISTS_PAINFUL': { 
    type: DataTypes.INTEGER(11),  
            },
            'KNEES': { 
    type: DataTypes.INTEGER(11),  
            },
            'KNEES_PAINFUL': { 
    type: DataTypes.INTEGER(11),  
            },
            'ANKLES': { 
    type: DataTypes.INTEGER(11),  
            },
            'ANKLES_PAINFUL': { 
    type: DataTypes.INTEGER(11),  
            },
            'GRIP_STRENGTH': { 
    type: DataTypes.INTEGER(11),  
            },
            'EPICONDYLES': { 
    type: DataTypes.INTEGER(11),  
            },
            'HEEL_WALK': { 
    type: DataTypes.INTEGER(11),  
            },
            'DUCK_WALK': { 
    type: DataTypes.INTEGER(11),  
            },
            'TOE_WALK': { 
    type: DataTypes.INTEGER(11),  
            },
            'RHOMBERGS': { 
    type: DataTypes.INTEGER(11),  
            },
            'FUTHER_COMMENTS': { 
    type: DataTypes.STRING(500),  
            },
            'LIMB_EXAMINERS_COMMENTS': { 
    type: DataTypes.STRING(500),  
            },
            'GORGON_DATE': { 
    type: DataTypes.DATE,  
            },
            'SIGNATURE': { 
    type: DataTypes.BLOB,  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'CalId': { 
    type: DataTypes.BIGINT(20),  
            },
            'DocId': { 
    type: DataTypes.INTEGER(11),  
            },
            'EXAMINER_NAME': { 
    type: DataTypes.STRING(100),  
            },
            'EXAMINER_ADDRESS': { 
    type: DataTypes.STRING(100),  
            },
            'RIGHT_EAR_500': { 
    type: DataTypes.INTEGER(11),  
            },
            'RIGHT_EAR_1000': { 
    type: DataTypes.INTEGER(11),  
            },
            'RIGHT_EAR_1500': { 
    type: DataTypes.INTEGER(11),  
            },
            'RIGHT_EAR_2000': { 
    type: DataTypes.INTEGER(11),  
            },
            'RIGHT_EAR_3000': { 
    type: DataTypes.INTEGER(11),  
            },
            'RIGHT_EAR_4000': { 
    type: DataTypes.INTEGER(11),  
            },
            'RIGHT_EAR_6000': { 
    type: DataTypes.INTEGER(11),  
            },
            'RIGHT_EAR_8000': { 
    type: DataTypes.INTEGER(11),  
            },
            'LEFT_EAR_500': { 
    type: DataTypes.INTEGER(11),  
            },
            'LEFT_EAR_1000': { 
    type: DataTypes.INTEGER(11),  
            },
            'LEFT_EAR_1500': { 
    type: DataTypes.INTEGER(11),  
            },
            'LEFT_EAR_2000': { 
    type: DataTypes.INTEGER(11),  
            },
            'LEFT_EAR_3000': { 
    type: DataTypes.INTEGER(11),  
            },
            'LEFT_EAR_4000': { 
    type: DataTypes.INTEGER(11),  
            },
            'LEFT_EAR_6000': { 
    type: DataTypes.INTEGER(11),  
            },
            'LEFT_EAR_8000': { 
    type: DataTypes.INTEGER(11),  
            },
            'PRE_BR1_V1': { 
    type: DataTypes.INTEGER(11),  
            },
            'PRE_BR1_V2': { 
    type: DataTypes.INTEGER(11),  
            },
            'PRE_BR1_V3': { 
    type: DataTypes.INTEGER(11),  
            },
            'PRE_BR1_V4': { 
    type: DataTypes.INTEGER(11),  
            },
            'PRE_BR1_V5': { 
    type: DataTypes.INTEGER(11),  
            },
            'PRE_BR1_V6': { 
    type: DataTypes.INTEGER(11),  
            },
            'PRE_BR1_V7': { 
    type: DataTypes.INTEGER(11),  
            },
            'PRE_BR2_V1': { 
    type: DataTypes.INTEGER(11),  
            },
            'PRE_BR2_V2': { 
    type: DataTypes.INTEGER(11),  
            },
            'PRE_BR2_V3': { 
    type: DataTypes.INTEGER(11),  
            },
            'PRE_BR2_V4': { 
    type: DataTypes.INTEGER(11),  
            },
            'PRE_BR2_V5': { 
    type: DataTypes.INTEGER(11),  
            },
            'PRE_BR2_V6': { 
    type: DataTypes.INTEGER(11),  
            },
            'PRE_BR2_V7': { 
    type: DataTypes.INTEGER(11),  
            },
            'PROTEIN_COMMENT': { 
    type: DataTypes.STRING(500),  
            },
            'GLUCOSE_COMMENT': { 
    type: DataTypes.STRING(500),  
            },
            'BLOOD_COMMENT': { 
    type: DataTypes.STRING(500),  
            },
}, {
tableName: "gorgon_doc_ma",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}