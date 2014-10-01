/** 
* Created by meditech on 19/09/2014.
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
           }
       }
   }); 
   return SysForms;
};