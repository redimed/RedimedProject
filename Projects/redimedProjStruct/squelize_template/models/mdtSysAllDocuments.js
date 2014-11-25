module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSysAllDocuments", {
            'DOC_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'SERVICE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'DOC_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'Isenable': { 
    type: DataTypes.INTEGER(11),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Creation_date': { 
    type: DataTypes.DATE,  
            },
            'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Last_update_date': { 
    type: DataTypes.DATE,  
            },
            'DOC_TYPE': { 
    type: DataTypes.STRING(10),  
            },
            'DOC_CODE': { 
    type: DataTypes.STRING(10),  
            },
}, {
tableName: "sys_all_documents",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}