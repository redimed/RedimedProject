
module.exports = function(sequelize, DataTypes){
    var docMA = sequelize.define('docMA',{
        "MA_ID": {type:DataTypes.INTEGER(11), primaryKey:true},
        "PATIENT_ID": DataTypes.INTEGER(20),
        "CAL_ID": DataTypes.INTEGER(11),
        "STICKER" : DataTypes.STRING(500),
        "HEIGHT": DataTypes.FLOAT,
        "WEIGHT": DataTypes.FLOAT,
        "BMI" : DataTypes.FLOAT,
        "WAIST": DataTypes.FLOAT,
        "HIP": DataTypes.FLOAT,
        "WHR": DataTypes.FLOAT,
        "IS_BMI": DataTypes.INTEGER(11),
        "BLOOD_SEC1": DataTypes.INTEGER(11),
        "IS_BLOOD": DataTypes.INTEGER(11),
        "RESTING_HEART_RATE": DataTypes.INTEGER(11),
        "IS_RESTING_HEART_RATE": DataTypes.INTEGER(11),
        "HEART_SOUNDS": DataTypes.INTEGER(11),
        "PERIPHERAL": DataTypes.INTEGER(11),
        "VEINS_OTHER": DataTypes.INTEGER(11),
        "COMMENT_SEC1" : DataTypes.STRING(500),
        "RIGHT_DIST": DataTypes.INTEGER(11),
        "RIGHT_DIST_CORRECT": DataTypes.INTEGER(11),
        "LEFT_DIST": DataTypes.INTEGER(11),
        "LEFT_DIST_CORRECT": DataTypes.INTEGER(11),
        "RIGHT_NEAR": DataTypes.INTEGER(11),
        "RIGHT_NEAR_CORRECT": DataTypes.INTEGER(11),
        "LEFT_NEAR": DataTypes.INTEGER(11),
        "LEFT_NEAR_CORRECT": DataTypes.INTEGER(11),
        "COLOUR_SEC2": DataTypes.INTEGER(11),
        "SCORE_SEC2": DataTypes.INTEGER(11),
        "PERIPHERAL_SEC2": DataTypes.INTEGER(11),
        "VISUAL_AIDS": DataTypes.INTEGER(11),
        "COMMENT_SEC2" : DataTypes.STRING(500),
        "PROTEIN": DataTypes.INTEGER(11),
        "GLUCOSE": DataTypes.INTEGER(11),
        "BLOOD": DataTypes.INTEGER(11),
        "BLOOD_SUGAR_LEVEL" : DataTypes.INTEGER(11),
        "COMMENT_SEC3" : DataTypes.STRING(500),
        "SPIROMETRY": DataTypes.INTEGER(11),
        "SYMMETRICAL": DataTypes.INTEGER(11),
        "AUSCULTATION": DataTypes.INTEGER(11),
        "EARS": DataTypes.INTEGER(11),
        "HEARING": DataTypes.INTEGER(11),
        "NOSE": DataTypes.INTEGER(11),
        "THROAT": DataTypes.INTEGER(11),
        "TEETH_GUMS": DataTypes.INTEGER(11),
        "SKIN": DataTypes.INTEGER(11),
        "DRUG": DataTypes.INTEGER(11),
        "NAIL": DataTypes.INTEGER(11),
        "SCAR": DataTypes.INTEGER(11),
        "ABDOMEN": DataTypes.INTEGER(11),
        "HERNIAL": DataTypes.INTEGER(11),
        "LIVER": DataTypes.INTEGER(11),
        "SPLEEN": DataTypes.INTEGER(11),
        "KIDNEYS": DataTypes.INTEGER(11),
        "BALANCE": DataTypes.INTEGER(11),
        "COORDINATION": DataTypes.INTEGER(11),
        "LYMPH": DataTypes.INTEGER(11),
        "THYROID": DataTypes.INTEGER(11),
        "COMMENT_SEC4" : DataTypes.STRING(500),
        "COMMENT_SEC5" : DataTypes.STRING(500),
        "COMMENT_SEC6" : DataTypes.STRING(500),
        "COMMENT_SEC7" : DataTypes.STRING(500),
        "COMMENT_SEC8" : DataTypes.STRING(500),
        "COMMENT_SEC9" : DataTypes.STRING(500),
        "AGE": DataTypes.INTEGER(11),
        "HYPER": DataTypes.INTEGER(11),
        "SMOKER": DataTypes.INTEGER(11),
        "KNOW": DataTypes.INTEGER(11),
        "SEDENTARY": DataTypes.INTEGER(11),
        "FAMILY": DataTypes.INTEGER(11),
        "HISTORY": DataTypes.INTEGER(11),
        "OBESITY": DataTypes.INTEGER(11),
        "RISK": DataTypes.INTEGER(11),
        "ECG": DataTypes.INTEGER(11),
        "ECG_RESULT": DataTypes.INTEGER(11),
        "GP": DataTypes.INTEGER(11),
        "COMMENT_SEC10" : DataTypes.STRING(500),
        "DOCTOR_ID" : DataTypes.INTEGER(11),
        "Created_by": DataTypes.INTEGER(11),
        "Creation_date": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE,
        "DF_CODE"  : DataTypes.STRING(10),
        "ISENABLE": DataTypes.INTEGER(11)
    },{
        tableName: 'doc_ma', // đặt tên bảng
        createdAt : "Creation_date",
        updatedAt : "Last_update_date"
    });
    return docMA;
};