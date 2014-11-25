module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtHrEmployee", {
            'Employee_ID': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'Client': { 
    type: DataTypes.INTEGER(11),  
            },
            'Site_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'Dept_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'Employee_Code': { 
    type: DataTypes.STRING(50),  
            },
            'FirstName': { 
    type: DataTypes.STRING(50),  
            },
            'LastName': { 
    type: DataTypes.STRING(50),  
            },
            'TownOfBirth_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'RegionOfBirth_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'CountryOfBirth_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'Nationality_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'SocialSecurity': { 
    type: DataTypes.STRING(50),  
            },
            'EmpType_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'Sex_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'Married': { 
    type: DataTypes.INTEGER(11),  
            },
            'Ethnic_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'Religion_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'BankAccount': { 
    type: DataTypes.STRING(50),  
            },
            'Banking_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'Hobby': { 
    type: DataTypes.STRING(200),  
            },
            'Description': { 
    type: DataTypes.STRING(200),  
            },
            'Position_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'Job_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'DateFirstHire': { 
    type: DataTypes.DATE,  
            },
            'DayOfWork': { 
    type: DataTypes.DATE,  
            },
            'Address': { 
    type: DataTypes.STRING(200),  
            },
            'Address2': { 
    type: DataTypes.STRING(200),  
            },
            'MobilePhone': { 
    type: DataTypes.STRING(50),  
            },
            'HomePhone': { 
    type: DataTypes.STRING(50),  
            },
            'Fax': { 
    type: DataTypes.STRING(50),  
            },
            'Email': { 
    type: DataTypes.STRING(50),  
            },
            'Supervisor_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'ProbationLength': { 
    type: DataTypes.INTEGER(11),  
            },
            'ProbationUnit': { 
    type: DataTypes.INTEGER(11),  
            },
            'ProbationEndDate': { 
    type: DataTypes.DATE,  
            },
            'WorkingHours': { 
    type: DataTypes.INTEGER(11),  
            },
            'Frequency': { 
    type: DataTypes.INTEGER(11),  
            },
            'Salaried': { 
    type: DataTypes.DECIMAL(),  
            },
            'NormalTimeForm': { 
    type: DataTypes.STRING(50),  
            },
            'NormalTimeTo': { 
    type: DataTypes.STRING(50),  
            },
            'WorkingAtHome': { 
    type: DataTypes.INTEGER(11),  
            },
            'Contract_Type_ID': { 
    type: DataTypes.INTEGER(11),  
            },
            'Isenable': { 
    type: DataTypes.INTEGER(11),  
            },
            'BirthDay': { 
    type: DataTypes.DATE,  
            },
            'Picture': { 
    type: DataTypes.STRING(200),  
            },
            'Company_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'CREATED_BY': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'suburb': { 
    type: DataTypes.STRING(200),  
            },
            'postcode': { 
    type: DataTypes.STRING(200),  
            },
            'state': { 
    type: DataTypes.INTEGER(11),  
            },
            'resident_status': { 
    type: DataTypes.INTEGER(11),  
            },
            'prefix': { 
    type: DataTypes.INTEGER(11),  
            },
            'IsPartTime': { 
    type: DataTypes.INTEGER(11),  
            },
            'Tax_type_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'super_annuation': { 
    type: DataTypes.INTEGER(11),  
            },
            'BSB': { 
    type: DataTypes.STRING(45),  
            },
}, {
tableName: "hr_employee",
createdAt: "CREATION_DATE",
updatedAt: "Last_update_date",
});
return mdtInstance;
}