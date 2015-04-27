module.exports = function(sequelize, DataTypes) {
    var HrLeave = sequelize.define('HrLeave', {
        leave_id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        application_date: DataTypes.DATE,
        start_date: DataTypes.DATE,
        finish_date: DataTypes.DATE,
        work_date: DataTypes.DATE,
        standard: DataTypes.INTEGER(11),
        status_id: DataTypes.INTEGER(11),
        time_leave: DataTypes.INTEGER(11),
        reason_leave: DataTypes.STRING(500),
        user_id: DataTypes.INTEGER(11),
        creation_date: DataTypes.DATE,
        last_update_date: DataTypes.DATE,
        created_by: DataTypes.INTEGER(11),
        last_updated_by: DataTypes.INTEGER(11)
    }, {
        tableName: "hr_leave",
        createdAt: 'creation_date',
        updatedAt: 'last_update_date'
    });
    return HrLeave;
};
