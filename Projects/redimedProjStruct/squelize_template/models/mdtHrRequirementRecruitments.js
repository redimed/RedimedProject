module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrRequirementRecruitments", {
            'STT_requirement_recruitment': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'requirement_number': { 
    type: DataTypes.STRING(100),  
            },
            'from_date_requirement_recruitment': { 
    type: DataTypes.DATE,  
            },
            'from_to_requirement_recruitment': { 
    type: DataTypes.DATE,  
            },
            'requirement_dept_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'requirement_site_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'created_by': { 
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
            'requirement_company_id': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "hr_requirement_recruitment",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}