//Model headers
module.exports = function(sequelize, DataTypes){
    var HeaderFA = sequelize.define('HeaderFA',{
        PATIENT_ID: DataTypes.BIGINT(20),
        CAL_ID : DataTypes.INTEGER(11),
        FA_ID: DataTypes.INTEGER(11),
        ENTITY_ID: DataTypes.INTEGER(11),
        FA_TYPE: DataTypes.STRING(10),
        FA_NAME : DataTypes.STRING(50),
        ISENABLE: DataTypes.INTEGER(11),
        Created_by: DataTypes.INTEGER(11),
        Creation_date : DataTypes.DATE,
        Last_updated_by: DataTypes.INTEGER(11),
        Last_update_date : DataTypes.DATE,
        Risk: DataTypes.STRING(10),
        Comments : DataTypes.STRING(200),
        Recommend: DataTypes.STRING(10),
        Att_Flexibility: DataTypes.INTEGER(11),
        Att_Core_Stability: DataTypes.INTEGER(11),
        Att_Wirst_Elbow_func: DataTypes.INTEGER(11),
        Att_Shoulder_func: DataTypes.INTEGER(11),
        Att_Lower_Limb_func: DataTypes.INTEGER(11),
        Att_Balance: DataTypes.INTEGER(11),
        ASSESSED_ID: DataTypes.INTEGER(11),
        ASSESSED_SIGN : DataTypes.TEXT,
        ASSESSED_DATE : DataTypes.DATE,
        ASSESSED_NAME : DataTypes.STRING(100),
        ITEM_ID: DataTypes.INTEGER(11)

    },{
        tableName: 'cln_fa_df_headers', // đặt tên bảng
        createdAt : "Creation_date",
        updatedAt : "Last_update_date"
    });
    return HeaderFA;
};