module.exports = function(sequelize, DataTypes){
    var Problem = sequelize.define('Problem',{
        Problem_id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        Patient_id: DataTypes.INTEGER(11),
        From_date: DataTypes.DATE,
        To_date: DataTypes.DATE,
        Notes: DataTypes.STRING,
        ICD10_code: DataTypes.STRING(150),
        ICPC_code: DataTypes.STRING(150),
        Creation_date: DataTypes.DATE,
        Created_by: DataTypes.INTEGER(11),
        Last_update_date: DataTypes.DATE,
        Last_updated_by: DataTypes.INTEGER(11),
       
    },{
        tableName: 'cln_problems', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date',
    });
    return Problem;
};