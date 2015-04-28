module.exports = function(sequelize, DataTypes) {
    var HrLeaveDetail = sequelize.define("HrLeaveDetail", {
        leave_detail_id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        leave_id: DataTypes.INTEGER(11),
        leave_type_id: DataTypes.INTEGER(11),
        time_leave: DataTypes.INTEGER(11),
        reason_leave: DataTypes.INTEGER(11),
        other: DataTypes.STRING(500),
        creation_date: DataTypes.DATE,
        last_update_date: DataTypes.DATE,
        creted_by: DataTypes.INTEGER(11),
        last_updated_by: DataTypes.INTEGER(11)
    }, {
        tableName: "hr_leave_detail",
        createdAt: "creation_date",
        updatedAt: "last_update_date"
    });
    return HrLeaveDetail;
};
