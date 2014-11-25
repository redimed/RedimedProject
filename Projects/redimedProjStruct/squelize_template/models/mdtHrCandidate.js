module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrCandidate", {
            'Candidate_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'recruitment_detail_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'FirstName_candidate': { 
    type: DataTypes.STRING(50),  
            },
            'LastName_candidate': { 
    type: DataTypes.STRING(50),  
            },
            'BirthDay_candidate': { 
    type: DataTypes.DATE,  
            },
            'TownOfBirth_ID_candidate': { 
    type: DataTypes.INTEGER(11),  
            },
            'Nationality_ID_candidate': { 
    type: DataTypes.INTEGER(11),  
            },
            'SocialSecurity_candidate': { 
    type: DataTypes.STRING(50),  
            },
            'Sex_ID_candidate': { 
    type: DataTypes.INTEGER(11),  
            },
            'Married_candidate': { 
    type: DataTypes.INTEGER(11),  
            },
            'Ethnic_ID_candidate': { 
    type: DataTypes.INTEGER(11),  
            },
            'Religion_ID_candidate': { 
    type: DataTypes.INTEGER(11),  
            },
            'Hobby_candidate': { 
    type: DataTypes.STRING(200),  
            },
            'Position_ID_candidate': { 
    type: DataTypes.INTEGER(11),  
            },
            'DateApply_candidate': { 
    type: DataTypes.DATE,  
            },
            'Address_candidate': { 
    type: DataTypes.STRING(200),  
            },
            'Address2_candidate': { 
    type: DataTypes.STRING(200),  
            },
            'MobilePhone_candidate': { 
    type: DataTypes.STRING(50),  
            },
            'HomePhone_candidate': { 
    type: DataTypes.STRING(50),  
            },
            'Email_candidate': { 
    type: DataTypes.STRING(50),  
            },
            'Salaried_candidate': { 
    type: DataTypes.DECIMAL(),  
            },
            'IsPass_candidate': { 
    type: DataTypes.INTEGER(11),  
            },
            'created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'education_id_candidate': { 
    type: DataTypes.INTEGER(11),  
            },
            'is_experience_candidate': { 
    type: DataTypes.INTEGER(11),  
            },
            'site_id_candidate': { 
    type: DataTypes.INTEGER(11),  
            },
            'dept_id_candidate': { 
    type: DataTypes.INTEGER(11),  
            },
            'company_id_candidate': { 
    type: DataTypes.INTEGER(11),  
            },
            'is_transfer': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "hr_candidate",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}