module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrTrainingCourse", {
            'course_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'from_date_training_course': { 
    type: DataTypes.DATE,  
            },
            'to_date_training_course': { 
    type: DataTypes.DATE,  
            },
            'content_course_training_course': { 
    type: DataTypes.STRING(255),  
            },
            'place_training_course': { 
    type: DataTypes.STRING(255),  
            },
            'cost_course': { 
    type: DataTypes.DECIMAL(),  
            },
            'plan_id_training_course': { 
    type: DataTypes.INTEGER(11),  
            },
            'created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'number_employee_training_course': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "hr_training_course",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}