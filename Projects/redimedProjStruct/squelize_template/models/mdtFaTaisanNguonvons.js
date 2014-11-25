module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtFaTaisanNguonvons", {
            'TaiSanID': { 
    type: DataTypes.INTEGER(11),  
            },
            'STT': { 
    type: DataTypes.INTEGER(11),  
            },
            'Ngay': { 
    type: DataTypes.DATE,  
            },
            'LineID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'MaNguonVon': { 
    type: DataTypes.STRING(20),  
            },
            'GiaTri': { 
    type: DataTypes.DECIMAL(),  
            },
            'GiaTriHaoMon': { 
    type: DataTypes.DECIMAL(),  
            },
}, {
tableName: "fa_taisan_nguonvon",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}