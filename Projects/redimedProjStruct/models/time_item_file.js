module.exports = function(sequelize, DataTypes) {
    var time_item_file = sequelize.define("time_item_file", {
        "time_item_file_id": {
            type: DataTypes.INTEGER(11),
            primaryKey: true
        },
        "task_id": DataTypes.INTEGER(11),
        "item_id": DataTypes.INTEGER(11),
        "file_id": DataTypes.INTEGER(11),
        "creation_date": DataTypes.DATE,
        "last_update_date": DataTypes.DATE,
        "created_by": DataTypes.INTEGER(11),
        "last_updated_by": DataTypes.INTEGER(11)
    }, {
        tableName: "time_item_file",
        createdAt: "creation_date",
        updatedAt: "last_update_date"
    });
    return time_item_file;
};
