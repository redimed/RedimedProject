/** 
* Created by meditech on 2014:10:04 21:03:36.
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
       ,LIST_FORM_TYPE : DataTypes.STRING(20) 
       ,NEW_EDIT_FORM_TYPE : DataTypes.STRING(20) 
   },{ 
       tableName: 'sys_forms',
       timestamps: true,
       createdAt : false,
       updatedAt: false,
       classMethods:{
           getPK:function(callback){
               sequelize.query("SELECT get_pk_value('sys_forms') AS PK").success(function(data){
                   callback(data[0].PK);
               })
           },
           getColumns:function(tableName,callback){
               sequelize.query("select f.MASTER_TABLE_NAME,f.MASTER_SEQ,f.DETAIL_TABLE_NAME,f.DETAIL_SEQ,f.FORM_DESCRIPTION,f.FORM_TYPE,f.LIST_FORM_TYPE,f.NEW_EDIT_FORM_TYPE, d.* from sys_form_details d, sys_forms f where d.form_id = f.form_id and d.form_id = (select max(form_id) from sys_forms where upper(master_table_name) = '"+tableName+"') order by ordinal_position").success(function(data){
                   callback(data);
               })
           }
       }
   });
    return SysForms;
};