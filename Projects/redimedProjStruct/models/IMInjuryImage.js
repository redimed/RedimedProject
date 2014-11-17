/**
 * Created by meditech on 09/10/2014.
 */
module.exports = function(sequelize,DataTypes){
    var IMInjuryImage = sequelize.define('IMInjuryImage',{
        injury_image_id : {type:DataTypes.INTEGER(11), primaryKey:true} ,
        injury_id : DataTypes.INTEGER(11) ,
        image : DataTypes.TEXT,
        description : DataTypes.TEXT,
        STATUS : DataTypes.STRING(100) ,
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