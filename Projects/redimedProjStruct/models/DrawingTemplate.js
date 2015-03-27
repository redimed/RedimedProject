module.exports = function(sequelize,DataTypes){
	var DrawingTemplate = sequelize.define('DrawingTemplate',{
	  id : {type: DataTypes.INTEGER(11), primaryKey: true },
	  fileName : DataTypes.STRING(200) ,
	  isFolder: DataTypes.INTEGER(11) ,
	  parent: DataTypes.INTEGER(11),
	  fileUrl: DataTypes.TEXT
},{
	 tableName: 'drawing_template', // đặt tên bảng
	  timestamps: false
    });

    return DrawingTemplate;
};