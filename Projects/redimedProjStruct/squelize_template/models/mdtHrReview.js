module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrReview", {
            'review_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            're_view_date_1': { 
    type: DataTypes.DATE,  
            },
            're_view_date_2': { 
    type: DataTypes.DATE,  
            },
            're_view_date_3': { 
    type: DataTypes.DATE,  
            },
            're_employee_id': { 
    type: DataTypes.INTEGER(11),  
            },
            're_employee_code': { 
    type: DataTypes.STRING(45),  
            },
            're_employee_name': { 
    type: DataTypes.STRING(200),  
            },
            're_company_id': { 
    type: DataTypes.INTEGER(11),  
            },
            're_site_id': { 
    type: DataTypes.INTEGER(11),  
            },
            're_dept_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'career_goal': { 
    type: DataTypes.STRING(200),  
            },
            'action_to_develop': { 
    type: DataTypes.STRING(200),  
            },
            'indicator_to_success': { 
    type: DataTypes.STRING(200),  
            },
            're_view_content': { 
    type: DataTypes.STRING(200),  
            },
            'major_responsibility': { 
    type: DataTypes.STRING(500),  
            },
            'expected_you_role': { 
    type: DataTypes.STRING(500),  
            },
            'work_task_responsibility': { 
    type: DataTypes.STRING(500),  
            },
            'highlight_your_work': { 
    type: DataTypes.STRING(500),  
            },
            'lowlight_you_work': { 
    type: DataTypes.STRING(500),  
            },
            'major_challenge': { 
    type: DataTypes.STRING(500),  
            },
            'important_partnership': { 
    type: DataTypes.STRING(500),  
            },
            'professional_goal': { 
    type: DataTypes.STRING(500),  
            },
            'strength': { 
    type: DataTypes.STRING(500),  
            },
            'area_development': { 
    type: DataTypes.STRING(500),  
            },
            'focus_area_improvement': { 
    type: DataTypes.STRING(500),  
            },
            'agreed_performance_goal': { 
    type: DataTypes.STRING(500),  
            },
            'action_to_develop_capability': { 
    type: DataTypes.STRING(500),  
            },
            'indicator_for_success': { 
    type: DataTypes.STRING(500),  
            },
            'career_goal_1': { 
    type: DataTypes.STRING(500),  
            },
            'career_goal_2': { 
    type: DataTypes.STRING(500),  
            },
            'career_goal_3': { 
    type: DataTypes.STRING(500),  
            },
            'action_to_develop_1': { 
    type: DataTypes.STRING(500),  
            },
            'action_to_develop_2': { 
    type: DataTypes.STRING(500),  
            },
            'action_to_develop_3': { 
    type: DataTypes.STRING(500),  
            },
            'indicator_success_1': { 
    type: DataTypes.STRING(500),  
            },
            'indicator_success_2': { 
    type: DataTypes.STRING(500),  
            },
            'indicator_success_3': { 
    type: DataTypes.STRING(500),  
            },
            'my_success_no_2': { 
    type: DataTypes.STRING(500),  
            },
            'what_challeng_me_no_2': { 
    type: DataTypes.STRING(500),  
            },
            'what_done_better_no_2': { 
    type: DataTypes.STRING(500),  
            },
            'key_work_task_no_2': { 
    type: DataTypes.STRING(500),  
            },
            'my_strength_no_2': { 
    type: DataTypes.STRING(500),  
            },
            'continue_improve_no_2': { 
    type: DataTypes.STRING(500),  
            },
            'my_performance_no_2': { 
    type: DataTypes.STRING(500),  
            },
            'my_success_no_3': { 
    type: DataTypes.STRING(500),  
            },
            'challenged_me_no_3': { 
    type: DataTypes.STRING(500),  
            },
            'done_better_no_3': { 
    type: DataTypes.STRING(500),  
            },
            'work_task_no_3': { 
    type: DataTypes.STRING(500),  
            },
            'my_strength_no_3': { 
    type: DataTypes.STRING(500),  
            },
            'focus_on_next_no_3': { 
    type: DataTypes.STRING(500),  
            },
            'available_to_me_no_3': { 
    type: DataTypes.STRING(500),  
            },
            'performance_further_no_3': { 
    type: DataTypes.STRING(500),  
            },
            'regular_basis_no_3': { 
    type: DataTypes.STRING(500),  
            },
            'created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    're_position_id': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "hr_review",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}