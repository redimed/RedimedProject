module.exports = function (sequelize, DataTypes) {
    var mdtInstance = sequelize.define("mdtAssessmentHeader", {
        'id': {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true, },
        'ass_name': {
            type: DataTypes.STRING(100),
        },
        'Created_by': {
            type: DataTypes.INTEGER(11),
        },
        'Last_updated_by': {
            type: DataTypes.INTEGER(11),
        },
        'company_id': {
            type: DataTypes.INTEGER(11),
        },
    }, {
        tableName: "assessment_headers",
        createdAt: "Creation_date",
        updatedAt: "Last_update_date",
    });
    return mdtInstance;
}