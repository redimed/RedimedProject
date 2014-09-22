//Model section
module.export = function(sequelize, DataTypes){
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
        tableName: 'redi_menus', // đặt tên bảng
        timestamps: false // đặt false để ko tự động tạo các cột timestamp
    });
};















module.exports = function(sequelize,DataTypes){
    var Menu = sequelize.define('Menu',{
        menu_id  : DataTypes.INTEGER,
        description : DataTypes.STRING(60) ,
        definition : DataTypes.STRING(200) ,
        parent_id : DataTypes.INTEGER(11) ,
        type : DataTypes.STRING(1) ,
        seq : DataTypes.INTEGER(11) ,
        is_mutiple_instance : DataTypes.INTEGER(11) ,
        function_id : DataTypes.INTEGER(11) ,
        isEnable : DataTypes.INTEGER(11)
    },{
        tableName: 'redi_menus', // đặt tên bảng
        timestamps: false // đặt false để ko tự động tạo các cột timestamp
    });

    return Menu;
};
