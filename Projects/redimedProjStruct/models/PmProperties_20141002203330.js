/** 
* Created by meditech on 2014:10:02 16:02:23.
*/
module.exports = function(sequelize,DataTypes){
   var PmProperties = sequelize.define('PmProperties',{
       property_id : {type:DataTypes.INTEGER(11), primaryKey:true} 
       ,Address : DataTypes.STRING(100) 
       ,Suburb : DataTypes.STRING(30) 
       ,Zipcode : DataTypes.STRING(10) 
       ,State : DataTypes.STRING(30) 
       ,Country : DataTypes.STRING(30) 
       ,note : DataTypes.STRING(1000) 
       ,Cancellation_reason : DataTypes.STRING(1000) 
       ,isCancellation : DataTypes.INTEGER(11) 
       ,isInsurance : DataTypes.INTEGER(11) 
       ,Avatar_Pic_path : DataTypes.STRING(200) 
       ,Created_by : DataTypes.INTEGER(11) 
       ,Creation_date : DataTypes.DATE 
       ,Last_updated_by : DataTypes.INTEGER(11) 
       ,Last_update_date : DataTypes.DATE 
   },{ 
       tableName: 'pm_properties',
       timestamps: false,
       createdAt : 'CREATION_DATE',
       updatedAt : 'LAST_UPDATE_DATE',
       classMethods:{
           getPK:function(callback){
               sequelize.query("SELECT get_pk_value('pm_properties') AS PK").success(function(data){
                   callback(data[0].PK);
               })
           }
       }
   }); 
   return PmProperties;
};