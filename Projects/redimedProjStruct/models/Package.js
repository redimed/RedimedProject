/**
 * Created by meditech on 09/10/2014.
 */
module.exports = function(sequelize,DataTypes){
    var Package = sequelize.define('Package',{
        id : {type:DataTypes.INTEGER(11), primaryKey: true},
        package_name : DataTypes.STRING(100) ,
        company_id : DataTypes.INTEGER(11) ,
        Created_by : DataTypes.INTEGER(11) ,
        Creation_date : DataTypes.DATE ,
        Last_updated_by : DataTypes.INTEGER(11) ,
        Last_update_date : DataTypes.DATE ,
        item_id : DataTypes.INTEGER(11) ,
        item_code : DataTypes.STRING(20) ,
        item_name : DataTypes.STRING(1000) ,
        fee: DataTypes.FLOAT
    },{
        tableName: 'packages', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return Package;
};