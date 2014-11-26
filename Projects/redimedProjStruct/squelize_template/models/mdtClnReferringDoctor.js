module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtClnReferringDoctor", {
            'REF_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'Patient_id': { 
    type: DataTypes.BIGINT(20),  
            },
            'DATE': { 
    type: DataTypes.DATE,  
            },
            'Duration': { 
    type: DataTypes.INTEGER(11),  
            },
            'Valid': { 
    type: DataTypes.INTEGER(11),  
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
                    'GP_ID': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "cln_referring_doctors",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}