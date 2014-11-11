/**
 * Created by thanh on 11/1/2014.
 */
module.exports = function (sequelize, DataTypes) {
    var linesSASYS = sequelize.define('linesSASYS', {
                "LINE_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
                "SECTION_ID": DataTypes.INTEGER(11),
                "SA_ID": DataTypes.INTEGER(11),
                "NAME": DataTypes.INTEGER(11),
                "VALUE_RIGHT": DataTypes.INTEGER(11),
                "VALUE_LEFT": DataTypes.INTEGER(11),
                "ISENABLE": DataTypes.INTEGER(11),
                "CREATED_BY": DataTypes.INTEGER(11),
                "CREATION_DATE": DataTypes.DATE,
                "LAST_UPDATED_BY": DataTypes.INTEGER(11),
                "LAST_UPDATE_DATE": DataTypes.DATE
            }, {
                tableName: 'sys_sa_df_lines',
                timestamps: false
            }
        )
        ;
    return linesSASYS;
}