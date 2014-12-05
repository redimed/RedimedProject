

module.exports = function(sequelize, DataTypes){
    var HeadersIDSCLN = sequelize.define('HeadersIDSCLN',{
        "IDAS_ID" : {type:DataTypes.INTEGER(11), primaryKey:true},
        "PATIENT_ID" : {type:DataTypes.INTEGER(11), primaryKey:true},
        "CAL_ID": {type:DataTypes.INTEGER(11), primaryKey:true},
        "DOCTOR_ID": DataTypes.INTEGER(11),
        "DF_CODE": DataTypes.STRING(10),
        "NAME": DataTypes.STRING(10),
        "IDAS_DATE": DataTypes.DATE,
        "Temperature": DataTypes.STRING(10),
        "Creatinine": DataTypes.STRING(10),
        "Drug_Test_Time": DataTypes.STRING(10),
        "Expiry_Date": DataTypes.DATE,
        "Notes": DataTypes.STRING(10),
        "Alcohol_Test_Time": DataTypes.STRING(10),
        "Reading": DataTypes.STRING(10),
        "Positive_Negative": DataTypes.INTEGER(11),
        "Reading2": DataTypes.STRING(10),
        "ITEM_ID": DataTypes.INTEGER(11),
        "Created_by": DataTypes.INTEGER(11),
        "Creation_date": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE,
        "NAME_COMMENT": DataTypes.STRING(10),
        "ISENABLE": DataTypes.INTEGER(11),
        "SIGNATURE": DataTypes.TEXT,
        "TesterName": DataTypes.STRING(10),
        "TesterSign": DataTypes.BLOB,
        "TesterDate": DataTypes.DATE
    },{
        tableName: 'cln_idas_headers',
        createdAt: 'Creation_date',
        updatedAt : "Last_update_date"
    });
    return HeadersIDSCLN;
};
