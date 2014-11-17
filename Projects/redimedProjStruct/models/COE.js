/**
 * Created by thanh on 11/16/2014.
 */
module.exports = function (sequelize, DataTypes) {
    var COE = sequelize.define('COE', {
        "coe_id": {type:DataTypes.INTEGER(11), primaryKey:true},
        "DocId": DataTypes.INTEGER(11),
        "DOCTOR_ID": DataTypes.INTEGER(11),
        "CalId": DataTypes.INTEGER(11),
        "PatientId": DataTypes.INTEGER(11),
        "isEmployed": DataTypes.INTEGER(11),
        "dateEmployed": DataTypes.DATE,
        "inPosition": DataTypes.STRING(100),
        "signature1": DataTypes.TEXT,
        "coeName": DataTypes.STRING(100),
        "coeTitle": DataTypes.STRING(100),
        "coeDate": DataTypes.DATE,
        "signature2": DataTypes.TEXT
    }, {
        tableName: 'gorgon_doc_coe',
        timestamps: false
    });
    return COE;
};