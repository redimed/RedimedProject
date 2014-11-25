module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtApFormulaHeaders", {
            'CLIENT': { 
    type: DataTypes.INTEGER(11),  
            },
            'COMPANY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SITE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'FORMULA_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'FORMULA_CODE': { 
    type: DataTypes.STRING(50),  
            },
            'FORMULA_DESCRIPTION': { 
    type: DataTypes.STRING(250),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATION_DATE': { 
    type: DataTypes.DATE,  
            },
            'LAST_UPDATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
            'LAST_UPDATE_DATE': { 
    type: DataTypes.DATE,  
            },
}, {
tableName: "ap_formula_headers",
createdAt: "CREATION_DATE",
updatedAt: "LAST_UPDATE_DATE",
});
return mdtInstance;
}