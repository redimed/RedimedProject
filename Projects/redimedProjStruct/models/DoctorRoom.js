/**
 * Created by meditech on 09/10/2014.
 */
module.exports = function(sequelize,DataTypes){
    var DoctorRoom = sequelize.define('DoctorRoom',{
        id : {type:DataTypes.INTEGER(11), primaryKey: true} ,
        doctor_id: DataTypes.INTEGER(11),
        room_id : DataTypes.INTEGER(11) ,
        Created_by : DataTypes.INTEGER(11) ,
        Creation_date : DataTypes.DATE ,
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE
    },{
        tableName: 'doctors_room', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return DoctorRoom;
};