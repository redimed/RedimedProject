/**
 * Created by thanh on 11/1/2014.
 */
module.exports = function (sequelize, DataTypes) {
    var sectionsSACLN = sequelize.define('sectionsSACLN', {
        "patient_id": {type: DataTypes.INTEGER(11), primaryKey: true},
        "CAL_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "SECTION_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "SA_ID": DataTypes.INTEGER(11),
        "SECTION_NAME": DataTypes.STRING(50),
        "ORD": DataTypes.INTEGER(11),
        "USER_TYPE": DataTypes.STRING(10),
        "ISENABLE": DataTypes.INTEGER(11),
        "Created_by": DataTypes.INTEGER(11),
        "Creation_date": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE
    }, {
        tableName: 'cln_sa_df_sections',
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });
    return sectionsSACLN;
}