module.exports = function(sequelize, DataTypes) {
    var Departments = sequelize.define('Departments', {
        departmentid: {
            type: DataTypes.INTEGER(11),
            primaryKey: true
        },
        departmentName: DataTypes.STRING(100),
        locationID: DataTypes.INTEGER(11),
        managerId: DataTypes.INTEGER(11),
        departmentType: DataTypes.INTEGER(11)
    }, {
        tableName: 'departments',
        timestamps: false
    });

    return Departments;
};
