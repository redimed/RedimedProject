/**
 * Created by meditech on 09/10/2014.
 */
module.exports = function(sequelize,DataTypes){
    var RoomSite = sequelize.define('RoomSite',{
        id : {type:DataTypes.INTEGER(11), primaryKey: true} ,
        room_name: DataTypes.STRING(200),
        description : DataTypes.TEXT ,
        site_id : DataTypes.INTEGER(11) ,
        isEnable : DataTypes.INTEGER(11) ,
        Created_by : DataTypes.INTEGER(11) ,
        Creation_date : DataTypes.DATE ,
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE
    },{
        tableName: 'redimedsites_room', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return RoomSite;
};