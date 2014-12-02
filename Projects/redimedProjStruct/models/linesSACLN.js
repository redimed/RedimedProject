/**
 * Created by thanh on 11/1/2014.
 */
module.exports = function (sequelize, DataTypes) {
    var linesSACLN = sequelize.define('linesSACLN', {
        "patient_id": {type: DataTypes.INTEGER(11), primaryKey: true},
        "CAL_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "LINE_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "SECTION_ID": DataTypes.INTEGER(11),
        "SA_ID": DataTypes.INTEGER(11),
        "NAME": {type: DataTypes.INTEGER(11), field: 'Name'},
        "VALUE_RIGHT": DataTypes.INTEGER(11),
        "VALUE_LEFT": DataTypes.INTEGER(11),
        "ISENABLE": DataTypes.INTEGER(11),
        "Created_by": DataTypes.INTEGER(11),
        "Creation_date": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE
    }, {
        tableName: 'cln_sa_df_lines',
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });
    return linesSACLN;
}