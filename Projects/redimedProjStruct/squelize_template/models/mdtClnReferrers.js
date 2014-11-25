module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtClnReferrers", {
            'REF_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'FIRST_NAME': { 
    type: DataTypes.STRING(50),  
            },
            'SURNAME': { 
    type: DataTypes.STRING(50),  
            },
            'CLINIC': { 
    type: DataTypes.STRING(50),  
            },
            'ADDR1': { 
    type: DataTypes.STRING(50),  
            },
            'ADDR2': { 
    type: DataTypes.STRING(50),  
            },
            'ADDR3': { 
    type: DataTypes.STRING(50),  
            },
            'SUBURB': { 
    type: DataTypes.STRING(50),  
            },
            'STATE': { 
    type: DataTypes.STRING(50),  
            },
            'COUNTRY': { 
    type: DataTypes.STRING(50),  
            },
            'POSTCODE': { 
    type: DataTypes.STRING(50),  
            },
            'PROVIDER_No': { 
    type: DataTypes.INTEGER(11),  
            },
            'MOBILE': { 
    type: DataTypes.STRING(50),  
            },
            'WORK_PHONE': { 
    type: DataTypes.STRING(50),  
            },
            'FAX': { 
    type: DataTypes.STRING(50),  
            },
            'HOME_PHONE': { 
    type: DataTypes.STRING(50),  
            },
            'EMAIL': { 
    type: DataTypes.STRING(50),  
            },
            'SPECIALTY_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'CAT_ID': { 
    type: DataTypes.INTEGER(11),  
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
}, {
tableName: "cln_referrers",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}