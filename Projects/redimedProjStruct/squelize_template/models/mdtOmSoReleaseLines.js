module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtOmSoReleaseLines", {
            'SO_RELEASE_LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'CLIENT': { 
    type: DataTypes.INTEGER(11),  
            },
            'COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SO_RELEASE_HEADER_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ORG_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SUB_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ITEM_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'UOM': { 
    type: DataTypes.STRING(20),  
            },
            'QUANTITY': { 
    type: DataTypes.INTEGER(11),  
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
            'TAX_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'TAX_AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'TAX_BASE_AMOUNT': { 
    type: DataTypes.FLOAT,  
            },
            'DESCRIPTION': { 
    type: DataTypes.TEXT,  
            },
            'SO_LINE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ISENABLE': { 
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
            'OtherQuantity': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "om_so_release_lines",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}