/**
 * Created by meditech on 09/10/2014.
 */
module.exports = function(sequelize,DataTypes){
    var DriverInjury = sequelize.define('DriverInjury',{
        id : {type:DataTypes.INTEGER(11), primaryKey: true} ,
        driver_id : DataTypes.INTEGER(11) ,
        patient_id : DataTypes.INTEGER(11) ,
        STATUS : DataTypes.STRING(50) ,
        pickup_date : DataTypes.DATE
    },{
        tableName: 'driverInjury',
        timestamps: false
    });

    return DriverInjury;
};