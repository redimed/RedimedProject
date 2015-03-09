module.exports = function(sequelize, DataTypes) {
    var timeLocation = sequelize.define('timeLocation', {
        location_id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true
        },
        address: DataTypes.STRING(200),
        NAME: DataTypes.STRING(200),
        creation_date: DataTypes.DATE,
        last_update_date: DataTypes.DATE,
        created_by: DataTypes.INTEGER(11),
        last_updated_by: DataTypes.INTEGER(11),
        deleted: DataTypes.INTEGER(11)
    }, {
        tableName: 'time_location',
        createdAt: "creation_date",
        updatedAt: "last_update_date"
    });
    return timeLocation;
};
