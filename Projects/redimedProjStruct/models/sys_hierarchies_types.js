module.exports = function(sequelize, DataTytes) {
    var sys_hierarchies_types = sequelize.define("sys_hierarchies_types", {
        "TYPE_ID": {
            type: DataTytes.INTEGER(11),
            primaryKey: true
        },
        "TYPE_NAME": DataTytes.STRING(200),
        "Creation_date": DataTytes.DATE,
        "Last_update_date": DataTytes.DATE,
        "Created_by": DataTytes.INTEGER(11),
        "Last_updated_by": DataTytes.INTEGER(11),
        "deleted": DataTytes.INTEGER(1)
    }, {
        tableName: "sys_hierarchies_types",
        createdAt: "Creation_date",
        updatedAt: "Last_update_date"
    });
    return sys_hierarchies_types;
};
