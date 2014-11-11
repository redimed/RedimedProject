/**
 * Created by thanh on 11/1/2014.
 */
module.exports = function (sequelize, DataTypes) {
    var sectionsSACLN = sequelize.define('sectionsSACLN', {
        "PATIENT_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "CAL_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "SECTION_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "SA_ID": DataTypes.INTEGER(11),
        "SECTION_NAME": DataTypes.STRING(50),
        "ORD": DataTypes.INTEGER(11),
        "USER_TYPE": DataTypes.STRING(10),
        "ISENABLE": DataTypes.INTEGER(11),
        "CREATED_BY": DataTypes.INTEGER(11),
        "CREATION_DATE": DataTypes.DATE,
        "LAST_UPDATED_BY": DataTypes.INTEGER(11),
        "LAST_UPDATE_DATE": DataTypes.DATE
    }, {
        tableName: 'cln_sa_df_sections',
        timestamps: false
    });
    return sectionsSACLN;
}