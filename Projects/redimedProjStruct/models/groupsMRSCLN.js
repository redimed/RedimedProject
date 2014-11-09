/**
 * Created by thanh on 10/29/2014.
 */
module.exports = function (sequelize, DataTypes) {
    var groupsMRSCLN = sequelize.define("groupsMRSCLN", {
        "MRS_GROUP_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "MRS_DF_ID": DataTypes.INTEGER(11),
        "PATIENT_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "CAL_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "ORD": DataTypes.INTEGER(11),
        "GROUP_NAME": DataTypes.STRING(200),
        "USER_TYPE": DataTypes.STRING(10),
        "ISENABLE": DataTypes.INTEGER(11),
        "Created_by": DataTypes.INTEGER(11),
        "Creation_date": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE
    }, {
        tableName: 'cln_mrs_groups',
        timestamps: false
    });
    return groupsMRSCLN;
};