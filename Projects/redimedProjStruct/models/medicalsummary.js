module.exports = function (sequelize, DataTypes) {
    var MedicalSummary = sequelize.define('MedicalSummary', {
        "mrs_id": {type: DataTypes.INTEGER(11), primaryKey: true, autoIncrement: true},
        "patient_id": DataTypes.INTEGER(11),
        "cal_id": DataTypes.INTEGER(11),
        "sticker_here": DataTypes.STRING(500),
        "proposed": DataTypes.STRING(200),
        "as_height": DataTypes.FLOAT,
        "as_weight": DataTypes.FLOAT,
        "as_whr": DataTypes.FLOAT,
        "as_bmi": DataTypes.FLOAT,
        "as_height_weight": DataTypes.INTEGER(11),
        "as_medical_history": DataTypes.INTEGER(11),
        "as_medical_assessment": DataTypes.INTEGER(11),
        "as_functional_assessment": DataTypes.INTEGER(11),
        "as_hearing_test": DataTypes.INTEGER(11),
        "as_spirometry": DataTypes.INTEGER(11),
        "as_drug_test": DataTypes.INTEGER(11),
        "as_other": DataTypes.INTEGER(11),
        "ac_any_existing_or_active": DataTypes.INTEGER(11),
        "ac_any_history": DataTypes.INTEGER(11),
        "ac_cardiovascular": DataTypes.INTEGER(11),
        "ac_any_current_or_work_related": DataTypes.INTEGER(11),
        "ac_any_medical_or_functional": DataTypes.INTEGER(11),
        "ac_any_diagnosed_or_previous": DataTypes.INTEGER(11),
        "ac_examiner_comment": DataTypes.STRING(500),
        "risk_rating" : DataTypes.INTEGER(11),
        "rr_amber_comment": DataTypes.STRING(500),
        "rr_red_comment": DataTypes.STRING(500),
        "mrs_review": DataTypes.INTEGER(11),
        "mrs_doc_date": DataTypes.DATE,
        "doctor_id": DataTypes.INTEGER(11),
        "created_by": DataTypes.INTEGER(11),
        "creation_date": DataTypes.DATE,
        "last_updated_by": DataTypes.INTEGER(11),
        "last_update_date": DataTypes.DATE
    }, {
        tableName: 'medical_summary',
        createdAt: 'creation_date',
        updatedAt: 'last_update_date'
    });
    return MedicalSummary;
};