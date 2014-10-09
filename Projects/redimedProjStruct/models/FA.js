//Model section
module.exports = function(sequelize, DataTypes){
    var Sections = sequelize.define('Sections',{
        patient_id : DataTypes.INTEGER(20),
        cal_id : DataTypes.INTEGER(11),
        section_id : DataTypes.INTEGER(11),
        fa_id : DataTypes.INTEGER(11),
        section_name : DataTypes.STRING(50),
        isenable : DataTypes.INTEGER(11),
        ord : DataTypes.INTEGER(11),
        user_type : DataTypes.STRING(10),
        created_by : DataTypes.INTEGER(11),
        creation_date : DataTypes.DATE,
        last_updated_by : DataTypes.INTEGER(11),
        last_updated_date : DataTypes.DATE,
        section_type : DataTypes.INTEGER(11)

    },{
        tableName: 'cln_fa_df_sections', // đặt tên bảng
        timestamps: false // đặt false để ko tự động tạo các cột timestamp
    });
    return Sections;
};

module.export = function(sequelize, DataTypes){
    var Lines = sequelize.define('Lines',{
        patient_id : DataTypes.INTEGER(20),
        cal_id : DataTypes.INTEGER(11),
        line_id : DataTypes.INTEGER(11),
        section_id : DataTypes.INTEGER(11),
        fa_id : DataTypes.INTEGER(11),
        question : DataTypes.STRING(200),
        picture : DataTypes.Blob,
        isscore1 : DataTypes.INTEGER(11),
        score_type1 : DataTypes.INTEGER(11),
        score1 : DataTypes.INTEGER(11),
        israting1 : DataTypes.INTEGER(11),
        rating_id1 : DataTypes.INTEGER(11),
        rating_value1 : DataTypes.INTEGER(11),
        comments : DataTypes.STRING(200),
        ord : DataTypes.INTEGER(11),
        isscore2 : DataTypes.INTEGER(11),
        score_type2 : DataTypes.INTEGER(11),
        score2 : DataTypes.INTEGER(11),
        israting2 : DataTypes.INTEGER(11),
        rating_id2 : DataTypes.INTEGER(11),
        rating_value2 : DataTypes.INTEGER(11),
        isenable : DataTypes.INTEGER(11),
        created_by : DataTypes.INTEGER(11),
        creation_date : DataTypes.DATE,
        last_updated_by : DataTypes.INTEGER(11),
        last_updated_date : DataTypes.DATE,
        iscommentsText : DataTypes.INTEGER(11),
        lineType : DataTypes.INTEGER(11),
        rate1 : DataTypes.STRING(20),
        rate2 : DataTypes.STRING(20),
        val1_name_header : DataTypes.STRING(50),
        val1_value_header : DataTypes.STRING(50),
        val2_name_header : DataTypes.STRING(50),
        val2_value_header : DataTypes.STRING(50),
        is_show_ranking_table : DataTypes.INTEGER(11)

    },{
        tableName: 'cln_fa_df_lines', // đặt tên bảng
        timestamps: false // đặt false để ko tự động tạo các cột timestamp
    });
    return Lines;
};

//Model line details
module.export = function(sequelize, DataTypes){
    var Details = sequelize.define('Details',{
        patient_id : DataTypes.INTEGER(20),
        cal_id : DataTypes.INTEGER(11),
        detail_id : DataTypes.INTEGER(11),
        line_id : DataTypes.INTEGER(11),
        question : DataTypes.STRING(200),
        val1_name : DataTypes.STRING(50),
        val1_isvalue : DataTypes.INTEGER(11),
        val1_value : DataTypes.STRING(100),
        val1_ischeckbox : DataTypes.INTEGER(11),
        val1_checkbox : DataTypes.STRING(10),
        val2_name : DataTypes.STRING(50),
        val2_isvalue : DataTypes.INTEGER(11),
        val2_value : DataTypes.STRING(100),
        val2_ischeckbox : DataTypes.INTEGER(11),
        val2_checkbox : DataTypes.STRING(10),
        comments : DataTypes.STRING(200),
        picture : DataTypes.Blob,
        ord : DataTypes.INTEGER(11),
        isenable : DataTypes.INTEGER(11),
        created_by : DataTypes.INTEGER(11),
        creation_date : DataTypes.DATE,
        last_updated_by : DataTypes.INTEGER(11),
        last_updated_date : DataTypes.DATE,
        val1_iscomment_when_yes : DataTypes.INTEGER(11),
        val1_iscomment_when_no : DataTypes.INTEGER(11),
        val2_iscomment_when_yes : DataTypes.INTEGER(11),
        val2_iscomment_when_no : DataTypes.INTEGER(11),
        iscommentsText : DataTypes.INTEGER(11),
        lineTestRefer : DataTypes.INTEGER(11),
        val1_value_is_number : DataTypes.INTEGER(11),
        val2_value_is_number : DataTypes.INTEGER(11)

    },{
        tableName: 'cln_fa_df_line_details', // đặt tên bảng
        timestamps: false // đặt false để ko tự động tạo các cột timestamp
    });
    return Sections;
};

//Model headers
module.export = function(sequelize, DataTypes){
    var Headers = sequelize.define('Headers',{
        patient_id : DataTypes.INTEGER(20),
        cal_id : DataTypes.INTEGER(11),
        fa_id : DataTypes.INTEGER(11),
        entity_id : DataTypes.INTEGER(11),
        fa_type : DataTypes.STRING(10),
        fa_name : DataTypes.STRING(50),
        isenable : DataTypes.INTEGER(11),
        created_by : DataTypes.INTEGER(11),
        creation_date : DataTypes.DATE,
        last_updated_by : DataTypes.INTEGER(11),
        last_updated_date : DataTypes.DATE,
        risk : DataTypes.STRING(10),
        comments : DataTypes.STRING(200),
        recomment : DataTypes.STRING(10),
        Att_Flexibility : DataTypes.INTEGER(11),
        Att_Core_Stability : DataTypes.INTEGER(11),
        Att_Wirst_Elbow_func : DataTypes.INTEGER(11),
        Att_Shoulder_func : DataTypes.INTEGER(11),
        Att_Lower_Limb_func : DataTypes.INTEGER(11),
        Att_Balance : DataTypes.INTEGER(11),
        ASSESSED_ID : DataTypes.INTEGER(11),
        ASSESSED_SIGN : DataTypes.Blob,
        ASSESSED_DATE : DataTypes.DATE,
        ASSESSED_NAME : DataTypes.STRING(100)
    },{
        tableName: 'cln_fa_df_headers', // đặt tên bảng
        timestamps: false // đặt false để ko tự động tạo các cột timestamp
    });
    return Sections;
};

//Model comments
module.export = function(sequelize, DataTypes){
    var Comments = sequelize.define('Comments',{
        patient_id : DataTypes.INTEGER(20),
        cal_id : DataTypes.INTEGER(11),
        fa_comment_id : DataTypes.INTEGER(11),
        line_id : DataTypes.INTEGER(11),
        name : DataTypes.STRING(50),
        value : DataTypes.STRING(20),
        isenable : DataTypes.INTEGER(11),
        created_by : DataTypes.INTEGER(11),
        creation_date : DataTypes.DATE,
        last_updated_by : DataTypes.INTEGER(11),
        last_updated_date : DataTypes.DATE,
        comment_type : DataTypes.INTEGER(11)
    },{
        tableName: 'cln_fa_df_comments', // đặt tên bảng
        timestamps: false // đặt false để ko tự động tạo các cột timestamp
    });
    return Comments;
};






