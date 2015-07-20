/**
 * Created by meditech on 09/10/2014.
 */
module.exports = function(sequelize,DataTypes){
    var IMInjuryApptStatus = sequelize.define('IMInjuryApptStatus',{
        id : {type:DataTypes.INTEGER(11), primaryKey: true} ,
        appt_id: DataTypes.INTEGER(11),
        appt_status: DataTypes.STRING(200),
        waiting_start_time: DataTypes.DATE,
        waiting_end_time: DataTypes.DATE,
        picking_start_time: DataTypes.DATE,
        picking_end_time: DataTypes.DATE,
        picked_start_time: DataTypes.DATE,
        picked_end_time: DataTypes.DATE
    },{
        tableName: 'im_injury_appt_status',
        timestamps: false
    });

    return IMInjuryApptStatus;
};