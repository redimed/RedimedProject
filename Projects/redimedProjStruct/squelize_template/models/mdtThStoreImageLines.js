module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtThStoreImageLines", {
            'LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'HEADER_CODE': { 
    type: DataTypes.STRING(30),  
            },
            'TELEHEALTH_FORM_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'IMAGE': { 
    type: DataTypes.BLOB,  
            },
            'NOTICE': { 
    type: DataTypes.STRING(200),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "th_store_image_line",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}