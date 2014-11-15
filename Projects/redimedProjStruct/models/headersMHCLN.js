/**
 * Created by thanh on 10/24/2014.
 */
module.exports = function (sequelize, DataTypes) {
    var headersMHCLN = sequelize.define('headersMHCLN', {
        "PATIENT_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "CAL_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "MH_DF_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "DF_CODE": DataTypes.STRING(10),
        "DESCRIPTION": DataTypes.STRING(100),
        "ISENABLE": DataTypes.INTEGER(11),
        "CREATED_BY": DataTypes.INTEGER(11),
        "CREATION_DATE": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE,
        "Sign": DataTypes.BLOB,
        "Date": DataTypes.DATE,
        "Release_of_medical_info_sign": DataTypes.STRING(100),
        "Release_of_medical_info_witness_sign": DataTypes.STRING(100),
        "Declaration_sign": DataTypes.BLOB,
        "Declaration_witness_sign": DataTypes.STRING(100),
        "Statement_sign": DataTypes.BLOB,
        "Statement_Date": DataTypes.DATE
    }, {
        tableName: 'cln_mh_df_headers',
        createdAt: 'CREATION_DATE',
        updatedAt: 'Last_update_date'
    });
    return headersMHCLN;
};