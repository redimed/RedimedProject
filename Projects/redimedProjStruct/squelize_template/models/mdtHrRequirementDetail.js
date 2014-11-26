module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrRequirementDetail", {
            'STT_requirement_detail': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'position_id_requirement_detail': { 
    type: DataTypes.INTEGER(11),  
            },
            'sex_requirement_detail': { 
    type: DataTypes.INTEGER(11),  
            },
            'experience_requirement_detail': { 
    type: DataTypes.INTEGER(11),  
            },
            'education_id_requirement_detail': { 
    type: DataTypes.INTEGER(11),  
            },
            'work_location_requirement_detail': { 
    type: DataTypes.STRING(250),  
            },
            'requirement_recruit_id_requirement_detail': { 
    type: DataTypes.INTEGER(11),  
            },
            'created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'quantity_requirement_detail': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "hr_requirement_detail",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}