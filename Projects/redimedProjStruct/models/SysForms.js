/** 
* Created by meditech on 2014:10:01 21:59:48.
*/
module.exports = function(sequelize,DataTypes){
   var SysForms = sequelize.define('SysForms',{
       FORM_ID : {type:DataTypes.INTEGER(11), primaryKey:true} 
       ,MASTER_TABLE_NAME : DataTypes.STRING(100) 
       ,MASTER_SEQ : DataTypes.STRING(100) 
       ,DETAIL_TABLE_NAME : DataTypes.STRING(100) 
       ,DETAIL_SEQ : DataTypes.STRING(100) 
       ,FORM_DESCRIPTION : DataTypes.STRING(250) 
       ,FORM_TYPE : DataTypes.STRING(20) 
   },{ 
       tableName: 'sys_forms',
       timestamps: false,
       classMethods:{
           getPK:function(callback){
               sequelize.query("SELECT get_pk_value('sys_forms') AS PK").success(function(data){
                   callback(data[0].PK);
               })
           },
           getColumns:function(tableName,callback){
               sequelize.query("select * from sys_form_details where form_id = (select max(form_id) from sys_forms where upper(master_table_name) = '"+tableName+"') order by ordinal_position").success(function(data){
                   callback(data);
               })
           }
       }
   }); 
   return SysForms;
};