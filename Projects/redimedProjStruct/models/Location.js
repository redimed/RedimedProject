module.exports = function(sequelize, DataTypes) {
    var Location = sequelize.define("Location", {
        "location_id": {
            type: DataTypes.INTEGER(11),
            primaryKey: true
        },
        "street_address": DataTypes.STRING(10),
        "postal_code": DataTypes.STRING(10),
        "city": DataTypes.STRING(10),
        "StateProvince": DataTypes.STRING(10),
        "country_id": DataTypes.INTEGER(11)
    }, {
        tableName: "locations"
    });
    return Location;
};
