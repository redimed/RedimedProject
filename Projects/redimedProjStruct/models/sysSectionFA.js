module.exports = function(sequelize, DataTypes){
    var sysSectionFA = sequelize.define('sysSectionFA',{
        "SECTION_ID"  : {type:DataTypes.INTEGER(11), primaryKey:true},
        "FA_ID" : DataTypes.INTEGER(11),
        "SECTION_NAME": DataTypes.STRING(50),
        "ISENABLE" : DataTypes.INTEGER(11),
        "ORD" : DataTypes.INTEGER(11),
        "USER_TYPE" : DataTypes.STRING(10),
        "Created_by" : DataTypes.INTEGER(11),
        "Creation_date"  : DataTypes.DATE,
        "Last_updated_by" : DataTypes.INTEGER(11),
        "Last_update_date"  : DataTypes.DATE,
        "SECTION_TYPE" : DataTypes.INTEGER(11)
    },{
        tableName: 'sys_fa_df_sections', // đặt tên bảng
        createdAt : "Creation_date",
        updatedAt : "Last_update_date"
    });
    return sysSectionFA;
};