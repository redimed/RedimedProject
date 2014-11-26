module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSymptomsheader", {
            'Sym_Id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'Sym_Name': { 
    type: DataTypes.STRING(200),  
            },
            'IsEnable': { 
    type: DataTypes.INTEGER(11),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "symptomsheader",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}