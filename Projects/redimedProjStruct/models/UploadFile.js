module.exports = function(sequelize,DataTypes){
    var UploadFile = sequelize.define('UploadFile',{
        id : {type: DataTypes.INTEGER(11), primaryKey: true},
        description: DataTypes.TEXT,
        fileName: DataTypes.STRING(200),
        url: DataTypes.TEXT,
        Created_by : DataTypes.INTEGER(11) ,
        Creation_date : DataTypes.DATE ,
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE
    },{
        tableName: 'upload_file', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return UploadFile;
};