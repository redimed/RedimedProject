/**
 * Created by meditech on 19/09/2014.
 */
module.exports = function(sequelize,DataTypes){
  var Menu = sequelize.define('Menu',{
      menu_id  : DataTypes.INTEGER,
      description : DataTypes.STRING(60) ,
      definition : DataTypes.STRING(200) ,
      parent_id : DataTypes.INTEGER(11) ,
      type : DataTypes.STRING(1) ,
      seq : DataTypes.INTEGER(11) ,
      is_mutiple_instance : DataTypes.INTEGER(11) ,
      function_id : DataTypes.INTEGER(11) ,
      isEnable : DataTypes.INTEGER(11) 
},{
      tableName: 'redi_menus', // đặt tên bảng
        timestamps: false // đặt false để ko tự động tạo các cột timestamp
    });

    return Menu;
};