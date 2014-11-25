module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtPoLines", {
            'HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
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
            'PRICE': { 
    type: DataTypes.FLOAT,  
            },
            'AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'BASE_AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'NEED_DATE': { 
    type: DataTypes.DATE,  
            },
            'ORG_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SUB_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'QUALITY_NOTE': { 
    type: DataTypes.STRING(100),  
            },
            'PACKING_NOTE': { 
    type: DataTypes.STRING(100),  
            },
            'MAKING_NOTE': { 
    type: DataTypes.STRING(100),  
            },
            'MFG_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'DESCRIPTION': { 
    type: DataTypes.STRING(100),  
            },
            'status': { 
    type: DataTypes.STRING(20),  
            },
            'REQ_HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'REQ_LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'APPR_HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'APPR_LINE_ID': { 
    type: DataTypes.INTEGER(11),  
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
            'CURR': { 
    type: DataTypes.STRING(5),  
            },
            'BASECURR': { 
    type: DataTypes.STRING(5),  
            },
            'RATE': { 
    type: DataTypes.FLOAT,  
            },
}, {
tableName: "po_lines",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}