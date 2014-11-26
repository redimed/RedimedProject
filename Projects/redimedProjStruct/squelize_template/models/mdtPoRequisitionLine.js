module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPoRequisitionLine", {
            'HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
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
            'ITEM_TYPE': { 
    type: DataTypes.STRING(20),  
            },
            'ITEM_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ITEM_CODE': { 
    type: DataTypes.STRING(20),  
            },
            'item_desc': { 
    type: DataTypes.STRING(1000),  
            },
            'PRIMARY_UOM': { 
    type: DataTypes.STRING(10),  
            },
            'UOM': { 
    type: DataTypes.STRING(10),  
            },
            'QUANTITY': { 
    type: DataTypes.FLOAT,  
            },
            'NEED_DATE': { 
    type: DataTypes.DATE,  
            },
            'APPR_QUANTITY': { 
    type: DataTypes.FLOAT,  
            },
            'STATUS': { 
    type: DataTypes.STRING(20),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(100),  
            },
            'MFG_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ENTITY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ENTITY_SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'PRICE': { 
    type: DataTypes.FLOAT,  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "po_requisition_lines",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}