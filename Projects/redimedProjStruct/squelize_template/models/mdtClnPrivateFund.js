module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtClnPrivateFund", {
            'PF_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'Fund_name': { 
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
        }, {
tableName: "cln_private_fund",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}