module.exports = function(sequelize,DataTypes){
    var qantas_groundsupport = sequelize.define('qantas_groundsupport',{
        ID:{type:DataTypes.INTEGER(11), primaryKey:true},
        PATIENT_ID:DataTypes.INTEGER(11),
        CAL_ID:DataTypes.INTEGER(11),
        check1:DataTypes.STRING(2),
        check2:DataTypes.STRING(2),
        check3:DataTypes.STRING(2),
        check4:DataTypes.STRING(2),
        check5:DataTypes.STRING(2),
        check6:DataTypes.STRING(2),
        check7:DataTypes.STRING(2),
        check8:DataTypes.STRING(2),
        check9:DataTypes.STRING(2),
        check10:DataTypes.STRING(2),
        check11:DataTypes.STRING(2),
        check12:DataTypes.STRING(2),
        check13:DataTypes.STRING(2),
        check14:DataTypes.STRING(2),
        check15:DataTypes.STRING(2),
        check16:DataTypes.STRING(2),
        check17:DataTypes.STRING(2),
        check18:DataTypes.STRING(2),
        check19:DataTypes.STRING(2),
        check20:DataTypes.STRING(2),
        check21:DataTypes.STRING(2),
        check22:DataTypes.STRING(2),
        check23:DataTypes.STRING(2),
        check24:DataTypes.STRING(2),
        check25:DataTypes.STRING(2),
        check26:DataTypes.STRING(2),
        check27:DataTypes.STRING(2),
        check28:DataTypes.STRING(2),
        check29:DataTypes.STRING(2),
        check30:DataTypes.STRING(2),
        check31:DataTypes.STRING(2),
        check32:DataTypes.STRING(2),
        check33:DataTypes.STRING(2),
        check34:DataTypes.STRING(2),
        check35:DataTypes.STRING(2),
        check36:DataTypes.STRING(2),
        check37:DataTypes.STRING(2),
        check38:DataTypes.STRING(2),
        check39:DataTypes.STRING(2),
        check40:DataTypes.STRING(2),
        check41:DataTypes.STRING(2),
        check42:DataTypes.STRING(2),
        check43:DataTypes.STRING(2),
        check44:DataTypes.STRING(2),
        check45:DataTypes.STRING(2),
        check46:DataTypes.STRING(2),
        check47:DataTypes.STRING(2),
        check48:DataTypes.STRING(2),
        check49:DataTypes.STRING(2),
        check50:DataTypes.STRING(2),
        group2_comment1:DataTypes.STRING(100),
        group3_sec1_comment1:DataTypes.STRING(100),
        group3_sec1_comment2:DataTypes.STRING(100),
        group3_sec1_value1:DataTypes.INTEGER(11),
        group3_sec1_value2:DataTypes.INTEGER(11),
        group3_sec2_comment1:DataTypes.STRING(100),
        group3_sec2_comment2:DataTypes.STRING(100),
        group3_sec2_comment3:DataTypes.STRING(100),
        group3_sec2_comment4:DataTypes.STRING(100),
        group3_sec2_comment5:DataTypes.STRING(100),
        group3_sec2_comment6:DataTypes.STRING(100),
        group3_sec2_rate:DataTypes.STRING(100),
        group3_sec2_value1:DataTypes.INTEGER(11),
        group3_sec2_value2:DataTypes.INTEGER(11),
        group3_sec3_checkL_1:DataTypes.STRING(2),
        group3_sec3_checkL_2:DataTypes.STRING(2),
        group3_sec3_checkL_3:DataTypes.STRING(2),
        group3_sec3_checkL_4:DataTypes.STRING(2),
        group3_sec3_checkL_5:DataTypes.STRING(2),
        group3_sec3_checkL_6:DataTypes.STRING(2),
        group3_sec3_checkL_7:DataTypes.STRING(2),
        group3_sec3_checkL_8:DataTypes.STRING(2),
        group3_sec3_checkL_9:DataTypes.STRING(2),
        group3_sec3_checkL_10:DataTypes.STRING(2),
        group3_sec3_checkL_11:DataTypes.STRING(2),
        group3_sec3_checkL_12:DataTypes.STRING(2),
        group3_sec3_checkL_13:DataTypes.STRING(2),
        group3_sec3_checkR_1:DataTypes.STRING(2),
        group3_sec3_checkR_2:DataTypes.STRING(2),
        group3_sec3_checkR_3:DataTypes.STRING(2),
        group3_sec3_checkR_4:DataTypes.STRING(2),
        group3_sec3_checkR_5:DataTypes.STRING(2),
        group3_sec3_checkR_6:DataTypes.STRING(2),
        group3_sec3_checkR_7:DataTypes.STRING(2),
        group3_sec3_checkR_8:DataTypes.STRING(2),
        group3_sec3_checkR_9:DataTypes.STRING(2),
        group3_sec3_checkR_10:DataTypes.STRING(2),
        group3_sec3_checkR_11:DataTypes.STRING(2),
        group3_sec3_checkR_12:DataTypes.STRING(2),
        group3_sec3_checkR_13:DataTypes.STRING(2),
        group3_sec3_comment1:DataTypes.STRING(100),
        group3_sec3_comment2:DataTypes.STRING(100),
        group3_sec3_comment3:DataTypes.STRING(100),
        group3_sec3_comment4:DataTypes.STRING(100),
        group3_sec3_comment5:DataTypes.STRING(100),
        group3_sec3_comment6:DataTypes.STRING(100),
        group3_sec3_comment7:DataTypes.STRING(100),
        group3_sec3_comment8:DataTypes.STRING(100),
        group3_sec3_comment9:DataTypes.STRING(100),
        group3_sec3_comment10:DataTypes.STRING(100),
        group3_sec3_comment11:DataTypes.STRING(100),
        group3_sec3_comment12:DataTypes.STRING(100),
        group3_sec3_comment13:DataTypes.STRING(100),
        group3_sec4_comment1:DataTypes.STRING(100),
        group3_sec4_rate1:DataTypes.STRING(2),
        group3_sec4_rate2:DataTypes.STRING(2),
        group3_sec4_rate3:DataTypes.STRING(2),
        group3_sec4_rate4:DataTypes.STRING(2),
        group3_sec4_rate5:DataTypes.STRING(2),
        group3_sec4_rate6:DataTypes.STRING(2),
        group3_sec4_rate7:DataTypes.STRING(2),
        group3_sec5_comment1:DataTypes.STRING(100),
        group3_sec5_comment2:DataTypes.STRING(100),
        group3_sec5_comment3:DataTypes.STRING(100),
        group3_sec5_comment4:DataTypes.STRING(100),
        group3_sec5_value1:DataTypes.INTEGER(11),
        group3_sec5_value2:DataTypes.INTEGER(11),
        group3_sec5_value3:DataTypes.INTEGER(11),
        group3_sec5_value4:DataTypes.INTEGER(11),
        group3_sec6_comment1:DataTypes.STRING(100),
        group4_checkbox1:DataTypes.STRING(2),
        group4_checkbox2:DataTypes.STRING(2),
        group4_checkbox3:DataTypes.STRING(2),
        group4_checkbox4:DataTypes.STRING(2),
        group4_comment1:DataTypes.STRING(100),
        group4_comment2:DataTypes.STRING(100),
        group4_comment3:DataTypes.STRING(100),
        group4_comment4:DataTypes.STRING(100),
        group4_comment5:DataTypes.STRING(100),
        dateChose:DataTypes.DATE,
        PATIENT_SIGN:DataTypes.STRING(100),
        PATIENT_SIGN1:DataTypes.TEXT,
        assessor:DataTypes.STRING(100),
        age2:DataTypes.STRING(100)
    },{
        tableName: 'qantas_groundsupport', // đặt tên bảng
        createdAt: 'Creation_date',
        updatedAt: 'Last_update_date'
    });

    return qantas_groundsupport;
};