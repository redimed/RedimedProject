module.exports = function(sequelize, DataTypes){
    var Allergy = sequelize.define('Allergy',{
        allergy_id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        allergy_name: DataTypes.STRING(100),
        isEnable: DataTypes.INTEGER(11),
        Creation_date: DataTypes.DATE,
        Created_by: DataTypes.INTEGER(11),
        Last_update_date: DataTypes.DATE,
        Last_updated_by: DataTypes.INTEGER(11),
       
    },{
        tableName: 'cln_allergies', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date',
    });
    return Allergy;
};