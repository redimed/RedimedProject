module.exports = function (sequelize, DataTypes) {
    var timeTaskWeek = sequelize.define('timeTaskWeek', {
        task_week_id :{type:DataTypes.INTEGER(11), primaryKey:true},
        start_date : DataTypes.DATE,
        end_date : DataTypes.DATE,
        user_id : DataTypes.INTEGER(11),
//        creation_date : DataTypes.DATE,
//        last_update_date : DataTypes.DATE,
        created_by : DataTypes.INTEGER(11),
        last_updated_by : DataTypes.INTEGER(11),
        deleted : DataTypes.INTEGER(11)
    }, {
        tableName: 'time_tasks_week',
        createdAt : "creation_date",
        updatedAt : "last_update_date"
    });
    return timeTaskWeek;
};
