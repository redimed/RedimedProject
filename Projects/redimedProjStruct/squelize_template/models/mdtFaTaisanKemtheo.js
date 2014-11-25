module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtFaTaisanKemtheo", {
            'STT': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'TaiSanID': { 
    type: DataTypes.INTEGER(11),  
            },
            'DienGiai': { 
    type: DataTypes.STRING(150),  
            },
            'SoLuong': { 
    type: DataTypes.DECIMAL(),  
            },
            'DVT': { 
    type: DataTypes.STRING(10),  
            },
            'GhiChu': { 
    type: DataTypes.STRING(150),  
            },
            'stt_grid': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "fa_taisan_kemtheo",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}