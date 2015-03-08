module.exports = function (sequelize, DataTypes) {
    var timeTasks = sequelize.define('timeTasks', {
        "tasks_id" :{type:DataTypes.INTEGER(11), primaryKey:true},
        "tasks_week_id" : DataTypes.INTEGER(11),
        "date": DataTypes.DATE,
        "department_code_id" : DataTypes.INTEGER(11),
        "service_line_id" : DataTypes.INTEGER(11),
        "phase" : DataTypes.STRING(150),
        "task" : DataTypes.STRING(150),
        "location_id" : DataTypes.INTEGER(11),
        "activity_id" : DataTypes.INTEGER(11),
        "planned" : DataTypes.INTEGER(11),
        "actual" : DataTypes.INTEGER(11),
        "time_charge": DataTypes.INTEGER(11),
        // "start_time" : DataTypes.STRING(200),
        // "end_time" : DataTypes.STRING(200),
        "isenable"  : DataTypes.INTEGER(11),
        // "task_status_id" : DataTypes.INTEGER(11),
        //"creation_date": DataTypes.DATE,
        //"last_update_date": DataTypes.DATE,
        "created_by" : DataTypes.INTEGER(11),
        "last_updated_by" : DataTypes.INTEGER(11),
        "deleted" : DataTypes.INTEGER(11)
    }, {
        tableName: 'time_tasks',
        createdAt : "creation_date",
        updatedAt : "last_update_date"
    });
    return timeTasks;
};

