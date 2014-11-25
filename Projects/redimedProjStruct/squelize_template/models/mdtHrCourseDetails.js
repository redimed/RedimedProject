module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrCourseDetails", {
            'course_detail_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'employee_id_course_detail': { 
    type: DataTypes.INTEGER(11),  
            },
            'cost_employee_course_detail': { 
    type: DataTypes.DECIMAL(),  
            },
            'result_course_detail': { 
    type: DataTypes.STRING(255),  
            },
            'notes_course_detail': { 
    type: DataTypes.STRING(255),  
            },
            'is_pass_course_detail': { 
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
            'course_id_course_detail': { 
    type: DataTypes.INTEGER(11),  
            },
            'dept_id_course_detail': { 
    type: DataTypes.INTEGER(11),  
            },
            'employee_code_course_detail': { 
    type: DataTypes.STRING(255),  
            },
            'employee_name_course_detail': { 
    type: DataTypes.INTEGER(11),  
            },
            'from_date': { 
    type: DataTypes.DATE,  
            },
            'to_date': { 
    type: DataTypes.DATE,  
            },
}, {
tableName: "hr_course_detail",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}