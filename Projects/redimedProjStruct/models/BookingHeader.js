module.exports = function(sequelize,DataTypes){
  var BookingHeader = sequelize.define('BookingHeader',{
      Booking_id : {type:DataTypes.INTEGER(11), primaryKey:true} ,
	  PO_Number : DataTypes.STRING(20) ,
	  result_email : DataTypes.STRING(1000) ,
	  invoice_email : DataTypes.STRING(1000) ,
	  Project_Identofication: DataTypes.STRING(100) ,
	  Comments : DataTypes.STRING(250) ,
	  package_id : DataTypes.INTEGER(11) ,
	  site_id : DataTypes.INTEGER(11) ,
	  company_id : DataTypes.INTEGER(11) ,
	  Booking_Person : DataTypes.STRING(50) ,
	  contact_number : DataTypes.STRING(50) ,
	  period : DataTypes.INTEGER(11) ,
	  sub_company_id : DataTypes.INTEGER(11) ,
	  contact_email : DataTypes.STRING(50) ,
	  Created_by : DataTypes.INTEGER(11) ,
	  Creation_date : DataTypes.DATE ,
	  Last_updated_by : DataTypes.INTEGER(11) ,
	  Last_update_date: DataTypes.DATE ,
	  isBookingAtRediMed : DataTypes.INTEGER(11)
},{
      tableName: 'booking_headers', // đặt tên bảng
      createdAt: 'Creation_date',
      updatedAt: 'Last_update_date'
    });

    return BookingHeader;
};