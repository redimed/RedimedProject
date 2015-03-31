module.exports = function(sequelize, DataTypes) {
    var timeTaskWeek = sequelize.define('timeTaskWeek', {
        task_week_id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true
        },
        start_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
        user_id: DataTypes.INTEGER(11),
        task_status_id: DataTypes.INTEGER(11),
        week_no: DataTypes.INTEGER(11),
        approved_date: DataTypes.DATE,
        time_charge: DataTypes.INTEGER(11),
        time_spent: DataTypes.INTEGER(11),
        time_rest: DataTypes.INTEGER(11),
        over_time: DataTypes.INTEGER(11),
        date_submited: DataTypes.DATE,
        time_in_lieu: DataTypes.INTEGER(11),
        comments: DataTypes.TEXT,
        created_by: DataTypes.INTEGER(11),
        last_updated_by: DataTypes.INTEGER(11),
        time_in_lieuChoose: DataTypes.INTEGER(11),
        after_status_id: DataTypes.INTEGER(11),
        deleted: DataTypes.INTEGER(11)
    }, {
        tableName: 'time_tasks_week',
        createdAt: "creation_date",
        updatedAt: "last_update_date"
    });
    return timeTaskWeek;
};
