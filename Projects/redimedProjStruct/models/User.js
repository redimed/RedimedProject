module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
      id : DataTypes.INTEGER,
      user_name: DataTypes.STRING(50),
      password : DataTypes.STRING(500),
      company_id: DataTypes.INTEGER(11),
      user_type: DataTypes.STRING(20),
      result_email: DataTypes.STRING(1000),
      invoiceemail : DataTypes.STRING(1000) ,
      PO_number : DataTypes.STRING(50) ,
      Booking_Person : DataTypes.STRING(50) ,
      Contact_number : DataTypes.STRING(50) ,
      isProject : DataTypes.INTEGER(11) ,
      isCalendar : DataTypes.INTEGER(11) ,
      isAll : DataTypes.INTEGER(11) ,
      isEnable : DataTypes.INTEGER(11) ,
      Contact_email : DataTypes.STRING(50) ,
      Report_To_email : DataTypes.STRING(50) ,
      isMakeBooking : DataTypes.INTEGER(11) ,
      isBooking : DataTypes.INTEGER(11) ,
      isPackage : DataTypes.INTEGER(11) ,
      isPosition : DataTypes.INTEGER(11) ,
      isSetting : DataTypes.INTEGER(11) ,
      Created_by : DataTypes.INTEGER(11) ,
      Creation_date: DataTypes.DATE ,
      Last_updated_by : DataTypes.INTEGER(11) ,
      Last_update_date: DataTypes.DATE ,
      isDownloadResult : DataTypes.INTEGER(11) ,
      isAllCompanyData : DataTypes.INTEGER(11) ,
      isAdmin : DataTypes.INTEGER(11) ,
      isReceiveEmailAfterHour : DataTypes.INTEGER(11) ,
      function_id : DataTypes.INTEGER(11) ,
      function_taskFlow : DataTypes.STRING(100) ,
      employee_id : DataTypes.INTEGER(11)
}, {
        tableName: 'users', // đặt tên bảng
        timestamps: false // đặt false để ko tự động tạo các cột timestamp
    });

    return User;
};