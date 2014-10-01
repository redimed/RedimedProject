/** 
* Created by meditech on 19/09/2014.
*/
module.exports = function(sequelize,DataTypes){
   var SysFormDetails = sequelize.define('SysFormDetails',{
       FORM_ID : DataTypes.INTEGER(11) 
       ,TABLE_NAME : DataTypes.STRING(100) 
       ,FORM_DETAIL_ID : {type:DataTypes.INTEGER(11), primaryKey:true} 
       ,ORDINAL_POSITION : DataTypes.INTEGER(11) 
       ,COLUMN_NAME : DataTypes.STRING(100) 
       ,IS_NULLABLE : DataTypes.STRING(3) 
       ,DATA_TYPE : DataTypes.STRING(64) 
       ,COLUMN_KEY : DataTypes.STRING(3) 
       ,DISPLAY_NAME : DataTypes.STRING(250) 
       ,ISDISPLAY : DataTypes.INTEGER(11) 
       ,ISNEW : DataTypes.INTEGER(11) 
       ,ISUPDATE : DataTypes.INTEGER(11) 
       ,ISREQUIRE : DataTypes.INTEGER(11) 
       ,INPUT_TYPE : DataTypes.STRING(100) 
       ,LOV_SQL : DataTypes.STRING(2000) 
   },{ 
       tableName: 'sys_form_details',
       timestamps: false,
       classMethods:{
           getPK:function(callback){
               sequelize.query("SELECT get_pk_value('sys_form_details') AS PK").success(function(data){
                   callback(data[0].PK);
               })
           }
       }
   }); 
   return SysFormDetails;
};