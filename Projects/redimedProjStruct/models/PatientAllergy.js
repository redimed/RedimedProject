module.exports = function(sequelize, DataTypes){
    var PatientAllergy = sequelize.define('PatientAllergy',{
        allergy_id: DataTypes.INTEGER(11),
        patient_id: DataTypes.INTEGER(11),
       
    },{
        tableName: 'cln_patient_allergies', // đặt tên bảng
    });
    return PatientAllergy;
};