/**
* Created by thanh on 10/10/2014.
*/

/**
* begin table cln_sa_df_headers
*/
module.exports = function (sequelize, DataTypes) {
    var Headers = sequelize.define("Headers", {
        "patient_id": {type: DataTypes.INTEGER(11), primaryKey: true},
        "CAL_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "SA_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "SA_NAME": DataTypes.STRING(50),
        "ISENABLE": DataTypes.INTEGER(11),
        "SA_CODE": DataTypes.STRING(10),
        "Created_by": DataTypes.INTEGER(11),
        "Creation_date": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE,
        "test_date": DataTypes.DATE,
        "tester": DataTypes.STRING(50),
        "report_type": DataTypes.STRING(20),
        "RECIPIENT_NAME": DataTypes.STRING(200),
        "DOCTOR_ID": DataTypes.INTEGER(11),
        "Signature": DataTypes.BLOB,
        "LOCATION_ID": DataTypes.INTEGER(11)
    }, {
        tableName: 'cln_sa_df_headers',
        timestamps: false
    });
    return Headers;
};
/**
* end table cln_sa_df_headers
*/

/**
* begin table cln_sa_df_sections
*/
module.exports = function (sequelize, DataTypes) {
    var Sections = sequelize.define('Sections', {
        "patient_id": {type: DataTypes.INTEGER(11), primaryKey: true},
        "CAL_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "SECTION_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "SA_ID": DataTypes.INTEGER(11),
        "SECTION_NAME": DataTypes.STRING(50),
        "ORD": DataTypes.INTEGER(11),
        "USER_TYPE": DataTypes.STRING(10),
        "ISENABLE": DataTypes.INTEGER(11),
        "Created_by": DataTypes.INTEGER(11),
        "Creation_date": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE
    }, {
        tableName: 'cln_sa_df_sections',
        timestamps: false
    });
    return Sections;
};
/**
* end table cln_sa_df_sections
*/

/**
* begin table cln_sa_df_lines
*/
module.exports = function (sequelize, DataTypes) {
    var Lines = sequelize.define('Lines', {
        "patient_id": {type: DataTypes.INTEGER(11), primaryKey: true},
        "CAL_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "LINE_ID": {type: DataTypes.INTEGER(11), primaryKey: true},
        "SECTION_ID": DataTypes.INTEGER(11),
        "SA_ID": DataTypes.INTEGER(11),
        "Name": DataTypes.INTEGER(11),
        "VALUE_RIGHT": DataTypes.INTEGER(11),
        "VALUE_LEFT": DataTypes.INTEGER(11),
        "ISENABLE": DataTypes.INTEGER(11),
        "Created_by": DataTypes.INTEGER(11),
        "Creation_date": DataTypes.DATE,
        "Last_updated_by": DataTypes.INTEGER(11),
        "Last_update_date": DataTypes.DATE
    }, {
        tableName: 'cln_sa_sf_lines',
        timestamps: false
    });
    return Lines;
};
/**
* end table cln_sa_df_lines
*/