module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtClnSpecialty", {
            'Specialties_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'Specialties_name': { 
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
                    'RL_TYPE_ID': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "cln_specialties",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}