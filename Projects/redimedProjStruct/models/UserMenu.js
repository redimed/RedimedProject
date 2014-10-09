/**
 * Created by meditech on 06/10/2014.
 */
module.exports = function(sequelize,DataTypes){
    var UserMenu = sequelize.define('UserMenu',{
        id : {type:DataTypes.INTEGER(11), primaryKey:true},
        menu_id : DataTypes.INTEGER(11) ,
        user_id : DataTypes.INTEGER(11) ,
        isEnable : DataTypes.INTEGER(11) ,
        Created_by : DataTypes.INTEGER(11) ,
        Creation_date : DataTypes.DATE ,
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE 
    },{
        tableName: 'redi_user_menus', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return UserMenu;
};