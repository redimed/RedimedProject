/** 
* Created by meditech on 19/09/2014.
*/
module.exports = function(sequelize,DataTypes){
   var PmProperties = sequelize.define('PmProperties',{
       property_id :{type:DataTypes.INTEGER(11), primaryKey:true}
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

   },{ 
       tableName: 'pm_properties',
       timestamps: false
   });
   return PmProperties;
};
