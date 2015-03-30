module.exports = function(sequelize, DataTypes) {
    var timeActivity = sequelize.define('timeActivity', {
        activity_id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true
        },
        NAME: DataTypes.STRING(200),
        creation_date: DataTypes.DATE,
        last_update_date: DataTypes.DATE,
        created_by: DataTypes.INTEGER(11),
        last_updated_by: DataTypes.INTEGER(11),
        deleted: DataTypes.INTEGER(11)
    }, {
        tableName: 'time_activity',
        createdAt: "creation_date",
        updatedAt: "last_update_date"
    });
    return timeActivity;
};
