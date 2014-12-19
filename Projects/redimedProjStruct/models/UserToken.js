/**
 * Created by meditech on 06/10/2014.
 */
module.exports = function(sequelize,DataTypes){
    var UserToken = sequelize.define('UserToken',{
        id : {type:DataTypes.INTEGER(11), primaryKey:true},
        user_id : DataTypes.INTEGER(11) ,
        user_type : DataTypes.STRING(20),
        android_token: DataTypes.TEXT,
        ios_token : DataTypes.TEXT,
        roomSession: DataTypes.STRING(500)
    },{
        tableName: 'user_token',
        timestamps: false
    });

    return UserToken;
};