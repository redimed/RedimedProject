module.exports = function(sequelize, DataTypes) {
    var pemedical_file = sequelize.define("pemedical_file", {
        "file_id": {
            type: DataTypes.INTEGER(11),
            primaryKey: true
        },
        "path_file": DataTypes.STRING(500),
        "file_name": DataTypes.STRING(200),
        "file_size": DataTypes.INTEGER(11),
        "creation_date": DataTypes.DATE,
        "last_update_date": DataTypes.DATE,
        "created_by": DataTypes.INTEGER(11),
        "last_updated_by": DataTypes.INTEGER(11),
    }, {
        tableName: "pemedical_file",
        createdAt: "creation_date",
        updatedAt: "last_update_date"
    });
    return pemedical_file;
};
