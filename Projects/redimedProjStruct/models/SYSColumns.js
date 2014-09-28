/**
 * Created by meditech on 22/09/2014.
 */
module.exports = function(sequelize,DataTypes){
    var SYSCOLUMNS = sequelize.define('SYSCOLUMNS',{
        TABLE_CATALOG : DataTypes.STRING(512) ,
        TABLE_SCHEMA : DataTypes.STRING(64) ,
        TABLE_NAME : DataTypes.STRING(64) ,
        COLUMN_NAME : DataTypes.STRING(64) ,
        DATA_TYPE : DataTypes.STRING(64) ,
        ORDINAL_POSITION : DataTypes.BIGINT,
        CHARACTER_MAXIMUM_LENGTH : DataTypes.BIGINT,
        COLUMN_KEY : DataTypes.STRING(64)
    },{
        tableName: 'INFORMATION_SCHEMA.COLUMNS'
    });

    return SYSCOLUMNS;
};