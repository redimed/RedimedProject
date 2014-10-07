/** 
* Created by meditech on 2014:10:07 14:38:23.
*/
module.exports = function(sequelize,DataTypes){
   var SysForms2 = sequelize.define('SysForms2',{
       FORM_ID : {type:DataTypes.INTEGER(11), primaryKey:true} 
       ,MASTER_TABLE_NAME : DataTypes.STRING(100) 
       ,MASTER_SEQ : DataTypes.STRING(100) 
       ,DETAIL_TABLE_NAME : DataTypes.STRING(100) 
       ,DETAIL_SEQ : DataTypes.STRING(100) 
       ,FORM_DESCRIPTION : DataTypes.STRING(250) 
       ,FORM_TYPE : DataTypes.STRING(20) 
       ,LIST_FORM_TYPE : DataTypes.STRING(20) 
       ,NEW_EDIT_FORM_TYPE : DataTypes.STRING(20) 
       ,FORM_PROPERTIES : DataTypes.STRING(2000) 
   },{ 
       tableName: 'sys_forms2',
       timestamps: true,
       createdAt : false,
       updatedAt: false,
       classMethods:{
           getPK:function(callback){
               sequelize.query("SELECT get_pk_value('sys_forms2') AS PK").success(function(data){
                   callback(data[0].PK);
               })
           }
       }
   }); 
   return SysForms2;
};