/**
 * Created by meditech on 09/10/2014.
 */
module.exports = function(sequelize,DataTypes){
    var IMInjuryImage = sequelize.define('IMInjuryImage',{
        id : {type:DataTypes.INTEGER(11), primaryKey:true} ,
        injury_id : DataTypes.INTEGER(11) ,
        injury_part: DataTypes.STRING(200),
        description : DataTypes.TEXT,
        img_url : DataTypes.TEXT,
        Created_by : DataTypes.INTEGER(11) ,
        Creation_date : DataTypes.DATE ,
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE

},{
        tableName: 'im_injury_images', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return IMInjuryImage;
};