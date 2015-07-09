/**
 * Created by meditech on 09/10/2014.
 */
module.exports = function(sequelize,DataTypes){
    var IMInjury = sequelize.define('IMInjury',{
        injury_id : {type:DataTypes.INTEGER(11), primaryKey: true} ,
        user_submit: DataTypes.INTEGER(11),
        patient_id : DataTypes.INTEGER(20) ,
        driver_id : DataTypes.INTEGER(11) ,
        doctor_id : DataTypes.INTEGER(11) ,
        cal_id : DataTypes.INTEGER(11) ,
        injury_date: DataTypes.DATE,
        injury_description: DataTypes.TEXT,
        STATUS : DataTypes.STRING(100) ,
        pickup_address: DataTypes.STRING(200),
        pickup_suburb: DataTypes.STRING(100),
        pickup_postcode: DataTypes.STRING(100),
        latitude: DataTypes.STRING(100),
        longitude: DataTypes.STRING(100),
        signature: DataTypes.TEXT,
        Created_by : DataTypes.INTEGER(11) ,
        Creation_date : DataTypes.DATE ,
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE
    },{
        tableName: 'im_injury', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return IMInjury;
};