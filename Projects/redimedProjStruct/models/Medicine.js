module.exports = function(sequelize, DataTypes){
    var Medicine = sequelize.define('Medicine',{
        medicine_id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        medicine_name: DataTypes.STRING(100),
        medicine_price: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
        medicine_unit: DataTypes.STRING(20),
        isEnable: DataTypes.INTEGER(11),
        Creation_date: DataTypes.DATE,
        Created_by: DataTypes.INTEGER(11),
        Last_update_date: DataTypes.DATE,
        Last_updated_by: DataTypes.INTEGER(11),
       
    },{
        tableName: 'cln_medicines', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date',
    });
    return Medicine;
};