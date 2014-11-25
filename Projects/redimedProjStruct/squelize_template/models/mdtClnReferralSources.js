module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtClnReferralSources", {
            'RS_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'RS_name': { 
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
}, {
tableName: "cln_referral_source",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}