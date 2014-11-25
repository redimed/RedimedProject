module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrExperience", {
            'exp_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'company_name': { 
    type: DataTypes.STRING(200),  
            },
            'from_date_experience': { 
    type: DataTypes.DATE,  
            },
            'to_date_experience': { 
    type: DataTypes.DATE,  
            },
            'position_experience': { 
    type: DataTypes.STRING(200),  
            },
            'notes_experience': { 
    type: DataTypes.STRING(200),  
            },
            'employee_id_experience': { 
    type: DataTypes.INTEGER(11),  
            },
            'profession_experience': { 
    type: DataTypes.STRING(200),  
            },
            'candidate_id_experience': { 
    type: DataTypes.INTEGER(11),  
            },
            'created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
        }, {
tableName: "hr_experience",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}