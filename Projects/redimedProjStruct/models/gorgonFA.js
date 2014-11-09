module.exports = function(sequelize, DataTypes){
    var gorgonFA = sequelize.define('gorgonFA',{
        "id" : {type:DataTypes.INTEGER(11), primaryKey:true},
        "patientId" : DataTypes.INTEGER(11),
        "fName" : DataTypes.STRING(200),
        "JAF" : DataTypes.STRING(200),
        "DOB" : DataTypes.DATE,
        "DOA" : DataTypes.DATE,
        "IsConsentReason"  : DataTypes.INTEGER(11),
        "fsign": DataTypes.BLOB,
        "fsignDate" : DataTypes.DATE,
        "Estimated" : DataTypes.INTEGER(11),
        "EstimatedComments" : DataTypes.STRING(200),
        "MS_HeartConditions" : DataTypes.INTEGER(11),
        "MS_HeartConditions_Comment" : DataTypes.STRING(200),
        "MS_Lung_Asthma" : DataTypes.INTEGER(11),
        "MS_Lung__Asthma_Comment" : DataTypes.STRING(200),
        "MS_Diabetes" : DataTypes.INTEGER(11),
        "MS_Diabetes_Comment" : DataTypes.STRING(200),
        "MS_Fits" : DataTypes.INTEGER(11),
        "MS_Fits_Comment" : DataTypes.STRING(200),
        "MS_Medication" : DataTypes.INTEGER(11),
        "MS_Medication_Comment" : DataTypes.STRING(200),
        "MS_Other" : DataTypes.INTEGER(11),
        "MS_Other_Comment" : DataTypes.STRING(200),
        "MS_ie_Comment" : DataTypes.STRING(200),
        "MS_Mx_Heart_Rage_1" : DataTypes.INTEGER(11),
        "MS_Mx_Heart_Rage_2" : DataTypes.FLOAT,
        "MS_Mx_Weight_1" : DataTypes.INTEGER(11),
        "MS_MX_Weight_2" : DataTypes.FLOAT,
        "MS_Blood_Pressure_1" : DataTypes.INTEGER(11),
        "MS_Blood_Pressure_2" : DataTypes.INTEGER(11),
        "MS_Resting_Heart_Rate" : DataTypes.INTEGER(11),
        "1Rom_Neck"  : DataTypes.INTEGER(11),
        "1Rom_Thoracic"  : DataTypes.INTEGER(11),
        "1Rom_Lumbar"  : DataTypes.INTEGER(11),
        "1Rom_Shoulder"  : DataTypes.INTEGER(11),
        "1Rom_Elbow"  : DataTypes.INTEGER(11),
        "1Rom_Wrist"  : DataTypes.INTEGER(11),
        "1Rom_Fingers"  : DataTypes.INTEGER(11),
        "1Rom_Hips"  : DataTypes.INTEGER(11),
        "1Rom_Knees"  : DataTypes.INTEGER(11),
        "1Rom_Ankles"  : DataTypes.INTEGER(11),
        "1Rom_Comments" : DataTypes.STRING(200),
        "1Rom_Total"  : DataTypes.INTEGER(11),
        "2Heart_Rate_30S"  : DataTypes.INTEGER(11),
        "2Heart_Rate_1M"  : DataTypes.INTEGER(11),
        "2Heart_Rate_1M_30S"  : DataTypes.INTEGER(11),
        "2Heart_Rate_2M"  : DataTypes.INTEGER(11),
        "2Heart_Rate_2M_30S"  : DataTypes.INTEGER(11),
        "2Heart_Rate_3M"  : DataTypes.INTEGER(11),
        "2Heart_Rate_1M_Post"  : DataTypes.INTEGER(11),
        "2Step_Result"  : DataTypes.INTEGER(11),
        "2Step_Correct"  : DataTypes.INTEGER(11),
        "2Comments" : DataTypes.STRING(200),
        "2Total"  : DataTypes.INTEGER(11),
        "3a_Right" : DataTypes.FLOAT,
        "3a_Left" : DataTypes.FLOAT,
        "3b_Right" : DataTypes.FLOAT,
        "3b_Left" : DataTypes.FLOAT,
        "3c_Grip"  : DataTypes.INTEGER(11),
        "3c_Right"  : DataTypes.INTEGER(11),
        "3c_Left"  : DataTypes.INTEGER(11),
        "3c_Result"  : DataTypes.INTEGER(11),
        "3d_Push_ups_total"  : DataTypes.INTEGER(11),
        "3d_Result"  : DataTypes.INTEGER(11),
        "3e_total"  : DataTypes.INTEGER(11),
        "3e_Result"  : DataTypes.INTEGER(11),
        "3Comments" : DataTypes.STRING(200),
        "3Total" : DataTypes.FLOAT,
        "4aSec"  : DataTypes.INTEGER(11),
        "4aResult"  : DataTypes.INTEGER(11),
        "4bTotal"  : DataTypes.INTEGER(11),
        "4bCrepitus"  : DataTypes.INTEGER(11),
        "4bResult"  : DataTypes.INTEGER(11),
        "4cKneeling"  : DataTypes.INTEGER(11),
        "4cResult"  : DataTypes.INTEGER(11),
        "4Comments" : DataTypes.STRING(200),
        "4Total"  : DataTypes.INTEGER(11),
        "5aPosture"  : DataTypes.INTEGER(11),
        "5bHoverResult" : DataTypes.FLOAT,
        "5cStrenght"  : DataTypes.INTEGER(11),
        "5cResult" : DataTypes.FLOAT,
        "5dTotal"  : DataTypes.INTEGER(11),
        "5dResult" : DataTypes.FLOAT,
        "5eWaitesBow"  : DataTypes.INTEGER(11),
        "5eResult" : DataTypes.FLOAT,
        "5fRight" : DataTypes.FLOAT,
        "5fLeft" : DataTypes.FLOAT,
        "5gRight" : DataTypes.FLOAT,
        "5gFloat" : DataTypes.FLOAT,
        "5Total" : DataTypes.FLOAT,
        "6aMax"  : DataTypes.INTEGER(11),
        "6aResult"  : DataTypes.INTEGER(11),
        "6bMax"  : DataTypes.INTEGER(11),
        "6bResult"  : DataTypes.INTEGER(11),
        "6c_1"  : DataTypes.INTEGER(11),
        "6c_1Comment" : DataTypes.STRING(200),
        "6c_2"  : DataTypes.INTEGER(11),
        "6c_2Comment" : DataTypes.STRING(200),
        "6c_3"  : DataTypes.INTEGER(11),
        "6c_3Comment" : DataTypes.STRING(200),
        "6c_4"  : DataTypes.INTEGER(11),
        "6c_4Comment" : DataTypes.STRING(200),
        "6c_5"  : DataTypes.INTEGER(11),
        "6c_5Comment" : DataTypes.STRING(200),
        "6Comments" : DataTypes.STRING(200),
        "6Total"  : DataTypes.INTEGER(11),
        "Score1Comment" : DataTypes.STRING(200),
        "Score2Comment" : DataTypes.STRING(200),
        "Score3Comment" : DataTypes.STRING(200),
        "Score4Comment" : DataTypes.STRING(200),
        "Score5Comment" : DataTypes.STRING(200),
        "Score6Comment" : DataTypes.STRING(200),
        "Score7Comment" : DataTypes.STRING(200),
        "Score8Comment" : DataTypes.STRING(200),
        "FCAToTal": DataTypes.FLOAT,
        "FCAResult" : DataTypes.INTEGER(11),
        "LEPDC" : DataTypes.INTEGER(11),
        "LAPC" : DataTypes.INTEGER(11),
        "LComment" : DataTypes.STRING(200),
        "Lsign": DataTypes.BLOB,
        "LDate" : DataTypes.DATE,
        "LName" : DataTypes.STRING(200),
        "LPosition" : DataTypes.STRING(200),
        "Created_by" : DataTypes.INTEGER(11),
        "Creation_date" : DataTypes.DATE,
        "Last_updated_by" : DataTypes.INTEGER(11),
        "Last_update_date" : DataTypes.DATE,
        "CalId": DataTypes.INTEGER(20),
        "DocId" : DataTypes.INTEGER(11)

    },{
        tableName: 'gorgon_doc_fca', // đặt tên bảng
        timestamps: false // đặt false để ko tự động tạo các cột timestamp
    });
    return gorgonFA;
};

