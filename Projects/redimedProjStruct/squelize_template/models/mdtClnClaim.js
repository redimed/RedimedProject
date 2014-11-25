module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtClnClaim", {
            'Claim_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
        autoIncrement: true,            },
            'Patient_id': { 
    type: DataTypes.BIGINT(20),  
            },
            'Injury_name': { 
    type: DataTypes.STRING(100),  
            },
            'Injury_date': { 
    type: DataTypes.DATE,  
            },
            'How_Injury_Occurred': { 
    type: DataTypes.STRING(250),  
            },
            'Location': { 
    type: DataTypes.STRING(50),  
            },
            'ENTITY_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'Claim_date': { 
    type: DataTypes.DATE,  
            },
            'Insurer': { 
    type: DataTypes.STRING(50),  
            },
            'Address': { 
    type: DataTypes.STRING(50),  
            },
            'Claim_no': { 
    type: DataTypes.INTEGER(11),  
            },
            'Case_manager': { 
    type: DataTypes.STRING(50),  
            },
            'Isenable': { 
    type: DataTypes.INTEGER(11),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'isCurr': { 
    type: DataTypes.INTEGER(11),  
            },
            'insurer_site': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "cln_claims",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}