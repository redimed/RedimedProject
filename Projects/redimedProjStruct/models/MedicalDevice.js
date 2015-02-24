/**
 * Created by meditech on 09/10/2014.
 */
module.exports = function(sequelize,DataTypes){
    var MedicalDevice = sequelize.define('MedicalDevice',{
        id : {type:DataTypes.INTEGER(11), primaryKey: true} ,
        device_id : DataTypes.STRING(100) ,
        device_name : DataTypes.STRING(100) ,
        device_img : DataTypes.TEXT
    },{
        tableName: 'medical_device',
        timestamps: false
    });

    return MedicalDevice;
};