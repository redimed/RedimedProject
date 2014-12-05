module.exports = function (sequelize, DataTypes) {
    var HeadersIDSSYS = sequelize.define('HeadersIDSSYS', {
        "IDAS_ID": {type: DataTypes.INTEGER(11), primaryKey: true, name: "IDAS_DF_ID"},
        "DF_CODE": DataTypes.STRING(10),
        "ITEM_ID": DataTypes.STRING(10),
        "DESCRIPTION": DataTypes.STRING(250),
        "ISENABLE": DataTypes.INTEGER(11),
        "Created_by": DataTypes.INTEGER(11),
        "Creation_date": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE
    }, {
        tableName: 'sys_idas_headers',
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });
    return HeadersIDSSYS;
}
