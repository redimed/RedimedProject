/** 
* Created by meditech on 2014:10:07 14:38:23.
*/
module.exports = function(sequelize,DataTypes){
   var SysFormDetails2 = sequelize.define('SysFormDetails2',{
       FORM_ID : DataTypes.INTEGER(11) 
       ,TABLE_NAME : DataTypes.STRING(100) 
       ,FORM_DETAIL_ID : {type:DataTypes.INTEGER(11), primaryKey:true} 
       ,COLUMN_NAME : DataTypes.STRING(100) 
       ,IS_NULLABLE : DataTypes.STRING(3) 
       ,DATA_TYPE : DataTypes.STRING(64) 
       ,COLUMN_KEY : DataTypes.STRING(3) 
       ,DISPLAY_NAME : DataTypes.STRING(250) 
       ,ISDISPLAY_ON_LIST : DataTypes.INTEGER(11) 
       ,ISDISPLAY_ON_FORM : DataTypes.INTEGER(11) 
       ,ISNEW : DataTypes.INTEGER(11) 
       ,ISUPDATE : DataTypes.INTEGER(11) 
       ,ISREQUIRE : DataTypes.INTEGER(11) 
       ,ISLIST_LINK : DataTypes.INTEGER(11) 
       ,INPUT_TYPE : DataTypes.STRING(100) 
       ,LOV_SQL : DataTypes.STRING(2000) 
       ,ATTRIBUTE_PROPERTIES : DataTypes.STRING(2000) 
   },{ 
       tableName: 'sys_form_details2',
       timestamps: true,
       createdAt : false,
       updatedAt: false,
       classMethods:{
           getPK:function(callback){
               sequelize.query("SELECT get_pk_value('sys_form_details2') AS PK").success(function(data){
                   callback(data[0].PK);
               })
           }
       }
   }); 
   return SysFormDetails2;
};