module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtSymptomscontents", {
            'Sym_Content_Id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'Sym_Id': { 
    type: DataTypes.INTEGER(11),  
            },
            'Sym_Content': { 
    type: DataTypes.STRING(500),  
            },
            'IsEnable': { 
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
tableName: "symptomscontent",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}