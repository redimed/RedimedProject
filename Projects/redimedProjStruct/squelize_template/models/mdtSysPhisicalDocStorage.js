module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysPhisicalDocStorage", {
            'STORAGE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'STORE_ROOM': { 
    type: DataTypes.STRING(30),  
            },
            'STORE_CUPBOARD': { 
    type: DataTypes.STRING(30),  
            },
            'STORE_RACK': { 
    type: DataTypes.STRING(30),  
            },
            'STORE_FOLDER': { 
    type: DataTypes.STRING(30),  
            },
            'ISENABLE': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "sys_phisical_doc_storages",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}