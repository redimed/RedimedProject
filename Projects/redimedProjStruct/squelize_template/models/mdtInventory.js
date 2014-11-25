module.exports = function (sequelize, DataTypes) {
    var mdtInstance = sequelize.define("mdtInventory", {
        'inventory_id': {
            type: DataTypes.INTEGER(8),
            primaryKey: true,
        },
        'film_id': {
            type: DataTypes.INTEGER(5),
        },
        'store_id': {
            type: DataTypes.INTEGER(3),
        },
        'last_update': {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: "inventory",
        createdAt: "",
        updatedAt: "",
    });
    return mdtInstance;
}