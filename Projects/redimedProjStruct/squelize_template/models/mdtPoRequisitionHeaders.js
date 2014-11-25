module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPoRequisitionHeaders", {
            'HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'REQ_NO': { 
    type: DataTypes.STRING(20),  
            },
            'SYS_COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SYS_SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SYS_ORG_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'EMP_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'REQ_TYPE': { 
    type: DataTypes.STRING(20),  
            },
            'REQ_DATE': { 
    type: DataTypes.DATE,  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(100),  
            },
            'STATUS': { 
    type: DataTypes.STRING(20),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATION_DATE': { 
    type: DataTypes.DATE,  
            },
            'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Last_update_date': { 
    type: DataTypes.DATE,  
            },
}, {
tableName: "po_requisition_headers",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}