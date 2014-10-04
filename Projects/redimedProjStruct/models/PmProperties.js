/** 
* Created by meditech on 2014:10:03 15:27:47.
*/
module.exports = function(sequelize,DataTypes){
   var PmProperties = sequelize.define('PmProperties',{
       property_id : {type:DataTypes.INTEGER(11), primaryKey:true} 
       ,Address : DataTypes.STRING(100) 
       ,Suburb : DataTypes.STRING(30) 
       ,Zipcode : DataTypes.STRING(10) 
       ,State : DataTypes.STRING(30) 
       ,Country : DataTypes.STRING(30) 
       ,purchase_date : DataTypes.DATE 
       ,note : DataTypes.STRING(1000) 
       ,Cancellation_reason : DataTypes.STRING(1000) 
       ,isCancellation : DataTypes.INTEGER(11) 
       ,isInsurance : DataTypes.INTEGER(11) 
       ,Avatar_Pic_path : DataTypes.STRING(200) 
       ,Created_by : DataTypes.INTEGER(11) 
       ,Last_updated_by : DataTypes.INTEGER(11) 
   },{ 
       tableName: 'pm_properties',
       timestamps: true,
       createdAt : 'Creation_date',
       updatedAt : 'Last_update_date',
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