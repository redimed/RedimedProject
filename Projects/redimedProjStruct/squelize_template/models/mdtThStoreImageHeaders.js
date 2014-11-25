module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtThStoreImageHeaders", {
            'HEADER_CODE': { 
    type: DataTypes.STRING(30),  
            primaryKey: true,
                    },
            'DESCRIPTION': { 
    type: DataTypes.STRING(50),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "th_store_image_header",
createdAt: "",
updatedAt: "",
});
return mdtInstance;
}