module.exports = function(sequelize, DataTypes){
    var LinesIDSCLN = sequelize.define('LinesIDSCLN',{
        "IDAS_LINE_ID" : {type:DataTypes.INTEGER(11), primaryKey:true},
        "IDAS_GROUP_ID": DataTypes.INTEGER(11),
        "IDAS_ID": DataTypes.INTEGER(11),
        "PATIENT_ID": {type:DataTypes.INTEGER(11), primaryKey:true},
        "CAL_ID": {type:DataTypes.INTEGER(11), primaryKey:true},
        "ORD": DataTypes.INTEGER(11),
        "QUESTION": DataTypes.STRING(200),
        "YES_NO": DataTypes.INTEGER(11),
        "Created_by": DataTypes.INTEGER(11),
        "Creation_date": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE,
        "ISENABLE": DataTypes.INTEGER(11)

    },{
        tableName: 'cln_idas_lines',
        createdAt: 'Creation_date',
        updatedAt : "Last_update_date"
    });
    return LinesIDSCLN;
};
