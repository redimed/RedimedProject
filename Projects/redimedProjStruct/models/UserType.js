/**
 * Created by meditech on 06/10/2014.
 */
module.exports = function(sequelize,DataTypes){
    var UserType = sequelize.define('UserType',{
        id : {type:DataTypes.INTEGER(11), primaryKey:true},
        user_type : DataTypes.STRING(50)
    },{
        tableName: 'user_type',
        timestamps: false
    });

    return UserType;
};

