/**
 * Created by meditech on 06/10/2014.
 */
module.exports = function(sequelize,DataTypes){
    var UserTypeMenu = sequelize.define('UserTypeMenu',{
        id : {type:DataTypes.INTEGER(11), primaryKey:true},
        menu_id : DataTypes.INTEGER(11) ,
        type_id : DataTypes.INTEGER(11) ,
        isEnable : DataTypes.INTEGER(11)
    },{
        tableName: 'redi_userType_menus',
        timestamps: false
    });

    return UserTypeMenu;
};