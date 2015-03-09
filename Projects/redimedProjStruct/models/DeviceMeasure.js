/**
 * Created by meditech on 09/10/2014.
 */
module.exports = function(sequelize,DataTypes){
    var DeviceMeasure = sequelize.define('DeviceMeasure',{
        measure_id : {type:DataTypes.INTEGER(11), primaryKey: true} ,
        patient_id: DataTypes.INTEGER(11),
        measure_date : DataTypes.DATE ,
        device_id : DataTypes.INTEGER(11) ,
        measureData : DataTypes.TEXT ,
        notes : DataTypes.TEXT 
    },{
        tableName: 'cln_device_measures', 
         timestamps: false 
    });

    return DeviceMeasure;
};